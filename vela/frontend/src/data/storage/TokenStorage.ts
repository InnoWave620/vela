import { Platform } from 'react-native';
import { AuthTokensDto } from '@vela/shared';

export interface ITokenStorage {
  getTokens(): Promise<AuthTokensDto | null>;
  saveTokens(tokens: AuthTokensDto): Promise<void>;
  clearTokens(): Promise<void>;
}

export class MemoryTokenStorage implements ITokenStorage {
  private static STORAGE_KEY = 'vela_auth_tokens';
  private inMemoryTokens: AuthTokensDto | null = null;

  public async getTokens(): Promise<AuthTokensDto | null> {
    if (this.inMemoryTokens) {
      return this.inMemoryTokens;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(MemoryTokenStorage.STORAGE_KEY);
        if (item) {
          this.inMemoryTokens = JSON.parse(item);
          return this.inMemoryTokens;
        }
      } catch {
        // Fallback to in-memory
      }
    }

    return null;
  }

  public async saveTokens(tokens: AuthTokensDto): Promise<void> {
    this.inMemoryTokens = tokens;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(MemoryTokenStorage.STORAGE_KEY, JSON.stringify(tokens));
      } catch {
        // Ignore storage error
      }
    }
  }

  public async clearTokens(): Promise<void> {
    this.inMemoryTokens = null;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(MemoryTokenStorage.STORAGE_KEY);
      } catch {
        // Ignore storage error
      }
    }
  }
}

