"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const PaymentLinkRedirect = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToCheckout = async () => {
      const paymentLinkId = params.id;
      if (!paymentLinkId) {
        setError("Invalid payment link ID");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
        const response = await fetch(`${apiUrl}/l/${paymentLinkId}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.data && data.data.id) {
          // Redirect to the checkout page with the generated checkout ID
          router.push(`/c/${data.data.id}`);
        } else {
          throw new Error("No valid checkout was created from the payment link");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while processing the payment link");
        console.error("Error processing payment link:", err);
        setLoading(false);
      }
    };

    redirectToCheckout();
  }, [params.id, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">Payment Link Error</h1>
          <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-md flex items-start mb-4">
            <span>{error}</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Processing Payment Link</h1>
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        <p className="text-gray-300">Please wait while we redirect you to the checkout page...</p>
      </div>
    </div>
  );
};

export default PaymentLinkRedirect; 