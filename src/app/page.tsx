import { app_routes } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-amber-400 text-transparent bg-clip-text">Bitvora</span>
                <span className="ml-1 text-xl font-light">Commerce</span>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#features" className="text-gray-300 hover:text-purple-400 px-3 py-2">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-purple-400 px-3 py-2">Pricing</a>
                <a href="#self-hosting" className="text-gray-300 hover:text-purple-400 px-3 py-2">Self-hosting</a>
                <a href="#faq" className="text-gray-300 hover:text-purple-400 px-3 py-2">FAQ</a>
              </div>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <a href={app_routes.login} className="text-gray-300 hover:text-white px-3 py-2">Login</a>
              <a href={app_routes.signup} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-amber-900"></div>
          <div className="absolute inset-0 bg-[url('/bitcoin-pattern.png')] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="block">Open Source</span>
                <span className="block bg-gradient-to-r from-purple-500 to-amber-400 text-transparent bg-clip-text">
                  Bitcoin Payments
                </span>
                <span className="block">For Everyone</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                The 100% open source Bitcoin payment platform for merchants, online stores, and businesses.
                Accept Lightning and on-chain payments without giving up control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg">
                  Get Started Free
                </a>
                <a href="#self-hosting" className="border border-amber-500 text-amber-400 hover:bg-amber-500/10 px-8 py-3 rounded-lg font-medium text-lg">
                  Self-Host It
                </a>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5">
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-2xl border border-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-amber-600/20"></div>
                <Image 
                  src="/dashboard-preview.png" 
                  alt="Bitvora Commerce Dashboard"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Bitcoin Payment Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to accept Bitcoin payments for your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast Payments</h3>
              <p className="text-gray-400">
                Accept instant Bitcoin payments through the Lightning Network with minimal fees.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Self-Custodial</h3>
              <p className="text-gray-400">
                Powered by Nostr Wallet Connect - we never touch your money. Maintain full control.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Chain Security</h3>
              <p className="text-gray-400">
                Support for both Lightning and traditional on-chain Bitcoin transactions.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bitcoin Subscriptions</h3>
              <p className="text-gray-400">
                Set up recurring Bitcoin payments for your subscription-based business.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Links</h3>
              <p className="text-gray-400">
                Create and share customized payment links for quick and easy checkout.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Open Source</h3>
              <p className="text-gray-400">
                Fully transparent code that's freely available for review, modification, and self-hosting.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Perfect for small businesses or individuals just getting started with Bitcoin payments.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Lightning Network payments
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    1 merchant account
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Up to $5,000 USD/month
                  </li>
                  <li className="flex items-center text-gray-500">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No on-chain payments
                  </li>
                </ul>
                <a href="/signup" className="block text-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">
                  Get Started
                </a>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-purple-900 to-gray-800 rounded-xl overflow-hidden transform scale-105 shadow-xl border border-purple-500/30">
              <div className="p-8">
                <div className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">Most Popular</div>
                <h3 className="text-xl font-semibold mb-4">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  For growing businesses that need more volume and advanced features.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Lightning Network payments
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    On-chain Bitcoin payments
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited monthly volume
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple merchant accounts
                  </li>
                </ul>
                <a href="/signup-pro" className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg">
                  Go Pro
                </a>
              </div>
            </div>
            
            {/* Self-Hosted Plan */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">Self-Hosted</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-gray-400">/forever</span>
                </div>
                <p className="text-gray-400 mb-6">
                  For technical users who want complete control over their payment infrastructure.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Full feature access
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    No monthly limits
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Complete control
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Technical setup required
                  </li>
                </ul>
                <a href="https://github.com/bitvora/commerce" className="block text-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Self-hosting Section */}
      <section id="self-hosting" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="bg-gray-900 p-2 rounded-lg border border-purple-500/20">
                <pre className="overflow-x-auto p-4 text-amber-300 font-mono text-sm">
                  <code>
{`# Clone the repository
git clone https://github.com/bitvora/commerce.git

# Navigate to the directory
cd bitvora-commerce

# Install dependencies
npm install

# Configure your .env file
cp .env.example .env

# Start the server
npm run start`}
                  </code>
                </pre>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Self-Host Your Bitcoin Payment Infrastructure</h2>
              <p className="text-gray-300 mb-6">
                Bitvora Commerce is 100% open source. Take control of your payment infrastructure by hosting it yourself.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>No monthly fees or transaction limits</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Complete data privacy and control</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Customize to fit your specific needs</span>
                </li>
              </ul>
              <div className="flex space-x-4">
                <a href="https://github.com/bitvora/commerce" className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub Repository
                </a>
                <a href="/docs/self-hosting" className="inline-flex items-center border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-medium py-2 px-4 rounded-lg">
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Accept Bitcoin Payments?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of merchants who are already using Bitvora Commerce to accept Bitcoin payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 py-3 rounded-lg font-medium text-lg">
              Sign Up for Free
            </a>
            <a href="/contact" className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-lg">
              Contact Sales
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 pt-12 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-purple-400">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-purple-400">Pricing</a></li>
                <li><a href="/docs" className="text-gray-400 hover:text-purple-400">Documentation</a></li>
                <li><a href="/api" className="text-gray-400 hover:text-purple-400">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-purple-400">About Us</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-purple-400">Blog</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-purple-400">Contact</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-purple-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/guides" className="text-gray-400 hover:text-purple-400">Guides</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-purple-400">Support</a></li>
                <li><a href="/status" className="text-gray-400 hover:text-purple-400">System Status</a></li>
                <li><a href="/security" className="text-gray-400 hover:text-purple-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-purple-400">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-purple-400">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-amber-400 text-transparent bg-clip-text">Bitvora</span>
              <span className="ml-1 text-lg font-light">Commerce</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Bitvora Commerce. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://twitter.com/bitvoracommerce" className="text-gray-400 hover:text-purple-400">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://github.com/bitvora/commerce" className="text-gray-400 hover:text-purple-400">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}