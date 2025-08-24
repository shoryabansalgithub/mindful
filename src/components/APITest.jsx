import React, { useState } from "react";
import { runchat } from "../config/gemini.jsx";

const APITest = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testAPI = async () => {
    setLoading(true);
    setError("");
    setResult("");
    
    try {
      const response = await runchat("Hello, this is a test message.");
      setResult(response);
    } catch (err) {
      console.error("API Test Error:", err);
      setError(err.message || "An error occurred while testing the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Test</h2>
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test API Connection"}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h3 className="font-bold">Success:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default APITest;