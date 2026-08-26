import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, MapPin, MessageCircle, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Loader from "../../components/common/Loader";
import { matchApi } from "../../services/api/match.api";

const DEMO_MATCHES = [
  {
    id: "demo-1",
    name: "Aarav",
    city: "Noida",
    score: 94,
    label: "Excellent match",
    budget: "₹8,000 – ₹10,000",
    routine: "Morning person",
    lifestyle: "Clean • Quiet • Non-smoker",
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "demo-2",
    name: "Riya",
    city: "Delhi",
    score: 89,
    label: "Great match",
    budget: "₹9,000 – ₹12,000",
    routine: "Flexible schedule",
    lifestyle: "Social • Organized • Vegetarian",
    color: "from-violet-500 to-fuchsia-400",
  },
  {
    id: "demo-3",
    name: "Kunal",
    city: "Ghaziabad",
    score: 84,
    label: "Good match",
    budget: "₹7,000 – ₹9,000",
    routine: "Early sleeper",
    lifestyle: "Friendly • Clean • Non-smoker",
    color: "from-emerald-500 to-teal-400",
  },
];

const avatarColors = ["#dbeafe", "#f3e8ff", "#d1fae5"];

function normaliseMatches(data) {
  return (data || []).map((candidate, index) => ({
    id: candidate.userId || candidate._id || `match-${index}`,
    name: candidate.name || "Roommate",
    city: candidate.city || candidate.location || "Nearby",
    score: Math.round(candidate.score || 0),
    label:
      candidate.score >= 90
        ? "Excellent match"
        : candidate.score >= 80
          ? "Great match"
          : "Good match",
    budget: candidate.budget || "Budget not added",
    routine: candidate.sleepSchedule || candidate.workSchedule || "Flexible schedule",
    lifestyle: candidate.lifestyle || "Lifestyle preferences match",
    avatarUrl: candidate.avatarUrl,
  }));
}

export default function MyMatches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState({});

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      try {
        const response = await matchApi.topMatches(8);
        const apiMatches = normaliseMatches(response?.data?.data);

        if (active && apiMatches.length) {
          setMatches(apiMatches);
          return;
        }
      } catch {
        // Frontend can still be previewed without the backend.
      } finally {
        if (active) setLoading(false);
      }

      if (active) setMatches(DEMO_MATCHES);
    }

    loadMatches();

    return () => {
      active = false;
    };
  }, []);

  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => b.score - a.score),
    [matches]
  );

  if (loading && !matches.length) {
    return <Loader label="Finding your best matches..." />;
  }

  return (
    <PageContainer
      title="My Matches"
      subtitle="People who match your budget, routine and lifestyle."
    >
      <div className="matches-page">
        <div className="matches-summary">
          <div>
            <div className="matches-summary-icon">
              <Sparkles size={19} />
            </div>
            <div>
              <p className="matches-summary-title">Your best matches</p>
              <p className="matches-summary-text">
                Higher scores mean a better overall lifestyle match.
              </p>
            </div>
          </div>
          <span className="matches-count">
            {sortedMatches.length} matches
          </span>
        </div>

        <div className="matches-grid">
          {sortedMatches.map((match, index) => (
            <article className="match-profile-card" key={match.id}>
              <div className={`match-cover bg-gradient-to-r ${match.color || DEMO_MATCHES[index % DEMO_MATCHES.length].color}`} />

              <div className="match-card-body">
                <div className="match-avatar-wrap">
                  {match.avatarUrl ? (
                    <img src={match.avatarUrl} alt={match.name} className="match-avatar" />
                  ) : (
                    <div
                      className="match-avatar match-avatar-fallback"
                      style={{ background: avatarColors[index % avatarColors.length] }}
                    >
                      {match.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="match-online-dot" />
                </div>

                <div className="match-card-heading">
                  <div>
                    <h2>{match.name}</h2>
                    <p>
                      <MapPin size={13} />
                      {match.city}
                    </p>
                  </div>
                  <div className="match-score-badge">
                    <strong>{match.score}%</strong>
                    <span>match</span>
                  </div>
                </div>

                <div className="match-tags">
                  <span>{match.budget}</span>
                  <span>{match.routine}</span>
                  <span>{match.lifestyle}</span>
                </div>

                <div className="match-card-actions">
                  <button
                    type="button"
                    className={connected[match.id] ? "match-connect connected" : "match-connect"}
                    onClick={() =>
                      setConnected((current) => ({
                        ...current,
                        [match.id]: !current[match.id],
                      }))
                    }
                  >
                    {connected[match.id] ? <MessageCircle size={16} /> : <Heart size={16} />}
                    {connected[match.id] ? "Interested" : "Connect"}
                  </button>

                  <button
                    type="button"
                    className="match-view"
                    onClick={() => navigate("/roommates")}
                  >
                    View roommate
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="matches-footer-note">
          <Users size={18} />
          <span>
            Complete your roommate preferences to make these matches more accurate.
          </span>
          <button type="button" onClick={() => navigate("/profile/preferences")}>
            Update preferences
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
