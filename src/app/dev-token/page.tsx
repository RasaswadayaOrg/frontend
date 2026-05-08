"use client";

import { useEffect, useState } from "react";

export default function DevTokenPage() {
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("/api/dev/token");
        const data = await res.json();
        
        if (data.token) {
          setToken(data.token);
        } else {
          setError("No token found. Please login first.");
        }
      } catch (err) {
        setError("Failed to fetch token");
      }
    }
    
    fetchToken();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          🔑 JWT Token for Postman Testing
        </h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
            {error}
          </div>
        ) : token ? (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Your JWT Token:</p>
              <div className="bg-white border border-gray-300 rounded p-3 break-all font-mono text-sm text-gray-800">
                {token}
              </div>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {copied ? "✓ Copied!" : "📋 Copy Token"}
            </button>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h2 className="font-bold text-blue-900 mb-2">How to use in Postman:</h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Copy the token above</li>
                <li>Open Postman</li>
                <li>Go to <strong>Authorization</strong> tab</li>
                <li>Select <strong>Bearer Token</strong></li>
                <li>Paste the token</li>
                <li>Send your request</li>
              </ol>
            </div>
          </>
        ) : (
          <div className="text-gray-500">Loading...</div>
        )}
      </div>
    </div>
  );
}
