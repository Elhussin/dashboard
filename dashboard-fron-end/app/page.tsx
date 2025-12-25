"use client";

import { useState, useEffect } from "react";
import SalesDashboard from "../components/SalesDashboard";
import { SalesRecord } from "../types/sales";
import { Loading } from "../components/Loading";

export default function HomePage() {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/users/?Year=" + year);
        console.log(response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        // The API returns { message: string, data: SalesRecord[] }
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [year]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900 text-white p-4 flex items-center justify-center">
        <input
          type="number"
          className="p-2 border border-slate-600 rounded"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          placeholder="Inter year"
        />
        <button className="p-2 border border-slate-600 rounded" onClick={() => setYear(year)}>Submit</button>
      </div>

      {isLoading && (
        <Loading />
      )}
      <SalesDashboard data={data} />
    </>
  );
}
