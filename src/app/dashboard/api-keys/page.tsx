"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';

interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

interface Permissions {
  customers: Permission;
  products: Permission;
  subscriptions: Permission;
  payment_links: Permission;
  checkouts: Permission;
  wallets: Permission;
  invoices: Permission;
}

interface ApiKey {
  id: number;
  user_id: string;
  account_id: string;
  name: string;
  token_hash: string;
  permissions: Permissions;
  created_at: string;
  updated_at: string;
  token?: string; // Only available when first created
}

interface ApiKeyFormData {
  name: string;
  permissions: Permissions;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null);
  const [newApiKeyToken, setNewApiKeyToken] = useState<string | null>(null);
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const defaultPermissions: Permissions = {
    customers: { read: true, create: false, update: false, delete: false },
    products: { read: true, create: false, update: false, delete: false },
    subscriptions: { read: true, create: false, update: false, delete: false },
    payment_links: { read: true, create: false, update: false, delete: false },
    checkouts: { read: true, create: false, update: false, delete: false },
    wallets: { read: true, create: false, update: false, delete: false },
    invoices: { read: true, create: false, update: false, delete: false },
  };

  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: "",
    permissions: defaultPermissions,
  });

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
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
      const endpoint = `${apiUrl}/api-key/account/${selectedAccountId}`;
      
      const response = await fetch(endpoint, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching API keys');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      permissions: defaultPermissions,
    });
    setNewApiKeyToken(null);
  };

  const openCreateModal = () => {
    resetForm();
    setCurrentApiKey(null);
    setIsModalOpen(true);
  };

  const openEditModal = (apiKey: ApiKey) => {
    setCurrentApiKey(apiKey);
    setFormData({
      name: apiKey.name,
      permissions: apiKey.permissions,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewApiKeyToken(null);
    setIsTokenVisible(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value
    });
  };

  const handlePermissionChange = (
    resource: keyof Permissions,
    action: keyof Permission,
    value: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [resource]: {
          ...formData.permissions[resource],
          [action]: value,
        },
      },
    });
  };

  const handleSelectAllForResource = (resource: keyof Permissions, value: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [resource]: {
          read: value,
          create: value,
          update: value,
          delete: value,
        },
      },
    });
  };

  const handleSelectAllForAction = (action: keyof Permission, value: boolean) => {
    const updatedPermissions = { ...formData.permissions };
    
    (Object.keys(updatedPermissions) as Array<keyof Permissions>).forEach(resource => {
      updatedPermissions[resource] = {
        ...updatedPermissions[resource],
        [action]: value,
      };
    });
    
    setFormData({
      ...formData,
      permissions: updatedPermissions,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      const apiKeyData = {
        ...formData,
        account_id: selectedAccountId,
      };
      
      const isUpdating = !!currentApiKey;
      const url = isUpdating 
        ? `${apiUrl}/api-key/${currentApiKey.id}`
        : `${apiUrl}/api-key`;
      
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(apiKeyData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!isUpdating && result.data?.token) {
        // If creating a new API key, store the token to display it
        setNewApiKeyToken(result.data.token);
      } else {
        setSuccessMessage(isUpdating ? "API key updated successfully!" : "API key created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        await fetchApiKeys();
        closeModal();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      const response = await fetch(`${apiUrl}/api-key/${id}`, {
        method: 'DELETE',
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("API key deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchApiKeys();
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the API key');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      const response = await fetch(`${apiUrl}/api-key/${id}/lock`, {
        method: 'POST',
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("API key locked successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while locking the API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("API key copied to clipboard!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          New API Key
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

      {/* API Keys table */}
      {!loading && apiKeys.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-300">No API keys found</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create API Key
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
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {apiKey.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(apiKey.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openEditModal(apiKey)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleLock(apiKey.id)}
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Lock API Key"
                      >
                        Lock
                      </button>
                      <button
                        onClick={() => setConfirmDelete(apiKey.id)}
                        className="text-red-400 hover:text-red-300"
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

      {/* Delete Confirmation Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this API key? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete !== null && handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">
                {currentApiKey ? "Edit API Key" : "Create New API Key"}
              </h2>
            </div>
            
            {newApiKeyToken ? (
              <div className="p-6 space-y-6">
                <div className="bg-yellow-600/20 border border-yellow-500 text-yellow-400 px-4 py-3 rounded-md">
                  <p className="font-semibold">Important: Save your API key now</p>
                  <p className="text-sm mt-1">This API key will only be shown once and cannot be recovered later.</p>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your API Key:
                  </label>
                  <div className="flex relative">
                    <input
                      type={isTokenVisible ? "text" : "password"}
                      value={newApiKeyToken}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-24"
                    />
                    <button
                      type="button"
                      onClick={() => setIsTokenVisible(!isTokenVisible)}
                      className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white"
                      aria-label={isTokenVisible ? "Hide token" : "Show token"}
                    >
                      <FontAwesomeIcon icon={isTokenVisible ? faEyeSlash : faEye} className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newApiKeyToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white"
                      aria-label="Copy to clipboard"
                    >
                      <FontAwesomeIcon icon={faClipboard} className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      fetchApiKeys();
                      closeModal();
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    API Key Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Enter a name for this API key"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Permissions</h3>
                  
                  <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Resource
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-1 justify-center">
                              <span>Read</span>
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-purple-600 rounded-sm"
                                checked={Object.values(formData.permissions).every(p => p.read)}
                                onChange={(e) => handleSelectAllForAction('read', e.target.checked)}
                              />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-1 justify-center">
                              <span>Create</span>
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-purple-600 rounded-sm"
                                checked={Object.values(formData.permissions).every(p => p.create)}
                                onChange={(e) => handleSelectAllForAction('create', e.target.checked)}
                              />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-1 justify-center">
                              <span>Update</span>
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-purple-600 rounded-sm"
                                checked={Object.values(formData.permissions).every(p => p.update)}
                                onChange={(e) => handleSelectAllForAction('update', e.target.checked)}
                              />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-1 justify-center">
                              <span>Delete</span>
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-purple-600 rounded-sm"
                                checked={Object.values(formData.permissions).every(p => p.delete)}
                                onChange={(e) => handleSelectAllForAction('delete', e.target.checked)}
                              />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            All
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {(Object.keys(formData.permissions) as Array<keyof Permissions>).map((resource) => (
                          <tr key={resource} className="hover:bg-gray-800/70">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white capitalize">
                              {resource.replace('_', ' ')}
                            </td>
                            {(['read', 'create', 'update', 'delete'] as Array<keyof Permission>).map((action) => (
                              <td key={`${resource}-${action}`} className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={formData.permissions[resource][action]}
                                  onChange={(e) => handlePermissionChange(resource, action, e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-purple-600 rounded-sm"
                                />
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <input
                                type="checkbox"
                                checked={
                                  formData.permissions[resource].read && 
                                  formData.permissions[resource].create && 
                                  formData.permissions[resource].update && 
                                  formData.permissions[resource].delete
                                }
                                onChange={(e) => handleSelectAllForResource(resource, e.target.checked)}
                                className="form-checkbox h-5 w-5 text-purple-600 rounded-sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    {currentApiKey ? "Update API Key" : "Create API Key"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 