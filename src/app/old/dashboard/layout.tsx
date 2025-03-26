'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Navigation items configuration
const mainNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Products', path: '/dashboard/products', icon: '📦' },
  { name: 'Customers', path: '/dashboard/customers', icon: '👥' },
  { name: 'Subscriptions', path: '/dashboard/subscriptions', icon: '🔄' },
  { name: 'Checkouts', path: '/dashboard/checkouts', icon: '🛒' },
  { name: 'Payment Links', path: '/dashboard/payment-links', icon: '🔗' },
  { name: 'Wallet', path: '/dashboard/wallet', icon: '👛' }
];

const developerNavItems = [
  { name: 'API Keys', path: '/dashboard/api-keys', icon: '🔑' },
  { name: 'Webhooks', path: '/dashboard/webhooks', icon: '🪝' },
  { name: 'Logs', path: '/dashboard/logs', icon: '📝' }
];

// Account interface
interface Account {
  id: string;
  name: string;
  logo?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  // other fields...
}

// Form data interface for account creation
interface AccountFormData {
  name: string;
  logo?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    logo: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [formError, setFormError] = useState('');

  // Check if user is authenticated and load accounts
  // useEffect(() => {
  //   const sessionId = localStorage.getItem("session_id");

  //   if (!sessionId) {
  //     router.push("/login");
  //     return;
  //   }

  //   // Fetch accounts directly
  //   const fetchAccounts = async (sessionId: string) => {
  //     try {
  //       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
  //       const accountsResponse = await fetch(`${apiUrl}/account`, {
  //         headers: {
  //           "Session-ID": sessionId
  //         }
  //       });

  //       if (accountsResponse.ok) {
  //         const accountsData = await accountsResponse.json();
  //         if (accountsData.data && accountsData.data.length > 0) {
  //           setAccounts(accountsData.data);
  //           localStorage.setItem("accounts", JSON.stringify(accountsData.data));

  //           // Set selected account
  //           const selectedAccountId = localStorage.getItem("selected_account_id");
  //           if (selectedAccountId) {
  //             const account = accountsData.data.find((a: Account) => a.id === selectedAccountId);
  //             if (account) {
  //               setSelectedAccount(account);
  //             } else {
  //               setSelectedAccount(accountsData.data[0]);
  //               localStorage.setItem("selected_account_id", accountsData.data[0].id);
  //             }
  //           } else {
  //             setSelectedAccount(accountsData.data[0]);
  //             localStorage.setItem("selected_account_id", accountsData.data[0].id);
  //           }
  //         } else {
  //           // No accounts found, show the account setup modal
  //           setShowAccountSetupModal(true);
  //         }
  //       } else {
  //         console.error("Failed to fetch accounts:", accountsResponse.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching accounts:", error);
  //     } finally {
  //       setLoading(false); // Ensure loading is set to false after fetching
  //     }
  //   };

  //   fetchAccounts(sessionId);
  // }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('selected_account_id');
    localStorage.removeItem('accounts');
    router.push('/login');
  };

  const switchAccount = (account: Account) => {
    setSelectedAccount(account);
    localStorage.setItem('selected_account_id', account.id);
    setAccountMenuOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Account name is required');
      return;
    }

    setCreatingAccount(true);
    setFormError('');

    // Prepare the data, only including fields with values
    const submitData: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) {
        submitData[key] = value.trim();
      }
    });

    try {
      const sessionId = localStorage.getItem('session_id');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';

      const response = await fetch(`${apiUrl}/account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId || ''
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();

        // Add the new account to the accounts list
        const newAccount = result.data;
        const updatedAccounts = [...accounts, newAccount];

        setAccounts(updatedAccounts);
        setSelectedAccount(newAccount);
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        localStorage.setItem('selected_account_id', newAccount.id);

        // Close the modal
        setShowAccountSetupModal(false);
      } else {
        const errorData = await response.json();
        setFormError(errorData.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setFormError('An error occurred while creating your account');
    } finally {
      setCreatingAccount(false);
    }
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
      {/* Account Setup Modal */}
      {showAccountSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-6">Set Up Your Account</h2>
            <form onSubmit={handleAccountSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Your business or organization name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL</label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Apt, Suite, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {formError && <div className="text-red-500 text-sm py-2">{formError}</div>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creatingAccount}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-amber-400 hover:from-purple-600 hover:to-amber-500 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
                    {creatingAccount ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>

                <div className="text-xs text-gray-400 text-center pt-2">
                  Only account name is required. All other fields are optional.
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-gray-200 hover:bg-gray-700/40 p-2 rounded-md">
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
                <span className="truncate text-sm">
                  {selectedAccount?.name || 'Select Account'}
                </span>
              </div>
              <span>▼</span>
            </button>

            {accountMenuOpen && accounts.length > 0 && (
              <div className="absolute left-0 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => switchAccount(account)}
                    className={`w-full flex items-center text-left p-2 text-sm ${
                      selectedAccount?.id === account.id
                        ? 'bg-purple-600/20 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}>
                    {account.logo ? (
                      <img src={account.logo} alt={account.name} className="w-5 h-5 mr-2 rounded" />
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
          <div className="px-4 mb-2 text-gray-400 text-xs uppercase font-semibold">Main</div>
          <ul>
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-2 text-sm ${
                    pathname === item.path
                      ? 'bg-purple-600/20 border-l-2 border-purple-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700/40'
                  }`}>
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
                      ? 'bg-purple-600/20 border-l-2 border-purple-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700/40'
                  }`}>
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
              title="Logout">
              <span role="img" aria-label="Logout">
                🚪
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-gray-800/40 border-b border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {mainNavItems.find((item) => item.path === pathname)?.name ||
              developerNavItems.find((item) => item.path === pathname)?.name ||
              'Dashboard'}
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
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
