/**
 * ExtensionHost - Loads and manages extensions
 */

import {
  ExtensionManifest,
  ExtensionContext,
  Extension,
  ExtensionInfo,
  Disposable,
  Memento,
  ExtensionMode
} from '../api/types';

/**
 * Extension state storage
 */
class ExtensionMemento implements Memento {
  private storage: Map<string, any> = new Map();

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string, defaultValue?: T): T | undefined {
    return this.storage.has(key) ? this.storage.get(key) : defaultValue;
  }

  async update(key: string, value: any): Promise<void> {
    if (value === undefined) {
      this.storage.delete(key);
    } else {
      this.storage.set(key, value);
    }
  }
}

/**
 * Extension context implementation
 */
class ExtensionContextImpl implements ExtensionContext {
  readonly manifest: ExtensionManifest;
  readonly extensionPath: string;
  readonly subscriptions: Disposable[] = [];
  readonly globalState: Memento;
  readonly workspaceState: Memento;
  readonly storagePath: string | undefined;
  readonly globalStoragePath: string | undefined;

  constructor(
    manifest: ExtensionManifest,
    extensionPath: string,
    storagePath?: string,
    globalStoragePath?: string
  ) {
    this.manifest = manifest;
    this.extensionPath = extensionPath;
    this.storagePath = storagePath;
    this.globalStoragePath = globalStoragePath;
    this.globalState = new ExtensionMemento();
    this.workspaceState = new ExtensionMemento();
  }

  dispose(): void {
    for (const subscription of this.subscriptions) {
      try {
        subscription.dispose();
      } catch (error) {
        console.error('Error disposing subscription:', error);
      }
    }
    this.subscriptions.length = 0;
  }
}

/**
 * Loaded extension
 */
interface LoadedExtension {
  id: string;
  manifest: ExtensionManifest;
  extensionPath: string;
  context: ExtensionContextImpl;
  extension?: Extension;
  isActive: boolean;
  exports?: any;
}

/**
 * ExtensionHost manages extension lifecycle
 */
export class ExtensionHost {
  private extensions: Map<string, LoadedExtension> = new Map();
  private activationEvents: Map<string, Set<string>> = new Map();

  /**
   * Loads an extension from a path
   */
  async loadExtension(extensionPath: string): Promise<ExtensionInfo> {
    try {
      // Load manifest
      const manifest = await this.loadManifest(extensionPath);
      const id = this.getExtensionId(manifest);

      // Check if already loaded
      if (this.extensions.has(id)) {
        throw new Error(`Extension ${id} is already loaded`);
      }

      // Create context
      const context = new ExtensionContextImpl(
        manifest,
        extensionPath,
        `${extensionPath}/storage`,
        '/global/storage'
      );

      // Create loaded extension
      const loadedExtension: LoadedExtension = {
        id,
        manifest,
        extensionPath,
        context,
        isActive: false
      };

      this.extensions.set(id, loadedExtension);

      // Register activation events
      if (manifest.activationEvents) {
        for (const event of manifest.activationEvents) {
          if (!this.activationEvents.has(event)) {
            this.activationEvents.set(event, new Set());
          }
          this.activationEvents.get(event)!.add(id);
        }
      }

      return this.getExtensionInfo(id);
    } catch (error) {
      throw new Error(`Failed to load extension from ${extensionPath}: ${error}`);
    }
  }

