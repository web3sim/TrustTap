/**
 * NFC Service
 * Manages NFC communication for Keycard hardware wallet interaction
 * Supports both Android and iOS NFC capabilities
 */

import { NfcManager, NfcTech, Ndef } from 'react-native-nfc-manager';

interface NFCTag {
  type: string;
  id: string;
  tech: string[];
}

interface KeycardAPDU {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data?: string;
  le?: number;
}

class NFCService {
  private isInitialized: boolean = false;
  private isScanning: boolean = false;

  /**
   * Initialize NFC manager
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔵 Initializing NFC Manager...');
      await NfcManager.start();
      this.isInitialized = true;
      console.log('✅ NFC Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize NFC:', error);
      throw error;
    }
  }

  /**
   * Start scanning for Keycard
   */
  async startScanning(): Promise<NFCTag> {
    if (!this.isInitialized) {
      throw new Error('NFC Manager not initialized');
    }

    try {
      console.log('📡 Starting NFC scan for Keycard...');
      this.isScanning = true;

      // Register for NFC Events
      await NfcManager.requestTechnology([
        NfcTech.IsoDep,
        NfcTech.NfcA,
      ]);

      // Get tag info
      const tag = await NfcManager.getTag();

      if (!tag) {
        throw new Error('No NFC tag detected');
      }

      console.log('✅ Keycard detected:', tag.id);

      return {
        type: tag.type || 'unknown',
        id: tag.id || '',
        tech: tag.tech || [],
      };
    } catch (error) {
      console.error('❌ NFC scan failed:', error);
      throw error;
    } finally {
      this.isScanning = false;
      await this.stopScanning();
    }
  }

  /**
   * Stop scanning for NFC tags
   */
  async stopScanning(): Promise<void> {
    try {
      await NfcManager.cancelTechnologyRequest();
      console.log('🔴 NFC scan stopped');
    } catch (error) {
      console.warn('⚠️ Error stopping NFC scan:', error);
    }
  }

  /**
   * Send APDU command to Keycard
   * @param apdu - APDU command to send
   */
  async sendAPDU(apdu: KeycardAPDU): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('NFC Manager not initialized');
    }

    try {
      console.log('📤 Sending APDU command to Keycard...');

      // Format APDU command
      const apduHex = this.formatAPDU(apdu);

      // Send command via IsoDep (ISO/IEC 14443-4)
      const response = await NfcManager.transceive(
        Buffer.from(apduHex, 'hex').toJSON().data || []
      );

      const responseHex = Buffer.from(response).toString('hex');
      console.log('📥 APDU Response:', responseHex);

      return responseHex;
    } catch (error) {
      console.error('❌ APDU command failed:', error);
      throw error;
    }
  }

  /**
   * Send Keycard SELECT command
   * Application Identifier (AID): 0xA0000008040001
   */
  async selectKeycard(): Promise<string> {
    const apdu: KeycardAPDU = {
      cla: 0x00,
      ins: 0xa4,
      p1: 0x04,
      p2: 0x00,
      data: 'A0000008040001', // Keycard AID
      le: 256,
    };

    return this.sendAPDU(apdu);
  }

  /**
   * Get Keycard status
   */
  async getKeycardStatus(): Promise<string> {
    // SELECT Keycard first
    await this.selectKeycard();

    // GET STATUS command (INS 0xF2)
    const apdu: KeycardAPDU = {
      cla: 0x80,
      ins: 0xf2,
      p1: 0x00,
      p2: 0x00,
      le: 256,
    };

    return this.sendAPDU(apdu);
  }

  /**
   * Verify PIN on Keycard (VERIFY command)
   */
  async verifyPin(pin: string): Promise<string> {
    // SELECT Keycard first
    await this.selectKeycard();

    // Convert PIN to hex
    const pinHex = Buffer.from(pin).toString('hex');

    // VERIFY command (INS 0x20)
    const apdu: KeycardAPDU = {
      cla: 0x80,
      ins: 0x20,
      p1: 0x00,
      p2: 0x00,
      data: pinHex,
      le: 0,
    };

    return this.sendAPDU(apdu);
  }

  /**
   * Get public key from Keycard
   */
  async getPublicKey(keyPath: number = 0): Promise<string> {
    // SELECT Keycard first
    await this.selectKeycard();

    // GET PUBLIC KEY command (INS 0xF7)
    const apdu: KeycardAPDU = {
      cla: 0x80,
      ins: 0xf7,
      p1: 0x00,
      p2: keyPath,
      le: 256,
    };

    return this.sendAPDU(apdu);
  }

  /**
   * Sign data with Keycard
   */
  async signData(data: string): Promise<string> {
    // SELECT Keycard first
    await this.selectKeycard();

    // SIGN command (INS 0xC0)
    const apdu: KeycardAPDU = {
      cla: 0x80,
      ins: 0xc0,
      p1: 0x00,
      p2: 0x00,
      data: data,
      le: 256,
    };

    return this.sendAPDU(apdu);
  }

  /**
   * Check if NFC is available and enabled
   */
  async isNFCAvailable(): Promise<boolean> {
    try {
      const isSupported = await NfcManager.isSupported();
      return isSupported;
    } catch (error) {
      console.error('❌ NFC availability check failed:', error);
      return false;
    }
  }

  /**
   * Get NFC manager instance
   */
  getNfcManager() {
    return NfcManager;
  }

  /**
   * Check if currently scanning
   */
  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }

  /**
   * Cleanup and close NFC manager
   */
  async cleanup(): Promise<void> {
    try {
      if (this.isScanning) {
        await this.stopScanning();
      }
      // Note: Don't call NfcManager.stop() as it may prevent future NFC operations
      this.isInitialized = false;
      console.log('🧹 NFC cleanup complete');
    } catch (error) {
      console.error('❌ NFC cleanup failed:', error);
    }
  }

  // Private helper methods

  private formatAPDU(apdu: KeycardAPDU): string {
    let apduStr = '';

    // CLA byte
    apduStr += this.byteToHex(apdu.cla);

    // INS byte
    apduStr += this.byteToHex(apdu.ins);

    // P1 byte
    apduStr += this.byteToHex(apdu.p1);

    // P2 byte
    apduStr += this.byteToHex(apdu.p2);

    // If data is provided, add length and data
    if (apdu.data) {
      const dataLength = Buffer.from(apdu.data, 'hex').length;
      apduStr += this.byteToHex(dataLength);
      apduStr += apdu.data;
    } else {
      apduStr += '00'; // Lc = 0
    }

    // Add expected response length (Le)
    if (apdu.le !== undefined) {
      apduStr += this.byteToHex(apdu.le);
    }

    return apduStr;
  }

  private byteToHex(byte: number): string {
    return ('0' + byte.toString(16)).slice(-2);
  }
}

export default new NFCService();
