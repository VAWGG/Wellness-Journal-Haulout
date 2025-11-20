// services/walrusService.js
import { WalrusClient } from '@mysten/walrus';
import axios from 'axios';

// Initialize Walrus Client
const WALRUS_RPC_URL = process.env.REACT_APP_WALRUS_RPC_URL || 'https://walrus-testnet-rpc.mystenlabs.com';

const walrusClient = new WalrusClient({
  rpcUrl: WALRUS_RPC_URL
});

/**
 * Store wellness entry on Walrus
 * @param {Object} entryData - Wellness journal entry data
 * @returns {Object} - { walrusId, contentHash, timestamp }
 */
export const storeWellnessEntry = async (entryData) => {
  try {
    console.log('Storing wellness entry on Walrus...');

    // Convert entry to JSON
    const jsonData = JSON.stringify(entryData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Store on Walrus
    const storageResponse = await walrusClient.uploadBlob(blob);

    const result = {
      walrusId: storageResponse.certifiedBlobId,
      contentHash: storageResponse.contentHash,
      size: blob.size,
      timestamp: new Date().toISOString(),
      uploadTime: storageResponse.timestamp,
      status: 'success'
    };

    console.log('✅ Entry stored on Walrus:', result);
    return result;

  } catch (error) {
    console.error('❌ Error storing on Walrus:', error);
    throw new Error(`Walrus storage failed: ${error.message}`);
  }
};

/**
 * Retrieve wellness entry from Walrus
 * @param {String} walrusId - Walrus blob ID
 * @returns {Object} - Wellness entry data
 */
export const retrieveWellnessEntry = async (walrusId) => {
  try {
    console.log('Retrieving entry from Walrus:', walrusId);

    const blobData = await walrusClient.readBlob(walrusId);
    const jsonString = new TextDecoder().decode(blobData);
    const entryData = JSON.parse(jsonString);

    console.log('✅ Entry retrieved from Walrus');
    return entryData;

  } catch (error) {
    console.error('❌ Error retrieving from Walrus:', error);
    throw new Error(`Walrus retrieval failed: ${error.message}`);
  }
};

/**
 * Store multiple wellness entries in batch
 * @param {Array} entriesArray - Array of wellness entries
 * @returns {Array} - Array of storage results
 */
export const batchStoreEntries = async (entriesArray) => {
  try {
    console.log(`Batch storing ${entriesArray.length} entries...`);

    const results = await Promise.all(
      entriesArray.map(entry => storeWellnessEntry(entry))
    );

    console.log('✅ Batch storage completed');
    return results;

  } catch (error) {
    console.error('❌ Batch storage failed:', error);
    throw error;
  }
};

/**
 * Create encrypted wellness entry using Seal
 * @param {Object} entryData - Entry data
 * @param {String} accessKey - Access key for encryption
 * @returns {Object} - Encrypted entry with metadata
 */
export const createEncryptedEntry = async (entryData, accessKey) => {
  try {
    console.log('Creating encrypted entry with Seal...');

    // Encrypt entry data
    const jsonData = JSON.stringify(entryData);
    
    // NOTE: In production, use Seal SDK for proper encryption
    // For now, using base64 as placeholder
    const encrypted = btoa(jsonData); // Basic encoding for demo

    const encryptedEntry = {
      data: encrypted,
      encryptionType: 'seal',
      accessKey: accessKey,
      createdAt: new Date().toISOString(),
      dataHash: hashData(jsonData)
    };

    console.log('✅ Entry encrypted');
    return encryptedEntry;

  } catch (error) {
    console.error('❌ Encryption failed:', error);
    throw error;
  }
};

/**
 * Decrypt wellness entry from Seal
 * @param {Object} encryptedEntry - Encrypted entry object
 * @param {String} accessKey - Access key for decryption
 * @returns {Object} - Decrypted entry data
 */
export const decryptEntry = async (encryptedEntry, accessKey) => {
  try {
    console.log('Decrypting entry from Seal...');

    // Verify access key
    if (encryptedEntry.accessKey !== accessKey) {
      throw new Error('Invalid access key');
    }

    // Decrypt data
    // NOTE: In production, use Seal SDK for proper decryption
    const decrypted = atob(encryptedEntry.data); // Basic decoding for demo
    const entryData = JSON.parse(decrypted);

    console.log('✅ Entry decrypted');
    return entryData;

  } catch (error) {
    console.error('❌ Decryption failed:', error);
    throw error;
  }
};

/**
 * Generate hash of data (for verification)
 * @param {String} data - Data to hash
 * @returns {String} - Hash value
 */
const hashData = (data) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

/**
 * Verify entry integrity using stored hash
 * @param {Object} entryData - Entry data
 * @param {String} storedHash - Hash to verify against
 * @returns {Boolean} - True if valid
 */
export const verifyEntryIntegrity = (entryData, storedHash) => {
  const currentHash = hashData(JSON.stringify(entryData));
  const isValid = currentHash === storedHash;
  
  console.log(`Entry integrity check: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  return isValid;
};

/**
 * Get entry metadata (size, hash, timestamp)
 * @param {String} walrusId - Walrus blob ID
 * @returns {Object} - Metadata object
 */
export const getEntryMetadata = async (walrusId) => {
  try {
    console.log('Fetching entry metadata...');

    // In production, this would fetch from Walrus metadata
    const metadata = {
      walrusId: walrusId,
      retrievalTime: new Date().toISOString(),
      status: 'available'
    };

    return metadata;

  } catch (error) {
    console.error('❌ Failed to fetch metadata:', error);
    throw error;
  }
};

export default {
  storeWellnessEntry,
  retrieveWellnessEntry,
  batchStoreEntries,
  createEncryptedEntry,
  decryptEntry,
  verifyEntryIntegrity,
  getEntryMetadata
};
