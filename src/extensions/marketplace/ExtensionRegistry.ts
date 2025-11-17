/**
 * ExtensionRegistry - Manages installed extensions
 */

import { ExtensionManifest, ExtensionInfo } from '../api/types';
import { extensionHost } from '../host/ExtensionHost';

/**
 * Extension metadata
 */
export interface ExtensionMetadata {
  id: string;
  manifest: ExtensionManifest;
  installPath: string;
  installedDate: Date;
  enabled: boolean;
  autoUpdate: boolean;
}

/**
 * ExtensionRegistry manages installed extensions
 */
export class ExtensionRegistry {
  private installedExtensions: Map<string, ExtensionMetadata> = new Map();
  private extensionsPath: string = '/extensions';

  /**
   * Initializes the registry
   */
  async initialize(): Promise<void> {
    try {
      // Load installed extensions from storage
      await this.loadInstalledExtensions();

      // Auto-enable extensions
      for (const metadata of this.installedExtensions.values()) {
        if (metadata.enabled) {
          await this.enableExtension(metadata.id);
        }
      }

      console.log(`Extension registry initialized with ${this.installedExtensions.size} extensions`);
    } catch (error) {
      console.error('Failed to initialize extension registry:', error);
    }
  }

  /**
   * Installs an extension
   */
  async install(extensionPath: string): Promise<ExtensionMetadata> {
    try {
      // Load extension
      const info = await extensionHost.loadExtension(extensionPath);

      // Create metadata
      const metadata: ExtensionMetadata = {
        id: info.id,
        manifest: info.manifest,
        installPath: extensionPath,
        installedDate: new Date(),
        enabled: true,
        autoUpdate: true
      };

      // Save metadata
      this.installedExtensions.set(info.id, metadata);
      await this.saveInstalledExtensions();

      // Enable extension
      await this.enableExtension(info.id);

      console.log(`Extension ${info.id} installed successfully`);
      return metadata;
    } catch (error) {
      throw new Error(`Failed to install extension: ${error}`);
    }
  }

  /**
   * Uninstalls an extension
   */
  async uninstall(extensionId: string): Promise<void> {
    const metadata = this.installedExtensions.get(extensionId);
    if (!metadata) {
      throw new Error(`Extension ${extensionId} not found`);
    }

    try {
      // Disable extension
      await this.disableExtension(extensionId);

      // Unload extension
      await extensionHost.unloadExtension(extensionId);

      // Remove metadata
      this.installedExtensions.delete(extensionId);
      await this.saveInstalledExtensions();

      // TODO: Delete extension files
      console.log(`Extension ${extensionId} uninstalled successfully`);
    } catch (error) {
      throw new Error(`Failed to uninstall extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Enables an extension
   */
  async enableExtension(extensionId: string): Promise<void> {
    const metadata = this.installedExtensions.get(extensionId);
    if (!metadata) {
      throw new Error(`Extension ${extensionId} not found`);
    }

    if (metadata.enabled) {
      return; // Already enabled
    }

    try {
      // Activate extension
      await extensionHost.activateExtension(extensionId);

      // Update metadata
      metadata.enabled = true;
      await this.saveInstalledExtensions();

      console.log(`Extension ${extensionId} enabled successfully`);
    } catch (error) {
      throw new Error(`Failed to enable extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Disables an extension
   */
  async disableExtension(extensionId: string): Promise<void> {
    const metadata = this.installedExtensions.get(extensionId);
    if (!metadata) {
      throw new Error(`Extension ${extensionId} not found`);
    }

    if (!metadata.enabled) {
      return; // Already disabled
    }

    try {
      // Deactivate extension
      await extensionHost.deactivateExtension(extensionId);

      // Update metadata
      metadata.enabled = false;
      await this.saveInstalledExtensions();

      console.log(`Extension ${extensionId} disabled successfully`);
    } catch (error) {
      throw new Error(`Failed to disable extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Gets installed extensions
   */
  getInstalledExtensions(): ExtensionMetadata[] {
    return Array.from(this.installedExtensions.values());
  }

  /**
   * Gets extension metadata
   */
  getExtension(extensionId: string): ExtensionMetadata | undefined {
    return this.installedExtensions.get(extensionId);
  }

  /**
   * Checks if extension is installed
   */
  isInstalled(extensionId: string): boolean {
    return this.installedExtensions.has(extensionId);
  }

  /**
   * Updates an extension
   */
  async update(extensionId: string, newPath: string): Promise<void> {
    try {
      // Uninstall old version
      await this.uninstall(extensionId);

      // Install new version
      await this.install(newPath);

      console.log(`Extension ${extensionId} updated successfully`);
    } catch (error) {
      throw new Error(`Failed to update extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Loads installed extensions from storage
   */
  private async loadInstalledExtensions(): Promise<void> {
    // TODO: Load from persistent storage
    // For now, use in-memory storage
    console.log('Loading installed extensions from storage');
  }

  /**
   * Saves installed extensions to storage
   */
  private async saveInstalledExtensions(): Promise<void> {
    // TODO: Save to persistent storage
    console.log('Saving installed extensions to storage');
  }
}

/**
 * Global extension registry instance
 */
export const extensionRegistry = new ExtensionRegistry();
