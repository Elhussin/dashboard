"use client";

import { useState, useEffect, FormEvent } from "react";
import { Loading } from "@/components/Loading";
import ProductTable from "@/components/ProductTable";

export default function ProductPage() {
  const [data, setData] = useState<any[]>([]);
  const [store, setStore] = useState("Jeddah Store");
  const [mainGroup, setMainGroup] = useState("58");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/product/?Store=" + store + "&MainGroup=" + mainGroup
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []); // Run once on mount

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Filter Section */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Product Analysis
            </h1>
            <p className="text-slate-400">
              View and filter product inventory and pricing
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
            >
              {/* Store Input */}
              <div className="md:col-span-5 space-y-2">
                <label
                  htmlFor="store"
                  className="text-sm font-medium text-slate-400 ml-1"
                >
                  Store Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    🏢
                  </div>
                  <input
                    id="store"
                    type="text"
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    placeholder="e.g., Jeddah Store"
                  />
                </div>
              </div>

              {/* Main Group Input */}
              <div className="md:col-span-5 space-y-2">
                <label
                  htmlFor="mainGroup"
                  className="text-sm font-medium text-slate-400 ml-1"
                >
                  Main Group ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    🏷️
                  </div>
                  <input
                    id="mainGroup"
                    type="text"
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    value={mainGroup}
                    onChange={(e) => setMainGroup(e.target.value)}
                    placeholder="e.g., 58"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Search</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <p className="text-red-400 text-lg font-medium">
                Error loading data
              </p>
              <p className="text-red-300/60 mt-2">{error}</p>
            </div>
          ) : (
            <ProductTable data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
