/**
 * Walrus Service (Hackathon Version)
 *
 * IMPORTANT:
 * - This implementation MOCKS Walrus storage using localStorage.
 * - It generates a fake Walrus ID + content hash for each entry.
 * - All reads/writes are local-only for demo purposes.
 * - TODO (Production): Replace with real WalrusClient + Sui signer and on-chain writeBlob().
 */

import crypto from 'crypto-js';

// Prefix for localStorage keys so we don't collide with other data
const WALRUS_STORAGE_PREFIX = 'walrus_entry_';

/**
 * Generate a fake Walrus ID for hackathon/demo purposes.
 * Example: WAL-1700192349375-2BAA7C45F
 */
export const generateFakeWalrusId = () => {
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `WAL-${Date.now()}-${randomPart}`;
};

/**
 * In the hackathon version we don't talk to a real Walrus node,
 * so initializeWalrus is kept only as a placeholder / future hook.
 */
export const initializeWalrus = async () => {
  console.log('ℹ️ Hackathon mode: Walrus client is mocked (no real network calls).');
  // TODO (Production): Initialize real WalrusClient with Sui signer + RPC URL
  return null;
};

/**
 * Get or initialize Walrus client (mocked)
 * Kept for API compatibility with future real implementation.
 */
const getWalrusClient = async () => {
  await initializeWalrus();
  return null;
};

/**
 * Generate content hash for data integrity verification
 */
export const generateContentHash = (data) => {
  const dataString = JSON.stringify(data);
  return crypto.SHA256(dataString).toString();
};

/**
 * Encrypt data using Seal (optional encryption)
 * @param {Object} data - Data to encrypt
 * @param {String} accessKey - Encryption key
 * @returns {String} - Encrypted data
 */
export const encryptWithSeal = (data, accessKey) => {
  try {
    const dataString = JSON.stringify(data);
    const encrypted = crypto.AES.encrypt(dataString, accessKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

/**
 * Decrypt data using Seal
 * @param {String} encryptedData - Encrypted data
 * @param {String} accessKey - Decryption key
 * @returns {Object} - Decrypted data
 */
export const decryptWithSeal = (encryptedData, accessKey) => {
  try {
    const bytes = crypto.AES.decrypt(encryptedData, accessKey);
    const decrypted = bytes.toString(crypto.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

/**
 * Store wellness entry (MOCKED Walrus storage using localStorage)
 * @param {Object} entryData - Wellness entry data
 * @param {String} accessKey - Optional encryption key for Seal
 * @returns {Object} - { walrusId, contentHash, size, timestamp }
 */
export const storeWellnessEntry = async (entryData, accessKey = null) => {
  try {
    // In hackathon mode we do NOT actually use the client, but keep the call
    // for future compatibility.
    await getWalrusClient();

    // Generate content hash for integrity verification
    const contentHash = generateContentHash(entryData);

    // Prepare data for storage
    let dataToStore = entryData;
    let encrypted = false;

    // Optional: Encrypt with Seal if accessKey provided
    if (accessKey) {
      dataToStore = encryptWithSeal(entryData, accessKey);
      encrypted = true;
    }

    // Generate fake Walrus ID for this entry
    const walrusId = generateFakeWalrusId();
    const timestamp = new Date().toISOString();

    const record = {
      walrusId,
      contentHash,
      encrypted,
      timestamp,
      data: dataToStore,
    };

    // Store in localStorage as our "mock Walrus"
    try {
      const key = WALRUS_STORAGE_PREFIX + walrusId;
      window.localStorage.setItem(key, JSON.stringify(record));
    } catch (storageError) {
      console.warn('⚠️ Failed to write to localStorage (mock Walrus storage):', storageError);
    }

    console.log('✅ [MOCK] Stored entry in local Walrus storage.', {
      walrusId,
      contentHash: contentHash.substring(0, 20) + '...',
    });

    return {
      walrusId,
      contentHash,
      size: JSON.stringify(record).length,
      timestamp,
      encrypted,
      // MOCK URL for display only
      url: `mock-walrus://${walrusId}`,
    };
  } catch (error) {
    console.error('❌ Failed to store wellness entry (mock Walrus):', error);
    throw new Error(`Walrus (mock) upload failed: ${error.message}`);
  }
};

/**
 * Retrieve wellness entry (MOCKED Walrus storage using localStorage)
 * @param {String} walrusId - Walrus ID of the entry
 * @param {String} accessKey - Optional decryption key if entry was encrypted
 * @returns {Object} - Wellness entry data
 */
export const retrieveWellnessEntry = async (walrusId, accessKey = null) => {
  try {
    await getWalrusClient();

    console.log('📥 [MOCK] Retrieving from local Walrus storage...', {
      walrusId: walrusId.substring(0, 30) + '...',
    });

    const key = WALRUS_STORAGE_PREFIX + walrusId;
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      throw new Error('No entry found for this Walrus ID in local storage.');
    }

    const record = JSON.parse(raw);
    let entryData = record.data;

    // Decrypt if accessKey provided and data is encrypted
    if (record.encrypted && accessKey) {
      try {
        entryData = decryptWithSeal(entryData, accessKey);
        console.log('✅ Successfully decrypted entry (mock Walrus).');
      } catch (decryptError) {
        console.warn('Decryption failed, returning encrypted data:', decryptError);
      }
    }

    console.log('✅ [MOCK] Successfully retrieved from local Walrus storage.');

    // Attach mock metadata back for UI if needed
    return {
      ...entryData,
      walrusId: record.walrusId,
      contentHash: record.contentHash,
      encrypted: record.encrypted,
      storedAt: record.timestamp,
    };
  } catch (error) {
    console.error('❌ Failed to retrieve wellness entry (mock Walrus):', error);
    throw new Error(`Walrus (mock) retrieval failed: ${error.message}`);
  }
};

/**
 * Verify entry integrity using content hash
 * @param {Object} entryData - Entry data to verify
 * @param {String} storedHash - Hash stored on blockchain
 * @returns {Boolean} - True if hash matches
 */
export const verifyEntryIntegrity = (entryData, storedHash) => {
  const currentHash = generateContentHash(entryData);
  return currentHash === storedHash;
};

/**
 * Batch store multiple entries
 * @param {Array} entries - Array of entry data
 * @param {String} accessKey - Optional encryption key
 * @returns {Array} - Array of storage results
 */
export const batchStoreEntries = async (entries, accessKey = null) => {
  const results = [];
  
  for (const entry of entries) {
    try {
      const result = await storeWellnessEntry(entry, accessKey);
      results.push({ success: true, entry, result });
    } catch (error) {
      results.push({ success: false, entry, error: error.message });
    }
  }
  
  return results;
};


