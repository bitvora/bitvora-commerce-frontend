"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faExternalLinkAlt, faCopy } from '@fortawesome/free-solid-svg-icons';

interface PaymentLink {
  id: string;
  user_id: string;
  account_id: string;
  amount: number;
  expiry_minutes: number;
  created_at: string;
  updated_at: string;
}

interface PaymentLinkFormData {
  account_id: string;
  amount: number;
  expiry_minutes: number;
}

export default function PaymentLinksPage() {
  const router = useRouter();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPaymentLink, setCurrentPaymentLink] = useState<PaymentLink | null>(null);
  const [formData, setFormData] = useState<PaymentLinkFormData>({
    account_id: "",
    amount: 0,
    expiry_minutes: 1440, // Default to 24 hours
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch payment links on component mount
  useEffect(() => {
    fetchPaymentLinks();
  }, []);

  const fetchPaymentLinks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      const selectedAccountId = localStorage.getItem("selected_account_id");
      
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      const endpoint = selectedAccountId 
        ? `${apiUrl}/payment-link/account/${selectedAccountId}`
        : `${apiUrl}/payment-link`;
      
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
        setPaymentLinks(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching payment links');
      console.error("Error fetching payment links:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const selectedAccountId = localStorage.getItem("selected_account_id") || "";
    setFormData({
      account_id: selectedAccountId,
      amount: 0,
      expiry_minutes: 1440,
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (paymentLink: PaymentLink) => {
    setCurrentPaymentLink(paymentLink);
    setFormData({
      account_id: paymentLink.account_id,
      amount: paymentLink.amount,
      expiry_minutes: paymentLink.expiry_minutes,
    });
    setIsUpdateModalOpen(true);
  };

  const openViewModal = (paymentLink: PaymentLink) => {
    setCurrentPaymentLink(paymentLink);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (paymentLink: PaymentLink) => {
    setCurrentPaymentLink(paymentLink);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentPaymentLink(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    
    if (!formData.expiry_minutes || formData.expiry_minutes <= 0) {
      errors.expiry_minutes = "Expiry time must be greater than 0 minutes";
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      
      const paymentLinkData = {
        ...formData,
        account_id: formData.account_id || localStorage.getItem("selected_account_id"),
      };
      
      const response = await fetch(`${apiUrl}/payment-link`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(paymentLinkData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccessMessage("Payment link created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchPaymentLinks();
      closeModals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the payment link');
      console.error("Error creating payment link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentPaymentLink) {
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      
      const paymentLinkData = {
        ...formData
      };
      
      const response = await fetch(`${apiUrl}/payment-link/${currentPaymentLink.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(paymentLinkData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("Payment link updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchPaymentLinks();
      closeModals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the payment link');
      console.error("Error updating payment link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPaymentLink) {
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      
      const response = await fetch(`${apiUrl}/payment-link/${currentPaymentLink.id}`, {
        method: 'DELETE',
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("Payment link deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchPaymentLinks();
      closeModals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the payment link');
      console.error("Error deleting payment link:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100); // Assuming amount is in cents
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("Copied to clipboard!");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const getPaymentLinkUrl = (id: string) => {
    return `${window.location.origin}/l/${id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Payment Links</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          New Payment Link
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

      {/* Payment Links table */}
      {!loading && paymentLinks.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-300">No payment links found</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Payment Link
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
                    Expiry (min)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {paymentLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {formatCurrency(link.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{link.expiry_minutes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(link.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(link.updated_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewModal(link)}
                        className="text-purple-400 hover:text-purple-300 mr-3"
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => openUpdateModal(link)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(link)}
                        className="text-red-400 hover:text-red-300 mr-3"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <Link
                        href={getPaymentLinkUrl(link.id)}
                        target="_blank"
                        className="text-green-400 hover:text-green-300"
                        title="Open Payment Link"
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

      {/* Create Payment Link Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Create New Payment Link</h2>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (in cents)*
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formErrors.amount && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="expiry_minutes" className="block text-sm font-medium text-gray-300 mb-1">
                  Expiry Time (minutes)*
                </label>
                <input
                  type="number"
                  id="expiry_minutes"
                  name="expiry_minutes"
                  value={formData.expiry_minutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formErrors.expiry_minutes && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.expiry_minutes}</p>
                )}
              </div>
              
              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Create Payment Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Payment Link Modal */}
      {isUpdateModalOpen && currentPaymentLink && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Update Payment Link</h2>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (in cents)*
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formErrors.amount && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="expiry_minutes" className="block text-sm font-medium text-gray-300 mb-1">
                  Expiry Time (minutes)*
                </label>
                <input
                  type="number"
                  id="expiry_minutes"
                  name="expiry_minutes"
                  value={formData.expiry_minutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formErrors.expiry_minutes && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.expiry_minutes}</p>
                )}
              </div>
              
              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Update Payment Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Payment Link Modal */}
      {isViewModalOpen && currentPaymentLink && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Payment Link Details</h2>
              <button 
                onClick={closeModals} 
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">ID:</p>
                  <p className="text-white font-mono text-sm break-all">{currentPaymentLink.id}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Amount:</p>
                  <p className="text-white">{formatCurrency(currentPaymentLink.amount)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Expiry Time:</p>
                  <p className="text-white">{currentPaymentLink.expiry_minutes} minutes</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Created:</p>
                  <p className="text-white">{formatDate(currentPaymentLink.created_at)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Updated:</p>
                  <p className="text-white">{formatDate(currentPaymentLink.updated_at)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Payment Link URL:</p>
                  <div className="p-3 bg-gray-700 rounded-md break-all mt-1">
                    <p className="text-sm text-white font-mono">{getPaymentLinkUrl(currentPaymentLink.id)}</p>
                  </div>
                  <div className="flex mt-2">
                    <button 
                      onClick={() => copyToClipboard(getPaymentLinkUrl(currentPaymentLink.id))}
                      className="flex items-center px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors mr-2"
                    >
                      <FontAwesomeIcon icon={faCopy} className="mr-2" /> Copy Link
                    </button>
                    <Link
                      href={getPaymentLinkUrl(currentPaymentLink.id)}
                      target="_blank"
                      className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" /> Open Link
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentPaymentLink && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Delete Payment Link</h2>
            </div>
            
            <div className="p-6">
              <p className="text-white">Are you sure you want to delete this payment link? This action cannot be undone.</p>
              
              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <p className="text-sm text-white">Amount: {formatCurrency(currentPaymentLink.amount)}</p>
                <p className="text-sm text-white">Created: {formatDate(currentPaymentLink.created_at)}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 