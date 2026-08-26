import { Ban } from "lucide-react";

export default function PropertyRules({ rules = [] }) {
  if (!rules.length) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">House rules</h2>
      <ul className="space-y-2">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <Ban size={15} className="mt-0.5 shrink-0 text-gray-400" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
