/**
 * GitService - Manages Git repositories
 */

import { GitRepository } from './GitRepository';
import { IGitRepository } from './types';

/**
 * GitService manages Git operations
 */
export class GitService {
  private repositories: Map<string, IGitRepository> = new Map();

  /**
   * Opens a Git repository
   */
  async openRepository(path: string): Promise<IGitRepository> {
    // Check if already open
    if (this.repositories.has(path)) {
      return this.repositories.get(path)!;
    }

    // Check if it's a valid git repository
    const isRepo = await GitRepository.isGitRepository(path);
    if (!isRepo) {
      throw new Error(`${path} is not a git repository`);
    }

    // Create repository instance
    const repo = new GitRepository(path);
    this.repositories.set(path, repo);

    return repo;
  }

  /**
   * Gets a repository by path
   */
  getRepository(path: string): IGitRepository | undefined {
    return this.repositories.get(path);
  }

  /**
   * Closes a repository
   */
  closeRepository(path: string): void {
    this.repositories.delete(path);
  }

  /**
   * Initializes a new Git repository
   */
  async initRepository(path: string): Promise<IGitRepository> {
    const repo = await GitRepository.init(path);
    this.repositories.set(path, repo);
    return repo;
  }

  /**
   * Clones a repository
   */
  async cloneRepository(url: string, path: string): Promise<IGitRepository> {
    const repo = await GitRepository.clone(url, path);
    this.repositories.set(path, repo);
    return repo;
  }

  /**
   * Gets all open repositories
   */
  getRepositories(): IGitRepository[] {
    return Array.from(this.repositories.values());
  }
}

/**
 * Global Git service instance
 */
export const gitService = new GitService();
