'use client';

import { SalesRecord } from '../types/sales';
import { motion } from 'framer-motion';

interface SalesDashboardProps {
    data: SalesRecord[];
}

export default function SalesDashboard({ data }: SalesDashboardProps) {
    // Calculate Totals
    const totalRevenue = data.reduce((acc, curr) => acc + curr['T.price'], 0);
    const totalQuantity = data.reduce((acc, curr) => acc + curr.Quantity, 0);
    const totalInsuranceDiscount = data.reduce((acc, curr) => acc + curr.InsuranceDiscount, 0);
    const totalApproved = data.reduce((acc, curr) => acc + curr.ApprovePrice, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-slate-900 text-white p-8 font-sans"
        >
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Sales Overview
                        </h1>
                        <p className="text-slate-400 mt-2">Real-time financial performance metrics</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 text-sm text-slate-300">
                        Year: {data[0]?.Trans_Year || new Date().getFullYear()}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard
                        title="Total Revenue"
                        value={formatCurrency(totalRevenue)}
                        icon="💰"
                        color="from-blue-500 to-cyan-500"
                    />
                    <SummaryCard
                        title="Total Quantity"
                        value={totalQuantity.toLocaleString()}
                        icon="📦"
                        color="from-emerald-500 to-teal-500"
                    />
                    <SummaryCard
                        title="Approved Amount"
                        value={formatCurrency(totalApproved)}
                        icon="✅"
                        color="from-violet-500 to-purple-500"
                    />
                    <SummaryCard
                        title="Insurance Discount"
                        value={formatCurrency(totalInsuranceDiscount)}
                        icon="🛡️"
                        color="from-rose-500 to-pink-500"
                    />
                </div>

                {/* Data Table */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Branch Name</th>
                                    <th className="p-4 font-semibold">Type</th>
                                    <th className="p-4 font-semibold text-right">Total Price</th>
                                    <th className="p-4 font-semibold text-right">Approve Price</th>
                                    <th className="p-4 font-semibold text-right">Discount</th>
                                    <th className="p-4 font-semibold text-center">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {data.map((record, index) => (
                                    <tr
                                        key={`${record.GalleryID}-${index}`}
                                        className="hover:bg-slate-700/30 transition-colors duration-150 group"
                                    >
                                        <td className="p-4 font-medium text-slate-200 group-hover:text-white">
                                            {record.Name}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${record.Insurance === 1
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {record.Insurance === 1 ? 'Insurance' : 'Cash'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-300">
                                            {formatCurrency(record['T.price'])}
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-300">
                                            {formatCurrency(record.ApprovePrice)}
                                        </td>
                                        <td className="p-4 text-right font-mono text-rose-300">
                                            {formatCurrency(record.InsuranceDiscount + record.CACHDiscount)}
                                        </td>
                                        <td className="p-4 text-center font-mono text-slate-400">
                                            {record.Quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}

// Sub-components
function SummaryCard({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
    return (
        <div className="relative group p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 transition-all duration-300 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                <span className="text-2xl grayscale group-hover:grayscale-0 transition-all duration-300">{icon}</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
                {value}
            </div>
        </div>
    );
}

// Helpers
function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Changed to SAR if Saudi Riyal, defaulting USD for now or convert to user locale
        maximumFractionDigits: 0
    }).format(value);
}
