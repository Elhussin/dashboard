'use client';

import { useState, useEffect } from 'react';
import SalesDashboard from '../../components/SalesDashboard';
import { SalesRecord } from '../../types/sales';

export default function HomePage() {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error('Network response was not ok');
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
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return <SalesDashboard data={data} />;
}