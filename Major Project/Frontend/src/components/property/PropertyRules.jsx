import { Ban } from "lucide-react";

export default function PropertyRules({ rules = [] }) {
  if (!rules.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-white">
      <h2 className="mb-3 text-sm sm:text-base font-extrabold text-white">House rules</h2>
      <ul className="space-y-2">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-300">
            <Ban size={15} className="mt-0.5 shrink-0 text-rose-400" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
