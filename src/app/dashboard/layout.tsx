"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// Navigation items configuration
const mainNavItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Products", path: "/dashboard/products", icon: "📦" },
  { name: "Customers", path: "/dashboard/customers", icon: "👥" },
  { name: "Subscriptions", path: "/dashboard/subscriptions", icon: "🔄" },
  { name: "Checkouts", path: "/dashboard/checkouts", icon: "🛒" },
  { name: "Payment Links", path: "/dashboard/payment-links", icon: "🔗" }
];

const developerNavItems = [
  { name: "API Keys", path: "/dashboard/api-keys", icon: "🔑" },
  { name: "Webhooks", path: "/dashboard/webhooks", icon: "🪝" },
  { name: "Logs", path: "/dashboard/logs", icon: "📝" }
];

// Account interface
interface Account {
  id: string;
  name: string;
  logo?: string;
  // other fields...
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Check if user is authenticated and load accounts
  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");
    
    if (!sessionId) {
      router.push("/login");
      return;
    }

    // Fetch accounts directly
    const fetchAccounts = async (sessionId: string) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
        const accountsResponse = await fetch(`${apiUrl}/account`, {
          headers: {
            "Session-ID": sessionId
          }
        });
        
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          if (accountsData.data && accountsData.data.length > 0) {
            setAccounts(accountsData.data);
            localStorage.setItem("accounts", JSON.stringify(accountsData.data));
            
            // Set selected account
            const selectedAccountId = localStorage.getItem("selected_account_id");
            if (selectedAccountId) {
              const account = accountsData.data.find((a: Account) => a.id === selectedAccountId);
              if (account) {
                setSelectedAccount(account);
              } else {
                setSelectedAccount(accountsData.data[0]);
                localStorage.setItem("selected_account_id", accountsData.data[0].id);
              }
            } else {
              setSelectedAccount(accountsData.data[0]);
              localStorage.setItem("selected_account_id", accountsData.data[0].id);
            }
          }
        } else {
          console.error("Failed to fetch accounts:", accountsResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
      }
    };

    fetchAccounts(sessionId);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("session_id");
    localStorage.removeItem("selected_account_id");
    localStorage.removeItem("accounts");
    router.push("/login");
  };

  const switchAccount = (account: Account) => {
    setSelectedAccount(account);
    localStorage.setItem("selected_account_id", account.id);
    setAccountMenuOpen(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-amber-400 text-transparent bg-clip-text">
              Bitvora
            </span>
            <span className="ml-1 text-lg font-light">Commerce</span>
          </Link>
        </div>
        
        {/* Account Selector */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <button 
              onClick={() => setAccountMenuOpen(prev => !prev)}
              className="w-full flex items-center justify-between text-gray-200 hover:bg-gray-700/40 p-2 rounded-md"
            >
              <div className="flex items-center truncate">
                {selectedAccount?.logo ? (
                  <img 
                    src={selectedAccount.logo} 
                    alt={selectedAccount.name}
                    className="w-5 h-5 mr-2 rounded"
                  />
                ) : (
                  <div className="w-5 h-5 mr-2 bg-purple-600 rounded flex items-center justify-center text-xs text-white">
                    {selectedAccount?.name.charAt(0) || 'A'}
                  </div>
                )}
                <span className="truncate text-sm">{selectedAccount?.name || 'Select Account'}</span>
              </div>
              <span>▼</span>
            </button>
            
            {accountMenuOpen && accounts.length > 0 && (
              <div className="absolute left-0 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                {accounts.map(account => (
                  <button 
                    key={account.id}
                    onClick={() => switchAccount(account)}
                    className={`w-full flex items-center text-left p-2 text-sm ${
                      selectedAccount?.id === account.id ? 'bg-purple-600/20 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {account.logo ? (
                      <img 
                        src={account.logo} 
                        alt={account.name}
                        className="w-5 h-5 mr-2 rounded"
                      />
                    ) : (
                      <div className="w-5 h-5 mr-2 bg-purple-600 rounded flex items-center justify-center text-xs text-white">
                        {account.name.charAt(0)}
                      </div>
                    )}
                    <span className="truncate">{account.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-4">
          <div className="px-4 mb-2 text-gray-400 text-xs uppercase font-semibold">
            Main
          </div>
          <ul>
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-4 py-2 text-sm ${
                    pathname === item.path
                      ? "bg-purple-600/20 border-l-2 border-purple-500 text-white"
                      : "text-gray-300 hover:bg-gray-700/40"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 mt-6 mb-2 text-gray-400 text-xs uppercase font-semibold">
            Developer
          </div>
          <ul>
            {developerNavItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-4 py-2 text-sm ${
                    pathname === item.path
                      ? "bg-purple-600/20 border-l-2 border-purple-500 text-white"
                      : "text-gray-300 hover:bg-gray-700/40"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-64 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2 text-sm font-medium text-gray-200 truncate max-w-[120px]">
                {userName}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
              title="Logout"
            >
              <span role="img" aria-label="Logout">🚪</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-gray-800/40 border-b border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {mainNavItems.find(item => item.path === pathname)?.name || 
             developerNavItems.find(item => item.path === pathname)?.name || 
             "Dashboard"}
          </h1>
          <div>
            {/* Account info indicator in top bar */}
            {selectedAccount && (
              <div className="flex items-center text-sm text-gray-300">
                <span>Current Account: </span>
                <span className="ml-2 font-medium text-white">{selectedAccount.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 