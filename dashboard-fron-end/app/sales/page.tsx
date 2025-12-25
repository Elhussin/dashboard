"use client";

import { useState } from "react";
import SalesDashboard from "../../components/SalesDashboard";
import { SalesRecord } from "../../types/sales";
import { Loading } from "../../components/Loading";

export default function HomePage() {
  const [data, setData] = useState<SalesRecord[]>([]);
  // Initialize dates to empty or some default. 
  // User asked to "stop fetch dat when looad", so we start with empty or current date but don't fetch.
  // We'll just provide inputs.
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      const response = await fetch(`/api/sales/?startDate=${startDate}&endDate=${endDate}`);
  

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
      <div className="bg-slate-900 text-white p-4 flex items-center justify-center gap-4">
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

