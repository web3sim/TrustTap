package com.humanpassport;

import android.content.Intent;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.humanpassport.nfc.NFCModule;

public class MainActivity extends ReactActivity {
    private static final String TAG = "MainActivity";
    private static final String KEYCARD_AID = "A0000008040001";
    private NfcAdapter nfcAdapter;

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HumanPassportMobile";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a {@link
     * DefaultReactActivityDelegate} which allows you to pass null for the {@link ReactRootView},
     * therefore the entire app will be a single-screen app with its root being an instance of
     * {@link ReactRootView} rather than a separately created one.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new MainActivityDelegate(this, getMainComponentName());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        
        // Log NFC availability
        if (nfcAdapter == null) {
            Log.w(TAG, "NFC is not available on this device");
        } else if (!nfcAdapter.isEnabled()) {
            Log.w(TAG, "NFC is disabled");
        } else {
            Log.d(TAG, "NFC is available and enabled");
        }

        // Handle intent if app was opened by NFC tag
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Enable NFC foreground dispatch
        if (nfcAdapter != null) {
            nfcAdapter.enableForegroundDispatch(this, null, null, null);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Disable NFC foreground dispatch
        if (nfcAdapter != null) {
            nfcAdapter.disableForegroundDispatch(this);
        }
    }

    /**
     * Handle NFC intent and send event to JavaScript
     */
    private void handleIntent(Intent intent) {
        if (intent == null) return;

        String action = intent.getAction();
        
        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(action) ||
            NfcAdapter.ACTION_TECH_DISCOVERED.equals(action)) {

            Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            if (tag != null) {
                handleKeycardDetected(tag);
            }
        }
    }

    /**
     * Handle Keycard detection via NFC
     */
    private void handleKeycardDetected(Tag tag) {
        try {
            IsoDep isoDep = IsoDep.get(tag);
            if (isoDep == null) {
                Log.w(TAG, "IsoDep not supported by this tag");
                return;
            }

            isoDep.connect();
            Log.d(TAG, "Connected to NFC tag: " + byteArrayToHexString(tag.getId()));

            // Send event to JavaScript
            WritableMap data = Arguments.createMap();
            data.putString("tagId", byteArrayToHexString(tag.getId()));
            data.putString("message", "Keycard detected");

            sendEvent("NFCTagDetected", data);

            // Disconnect
            if (isoDep.isConnected()) {
                isoDep.close();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error handling NFC tag: " + e.getMessage());
            
            WritableMap error = Arguments.createMap();
            error.putString("error", e.getMessage());
            sendEvent("NFCError", error);
        }
    }

    /**
     * Send event to JavaScript bridge
     */
    private void sendEvent(String eventName, WritableMap params) {
        try {
            getReactInstanceManager()
                    .getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } catch (Exception e) {
            Log.e(TAG, "Error sending event: " + e.getMessage());
        }
    }

    /**
     * Convert byte array to hex string
     */
    private static String byteArrayToHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }

    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }

        @Override
        protected ReactRootView createRootView() {
            ReactRootView reactRootView = new ReactRootView(getContext());
            // If you opted-in to the New Architecture, we enable the Fabric Renderer.
            reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
            return reactRootView;
        }
    }
}
