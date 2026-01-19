/**
 * Global type definitions for Pi Network SDK
 */

export interface PiUser {
  uid: string;
  username: string;
}

export interface PiAuthResult {
  accessToken: string;
  user: PiUser;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: any) => void;
}

export interface PiSDK {
  init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
  authenticate: (
    scopes: string[],
    options?: { authMessage?: string }
  ) => Promise<PiAuthResult>;
  createPayment: (
    paymentData: PiPaymentData,
    callbacks: PiPaymentCallbacks
  ) => void;
}

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}
