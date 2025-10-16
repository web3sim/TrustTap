/**
 * Human Passport Service
 * Communicates with Human Passport API for identity verification
 * Manages Passport scores, stamps verification, and user data
 * API Endpoint: https://api.passport.xyz/v2/stamps
 */

import axios, { AxiosInstance } from 'axios';

interface PassportScore {
  address: string;
  score: string;
  passing_score: boolean;
  last_score_timestamp: string;
  expiration_timestamp: string;
  threshold: string;
  error: string | null;
  stamp_scores?: { [key: string]: string };
}

interface PassportStamp {
  version: string;
  credential: {
    credentialSubject: {
      id: string;
      provider: string;
      hash?: string;
    };
    issuanceDate: string;
    expirationDate: string;
  };
  metadata?: any;
}

interface PassportStampsResponse {
  next?: string;
  prev?: string;
  items: PassportStamp[];
}

interface UserPassport {
  address: string;
  score: number;
  passing_score: boolean;
  stamps: PassportStamp[];
  verified: boolean;
}

interface SignatureVerification {
  address: string;
  message: string;
  signature: string;
  valid: boolean;
  recoveredAddress?: string;
}

class HumanPassportService {
  private apiClient: AxiosInstance;
  private baseURL: string = 'https://api.passport.xyz';
  private apiKey: string = 'n6Oe8CAt.HZJk2GBDxhJ7yS5Iv5LWYHvIHOxCHM6R';
  private scorerId: string = '100'; // Will be set during initialization

  constructor() {
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });
    // Set default header with API key
    this.apiClient.defaults.headers.common['X-API-KEY'] = this.apiKey;
  }

  /**
   * Initialize service with optional custom credentials
   * API key is already set, but can be overridden
   */
  async initialize(scorerId: string = '100', apiKey?: string): Promise<void> {
    try {
      this.scorerId = scorerId;
      if (apiKey) {
        this.apiKey = apiKey;
        this.apiClient.defaults.headers.common['X-API-KEY'] = apiKey;
      }
      console.log(`✅ Human Passport Service initialized with Scorer ID: ${this.scorerId}`);
    } catch (error) {
      console.error('❌ Failed to initialize Human Passport Service:', error);
      throw error;
    }
  }

  /**
   * Get Passport score for an Ethereum address
   * Endpoint: GET /v2/stamps/{scorer_id}/score/{address}
   */
  async getPassportScore(address: string): Promise<PassportScore> {
    try {
      console.log(`📊 Fetching Passport score for ${address}...`);

      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      const response = await this.apiClient.get(
        `/v2/stamps/${this.scorerId}/score/${address}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      const score: PassportScore = response.data;
      console.log(`✅ Passport score retrieved: ${score.score} (Passing: ${score.passing_score})`);

      return score;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.warn('⚠️ Address not found in Passport database');
        } else if (error.response?.status === 401) {
          console.error('❌ Unauthorized - Check API key');
        } else if (error.response?.status === 429) {
          console.error('❌ Rate limited - Too many requests');
        }
      }
      console.error('❌ Failed to fetch Passport score:', error);
      throw error;
    }
  }

  /**
   * Get user's Passport stamps/credentials
   * Endpoint: GET /v2/stamps/{address}
   */
  async getUserStamps(address: string, limit?: number, token?: string): Promise<PassportStampsResponse> {
    try {
      console.log(`🏷️ Fetching Passport stamps for ${address}...`);

      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      const params: any = {
        include_metadata: true,
      };

      if (limit) {
        params.limit = limit;
      }

      if (token) {
        params.token = token;
      }

      const response = await this.apiClient.get(
        `/v2/stamps/${address}`,
        {
          params,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      const stampsResponse: PassportStampsResponse = response.data;
      console.log(`✅ Retrieved ${stampsResponse.items.length} Passport stamps`);

      return stampsResponse;
    } catch (error) {
      console.error('❌ Failed to fetch Passport stamps:', error);
      throw error;
    }
  }

  /**
   * Get all available Stamps metadata
   * Endpoint: GET /v2/stamps/metadata
   */
  async getAllStampsMetadata() {
    try {
      console.log('� Fetching all available Stamps metadata...');

      const response = await this.apiClient.get(
        '/v2/stamps/metadata',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      console.log('✅ Stamps metadata retrieved');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch Stamps metadata:', error);
      throw error;
    }
  }

  /**
   * Get full user Passport data
   */
  async getUserPassport(address: string): Promise<UserPassport> {
    try {
      console.log(`👤 Fetching full Passport data for ${address}...`);

      const [scoreData, stampsData] = await Promise.all([
        this.getPassportScore(address),
        this.getUserStamps(address),
      ]);

      const userPassport: UserPassport = {
        address,
        score: parseFloat(scoreData.score),
        passing_score: scoreData.passing_score,
        stamps: stampsData.items || [],
        verified: scoreData.passing_score,
      };

      console.log('✅ User Passport data retrieved');

      return userPassport;
    } catch (error) {
      console.error('❌ Failed to fetch user Passport:', error);
      throw error;
    }
  }

  /**
   * Check if address passes Sybil resistance threshold
   * Default threshold: 20 points (as per Passport docs)
   */
  async isSybilResistant(address: string, threshold: number = 20): Promise<boolean> {
    try {
      const score = await this.getPassportScore(address);
      const scoreValue = parseFloat(score.score);
      const isSafe = scoreValue >= threshold;

      console.log(
        `${isSafe ? '✅' : '⚠️'} Sybil resistance check: ${scoreValue} >= ${threshold} = ${isSafe}`
      );

      return isSafe;
    } catch (error) {
      console.error('❌ Sybil resistance check failed:', error);
      throw error;
    }
  }

  /**
   * Verify a message signature (for future use)
   * Currently, verification should be done client-side using ethers.js
   */
  async verifySignature(
    address: string,
    message: string,
    signature: string
  ): Promise<SignatureVerification> {
    try {
      console.log('� Verifying signature...');

      // In production, you would verify the signature here
      // For now, return mock verification
      const result: SignatureVerification = {
        address,
        message,
        signature,
        valid: signature.length > 10, // Basic check
      };

      console.log(`✅ Signature verification result: ${result.valid ? 'VALID' : 'INVALID'}`);
      return result;
    } catch (error) {
      console.error('❌ Signature verification failed:', error);
      throw error;
    }
  }

  /**
   * Set custom API base URL (for testnet or alternative endpoints)
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.apiClient.defaults.baseURL = url;
    console.log(`✅ Base URL set to: ${url}`);
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      baseURL: this.baseURL,
      apiKeySet: !!this.apiKey,
    };
  }
}

export default new HumanPassportService();
