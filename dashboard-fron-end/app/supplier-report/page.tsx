"use client";

import { useState, useEffect, useCallback } from "react";
import MultiSelect from "@/components/MultiSelect";
import { Loading } from "@/components/Loading";

type SupplierRecord = {
    Name: string;
    Trans_Year: number;
    InvoiceDate: string;
    Code: string;
    Description: string;
    CostPrice: number;
    RetailPrice: number;
    Quantity: number;
    PurchaseBasePrice: number;
    MainGroupID: number;
};

type Option = {
    value: string | number;
    label: string;
};

export default function SupplierReport() {
    const [transYears, setTransYears] = useState<(string | number)[]>([]);
    const [mainGroupIDs, setMainGroupIDs] = useState<(string | number)[]>([]);
    const [supplierIDs, setSupplierIDs] = useState<(string | number)[]>([]);

    const [data, setData] = useState<SupplierRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter Options
    const [mainGroupOptions, setMainGroupOptions] = useState<Option[]>([]);
    const [supplierOptions, setSupplierOptions] = useState<Option[]>([]);

    // Generating Year Options (e.g., last 5 years + next year)
    const currentYear = new Date().getFullYear();
    const yearOptions: Option[] = Array.from({ length: 6 }, (_, i) => {
        const y = currentYear - 4 + i;
        return { value: y, label: y.toString() };
    }).reverse();

    // Fetch Filters
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [groupsRes, suppliersRes] = await Promise.all([
                    fetch("/api/main-groups"),
                    fetch("/api/suppliers"),
                ]);

                const groupsData = await groupsRes.json();
                const suppliersData = await suppliersRes.json();

                if (groupsData.data) {
                    setMainGroupOptions(groupsData.data.map((g: any) => ({ value: g.MainGroupsID, label: g.Name })));
                }
                if (suppliersData.data) {
                    setSupplierOptions(suppliersData.data.map((s: any) => ({ value: s.SupplierID, label: s.Name })));
                }
            } catch (err) {
                console.error("Error fetching filters:", err);
            }
        };
        fetchFilters();
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (transYears.length > 0) params.append("Trans_Year", transYears.join(","));
            if (mainGroupIDs.length > 0) params.append("MainGroupID", mainGroupIDs.join(","));
            if (supplierIDs.length > 0) params.append("SupplierID", supplierIDs.join(","));

            const res = await fetch(`/api/supplier-report?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");
            const json = await res.json();
            setData(json.data || []);
        } catch (err: any) {
            // console.error(err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [transYears, mainGroupIDs, supplierIDs]);

    // // Initial fetch
    // useEffect(() => {
    //     fetchData();
    // }, [fetchData]);

    // Handle Search Button
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Supplier Report
                        </h1>
                        <p className="text-slate-400">
                            Analyze product purchases by supplier, year, and group
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

                            <div className="md:col-span-1">
                                <MultiSelect
                                    label="Transaction Year"
                                    options={yearOptions}
                                    value={transYears}
                                    onChange={setTransYears}
                                    placeholder="Select Years..."
                                />
                            </div>

                            <div className="md:col-span-1">
                                <MultiSelect
                                    label="Main Group"
                                    options={mainGroupOptions}
                                    value={mainGroupIDs}
                                    onChange={setMainGroupIDs}
                                    placeholder="Select Groups..."
                                />
                            </div>

                            <div className="md:col-span-1">
                                <MultiSelect
                                    label="Supplier"
                                    options={supplierOptions}
                                    value={supplierIDs}
                                    onChange={setSupplierIDs}
                                    placeholder="Select Suppliers..."
                                />
                            </div>

                            <div className="md:col-span-1">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 h-[50px]"
                                >
                                    <span>Search</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loading />
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                            <p className="text-red-400 text-lg font-medium">Error loading data</p>
                            <p className="text-red-300/60 mt-2">{error}</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-700/50">
                                            <th className="p-4 font-semibold text-sm">Supplier</th>
                                            <th className="p-4 font-semibold text-sm">Year</th>
                                            <th className="p-4 font-semibold text-sm">Inv. Date</th>
                                            <th className="p-4 font-semibold text-sm">Code</th>
                                            <th className="p-4 font-semibold text-sm">Description</th>
                                            <th className="p-4 font-semibold text-sm text-right">Cost</th>
                                            <th className="p-4 font-semibold text-sm text-right">Retail</th>
                                            <th className="p-4 font-semibold text-sm text-right">Qty</th>
                                            <th className="p-4 font-semibold text-sm text-right">Base Price</th>
                                            <th className="p-4 font-semibold text-sm">GroupID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {data.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-700/30 transition-colors text-slate-300 text-sm">
                                                <td className="p-4 font-medium text-white">{row.Name}</td>
                                                <td className="p-4">{row.Trans_Year}</td>
                                                <td className="p-4 whitespace-nowrap">{new Date(row.InvoiceDate).toLocaleDateString()}</td>
                                                <td className="p-4 font-mono text-xs bg-slate-900/30 rounded px-2 py-1 w-fit">{row.Code}</td>
                                                <td className="p-4 max-w-xs truncate" title={row.Description}>{row.Description}</td>
                                                <td className="p-4 text-right font-mono text-emerald-400">{row.CostPrice?.toFixed(2)}</td>
                                                <td className="p-4 text-right font-mono text-blue-400">{row.RetailPrice?.toFixed(2)}</td>
                                                <td className="p-4 text-right">{row.Quantity}</td>
                                                <td className="p-4 text-right font-mono">{row.PurchaseBasePrice?.toFixed(2)}</td>
                                                <td className="p-4 text-slate-500">{row.MainGroupID}</td>
                                            </tr>
                                        ))}
                                        {data.length === 0 && (
                                            <tr>
                                                <td colSpan={10} className="p-12 text-center text-slate-500">
                                                    No data found. Adjust filters to search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
