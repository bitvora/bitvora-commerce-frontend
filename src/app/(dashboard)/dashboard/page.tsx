"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeCustomers: 0,
    totalProducts: 0,
    monthlyRecurringRevenue: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
          router.push("/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.commerce.bitvora.com";
        const response = await fetch(`${apiUrl}/dashboard/stats`, {
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
          setStats(data || stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use placeholder data when API is not available
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-sm font-medium text-gray-400">Total Sales</h3>
          <p className="text-2xl font-bold mt-2">${stats.totalSales.toLocaleString()}</p>
          <div className="mt-2 text-xs text-green-400">↑ 12% from last month</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-sm font-medium text-gray-400">Active Customers</h3>
          <p className="text-2xl font-bold mt-2">{stats.activeCustomers.toLocaleString()}</p>
          <div className="mt-2 text-xs text-green-400">↑ 5% from last month</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-sm font-medium text-gray-400">Products</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalProducts.toLocaleString()}</p>
          <div className="mt-2 text-xs text-gray-400">No change</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-sm font-medium text-gray-400">Monthly Recurring Revenue</h3>
          <p className="text-2xl font-bold mt-2">${stats.monthlyRecurringRevenue.toLocaleString()}</p>
          <div className="mt-2 text-xs text-green-400">↑ 8% from last month</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-300">New subscription</span>
              <span className="text-gray-400">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Customer #1234 subscribed to Premium Plan</p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Payment received</span>
              <span className="text-gray-400">5 hours ago</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">$49.99 payment for order #5678</p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-300">New customer</span>
              <span className="text-gray-400">Yesterday</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">John Doe created an account</p>
          </div>
        </div>
        
        <button className="mt-4 text-purple-400 text-sm hover:text-purple-300">
          View all activity →
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="font-medium mb-2">Create Product</h3>
          <p className="text-sm text-gray-400 mb-4">Add a new product to your inventory</p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
            Create Product
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="font-medium mb-2">Payment Link</h3>
          <p className="text-sm text-gray-400 mb-4">Create a shareable payment link</p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
            Generate Link
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="font-medium mb-2">API Documentation</h3>
          <p className="text-sm text-gray-400 mb-4">Learn how to integrate with our API</p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
} 