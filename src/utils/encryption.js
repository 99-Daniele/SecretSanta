import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key-change-in-production';

/**
 * Encrypt a string value
 * @param {string} value - The value to encrypt
 * @returns {string} Encrypted value
 */
export const encrypt = (value) => {
  try {
    return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return value;
  }
};

/**
 * Decrypt an encrypted string
 * @param {string} encryptedValue - The encrypted value
 * @returns {string} Decrypted value
 */
export const decrypt = (encryptedValue) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedValue;
  }
};

/**
 * Hash a value for database storage (one-way)
 * @param {string} value - The value to hash
 * @returns {string} Hashed value
 */
export const hash = (value) => {
  return CryptoJS.SHA256(value).toString();
};
