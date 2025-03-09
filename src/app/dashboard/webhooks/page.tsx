"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Webhook {
  id: string;
  user_id: string;
  account_id: string;
  url: string;
  description: string;
  secret: string;
  enabled: boolean;
  events: string[];
  created_at: string;
  updated_at: string;
}

interface WebhookFormData {
  account_id: string;
  url: string;
  description: string;
  events: string[];
  enabled: boolean;
}

interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  status: string;
  request_payload: any;
  response_body: string;
  response_status_code: number;
  duration_ms: number;
  error_message: string;
  created_at: string;
  updated_at: string;
}

export default function WebhooksPage() {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveriesModalOpen, setIsDeliveriesModalOpen] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState<Webhook | null>(null);
  const [currentDeliveries, setCurrentDeliveries] = useState<WebhookDelivery[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState<WebhookFormData>({
    account_id: "",
    url: "",
    description: "",
    events: [],
    enabled: true,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [availableEvents, setAvailableEvents] = useState([
    "checkout.created",
    "checkout.paid",
    "checkout.expired",
    "subscription.created",
    "subscription.updated",
    "subscription.deleted"
  ]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch webhooks on component mount
  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
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
      const endpoint = `${apiUrl}/webhook/account/${selectedAccountId}`;
      
      const response = await fetch(endpoint, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching webhooks');
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhookDeliveries = async (webhookId: string) => {
    setLoadingDeliveries(true);
    setError(null);
    
    try {
      const sessionId = localStorage.getItem("session_id");
      
      if (!sessionId) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      const endpoint = `${apiUrl}/webhook/${webhookId}/deliveries`;
      
      const response = await fetch(endpoint, {
        headers: {
          "Session-ID": sessionId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentDeliveries(data.data || []);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching webhook deliveries');
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const resetForm = () => {
    setFormData({
      account_id: "",
      url: "",
      description: "",
      events: [],
      enabled: true
    });
  };

  const openCreateModal = () => {
    resetForm();
    setCurrentWebhook(null);
    setIsModalOpen(true);
  };

  const openEditModal = (webhook: Webhook) => {
    setCurrentWebhook(webhook);
    setShowSecret(false);
    
    setFormData({
      account_id: webhook.account_id,
      url: webhook.url,
      description: webhook.description,
      events: [...webhook.events],
      enabled: webhook.enabled
    });
    setIsModalOpen(true);
  };

  const openDeliveriesModal = async (webhook: Webhook) => {
    setCurrentWebhook(webhook);
    setIsDeliveriesModalOpen(true);
    await fetchWebhookDeliveries(webhook.id);
  };

  const openViewModal = (webhook: Webhook) => {
    setCurrentWebhook(webhook);
    setShowSecret(false);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

  const closeDeliveriesModal = () => {
    setIsDeliveriesModalOpen(false);
    setCurrentDeliveries([]);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.url) {
      errors.url = "URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      errors.url = "URL must start with http:// or https://";
    }
    
    if (formData.events.length === 0) {
      errors.events = "Select at least one event";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleRemoveEvent = (event: string) => {
    setFormData({
      ...formData,
      events: formData.events.filter(e => e !== event)
    });
  };

  const handleSelectEvent = (event: string) => {
    if (!formData.events.includes(event)) {
      setFormData({
        ...formData,
        events: [...formData.events, event]
      });
    } else {
      handleRemoveEvent(event);
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      
      const webhookData = {
        ...formData,
        account_id: localStorage.getItem("selected_account_id"),
      };
      
      const isUpdating = !!currentWebhook;
      const url = isUpdating 
        ? `${apiUrl}/webhook/${currentWebhook.id}`
        : `${apiUrl}/webhook`;
      
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          "Content-Type": "application/json",
          "Session-ID": sessionId
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage(isUpdating ? "Webhook updated successfully!" : "Webhook created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchWebhooks();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the webhook');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) {
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
      const response = await fetch(`${apiUrl}/webhook/${id}`, {
        method: 'DELETE',
        headers: {
          "Session-ID": sessionId
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("Webhook deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchWebhooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the webhook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Webhooks</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          New Webhook
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

      {/* Webhooks table */}
      {!loading && webhooks.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <h3 className="mt-4 text-lg font-medium text-gray-300">No webhooks found</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Webhook
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Events
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {webhooks.map((webhook) => (
                  <tr 
                    key={webhook.id} 
                    className="hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => openViewModal(webhook)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {webhook.url}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{webhook.description || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {webhook.events.map((event, idx) => (
                          <span key={idx} className="inline-block bg-gray-700 px-2 py-1 rounded-md text-xs mr-1 mb-1">
                            {event}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        webhook.enabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {webhook.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeliveriesModal(webhook);
                        }}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Deliveries
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(webhook);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(webhook.id);
                        }}
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">
                {currentWebhook ? "Edit Webhook" : "Create New Webhook"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                  URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/webhook"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formErrors.url && (
                  <p className="mt-1 text-red-400 text-sm">{formErrors.url}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Webhook for checkout events"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Enabled Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-300">
                  Enabled
                </label>
              </div>
              
              {/* Events */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Events <span className="text-red-400">*</span>
                </label>
                
                <div className="mb-2 flex flex-wrap gap-2">
                  {formData.events.map((event, index) => (
                    <div key={index} className="bg-purple-600/30 border border-purple-500 px-3 py-1 rounded-full text-sm flex items-center">
                      {event}
                      <button
                        type="button"
                        onClick={() => handleRemoveEvent(event)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Select events to trigger this webhook:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableEvents.map((event) => (
                      <button
                        key={event}
                        type="button"
                        onClick={() => handleSelectEvent(event)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.events.includes(event)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                </div>
                
                {formErrors.events && (
                  <p className="mt-1 text-red-400 text-sm">{formErrors.events}</p>
                )}
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
                  {currentWebhook ? "Update Webhook" : "Create Webhook"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Webhook Modal */}
      {isViewModalOpen && currentWebhook && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between">
              <h2 className="text-xl font-semibold">
                Webhook Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">URL</h3>
                <p className="text-white">{currentWebhook.url}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                <p className="text-white">{currentWebhook.description || "-"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Secret</h3>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={currentWebhook.secret}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white px-2 py-1 rounded text-xs"
                  >
                    {showSecret ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-1 text-gray-400 text-xs">Use this secret to validate webhook payloads.</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentWebhook.enabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                }`}>
                  {currentWebhook.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Events</h3>
                <div className="flex flex-wrap gap-2">
                  {currentWebhook.events.map((event, idx) => (
                    <span key={idx} className="inline-block bg-gray-700 px-2 py-1 rounded-md text-sm">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
                <p className="text-white">{new Date(currentWebhook.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h3>
                <p className="text-white">{new Date(currentWebhook.updated_at).toLocaleString()}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-700 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    openDeliveriesModal(currentWebhook);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Deliveries
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    openEditModal(currentWebhook);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Edit Webhook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deliveries Modal */}
      {isDeliveriesModalOpen && currentWebhook && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Webhook Deliveries
              </h2>
              <button
                onClick={closeDeliveriesModal}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-300"><span className="font-semibold">URL:</span> {currentWebhook.url}</p>
              </div>
              
              {loadingDeliveries ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : currentDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No delivery attempts found for this webhook
                </div>
              ) : (
                <div className="space-y-4">
                  {currentDeliveries.map((delivery) => (
                    <div key={delivery.id} className={`border ${
                      delivery.status === 'success' 
                        ? 'border-green-500 bg-green-600/10' 
                        : 'border-red-500 bg-red-600/10'
                      } rounded-lg p-4`}
                    >
                      <div className="flex flex-col md:flex-row justify-between mb-2 gap-2">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            delivery.status === 'success' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-red-600/20 text-red-400'
                          }`}>
                            {delivery.status}
                          </span>
                          <span className="ml-2 text-gray-400 text-sm">
                            Event: <span className="text-gray-300">{delivery.event_type}</span>
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(delivery.created_at).toLocaleString()}
                          <span className="ml-2">({delivery.duration_ms}ms)</span>
                        </div>
                      </div>
                      
                      {delivery.status === 'failed' && (
                        <div className="mb-2 text-red-400 text-sm">
                          Error: {delivery.error_message}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Request Payload</h4>
                          <div className="bg-gray-900 p-2 rounded overflow-auto max-h-40">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                              {JSON.stringify(delivery.request_payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1">
                            Response ({delivery.response_status_code})
                          </h4>
                          <div className="bg-gray-900 p-2 rounded overflow-auto max-h-40">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                              {delivery.response_body}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 