  /**
   * Activates an extension
   */
  async activateExtension(extensionId: string): Promise<void> {
    const loaded = this.extensions.get(extensionId);
    if (!loaded) {
      throw new Error(`Extension ${extensionId} not found`);
    }

    if (loaded.isActive) {
      return; // Already active
    }

    try {
      // Load extension module
      if (loaded.manifest.main) {
        const extensionModule = await this.loadExtensionModule(
          loaded.extensionPath,
          loaded.manifest.main
        );

        if (extensionModule && typeof extensionModule.activate === 'function') {
          loaded.extension = extensionModule;

          // Call activate
          const result = await extensionModule.activate(loaded.context);
          loaded.exports = result;
          loaded.isActive = true;

          console.log(`Extension ${extensionId} activated successfully`);
        }
      }
    } catch (error) {
      throw new Error(`Failed to activate extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Deactivates an extension
   */
  async deactivateExtension(extensionId: string): Promise<void> {
    const loaded = this.extensions.get(extensionId);
    if (!loaded) {
      throw new Error(`Extension ${extensionId} not found`);
    }

    if (!loaded.isActive) {
      return; // Not active
    }

    try {
      // Call deactivate
      if (loaded.extension && typeof loaded.extension.deactivate === 'function') {
        await loaded.extension.deactivate();
      }

      // Dispose context
      loaded.context.dispose();
      loaded.isActive = false;
      loaded.exports = undefined;

      console.log(`Extension ${extensionId} deactivated successfully`);
    } catch (error) {
      throw new Error(`Failed to deactivate extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Unloads an extension
   */
  async unloadExtension(extensionId: string): Promise<void> {
    const loaded = this.extensions.get(extensionId);
    if (!loaded) {
      return;
    }

    // Deactivate if active
    if (loaded.isActive) {
      await this.deactivateExtension(extensionId);
    }

    // Remove from activation events
    if (loaded.manifest.activationEvents) {
      for (const event of loaded.manifest.activationEvents) {
        const extensions = this.activationEvents.get(event);
        if (extensions) {
          extensions.delete(extensionId);
          if (extensions.size === 0) {
            this.activationEvents.delete(event);
          }
        }
      }
    }

    // Remove from loaded extensions
    this.extensions.delete(extensionId);

    console.log(`Extension ${extensionId} unloaded successfully`);
  }

  /**
   * Gets extension information
   */
  getExtensionInfo(extensionId: string): ExtensionInfo {
    const loaded = this.extensions.get(extensionId);
    if (!loaded) {
      throw new Error(`Extension ${extensionId} not found`);
    }

    return {
      id: loaded.id,
      manifest: loaded.manifest,
      extensionPath: loaded.extensionPath,
      isActive: loaded.isActive,
      exports: loaded.exports
    };
  }

  /**
   * Gets all loaded extensions
   */
  getAllExtensions(): ExtensionInfo[] {
    return Array.from(this.extensions.values()).map(loaded => ({
      id: loaded.id,
      manifest: loaded.manifest,
      extensionPath: loaded.extensionPath,
      isActive: loaded.isActive,
      exports: loaded.exports
    }));
  }

  /**
   * Fires an activation event
   */
  async fireActivationEvent(event: string): Promise<void> {
    const extensionIds = this.activationEvents.get(event);
    if (!extensionIds || extensionIds.size === 0) {
      return;
    }

    const activationPromises: Promise<void>[] = [];
    for (const extensionId of extensionIds) {
      activationPromises.push(this.activateExtension(extensionId));
    }

    await Promise.all(activationPromises);
  }

  /**
   * Loads extension manifest
   */
  private async loadManifest(extensionPath: string): Promise<ExtensionManifest> {
    // TODO: Load manifest from package.json
    // For now, return a mock manifest
    const manifestPath = `${extensionPath}/package.json`;
    console.log(`Loading manifest from: ${manifestPath}`);

    // Mock implementation
    return {
      name: 'sample-extension',
      displayName: 'Sample Extension',
      version: '1.0.0',
      publisher: 'publisher',
      description: 'A sample extension'
    };
  }

  /**
   * Loads extension module
   */
  private async loadExtensionModule(
    extensionPath: string,
    main: string
  ): Promise<Extension | undefined> {
    // TODO: Load and execute extension module
    // For now, return undefined
    console.log(`Loading extension module: ${extensionPath}/${main}`);
    return undefined;
  }

  /**
   * Gets extension ID from manifest
   */
  private getExtensionId(manifest: ExtensionManifest): string {
    return `${manifest.publisher}.${manifest.name}`;
  }
}

/**
 * Global extension host instance
 */
export const extensionHost = new ExtensionHost();
