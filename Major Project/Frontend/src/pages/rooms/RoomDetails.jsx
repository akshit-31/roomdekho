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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <PropertyStatus status={room.status} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{room.title}</h1>
          <p className="text-sm text-gray-500">{room.address?.locality}, {room.address?.city}</p>
        </div>
        <FavoriteButton roomId={room._id} className="static shadow-sm" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <PropertyGallery media={room.media} />
          <PropertyInfo room={room} />
          <PropertyAmenities amenities={room.amenities} />
          <PropertyRules rules={room.houseRules} />
          <PropertyMap location={room.location} title={room.title} />

          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Reviews</h2>
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
            <Button variant="secondary" icon={CalendarClock} className="w-full">
              Schedule a visit
            </Button>
          </Link>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Similar rooms nearby</h2>
          <PropertyGrid rooms={similar} />
        </div>
      )}
    </div>
  );
}
