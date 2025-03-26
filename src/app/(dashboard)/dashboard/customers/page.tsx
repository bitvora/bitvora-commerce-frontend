"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  account_id: string;
  name?: string;
  email?: string;
  description?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  phone_number?: string;
  currency?: string;
}

interface CustomerFormData {
  account_id: string;
  name?: string;
  email?: string;
  description?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  phone_number?: string;
  currency: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    account_id: "",
    name: "",
    email: "",
    description: "",
    billing_address_line1: "",
    billing_address_line2: "",
    billing_city: "",
    billing_state: "",
    billing_postal_code: "",
    billing_country: "",
    shipping_address_line1: "",
    shipping_address_line2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "",
    phone_number: "",
    currency: "USD",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
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
        ? `${apiUrl}/customer/account/${selectedAccountId}`
        : `${apiUrl}/customer`;
      
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
        console.log("Customers fetched:", data);
        setCustomers(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching customers');
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const selectedAccountId = localStorage.getItem("selected_account_id") || "";
    setFormData({
      account_id: selectedAccountId,
      name: "",
      email: "",
      description: "",
      billing_address_line1: "",
      billing_address_line2: "",
      billing_city: "",
      billing_state: "",
      billing_postal_code: "",
      billing_country: "",
      shipping_address_line1: "",
      shipping_address_line2: "",
      shipping_city: "",
      shipping_state: "",
      shipping_postal_code: "",
      shipping_country: "",
      phone_number: "",
      currency: "USD",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({
      account_id: customer.account_id,
      name: customer.name,
      email: customer.email,
      description: customer.description,
      billing_address_line1: customer.billing_address_line1,
      billing_address_line2: customer.billing_address_line2,
      billing_city: customer.billing_city,
      billing_state: customer.billing_state,
      billing_postal_code: customer.billing_postal_code,
      billing_country: customer.billing_country,
      shipping_address_line1: customer.shipping_address_line1,
      shipping_address_line2: customer.shipping_address_line2,
      shipping_city: customer.shipping_city,
      shipping_state: customer.shipping_state,
      shipping_postal_code: customer.shipping_postal_code,
      shipping_country: customer.shipping_country,
      phone_number: customer.phone_number,
      currency: customer.currency || "USD",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Remove required validation for name and email
    // if (!formData.name?.trim()) {
    //   errors.name = "Customer name is required";
    // }
    
    // if (!formData.email?.trim()) {
    //   errors.email = "Email is required";
    // }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      
      const customerData = {
        ...formData,
        account_id: formData.account_id || localStorage.getItem("selected_account_id"),
      };
      
      const isUpdating = !!currentCustomer;
      const url = isUpdating 
        ? `${apiUrl}/customer/${currentCustomer.id}`
        : `${apiUrl}/customer`;
      
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(customerData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage(isUpdating ? "Customer updated successfully!" : "Customer created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchCustomers();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the customer');
      console.error("Error saving customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/customer/${id}`, {
        method: 'DELETE',
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("Customer deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the customer');
      console.error("Error deleting customer:", err);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (customerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
      const response = await fetch(`${apiUrl}/customer/${customerId}`, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setViewCustomer(data.data);
      setIsViewModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching customer details');
      console.error("Error fetching customer details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          New Customer
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

      {/* Customers table */}
      {!loading && customers.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-300">No customers found</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Customer
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white cursor-pointer" onClick={() => openViewModal(customer.id)}>
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{customer.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(customer)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-400 hover:text-red-300 ml-3"
                      >
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
                {currentCustomer ? "Edit Customer" : "Create New Customer"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
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
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Billing Address Section */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-white mb-3">Billing Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="billing_address_line1" className="block text-sm font-medium text-gray-300 mb-1">
                      Billing Address Line 1
                    </label>
                    <input
                      type="text"
                      id="billing_address_line1"
                      name="billing_address_line1"
                      value={formData.billing_address_line1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="billing_address_line2" className="block text-sm font-medium text-gray-300 mb-1">
                      Billing Address Line 2
                    </label>
                    <input
                      type="text"
                      id="billing_address_line2"
                      name="billing_address_line2"
                      value={formData.billing_address_line2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billing_city" className="block text-sm font-medium text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="billing_city"
                        name="billing_city"
                        value={formData.billing_city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="billing_state" className="block text-sm font-medium text-gray-300 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="billing_state"
                        name="billing_state"
                        value={formData.billing_state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billing_postal_code" className="block text-sm font-medium text-gray-300 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="billing_postal_code"
                        name="billing_postal_code"
                        value={formData.billing_postal_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="billing_country" className="block text-sm font-medium text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="billing_country"
                        name="billing_country"
                        value={formData.billing_country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address Section */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-white mb-3">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="shipping_address_line1" className="block text-sm font-medium text-gray-300 mb-1">
                      Shipping Address Line 1
                    </label>
                    <input
                      type="text"
                      id="shipping_address_line1"
                      name="shipping_address_line1"
                      value={formData.shipping_address_line1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_address_line2" className="block text-sm font-medium text-gray-300 mb-1">
                      Shipping Address Line 2
                    </label>
                    <input
                      type="text"
                      id="shipping_address_line2"
                      name="shipping_address_line2"
                      value={formData.shipping_address_line2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="shipping_city"
                        name="shipping_city"
                        value={formData.shipping_city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-300 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="shipping_state"
                        name="shipping_state"
                        value={formData.shipping_state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shipping_postal_code" className="block text-sm font-medium text-gray-300 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="shipping_postal_code"
                        name="shipping_postal_code"
                        value={formData.shipping_postal_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="shipping_country"
                        name="shipping_country"
                        value={formData.shipping_country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
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
                  {currentCustomer ? "Update Customer" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {viewCustomer && isViewModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Customer Details</h2>
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
                    <p><span className="text-gray-400">Name:</span> {viewCustomer.name || 'N/A'}</p>
                    <p><span className="text-gray-400">Email:</span> {viewCustomer.email || 'N/A'}</p>
                    <p><span className="text-gray-400">Phone:</span> {viewCustomer.phone_number || 'N/A'}</p>
                    <p><span className="text-gray-400">Currency:</span> {viewCustomer.currency || 'N/A'}</p>
                    <p><span className="text-gray-400">Description:</span> {viewCustomer.description || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Billing Address</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Address:</span> {viewCustomer.billing_address_line1 || 'N/A'}</p>
                    {viewCustomer.billing_address_line2 && (
                      <p><span className="text-gray-400">Address Line 2:</span> {viewCustomer.billing_address_line2}</p>
                    )}
                    <p><span className="text-gray-400">City:</span> {viewCustomer.billing_city || 'N/A'}</p>
                    <p><span className="text-gray-400">State:</span> {viewCustomer.billing_state || 'N/A'}</p>
                    <p><span className="text-gray-400">Postal Code:</span> {viewCustomer.billing_postal_code || 'N/A'}</p>
                    <p><span className="text-gray-400">Country:</span> {viewCustomer.billing_country || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-3">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Address:</span> {viewCustomer.shipping_address_line1 || 'N/A'}</p>
                    {viewCustomer.shipping_address_line2 && (
                      <p><span className="text-gray-400">Address Line 2:</span> {viewCustomer.shipping_address_line2}</p>
                    )}
                    <p><span className="text-gray-400">City:</span> {viewCustomer.shipping_city || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">State:</span> {viewCustomer.shipping_state || 'N/A'}</p>
                    <p><span className="text-gray-400">Postal Code:</span> {viewCustomer.shipping_postal_code || 'N/A'}</p>
                    <p><span className="text-gray-400">Country:</span> {viewCustomer.shipping_country || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(viewCustomer);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Edit Customer
              </button>
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