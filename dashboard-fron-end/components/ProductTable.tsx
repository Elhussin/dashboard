import { formatCurrency } from "@/app/utils";
import { motion } from "framer-motion";
import { SummaryCard } from "./SummaryCard";
const ProductTable = ({ data }: { data: any[] }) => {
  const TotalRetailPrice = data.reduce(
    (acc, item) => acc + item.RetailPrice,
    0
  );
  const TotalCostPrice = data.reduce((acc, item) => acc + item.CostPrice, 0);
  const TotalQuantity = data.reduce((acc, item) => acc + item.Expr1, 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-slate-900 text-white p-8 font-sans"
      >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Retail Price"
          value={formatCurrency(TotalRetailPrice)}
          icon=""
          color=""
        />
        <SummaryCard
          title="Total Cost Price"
          value={formatCurrency(TotalCostPrice)}
          icon=""
          color=""
        />
        <SummaryCard
          title="Total Quantity"
          value={TotalQuantity}
          icon=""
          color=""
        />
        </div>
        <div className="bg-slate-800 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold text-left"> CostPrice </th>
                  <th className="p-4 font-semibold text-left">RetailPrice</th>
                  <th className="p-4 font-semibold text-left">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 ">
                {data.map((item, index) => (
                  <tr
                    key={`${item.Code}-${index}`}
                    className="hover:bg-slate-700/30 transition-colors duration-150 group "
                  >
                    <td className="p-4 font-medium text-slate-200 group-hover:text-white">
                      {item.Code}
                    </td>
                    <td className="p-4 text-left font-mono text-slate-300 ">
                      {item.Description}
                    </td>
                    <td className="p-4 text-left font-mono text-slate-300 ">
                      {formatCurrency(item.CostPrice)}
                    </td>
                    <td className="p-4 text-left font-mono text-slate-300">
                      {formatCurrency(item.RetailPrice)}
                    </td>
                    <td className="p-4 text-left font-mono text-rose-300">
                      {item?.Expr1}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductTable;
