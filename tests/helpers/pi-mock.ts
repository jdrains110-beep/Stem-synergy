/**
 * Pi SDK Mock for Testing
 * 
 * This mock provides a complete Pi SDK implementation for testing purposes.
 * It simulates Pi Network authentication and payment flows without requiring
 * actual Pi Network connectivity.
 */

export interface MockPiUser {
  uid: string;
  username: string;
}

export interface MockPiAuthResult {
  accessToken: string;
  user: MockPiUser;
}

export const createMockPiSDK = () => {
  const mockUser: MockPiUser = {
    uid: 'test-user-id-12345',
    username: 'test_pi_user',
  };

  const mockAccessToken = 'mock-pi-access-token-for-testing';

  return {
    init: async (config: { version: string; sandbox?: boolean }) => {
      console.log('[Mock Pi SDK] Initialized with config:', config);
      return Promise.resolve();
    },

    authenticate: async (
      scopes: string[],
      options?: { authMessage?: string }
    ): Promise<MockPiAuthResult> => {
      console.log('[Mock Pi SDK] Authenticating with scopes:', scopes);
      console.log('[Mock Pi SDK] Auth message:', options?.authMessage);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        accessToken: mockAccessToken,
        user: mockUser,
      };
    },

    createPayment: (
      paymentData: {
        amount: number;
        memo: string;
        metadata: Record<string, any>;
      },
      callbacks: {
        onReadyForServerApproval: (paymentId: string) => void;
        onReadyForServerCompletion: (paymentId: string, txid: string) => void;
        onCancel: (paymentId: string) => void;
        onError: (error: Error, payment?: any) => void;
      }
    ) => {
      console.log('[Mock Pi SDK] Creating payment:', paymentData);
      
      // Simulate payment approval flow
      setTimeout(() => {
        const mockPaymentId = 'mock-payment-' + Date.now();
        callbacks.onReadyForServerApproval(mockPaymentId);
        
        // Simulate payment completion
        setTimeout(() => {
          const mockTxId = 'mock-tx-' + Date.now();
          callbacks.onReadyForServerCompletion(mockPaymentId, mockTxId);
        }, 100);
      }, 100);
    },
  };
};

/**
 * Inject Pi SDK mock into the global window object
 * Call this in test setup or beforeEach hooks
 */
export const injectMockPiSDK = () => {
  if (typeof window !== 'undefined') {
    (window as any).Pi = createMockPiSDK();
  }
};

/**
 * Remove Pi SDK mock from the global window object
 * Call this in test teardown or afterEach hooks
 */
export const removeMockPiSDK = () => {
  if (typeof window !== 'undefined') {
    delete (window as any).Pi;
  }
};
