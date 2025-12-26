"use client";

import { useState, useEffect } from "react";
import SalesDashboard from "../../components/SalesDashboard";
import { SalesRecord, Store, Gallery } from "../../types/sales";
import { Loading } from "../../components/Loading";

export default function HomePage() {
  const [data, setData] = useState<SalesRecord[]>([]);
  // Initialize dates to empty or some default. 
  // User asked to "stop fetch dat when looad", so we start with empty or current date but don't fetch.
  // We'll just provide inputs.
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [stores, setStores] = useState<Store[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const [selectedStore, setSelectedStore] = useState("");
  const [selectedGallery, setSelectedGallery] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const [isLoading, setIsLoading] = useState(false); // Start false per request
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams({ startDate, endDate });
      if (selectedStore) searchParams.append('storeId', selectedStore);
      if (selectedGallery) searchParams.append('galleryId', selectedGallery);
      if (paymentType) searchParams.append('paymentType', paymentType);

      const response = await fetch(`/api/sales/?${searchParams.toString()}`);


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

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [storesRes, galleriesRes] = await Promise.all([
          fetch('/api/stores').then(res => res.json()),
          fetch('/api/galleries').then(res => res.json())
        ]);
        if (Array.isArray(storesRes)) setStores(storesRes);
        if (Array.isArray(galleriesRes)) setGalleries(galleriesRes);
      } catch (e) {
        console.error("Failed to load filters", e);
      }
    };
    loadFilters();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-red-500 gap-4">
        <div>Error: {error}</div>
        <button
          className="p-2 border border-slate-600 rounded text-white hover:bg-slate-800"
          onClick={() => setError(null)}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-slate-400">Start Date</label>
          <input
            type="date"
            className="p-2 border border-slate-600 rounded bg-slate-800 text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400">End Date</label>
          <input
            type="date"
            className="p-2 border border-slate-600 rounded bg-slate-800 text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400">Store</label>
          <select
            className="p-2 border border-slate-600 rounded bg-slate-800 text-white w-40"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">All Stores</option>
            {stores.map(s => <option key={s.StoreID} value={s.StoreID}>{s.Name}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400">Gallery</label>
          <select
            className="p-2 border border-slate-600 rounded bg-slate-800 text-white w-40"
            value={selectedGallery}
            onChange={(e) => setSelectedGallery(e.target.value)}
          >
            <option value="">All Galleries</option>
            {galleries.map(g => <option key={g.GalleryID} value={g.GalleryID}>{g.Name}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-400">Payment</label>
          <select
            className="p-2 border border-slate-600 rounded bg-slate-800 text-white w-32"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="cash">Cash Only</option>
            <option value="insurance">Insurance Only</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button
            className="p-2 border border-slate-600 rounded hover:bg-slate-700 h-10 mt-5"
            onClick={() => fetchData()}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <SalesDashboard data={data} />
      )}

    </>
  );
}



// useEffect(() => {
//   async function fetchData() {
//     try {
//       const response = await fetch("/api/users/?Year=" + year);
//       console.log(response);

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       // The API returns { message: string, data: SalesRecord[] }
//       setData(result.data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : String(err));
//     } finally {
//       setIsLoading(false);
//     }
//   }


// }, [year]);

