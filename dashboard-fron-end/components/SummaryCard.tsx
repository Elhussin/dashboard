// Sub-components
export function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="relative group p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 transition-all duration-300 overflow-hidden">
      <div
        className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all duration-300">
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">
        {value}
      </div>
    </div>
  );
}

