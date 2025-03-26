"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface WalletConnection {
  id: string;
  user_id: string;
  account_id: string;
  nostr_pubkey: string;
  nostr_secret: string;
  nostr_relay: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([]);
  const [activeWallet, setActiveWallet] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletConnectUrl, setWalletConnectUrl] = useState("");
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchWalletConnections();
  // }, []);

  const fetchWalletConnections = async () => {
    try {
      setLoading(true);
      
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }
      
      const accountId = localStorage.getItem("selected_account_id");
      if (!accountId) {
        setError("No account selected");
        setLoading(false);
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/wallet/account/${accountId}`, {
        headers: {
          "Session-ID": sessionId
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setWalletConnections(data.data);
        const active = data.data.find((wallet: WalletConnection) => wallet.active);
        if (active) {
          setActiveWallet(active);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wallet connections");
      console.error("Error fetching wallet connections:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnectUrl.trim()) {
      setConnectError("Wallet connect URL is required");
      return;
    }
    
    try {
      setConnectingWallet(true);
      setConnectError(null);
      
      const sessionId = localStorage.getItem("session_id");
      const accountId = localStorage.getItem("selected_account_id");
      
      if (!sessionId || !accountId) {
        throw new Error("Authentication required");
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify({
          account_id: accountId,
          wallet_connect: walletConnectUrl
        })
      });
      
      const data = await response.json();
      
      if (response.status === 201) {
        setConnectSuccess(true);
        setWalletConnectUrl("");
        // Add new wallet to the list and set as active
        if (data.data) {
          setActiveWallet(data.data);
          setWalletConnections(prev => [data.data, ...prev]);
        }
        // Reset success message after 3 seconds
        setTimeout(() => setConnectSuccess(false), 3000);
      } else {
        throw new Error(data.message || "Failed to connect wallet");
      }
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Failed to connect wallet");
      console.error("Error connecting wallet:", err);
    } finally {
      setConnectingWallet(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Wallet Connection</h2>
        </div>
        
        <div className="p-6">
          {activeWallet ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Public Key</label>
                  <div className="bg-gray-700 px-4 py-2 rounded-md font-mono text-sm break-all">
                    {activeWallet.nostr_pubkey}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Secret Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={activeWallet.nostr_secret} 
                      readOnly
                      className="w-full bg-gray-700 px-4 py-2 rounded-md font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Relay</label>
                <div className="bg-gray-700 px-4 py-2 rounded-md font-mono text-sm">
                  {activeWallet.nostr_relay}
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span>Connected {formatDate(activeWallet.created_at)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                <span className="text-2xl">👛</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Active Wallet Connection</h3>
              <p className="text-gray-400 mb-4">Connect a wallet to manage your bitcoin payments</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Connect New Wallet</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleConnectWallet}>
            <div className="space-y-4">
              <div>
                <label htmlFor="walletConnectUrl" className="block text-sm font-medium text-gray-400 mb-1">
                  Wallet Connect URL
                </label>
                <input
                  id="walletConnectUrl"
                  type="text"
                  value={walletConnectUrl}
                  onChange={(e) => setWalletConnectUrl(e.target.value)}
                  placeholder="nostr+walletconnect://..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the wallet connect URL from your compatible wallet application
                </p>
              </div>
              
              {connectError && (
                <div className="text-red-500 text-sm py-2">
                  {connectError}
                </div>
              )}
              
              {connectSuccess && (
                <div className="text-green-500 text-sm py-2">
                  Wallet connected successfully!
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={connectingWallet}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {connectingWallet ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {walletConnections.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Connection History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Public Key
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Relay
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Connected At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {walletConnections.map((wallet) => (
                  <tr key={wallet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300 truncate max-w-xs">
                      {wallet.nostr_pubkey}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {wallet.nostr_relay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        wallet.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {wallet.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(wallet.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 