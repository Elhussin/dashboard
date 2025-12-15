"use client";

import { SalesRecord } from "../types/sales";
import { motion } from "framer-motion";
import { formatCurrency } from "@/app/utils";
import { SummaryCard } from "./SummaryCard";
interface SalesDashboardProps {
  data: SalesRecord[];
}

export default function SalesDashboard({ data }: SalesDashboardProps) {
  // Calculate Totals
  const totalRevenue = data.reduce((acc, curr) => acc + curr["T.price"], 0);
  const totalQuantity = data.reduce((acc, curr) => acc + curr.Quantity, 0);
  const totalInsuranceDiscount = data.reduce(
    (acc, curr) => acc + curr.InsuranceDiscount,
    0
  );
  const totalApproved = data.reduce((acc, curr) => acc + curr.ApprovePrice, 0);
  const totalCACHDiscount = data.reduce(
    (acc, curr) => acc + curr.CACHDiscount,
    0
  );
  const totalDiscount = totalCACHDiscount + totalInsuranceDiscount;
  const totalCash = data.reduce(
    (acc, curr) => (curr.Insurance === 0 ? acc + curr["T.price"] : acc),
    0
  );

  const totalDIFRENT = data.reduce((acc, curr) => acc + curr.DIFRENT, 0);
  const totalDeductible1 = data.reduce(
    (acc, curr) => acc + curr.Deductible1,
    0
  );
  const totalExpr1 = data.reduce((acc, curr) => acc + curr.Expr1, 0);
  const totalPUPADESCOUNT = data.reduce(
    (acc, curr) => acc + curr.PUPADESCOUNT,
    0
  );
  const totalpuba27 = data.reduce((acc, curr) => acc + curr["puba .27"], 0);
  const totalTAW = data.reduce((acc, curr) => acc + curr.TAW, 0);
  const totalAXA = data.reduce((acc, curr) => acc + curr.AXA, 0);
  const netTotal = totalRevenue - totalDiscount;

  return (
    <>
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
              <h1 className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Sales Overview
              </h1>
              <p className="text-slate-400 mt-2">
                Real-time financial performance metrics
              </p>
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
              title="Discount"
              value={formatCurrency(totalDiscount)}
              icon="🛡️"
              color="from-rose-500 to-pink-500"
            />
            <SummaryCard
              title="Net Revenue"
              value={formatCurrency(netTotal)}
              icon="🛡️"
              color="from-rose-500 to-pink-500"
            />
            <SummaryCard
              title="Total Cash"
              value={formatCurrency(totalCash)}
              icon="💰"
              color="from-blue-500 to-cyan-500"
            />
            <SummaryCard
              title="Total DIFRENT Price"
              value={formatCurrency(totalDIFRENT)}
              icon="📦"
              color="from-emerald-500 to-teal-500"
            />
            <SummaryCard
              title="Total Deductible1 Price"
              value={formatCurrency(totalDeductible1)}
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
                    <th className="p-4 font-semibold text-left">
                      Total Price
                    </th>
                    <th className="p-4 font-semibold text-left">
                      Approve Price
                    </th>
                    <th className="p-4 font-semibold text-left">Discount</th>
                    <th className="p-4 font-semibold text-left">DIFRENT</th>
                    <th className="p-4 font-semibold text-left">
                      Deductible
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 ">
                  {data.map((record, index) => (
                    <tr
                      key={`${record.GalleryID}-${index}`}
                      className="hover:bg-slate-700/30 transition-colors duration-150 group "
                    >
                      <td className="p-4 font-medium text-slate-200 group-hover:text-white">
                        {record.Name}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold ${
                            record.Insurance === 1
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {record.Insurance === 1 ? "Insurance" : "Cash"}
                        </span>
                      </td>
                      <td className="p-4 text-left font-mono text-slate-300 ">
                        {formatCurrency(record["T.price"])}
                      </td>
                      <td className="p-4 text-left font-mono text-slate-300">
                        {formatCurrency(record.ApprovePrice)}
                      </td>
                      <td className="p-4 text-left font-mono text-rose-300">
                        {formatCurrency(
                          record.InsuranceDiscount + record.CACHDiscount
                        )}
                      </td>
                      <td className="p-4 text-left font-mono text-rose-300">
                        {formatCurrency(record.DIFRENT)}
                      </td>
                      <td className="p-4 text-left font-mono text-rose-300">
                        {formatCurrency(record.Deductible1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

