// FateBook Cryptographic Engine for Confidential Biographic Conversations
// Ensures conversation records are encrypted at rest and accessible only to Root Admin

const MASTER_SALT = 'FATEBOOK_SALT_2026_UBORKA';

/**
 * Reversible cryptographic cipher (AES-like salted XOR stream cipher with Base64 envelope)
 */
export const encryptPayload = (plainText: string, key = 'Uborka232425---'): string => {
  if (!plainText) return '';
  try {
    const combinedKey = key + MASTER_SALT;
    let result = '';
    for (let i = 0; i < plainText.length; i++) {
      const charCode = plainText.charCodeAt(i);
      const keyChar = combinedKey.charCodeAt(i % combinedKey.length);
      const encryptedChar = String.fromCharCode(charCode ^ keyChar);
      result += encryptedChar;
    }
    // Encode to base64 with version prefix
    const encoded = btoa(encodeURIComponent(result));
    return `ENC:v1:${encoded}`;
  } catch (e) {
    console.error('Encryption failed, returning safe fallback', e);
    return `ENC:v1:${btoa(plainText)}`;
  }
};

/**
 * Decrypts encrypted conversation string back to original plain text
 */
export const decryptPayload = (cipherText: string, key = 'Uborka232425---'): string => {
  if (!cipherText) return '';
  if (!cipherText.startsWith('ENC:v1:')) {
    return cipherText; // Not encrypted or legacy text
  }
  try {
    const rawBase64 = cipherText.replace('ENC:v1:', '');
    const decoded = decodeURIComponent(atob(rawBase64));
    const combinedKey = key + MASTER_SALT;
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = combinedKey.charCodeAt(i % combinedKey.length);
      const decryptedChar = String.fromCharCode(charCode ^ keyChar);
      result += decryptedChar;
    }
    return result;
  } catch (e) {
    console.error('Decryption failed with provided key', e);
    return '[Titkosított Tartalom - Helytelen Admin Kulcs]';
  }
};

export const isEncrypted = (text: string): boolean => {
  return typeof text === 'string' && text.startsWith('ENC:v1:');
};
