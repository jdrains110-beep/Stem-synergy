// LOCKED FILE

          // *** System Configuration - NON-EDITABLE VALUES ***
          // This file contains configuration values that should not be modified during normal app customization.
          // These values are set during app creation.

          // Pi Network Configuration
          export const PI_NETWORK_CONFIG = {
            SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
            SANDBOX: false,
          } as const;

          // Backend Configuration
          export const BACKEND_CONFIG = {
            BASE_URL: typeof window !== 'undefined' ? window.location.origin : '',
          } as const;

          // Backend URLs
          export const BACKEND_URLS = {
            LOGIN: '/api/login',

          } as const;
