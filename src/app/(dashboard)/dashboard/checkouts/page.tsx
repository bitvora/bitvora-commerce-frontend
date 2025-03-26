"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface Checkout {
  id: string;
  account_id: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
  customer_id?: string;
  state: string;
  created_at: string;
  expires_at?: string;
  redirect_url?: string;
}

interface CheckoutFormData {
  account_id: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
  customer_id?: string;
  redirect_url?: string;
  expiry_minutes?: number;
}

export default function CheckoutsPage() {
  const router = useRouter();
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewCheckout, setViewCheckout] = useState<Checkout | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    account_id: "",
    amount: 0,
    currency: "USD",
    description: "",
    customer_id: "",
    redirect_url: "",
    expiry_minutes: 60,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch checkouts on component mount
  // useEffect(() => {
  //   fetchCheckouts();
  //   fetchCustomers();
  // }, []);

  const fetchCheckouts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      const selectedAccountId = localStorage.getItem("selected_account_id");
      
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const endpoint = selectedAccountId 
        ? `${apiUrl}/checkout/account/${selectedAccountId}`
        : `${apiUrl}/checkout`;
      
      const response = await fetch(endpoint, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("session_id");
        router.push("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Checkouts fetched:", data);
        setCheckouts(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching checkouts');
      console.error("Error fetching checkouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const sessionId = localStorage.getItem("session_id");
      const selectedAccountId = localStorage.getItem("selected_account_id");
      
      if (!sessionId || !selectedAccountId) {
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/customer/account/${selectedAccountId}`, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const resetForm = () => {
    const selectedAccountId = localStorage.getItem("selected_account_id") || "";
    setFormData({
      account_id: selectedAccountId,
      amount: 0,
      currency: "USD",
      description: "",
      customer_id: "",
      redirect_url: "",
      expiry_minutes: 60,
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    
    if (!formData.currency) {
      errors.currency = "Currency is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric inputs to numbers
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      
      const checkoutData = {
        ...formData,
        account_id: formData.account_id || localStorage.getItem("selected_account_id"),
      };
      
      const response = await fetch(`${apiUrl}/checkout`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccessMessage("Checkout created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchCheckouts();
      closeModal();

      // Redirect to the public checkout page if created successfully
      if (data.data && data.data.id) {
        router.push(`/c/${data.data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the checkout');
      console.error("Error creating checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (checkoutId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/checkout/${checkoutId}`, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setViewCheckout(data.data);
      setIsViewModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching checkout details');
      console.error("Error fetching checkout details:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getStatusColor = (state: string) => {
    if (!state) return 'bg-gray-500';
    
    switch (state.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-500';
      case 'pending':
      case 'pending_confirmation':
        return 'bg-yellow-500';
      case 'underpaid':
        return 'bg-orange-500';
      case 'overpaid':
        return 'bg-blue-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("Copied to clipboard!");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Checkouts</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          New Checkout
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded-md flex items-start">
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-md flex items-start">
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Checkouts table */}
      {!loading && checkouts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-300">No checkouts found</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Checkout
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Expires
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {checkouts.map((checkout) => (
                  <tr 
                    key={checkout.id} 
                    className="hover:bg-gray-700/50 cursor-pointer" 
                    onClick={() => openViewModal(checkout.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white cursor-pointer">
                        {formatCurrency(checkout.amount, checkout.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{checkout.description || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(checkout.state)} text-white`}>
                        {checkout.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(checkout.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{checkout.expires_at ? formatDate(checkout.expires_at) : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/c/${checkout.id}`}
                        target="_blank"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Create New Checkout</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                    Amount*
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formErrors.amount && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                    Currency*
                  </label>
                  <input
                    type="text"
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formErrors.currency && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.currency}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer_id" className="block text-sm font-medium text-gray-300 mb-1">
                    Customer
                  </label>
                  <select
                    id="customer_id"
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a customer (optional)</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="expiry_minutes" className="block text-sm font-medium text-gray-300 mb-1">
                    Expires in (minutes)
                  </label>
                  <input
                    type="number"
                    id="expiry_minutes"
                    name="expiry_minutes"
                    value={formData.expiry_minutes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="redirect_url" className="block text-sm font-medium text-gray-300 mb-1">
                  Redirect URL (after payment)
                </label>
                <input
                  type="text"
                  id="redirect_url"
                  name="redirect_url"
                  value={formData.redirect_url}
                  onChange={handleInputChange}
                  placeholder="https://yourdomain.com/success"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Create Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Checkout Modal */}
      {viewCheckout && isViewModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Checkout Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Amount:</span> {formatCurrency(viewCheckout.amount, viewCheckout.currency)}</p>
                    <p><span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(viewCheckout.state)} text-white`}>
                        {viewCheckout.state}
                      </span>
                    </p>
                    <p><span className="text-gray-400">Description:</span> {viewCheckout.description || 'N/A'}</p>
                    <p><span className="text-gray-400">Created:</span> {formatDate(viewCheckout.created_at)}</p>
                    <p><span className="text-gray-400">Expires:</span> {viewCheckout.expires_at ? formatDate(viewCheckout.expires_at) : 'N/A'}</p>
                    {viewCheckout.customer_id && <p><span className="text-gray-400">Customer ID:</span> {viewCheckout.customer_id}</p>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Checkout Link</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-700 rounded-md break-all">
                      <p className="text-sm text-white font-mono">{`${window.location.origin}/c/${viewCheckout.id}`}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(`${window.location.origin}/c/${viewCheckout.id}`)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Copy Link
                    </button>
                    <Link
                      href={`/c/${viewCheckout.id}`}
                      target="_blank"
                      className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors inline-block"
                    >
                      Go to Checkout Page
                    </Link>
                  </div>
                </div>
              </div>
              
              {viewCheckout.redirect_url && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Redirect URL</h3>
                  <div className="p-3 bg-gray-700 rounded-md break-all">
                    <p className="text-sm text-white font-mono">{viewCheckout.redirect_url}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 