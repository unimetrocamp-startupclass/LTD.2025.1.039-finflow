import { Buffer } from 'buffer';

export class CryptoManager {
  private static readonly ENCRYPTION_KEY = 'chave-secreta-do-gerenciador-financeiro';
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly IV_LENGTH = 12;

  static async encrypt(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      
      const key = await this.generateKey();
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv
        },
        key,
        encoder.encode(data)
      );

      const encryptedArray = new Uint8Array(encrypted);
      const buffer = new Uint8Array(iv.length + encryptedArray.length);
      buffer.set(iv);
      buffer.set(encryptedArray, iv.length);

      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.error('Erro ao criptografar:', error);
      throw new Error('Falha ao criptografar os dados');
    }
  }

  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      const data = new Uint8Array(buffer);
      
      const iv = data.slice(0, this.IV_LENGTH);
      const encrypted = data.slice(this.IV_LENGTH);
      
      const key = await this.generateKey();
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      throw new Error('Falha ao descriptografar os dados');
    }
  }

  private static async generateKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.ENCRYPTION_KEY),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }
}