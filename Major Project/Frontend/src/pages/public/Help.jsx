import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "How does the roommate compatibility score work?",
    a: "We compare budget, preferred location, food habits, sleep/work schedule, cleanliness, noise tolerance, smoking, pets, and personality tags between two users, and combine them into a weighted 0-100 score with a plain-English explanation.",
  },
  {
    q: "How do I know a listing or owner is verified?",
    a: "Verified owners have completed KYC (ID + selfie review). Look for the verified badge on the listing and owner profile.",
  },
  {
    q: "Can I message an owner before scheduling a visit?",
    a: "Yes — every room page has a \"Message owner\" button that opens a real-time chat.",
  },
  {
    q: "How do I split expenses with my roommate?",
    a: "Once you're sharing a place, use the Expenses page to split rent, electricity, WiFi, and food costs equally or by custom shares.",
  },
  {
    q: "How do I report a suspicious listing or user?",
    a: "Use the report option on the listing or profile page. Our trust & safety team reviews every report.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="text-sm font-medium text-gray-900">{q}</span>
        <ChevronDown size={18} className={clsx("shrink-0 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="mt-2 text-sm text-gray-500">{a}</p>}
    </div>
  );
}

export default function Help() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
      <p className="mt-2 text-sm text-gray-500">Answers to common questions. Can't find yours?</p>

      <div className="mt-6">
        {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
      </div>

      <Link
        to="/contact"
        className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Mail size={16} /> Contact support
      </Link>
    </div>
  );
}
