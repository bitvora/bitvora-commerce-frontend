"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import Confetti from 'react-confetti';

interface CheckoutData {
  id: string;
  account_id: string;
  amount: number;
  currency: string;
  description?: string;
  customer_id?: string;
  state: string;
  created_at: string;
  expires_at?: string;
  redirect_url?: string;
  bitcoin_address?: string;
  lightning_invoice?: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("unified");
  const [countdown, setCountdown] = useState<string>("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    fetchCheckoutData();
  }, [params.id]);

  // Update countdown timer
  useEffect(() => {
    if (!checkoutData?.expires_at) return;

    const timer = setInterval(() => {
      const now = new Date();
      const expiryDate = new Date(checkoutData.expires_at!);
      const diffMs = expiryDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown("Expired");
        clearInterval(timer);
        return;
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      let timeString = "";
      if (diffDays > 0) {
        timeString += `${diffDays} day${diffDays > 1 ? 's' : ''} `;
      }
      if (diffHours > 0) {
        timeString += `${diffHours} hour${diffHours > 1 ? 's' : ''} `;
      }
      timeString += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;

      setCountdown(timeString.trim());
    }, 1000);

    return () => clearInterval(timer);
  }, [checkoutData?.expires_at]);

  // New useEffect for polling payment status
  useEffect(() => {
    const pollPaymentStatus = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/c/${params.id}/poll`);

      if (response.ok) {
        const data = await response.json();
        const { state, received_amount, amount } = data.data;

        if (state === "paid" && received_amount >= amount) {
          setPaymentConfirmed(true);
          clearInterval(pollingInterval); // Stop polling once payment is confirmed
        }
      } else if (response.status === 404) {
        console.log("Payment not found, continuing to poll...");
      }
    };

    const pollingInterval = setInterval(pollPaymentStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(pollingInterval); // Cleanup on unmount
  }, [params.id]);

  const fetchCheckoutData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/c/${params.id}`); // Updated endpoint

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCheckoutData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching checkout details');
      console.error("Error fetching checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getUnifiedQRCodeValue = () => {
    const { bitcoin_address, lightning_invoice, amount } = checkoutData || {};
    if (bitcoin_address && lightning_invoice) {
      return `bitcoin:${bitcoin_address}?amount=${amount}&lightning=${lightning_invoice}`;
    }
    return bitcoin_address || lightning_invoice || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !checkoutData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400">{error || "Checkout not found"}</p>
        </div>
      </div>
    );
  }

  // Check if payment is completed
  const isCompleted = 
    checkoutData.state && (
      checkoutData.state.toLowerCase() === "completed" || 
      checkoutData.state.toLowerCase() === "paid"
    );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {paymentConfirmed && <Confetti />}
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Payment</h2>
          {checkoutData.expires_at && !isCompleted && (
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white">
              Expires in: {countdown}
            </div>
          )}
        </div>
        
        {/* Payment status */}
        {isCompleted || paymentConfirmed ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Complete!</h3>
            <p className="text-gray-400 mb-6">Thank you for your payment.</p>
          </div>
        ) : (
          <>
            {/* Amount and description */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-1">
                {formatCurrency(checkoutData.amount, checkoutData.currency)}
              </h3>
              {checkoutData.description && (
                <p className="text-gray-400">{checkoutData.description}</p>
              )}
            </div>
            
            {/* Payment method tabs */}
            <div className="border-t border-b border-gray-700">
              <div className="grid grid-cols-3 text-center">
                <button
                  className={`py-3 font-medium ${
                    activeTab === "unified" 
                    ? "text-purple-400 border-b-2 border-purple-400" 
                    : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("unified")}
                >
                  Unified
                </button>
                <button
                  className={`py-3 font-medium ${
                    activeTab === "lightning" 
                    ? "text-purple-400 border-b-2 border-purple-400" 
                    : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("lightning")}
                >
                  Lightning
                </button>
                <button
                  className={`py-3 font-medium ${
                    activeTab === "bitcoin" 
                    ? "text-purple-400 border-b-2 border-purple-400" 
                    : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("bitcoin")}
                >
                  Bitcoin
                </button>
              </div>
            </div>
            
            {/* QR codes and payment instructions */}
            <div className="p-6">
              {activeTab === "unified" && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg flex justify-center">
                    <QRCodeSVG value={getUnifiedQRCodeValue()} size={128} />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">
                      Scan with a wallet that supports both Bitcoin and Lightning payments.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === "lightning" && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg flex justify-center">
                    <QRCodeSVG value={checkoutData.lightning_invoice || ""} size={128} />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">
                      Scan with a Lightning wallet or copy the invoice
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={checkoutData.lightning_invoice || "Sample lightning invoice..."}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs overflow-ellipsis"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "bitcoin" && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg flex justify-center">
                    <QRCodeSVG value={checkoutData.bitcoin_address || ""} size={128} />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">
                      Scan with a Bitcoin wallet or copy the address
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={checkoutData.bitcoin_address || "Sample bitcoin address..."}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs overflow-ellipsis"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment amount reminder */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Please send exactly {formatCurrency(checkoutData.amount, checkoutData.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Payment will be detected automatically
                </p>
              </div>
            </div>
          </>
        )}
        
        {/* Footer */}
        <div className="p-4 bg-gray-900/50 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="text-purple-400">Bitcoin Payment Gateway</span>
          </p>
        </div>
      </div>
    </div>
  );
} 