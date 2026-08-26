import { useState } from "react";
import RatingStars from "./RatingStars";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { reviewApi } from "../../services/api/review.api";
import { getErrorMessage } from "../../utils/errorHandler";

/**
 * `targetType` is one of "room" | "owner" | "roommate" (see feature spec
 * §11 Reviews & Reputation) and `targetId` the id being reviewed.
 */
export default function ReviewForm({ targetType, targetId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a star rating");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await reviewApi.create({ targetType, targetId, rating, comment });
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Write a review</h2>

      {error && <ErrorMessage message={error} />}

      <div>
        <p className="mb-1 text-sm text-gray-600">Your rating</p>
        <RatingStars value={rating} onChange={setRating} size="lg" />
      </div>

      <Textarea
        label="Your review"
        placeholder="Share details about your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <Button type="submit" loading={submitting}>Submit review</Button>
    </form>
  );
}
