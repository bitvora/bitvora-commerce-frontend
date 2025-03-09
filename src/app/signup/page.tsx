"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
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

    // Basic validation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2121";
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success! Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Show error message
        setError(data.message || "An error occurred during signup");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Signup error:", err);
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
              <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Signup Form Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl border border-purple-500/20">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Start accepting Bitcoin payments today
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-purple-500 px-3 py-2 text-white"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
              
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-purple-500 px-3 py-2 text-white"
                  placeholder="••••••••"
                  minLength={8}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
                Log in
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