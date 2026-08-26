import { Home, Users, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">About Room Searcher &amp; Roommate</h1>
      <p className="mt-4 text-sm leading-relaxed text-gray-600">
        Most rental platforms only solve half the problem — they help you find a room, but leave you to
        gamble on who you'll be sharing it with. We built Room Searcher &amp; Roommate to treat both
        decisions as one: the same search should surface a place you can afford and a person you'll
        actually get along with.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { icon: Home, title: "Verified listings", desc: "Every room is tied to a KYC-checked owner, with fraud and duplicate detection running in the background." },
          { icon: Users, title: "AI-matched roommates", desc: "Compatibility scoring across budget, schedule, cleanliness, and lifestyle — with a plain-English explanation for every match." },
          { icon: ShieldCheck, title: "Trust by default", desc: "Reviews, reputation scores, and in-app reporting keep both sides of the marketplace accountable." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5">
            <Icon className="text-brand-500" size={22} />
            <h3 className="mt-3 text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-gray-600">
        We're early — this platform is under active development. If something looks off or you have ideas
        for what would make shared living easier, we'd love to hear from you on the{" "}
        <a href="/contact" className="font-medium text-brand-600 hover:underline">Contact</a> page.
      </p>
    </div>
  );
}
