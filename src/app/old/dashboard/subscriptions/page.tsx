'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subscription {
  id: string;
  user_id: string;
  account_id: string;
  customer_id: string;
  product_id: string;
  billing_start_date: string;
  active_on_date: string;
  metadata: {
    notes?: string;
    additional_info?: string;
  };
  nostr_relay: string;
  nostr_pubkey: string;
  nostr_secret: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionFormData {
  account_id: string;
  customer_id: string;
  product_id: string;
  billing_start_date: string;
  active_on_date: string;
  metadata: {
    notes?: string;
    additional_info?: string;
  };
  nostr_relay: string;
  nostr_pubkey: string;
  nostr_secret: string;
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    account_id: '',
    customer_id: '',
    product_id: '',
    billing_start_date: '',
    active_on_date: '',
    metadata: {
      notes: '',
      additional_info: ''
    },
    nostr_relay: '',
    nostr_pubkey: '',
    nostr_secret: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch customers and products when modal opens
  // useEffect(() => {
  //   if (isModalOpen) {
  //     fetchCustomers();
  //     fetchProducts();
  //   }
  // }, [isModalOpen]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('session_id');
      const selectedAccountId = localStorage.getItem('selected_account_id');

      if (!sessionId) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
      const endpoint = `${apiUrl}/subscription/account/${selectedAccountId}`;

      const response = await fetch(endpoint, {
        headers: {
          'Session-ID': sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching subscriptions'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const sessionId = localStorage.getItem('session_id');
      const selectedAccountId = localStorage.getItem('selected_account_id');

      if (!sessionId) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
      const endpoint = `${apiUrl}/customer/account/${selectedAccountId}`;

      const response = await fetch(endpoint, {
        headers: {
          'Session-ID': sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const sessionId = localStorage.getItem('session_id');
      const selectedAccountId = localStorage.getItem('selected_account_id');

      if (!sessionId) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
      const endpoint = `${apiUrl}/product/account/${selectedAccountId}`;

      const response = await fetch(endpoint, {
        headers: {
          'Session-ID': sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      ...formData,
      customer_id: customer.id
    });
    setIsCustomerDropdownOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      ...formData,
      product_id: product.id
    });
    setIsProductDropdownOpen(false);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product?.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      account_id: '',
      customer_id: '',
      product_id: '',
      billing_start_date: '',
      active_on_date: '',
      metadata: {
        notes: '',
        additional_info: ''
      },
      nostr_relay: '',
      nostr_pubkey: '',
      nostr_secret: ''
    });
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setCustomerSearchTerm('');
    setProductSearchTerm('');
  };

  const openCreateModal = () => {
    resetForm();
    setCurrentSubscription(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subscription: Subscription) => {
    setCurrentSubscription(subscription);

    // Find the selected customer and product
    const customer = customers.find((c) => c.id === subscription.customer_id) || null;
    const product = products.find((p) => p.id === subscription.product_id) || null;

    setSelectedCustomer(customer);
    setSelectedProduct(product);

    setFormData({
      account_id: subscription.account_id,
      customer_id: subscription.customer_id,
      product_id: subscription.product_id,
      billing_start_date: subscription.billing_start_date,
      active_on_date: subscription.active_on_date,
      metadata: subscription.metadata,
      nostr_relay: subscription.nostr_relay,
      nostr_pubkey: subscription.nostr_pubkey,
      nostr_secret: subscription.nostr_secret
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    // Add validation logic as needed
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';

      const subscriptionData = {
        ...formData,
        account_id: localStorage.getItem('selected_account_id'),
        billing_start_date: formData.billing_start_date
          ? new Date(formData.billing_start_date).toISOString()
          : new Date().toISOString(), // Default to now if not provided
        active_on_date: formData.active_on_date
          ? new Date(formData.active_on_date).toISOString()
          : new Date().toISOString() // Default to now if not provided
      };

      const isUpdating = !!currentSubscription;
      const url = isUpdating
        ? `${apiUrl}/subscription/${currentSubscription.id}`
        : `${apiUrl}/subscription`;

      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId
        },
        body: JSON.stringify(subscriptionData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage(
        isUpdating ? 'Subscription updated successfully!' : 'Subscription created successfully!'
      );
      setTimeout(() => setSuccessMessage(null), 3000);

      await fetchSubscriptions();
      closeModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while saving the subscription'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
      const response = await fetch(`${apiUrl}/subscription/${id}`, {
        method: 'DELETE',
        headers: {
          'Session-ID': sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage('Subscription deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);

      await fetchSubscriptions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while deleting the subscription'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center">
          New Subscription
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

      {/* Subscriptions table */}
      {!loading && subscriptions.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-300">No subscriptions found</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Create Subscription
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Active On
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {subscription.customer_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{subscription.product_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{subscription.active_on_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(subscription)}
                        className="text-indigo-400 hover:text-indigo-300">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="text-red-400 hover:text-red-300 ml-3">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">
                {currentSubscription ? 'Edit Subscription' : 'Create New Subscription'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label
                    htmlFor="customer_id"
                    className="block text-sm font-medium text-gray-300 mb-1">
                    Customer
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="customer_search"
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      onFocus={() => setIsCustomerDropdownOpen(true)}
                      placeholder={
                        selectedCustomer
                          ? selectedCustomer.name || selectedCustomer.email || selectedCustomer.id
                          : 'Search customers...'
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  {isCustomerDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleSelectCustomer(customer)}
                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                            <div className="font-medium">{customer.name || 'Unnamed Customer'}</div>
                            <div className="text-sm text-gray-400">
                              {customer.email || customer.id}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400">No customers found</div>
                      )}
                    </div>
                  )}
                  <input type="hidden" name="customer_id" value={formData.customer_id} />
                </div>

                <div className="relative">
                  <label
                    htmlFor="product_id"
                    className="block text-sm font-medium text-gray-300 mb-1">
                    Product
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="product_search"
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      onFocus={() => setIsProductDropdownOpen(true)}
                      placeholder={selectedProduct ? selectedproduct?.name : 'Search products...'}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  {isProductDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                            <div className="font-medium">{product?.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-400">{product.description}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400">No products found</div>
                      )}
                    </div>
                  )}
                  <input type="hidden" name="product_id" value={formData.product_id} />
                </div>
              </div>

              <div>
                <label
                  htmlFor="billing_start_date"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Billing Start Date
                </label>
                <input
                  type="date"
                  id="billing_start_date"
                  name="billing_start_date"
                  value={formData.billing_start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="active_on_date"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Active On Date
                </label>
                <input
                  type="date"
                  id="active_on_date"
                  name="active_on_date"
                  value={formData.active_on_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="nostr_relay"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Nostr Relay
                </label>
                <input
                  type="text"
                  id="nostr_relay"
                  name="nostr_relay"
                  value={formData.nostr_relay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="nostr_pubkey"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Nostr Public Key
                </label>
                <input
                  type="text"
                  id="nostr_pubkey"
                  name="nostr_pubkey"
                  value={formData.nostr_pubkey}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="nostr_secret"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Nostr Secret
                </label>
                <input
                  type="text"
                  id="nostr_secret"
                  name="nostr_secret"
                  value={formData.nostr_secret}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  {currentSubscription ? 'Update Subscription' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
