"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  account_id: string;
  name: string;
  description: string;
  image?: string;
  is_recurring: boolean;
  amount: number;
  currency: string;
  billing_period_hours?: number;
  created_at?: string;
  updated_at?: string;
}

interface ProductFormData {
  account_id: string;
  name: string;
  description: string;
  image: string;
  is_recurring: boolean;
  amount: number;
  currency: string;
  billing_period_hours: number | null;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    account_id: "",
    name: "",
    description: "",
    image: "",
    is_recurring: false,
    amount: 0,
    currency: "USD",
    billing_period_hours: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Currency options
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CNY", "BTC", "ETH"];

  // Fetch products on component mount
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const fetchProducts = async () => {
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
        ? `${apiUrl}/product/account/${selectedAccountId}`
        : `${apiUrl}/product`;
      
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
        console.log("Products fetched:", data);
        
        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Unexpected data format:", data);
          setProducts([]);
        }
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const selectedAccountId = localStorage.getItem("selected_account_id") || "";
    setFormData({
      account_id: selectedAccountId,
      name: "",
      description: "",
      image: "",
      is_recurring: false,
      amount: 0,
      currency: "USD",
      billing_period_hours: null,
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      account_id: product.account_id,
      name: product.name,
      description: product.description,
      image: product.image || "",
      is_recurring: product.is_recurring,
      amount: product.amount,
      currency: product.currency,
      billing_period_hours: product.billing_period_hours || null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (formData.amount <= 0) {
      errors.amount = "Amount must be greater than zero";
    }
    
    if (formData.is_recurring && (!formData.billing_period_hours || formData.billing_period_hours <= 0)) {
      errors.billing_period_hours = "Billing period must be greater than zero";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === "" ? null : parseFloat(value)
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
      
      // Prepare the data
      const productData = {
        ...formData,
        account_id: formData.account_id || localStorage.getItem("selected_account_id"),
        // Convert amount to number if it's a string
        amount: typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount,
        // Only include billing_period_hours if it's a recurring product
        billing_period_hours: formData.is_recurring ? formData.billing_period_hours : null
      };
      
      // Determine if we're creating or updating
      const isUpdating = !!currentProduct;
      const url = isUpdating 
        ? `${apiUrl}/product/${currentProduct.id}`
        : `${apiUrl}/product`;
      
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Show success message
      setSuccessMessage(isUpdating ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Explicitly wait for products to refresh
      await fetchProducts();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the product');
      console.error("Error saving product:", err);
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
      const response = await fetch(`${apiUrl}/product/${id}`, {
        method: 'DELETE',
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Show success message
      setSuccessMessage("Product deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Clear delete confirmation and explicitly wait for refresh
      setDeleteConfirmId(null);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the product');
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Product
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded-md flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-md flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Products table */}
      {!loading && filteredProducts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-300">No products found</h3>
          <p className="mt-2 text-gray-400">
            {searchTerm ? "Try adjusting your search" : "Get started by creating your first product"}
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Create Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    return (
                      <tr key={product.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {imageErrors[product.id] || !product.image ? (
                                <div className="h-10 w-10 rounded-md bg-gray-600 flex items-center justify-center text-white">
                                  <span>🚫</span>
                                </div>
                              ) : (
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.image}
                                  alt={product.name}
                                  onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{product.name}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{`${product.amount} ${product.currency}`}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.is_recurring ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-600/20 text-purple-400">
                              Subscription
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                              One-time
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {deleteConfirmId === product.id ? (
                            <div className="flex justify-end items-center space-x-2">
                              <span className="text-gray-400 text-xs">Confirm?</span>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-gray-400 hover:text-gray-300"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => openEditModal(product)}
                                className="text-indigo-400 hover:text-indigo-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(product.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                      {searchTerm ? "No products match your search" : "No products to display"}
                    </td>
                  </tr>
                )}
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
                {currentProduct ? "Edit Product" : "Create New Product"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    formErrors.description ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.png"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formData.image && (
                  <div className="mt-2 flex items-center">
                    <img 
                      src={formData.image} 
                      alt="Product preview" 
                      className="h-16 w-16 object-cover rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=Invalid+Image";
                      }}
                    />
                    <span className="ml-2 text-xs text-gray-400">Image preview</span>
                  </div>
                )}
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                    Price*
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      formErrors.amount ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  {formErrors.amount && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subscription Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_recurring"
                  name="is_recurring"
                  checked={formData.is_recurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                />
                <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-300">
                  This is a subscription product
                </label>
              </div>

              {/* Billing Period (only shown if subscription is selected) */}
              {formData.is_recurring && (
                <div>
                  <label htmlFor="billing_period_hours" className="block text-sm font-medium text-gray-300 mb-1">
                    Billing Period (hours)*
                  </label>
                  <input
                    type="number"
                    id="billing_period_hours"
                    name="billing_period_hours"
                    value={formData.billing_period_hours || ""}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      formErrors.billing_period_hours ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  {formErrors.billing_period_hours && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.billing_period_hours}</p>
                  )}
                  <div className="mt-1 text-xs text-gray-400">
                    <p>Common periods:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Monthly: 720 hours (30 days)</li>
                      <li>Yearly: 8760 hours (365 days)</li>
                      <li>Weekly: 168 hours (7 days)</li>
                    </ul>
                  </div>
                </div>
              )}

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
                  {currentProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 