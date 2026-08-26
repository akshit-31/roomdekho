import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoommateProfile from "../../components/roommate/RoommateProfile";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { userApi } from "../../services/api/user.api";
import { matchApi } from "../../services/api/match.api";
import { useAuth } from "../../hooks/useAuth";

export default function RoommateDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [roommate, setRoommate] = useState(null);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: profileRes } = await userApi.getPublicProfile(id);
      setRoommate(profileRes.data);

      if (user?.id && user.id !== id) {
        const { data: matchRes } = await matchApi.scoreWith(id);
        setMatch(matchRes.data);
      }
    } catch (err) {
      setError("This profile couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loader label="Loading profile..." />;
  if (error || !roommate) return <div className="mx-auto max-w-2xl px-4 py-12"><ErrorMessage message={error} onRetry={load} /></div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <RoommateProfile roommate={roommate} match={match} />
    </div>
  );
}
