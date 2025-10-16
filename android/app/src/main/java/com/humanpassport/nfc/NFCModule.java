package com.humanpassport.nfc;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.os.Build;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;

public class NFCModule extends ReactContextBaseJavaModule {
    private static final String TAG = "NFCModule";
    private static final String KEYCARD_AID = "A0000008040001";
    private NfcAdapter nfcAdapter;
    private IsoDep isoDep;
    private ReactApplicationContext reactContext;

    public NFCModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.nfcAdapter = NfcAdapter.getDefaultAdapter(context);
    }

    @Override
    public String getName() {
        return "NFCModule";
    }

    /**
     * Check if NFC is supported on device
     */
    @ReactMethod
    public void isNFCSupported(Promise promise) {
        try {
            if (nfcAdapter == null) {
                promise.resolve(false);
                return;
            }
            promise.resolve(nfcAdapter.isEnabled());
        } catch (Exception e) {
            promise.reject("NFC_ERROR", e.getMessage());
        }
    }

    /**
     * Enable NFC foreground dispatch
     */
    @ReactMethod
    public void enableNFCForegroundDispatch(Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null || nfcAdapter == null) {
                promise.reject("ACTIVITY_ERROR", "Activity or NFC adapter not available");
                return;
            }

            IntentFilter[] intentFilters = new IntentFilter[]{
                    new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED),
                    new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED)
            };

            String[][] techList = new String[][]{
                    {"android.nfc.tech.IsoDep"},
                    {"android.nfc.tech.NfcA"},
                    {"android.nfc.tech.MifareClassic"},
                    {"android.nfc.tech.MifareUltralight"}
            };

            Intent intent = new Intent(activity, activity.getClass())
                    .addFlags(Intent.FLAG_RECEIVER_REPLACE_PENDING);

            nfcAdapter.enableForegroundDispatch(activity, intent, intentFilters, techList);
            promise.resolve("NFC foreground dispatch enabled");
        } catch (Exception e) {
            promise.reject("NFC_ERROR", e.getMessage());
        }
    }

    /**
     * Disable NFC foreground dispatch
     */
    @ReactMethod
    public void disableNFCForegroundDispatch(Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null || nfcAdapter == null) {
                promise.reject("ACTIVITY_ERROR", "Activity or NFC adapter not available");
                return;
            }

            nfcAdapter.disableForegroundDispatch(activity);
            promise.resolve("NFC foreground dispatch disabled");
        } catch (Exception e) {
            promise.reject("NFC_ERROR", e.getMessage());
        }
    }

    /**
     * Send APDU command to Keycard
     */
    @ReactMethod
    public void sendAPDU(String apduHex, Promise promise) {
        try {
            if (isoDep == null || !isoDep.isConnected()) {
                promise.reject("NFC_ERROR", "Keycard not connected");
                return;
            }

            byte[] apduBytes = hexStringToByteArray(apduHex);
            byte[] response = isoDep.transceive(apduBytes);
            String responseHex = byteArrayToHexString(response);

            WritableMap result = Arguments.createMap();
            result.putString("response", responseHex);

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("APDU_ERROR", e.getMessage());
        }
    }

    /**
     * Connect to detected NFC tag
     */
    @ReactMethod
    public void connectToTag(Promise promise) {
        try {
            Intent intent = getCurrentActivity().getIntent();
            Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);

            if (tag == null) {
                promise.reject("NFC_ERROR", "No tag detected");
                return;
            }

            isoDep = IsoDep.get(tag);
            if (isoDep == null) {
                promise.reject("NFC_ERROR", "IsoDep not supported by this tag");
                return;
            }

            isoDep.connect();

            WritableMap result = Arguments.createMap();
            result.putString("message", "Connected to NFC tag");
            result.putString("tagId", byteArrayToHexString(tag.getId()));

            promise.resolve(result);
        } catch (IOException e) {
            promise.reject("NFC_ERROR", e.getMessage());
        }
    }

    /**
     * Disconnect from NFC tag
     */
    @ReactMethod
    public void disconnectTag(Promise promise) {
        try {
            if (isoDep != null && isoDep.isConnected()) {
                isoDep.close();
                isoDep = null;
            }
            promise.resolve("Disconnected from tag");
        } catch (Exception e) {
            promise.reject("NFC_ERROR", e.getMessage());
        }
    }

    /**
     * Send event to JavaScript
     */
    public void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // Helper methods

    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

    private static String byteArrayToHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
}
