"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Store session ID in local storage
        localStorage.setItem("session_id", data.data.id);
        
        // Fetch user accounts
        try {
          const accountsResponse = await fetch(`${apiUrl}/account`, {
            headers: {
              "Session-ID": data.data.id
            }
          });
          
          if (accountsResponse.ok) {
            const accountsData = await accountsResponse.json();
            if (accountsData.data && accountsData.data.length > 0) {
              // Store the first account as the default selected account
              localStorage.setItem("selected_account_id", accountsData.data[0].id);
              localStorage.setItem("accounts", JSON.stringify(accountsData.data));
            }
          }
        } catch (accountErr) {
          console.error("Error fetching accounts:", accountErr);
        }
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else if (response.status === 401) {
        // Show invalid credentials message
        setError("Invalid credentials. Please try again.");
      } else {
        // Show generic error message
        setError(data.message || "An error occurred during login");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-amber-400 text-transparent bg-clip-text">
                  Bitvora
                </span>
                <span className="ml-1 text-xl font-light">Commerce</span>
              </Link>
            </div>
            
            {/* Auth Links */}
            <div className="flex items-center space-x-4">
              <Link href="/signup" className="text-gray-300 hover:text-white px-3 py-2">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl border border-purple-500/20">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold">
              Log in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-purple-500 px-3 py-2 text-white"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-purple-500 px-3 py-2 text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-900 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-amber-400 text-transparent bg-clip-text">
                Bitvora
              </span>
              <span className="ml-1 text-lg font-light">Commerce</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Bitvora Commerce. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 