/**
 * Utility Helper Functions
 * Common functions for address validation, formatting, and crypto operations
 */

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format Ethereum address for display
 */
export function formatAddress(address: string, length: number = 6): string {
  if (!isValidEthereumAddress(address)) {
    return address;
  }
  return `${address.slice(0, length)}...${address.slice(-4)}`;
}

/**
 * Validate Ethereum signature format (v, r, s)
 */
export function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

/**
 * Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const hexString = hex.replace(/^0x/, '');
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = '0x';
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i].toString(16);
    hex += byte.length === 1 ? '0' + byte : byte;
  }
  return hex;
}

/**
 * Check if string is valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format ETH value with proper decimals
 */
export function formatEth(wei: string, decimals: number = 4): string {
  try {
    const value = parseFloat(wei) / 1e18;
    return value.toFixed(decimals);
  } catch {
    return '0';
  }
}

/**
 * Convert ETH to Wei
 */
export function ethToWei(eth: string): string {
  try {
    const value = parseFloat(eth);
    return (value * 1e18).toString();
  } catch {
    return '0';
  }
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get transaction from address (checksum format)
 */
export function toChecksumAddress(address: string): string {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address');
  }

  const addr = address.slice(2).toLowerCase();
  const hash = require('crypto').createHash('sha256').update(addr).digest('hex');
  
  let result = '0x';
  for (let i = 0; i < addr.length; i++) {
    const hashValue = parseInt(hash[i], 16);
    result += hashValue > 7 ? addr[i].toUpperCase() : addr[i];
  }
  return result;
}

/**
 * Compare two Ethereum addresses (case-insensitive)
 */
export function addressesEqual(addr1: string, addr2: string): boolean {
  if (!isValidEthereumAddress(addr1) || !isValidEthereumAddress(addr2)) {
    return false;
  }
  return addr1.toLowerCase() === addr2.toLowerCase();
}

/**
 * Calculate gas cost
 */
export function calculateGasCost(gasPrice: string, gasLimit: string): string {
  try {
    const price = parseFloat(gasPrice);
    const limit = parseFloat(gasLimit);
    return (price * limit).toString();
  } catch {
    return '0';
  }
}

/**
 * Validate BIP32 derivation path
 */
export function isValidDerivationPath(path: string): boolean {
  const pathRegex = /^m(\/\d+'?)*$/;
  return pathRegex.test(path);
}

/**
 * Parse BIP32 derivation path
 */
export function parseDerivationPath(path: string): number[] {
  if (!isValidDerivationPath(path)) {
    throw new Error('Invalid derivation path');
  }

  const parts = path.split('/').slice(1);
  return parts.map((part) => {
    const hardened = part.endsWith("'");
    const index = parseInt(part.replace("'", ''), 10);
    return hardened ? index + 0x80000000 : index;
  });
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Format transaction for logging
 */
export function formatTransaction(tx: any): string {
  return JSON.stringify(
    {
      from: tx.from ? formatAddress(tx.from) : 'unknown',
      to: tx.to ? formatAddress(tx.to) : 'contract creation',
      value: tx.value ? `${formatEth(tx.value)} ETH` : '0',
      data: tx.data ? `${tx.data.slice(0, 10)}...` : 'none',
      gas: tx.gasLimit || tx.gas,
      gasPrice: tx.gasPrice ? `${tx.gasPrice / 1e9} Gwei` : 'unknown',
    },
    null,
    2
  );
}
