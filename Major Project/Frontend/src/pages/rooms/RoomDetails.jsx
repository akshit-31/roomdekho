import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import PropertyGallery from "../../components/property/PropertyGallery";
import PropertyInfo from "../../components/property/PropertyInfo";
import PropertyAmenities from "../../components/property/PropertyAmenities";
import PropertyRules from "../../components/property/PropertyRules";
import PropertyOwner from "../../components/property/PropertyOwner";
import PropertyMap from "../../components/property/PropertyMap";
import PropertyStatus from "../../components/property/PropertyStatus";
import FavoriteButton from "../../components/property/FavoriteButton";
import RatingSummary from "../../components/reviews/RatingSummary";
import ReviewCard from "../../components/reviews/ReviewCard";
import ReviewForm from "../../components/reviews/ReviewForm";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import { propertyApi } from "../../services/api/property.api";
import { reviewApi } from "../../services/api/review.api";
import { recommendationApi } from "../../services/api/recommendation.api";
import PropertyGrid from "../../components/property/PropertyGrid";
import { useAuth } from "../../hooks/useAuth";

export default function RoomDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: roomRes }, { data: reviewRes }, { data: similarRes }] = await Promise.all([
        propertyApi.getOne(id),
        reviewApi.listForTarget("room", id).catch(() => ({ data: [] })),
        recommendationApi.similar(id).catch(() => ({ data: [] })),
      ]);
      setRoom(roomRes.data);
      setReviews(reviewRes.data || []);
      setSimilar(similarRes.data || []);
    } catch (err) {
      setError("This listing couldn't be loaded — it may have been removed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loader label="Loading listing..." />;
  if (error || !room) return <div className="mx-auto max-w-2xl px-4 py-12"><ErrorMessage message={error} onRetry={load} /></div>;

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 text-white">
      <div className="mb-6 flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <PropertyStatus status={room.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">{room.title}</h1>
          <p className="mt-1 text-sm sm:text-base font-medium text-slate-300">{room.address?.locality}, {room.address?.city}</p>
        </div>
        <FavoriteButton roomId={room._id} className="static shadow-md" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <PropertyGallery media={room.media} />
          <PropertyInfo room={room} />
          <PropertyAmenities amenities={room.amenities} />
          <PropertyRules rules={room.houseRules} />
          <PropertyMap location={room.location} title={room.title} />

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-white">
            <h2 className="mb-3 text-base sm:text-lg font-extrabold text-white">Reviews & Ratings</h2>
            <RatingSummary average={average} count={reviews.length} />
            <div className="mt-4 space-y-3">
              {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            </div>
            {isAuthenticated && (
              <div className="mt-4">
                <ReviewForm targetType="room" targetId={room._id} onSubmitted={load} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PropertyOwner owner={room.owner} roomId={room._id} />

          <Link to={`/visits?scheduleRoomId=${room._id}`}>
            <Button variant="secondary" icon={CalendarClock} className="w-full !border-white/20 !bg-slate-900/80 !text-white hover:!bg-white/10 rounded-2xl py-3 font-bold backdrop-blur-md">
              Schedule a visit
            </Button>
          </Link>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="mb-6 text-xl sm:text-2xl font-black text-white">Similar rooms nearby</h2>
          <PropertyGrid rooms={similar} />
        </div>
      )}
    </div>
  );
}
