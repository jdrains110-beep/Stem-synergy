"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface PiPaymentButtonProps {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  onSuccess?: (paymentId: string, txid: string) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  buttonText?: string;
}

// Window.Pi type is defined in contexts/pi-auth-context.tsx

export function PiPaymentButton({
  amount,
  memo,
  metadata = {},
  onSuccess,
  onCancel,
  onError,
  buttonText = 'Pay with Pi',
}: PiPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (typeof window.Pi === 'undefined') {
      toast.error('Pi SDK not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);

    try {
      window.Pi.createPayment(
        {
          amount,
          memo,
          metadata,
        },
        {
          // Phase 1: Payment created, needs server approval
          onReadyForServerApproval: async (paymentId: string) => {
            console.log('💰 Payment created, requesting approval:', paymentId);
            
            try {
              const response = await fetch('/api/pi/payments/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
              });

              if (!response.ok) {
                throw new Error('Payment approval failed');
              }

              console.log('✅ Payment approved by server');
            } catch (error) {
              console.error('❌ Server approval failed:', error);
              toast.error('Payment approval failed. Please try again.');
            }
          },

          // Phase 2: Blockchain transaction submitted, needs server completion
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log('⛓️ Transaction on blockchain:', txid);

            try {
              const response = await fetch('/api/pi/payments/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid }),
              });

              if (!response.ok) {
                throw new Error('Payment completion failed');
              }

              console.log('✅ Payment completed');
              toast.success('Payment successful! 🎉');
              setIsProcessing(false);
              
              if (onSuccess) {
                onSuccess(paymentId, txid);
              }
            } catch (error) {
              console.error('❌ Server completion failed:', error);
              toast.error('Payment completion failed. Please contact support.');
              setIsProcessing(false);
            }
          },

          // User cancelled the payment
          onCancel: (paymentId: string) => {
            console.log('❌ Payment cancelled by user:', paymentId);
            toast.info('Payment cancelled');
            setIsProcessing(false);
            
            if (onCancel) {
              onCancel();
            }
          },

          // Error occurred
          onError: (error: Error, payment?: any) => {
            console.error('❌ Payment error:', error, payment);
            toast.error(`Payment failed: ${error.message}`);
            setIsProcessing(false);
            
            if (onError) {
              onError(error);
            }
          },
        }
      );
    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      toast.error('Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      size="lg"
      className="w-full"
    >
      {isProcessing ? (
        <>
          <span className="mr-2">⏳</span>
          Processing...
        </>
      ) : (
        <>
          <span className="mr-2">π</span>
          {buttonText}
        </>
      )}
    </Button>
  );
}

// Example usage component
export function PiPaymentExample() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Premium Blueprint Generation</CardTitle>
        <CardDescription>
          Generate 10 premium blueprints with advanced features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>10 Premium Blueprints</span>
            <span className="font-semibold">5 π</span>
          </div>
          
          <PiPaymentButton
            amount={5}
            memo="10 Premium Blueprint Credits"
            metadata={{
              product: 'premium_blueprints',
              quantity: 10,
            }}
            onSuccess={(paymentId, txid) => {
              console.log('Payment successful!', { paymentId, txid });
              // Redirect to blueprints page or update UI
            }}
            buttonText="Purchase for 5 π"
          />
        </div>
      </CardContent>
    </Card>
  );
}
