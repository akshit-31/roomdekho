import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, MessageCircle, Wallet, ArrowRight } from "lucide-react";
import heroImage from "../../assets/images/hero-room.jpg";
import placeholderRoom from "../../assets/images/placeholder-room.jpg";
import SearchBar from "../../components/search/SearchBar";
import PropertyGrid from "../../components/property/PropertyGrid";
import RoommateGrid from "../../components/roommate/RoommateGrid";
import RotatingWord from "../../components/layout/RotatingWord";
import { useAuth } from "../../hooks/useAuth";
import { recommendationApi } from "../../services/api/recommendation.api";
import { searchApi } from "../../services/api/search.api";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "AI-matched roommates",
    desc: "A compatibility score based on budget, schedule, and lifestyle — not guesswork.",
    tint: "highlight-blue",
  },
  {
    icon: ShieldCheck,
    title: "Verified listings & users",
    desc: "KYC-backed owners and duplicate/scam detection keep the marketplace trustworthy.",
    tint: "highlight-green",
  },
  {
    icon: MessageCircle,
    title: "Everything in one chat",
    desc: "Message owners and roommates, schedule visits, and split expenses — no app-switching.",
    tint: "highlight-purple",
  },
  {
    icon: Wallet,
    title: "Built-in expense tools",
    desc: "Rent calculators and expense splitting so shared living stays simple.",
    tint: "highlight-amber",
  },
];


const DEMO_ROOMS = [
  {
    _id: "demo-room-1",
    title: "Modern room near Metro",
    rent: 8500,
    isVerified: true,
    media: [{ url: placeholderRoom }],
    address: { locality: "Sector 62", city: "Noida" },
    occupancy: { genderPreference: "any" },
  },
  {
    _id: "demo-room-2",
    title: "Furnished room in a quiet area",
    rent: 9500,
    isVerified: true,
    media: [{ url: placeholderRoom }],
    address: { locality: "Laxmi Nagar", city: "Delhi" },
    occupancy: { genderPreference: "any" },
  },
  {
    _id: "demo-room-3",
    title: "Bright room for working professionals",
    rent: 7800,
    isVerified: true,
    media: [{ url: placeholderRoom }],
    address: { locality: "Vaishali", city: "Ghaziabad" },
    occupancy: { genderPreference: "male" },
  },
  {
    _id: "demo-room-4",
    title: "Comfortable shared flat",
    rent: 11000,
    isVerified: true,
    media: [{ url: placeholderRoom }],
    address: { locality: "Indirapuram", city: "Ghaziabad" },
    occupancy: { genderPreference: "any" },
  },
];

const TICKER_ITEMS = [
  "Verified rooms",
  "Smart roommate matches",
  "Easy visit booking",
  "Secure conversations",
  "Simple shared expenses",
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const { data } = await recommendationApi.home();
          setRooms(data.data.recommendedRooms || []);
          setRoommates(data.data.compatibleRoommates || []);
        } else {
          const { data } = await searchApi.searchRooms({
            sortBy: "relevance",
            limit: 6,
          });
          setRooms((data.data.items && data.data.items.length) ? data.data.items : DEMO_ROOMS);
        }
      } catch {
        setRooms(isAuthenticated ? [] : DEMO_ROOMS);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isAuthenticated]);

  const handleSearch = (q) => navigate(`/rooms?q=${encodeURIComponent(q)}`);

  return (
    <div>
      <section className="hero-section">
        <img src={heroImage} alt="A comfortable room" className="hero-image" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-kicker">
              <span className="hero-kicker-dot" />
              A better way to find shared living
            </span>

            <h1>
              Find your <RotatingWord words={["room.", "roommate."]} />
            </h1>

            <p>
              Search verified rooms and PGs, then find people who actually fit
              your budget, schedule, and lifestyle.
            </p>

            <SearchBar onSearch={handleSearch} />

            <div className="hero-mini-links">
              <button onClick={() => navigate("/rooms")}>
                Browse rooms <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate("/roommates")}>
                Meet roommates <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>Live marketplace</span>
              <span className="hero-live">
                <i /> Active
              </span>
            </div>
            <div className="hero-card-number">Find a place that feels right.</div>
            <div className="hero-card-line">
              Rooms <span /> Roommates <span /> Matches
            </div>
          </div>
        </div>

        <div className="hero-ticker-wrap">
          <div className="hero-ticker">
            <div className="hero-ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
                <span key={`${item}-${index}`}>
                  <b>✦</b>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-highlights mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, tint }) => (
            <div
              key={title}
              className={`home-highlight-card ${title === "Verified listings & users" ? "verified-card" : ""} rounded-2xl p-5 transition duration-200 hover:-translate-y-1`}
            >
              <span className={`inline-flex rounded-xl p-2.5 ${tint}`}>
                <Icon size={20} />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="recent-rooms-section mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="recent-rooms-header">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isAuthenticated ? "Recommended for you" : "Recently listed rooms"}
            </h2>
            <p>Fresh listings with clear rent, location and verification details.</p>
          </div>
          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate("/rooms")}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View all rooms →
            </button>
          )}
        </div>
        <PropertyGrid rooms={rooms} loading={loading} />
      </section>

      {isAuthenticated && roommates.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Compatible roommates for you
          </h2>
          <RoommateGrid
            roommates={roommates.map((m) => ({
              _id: m.userId,
              name: m.name,
              avatarUrl: m.avatarUrl,
            }))}
            matchesById={Object.fromEntries(
              roommates.map((m) => [m.userId, m])
            )}
          />
        </section>
      )}
    </div>
  );
}
