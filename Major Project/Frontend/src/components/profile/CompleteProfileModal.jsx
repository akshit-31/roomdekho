import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  MapPin,
  Sparkles,
  Navigation,
  CheckCircle2,
  ShieldAlert,
  User,
  Briefcase,
  IndianRupee,
  Moon,
  Utensils
} from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { userApi } from "../../services/api/user.api";
import { fetchMe } from "../../store/user/user.store";

const INDIAN_CITIES = [
  "Delhi",
  "Noida",
  "Gurgaon",
  "Bengaluru",
  "Jaipur",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chandigarh",
  "Kolkata"
];

const GENDER_OPTIONS = ["male", "female", "other"];
const FOOD_OPTIONS = ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"];
const SLEEP_OPTIONS = ["Early Bird", "Night Owl", "Flexible"];
const CLEANLINESS_OPTIONS = ["High", "Moderate"];
const OCCUPATION_OPTIONS = [
  "Working Professional",
  "Software Engineer",
  "Student / College",
  "Product Designer",
  "Marketing & Sales",
  "Data Analyst",
  "Financial Consultant",
  "Doctor / Healthcare",
  "Freelancer / Creator",
  "Other"
];

export default function CompleteProfileModal({ isOpen, user }) {
  const dispatch = useDispatch();
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      gender: user?.gender || "male",
      age: user?.age || 23,
      occupation: user?.occupation || "Working Professional",
      bio: user?.bio || "",
      city: user?.preferredLocations?.[0] || user?.property_city || "Delhi",
      locality: user?.preferredLocations?.[1] || user?.property_locality || "",
      budgetMin: user?.budgetMin || 6000,
      budgetMax: user?.budgetMax || 16000,
      foodPreference: user?.foodPreference || "Vegetarian",
      sleepSchedule: user?.sleepSchedule || "Night Owl",
      cleanliness: user?.cleanliness || "High",
      smoking: user?.smoking || false,
      pets: user?.pets || false,
    },
  });

  const city = watch("city");

  // Geolocation detection handler
  const handleDetectLocation = () => {
    setLocationError(null);
    setLocationSuccess(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Please select your city manually.");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.state_district ||
            data.address?.town ||
            data.address?.county ||
            "Delhi";
          const detectedLocality =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.road ||
            "";

          setValue("city", detectedCity);
          if (detectedLocality) setValue("locality", detectedLocality);
          setLocationSuccess(`Location detected: ${detectedLocality ? detectedLocality + ", " : ""}${detectedCity}`);
        } catch {
          // Fallback
          setLocationSuccess(`Device GPS coordinates locked (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        if (err.code === 1) {
          setLocationError("Location permission denied. Please select your city and locality manually.");
        } else {
          setLocationError("Unable to retrieve device location. Please select your city manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const preferredLocations = [data.city];
      if (data.locality) preferredLocations.push(data.locality);

      const payload = {
        gender: data.gender,
        age: parseInt(data.age, 10),
        occupation: data.occupation,
        bio: data.bio || `Hi, I am living in ${data.city}. Looking for like-minded people.`,
        budgetMin: Number(data.budgetMin),
        budgetMax: Number(data.budgetMax),
        preferredLocations,
        foodPreference: data.foodPreference,
        sleepSchedule: data.sleepSchedule,
        cleanliness: data.cleanliness,
        smoking: Boolean(data.smoking),
        pets: Boolean(data.pets),
      };

      await userApi.updateProfile(payload);
      // Refresh redux user state so isProfileCompleted becomes true
      await dispatch(fetchMe());
    } catch (err) {
      setServerError(err?.response?.data?.message || err?.message || "Failed to save profile. Please check all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Heavy Blurred Backdrop (Non-dismissible) */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl animate-fade-in" />

      {/* Modal Dialog Card */}
      <div className="relative my-auto w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 p-5 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white z-10 animate-scale-up">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

        {/* Modal Header */}
        <div className="mb-4 flex flex-col items-center text-center shrink-0 border-b border-white/10 pb-4">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-400/20 to-amber-500/30 shadow-lg">
            <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>
          <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-0.5 text-[11px] font-bold text-amber-300 mb-1">
            ✨ Mandatory First-Time Setup
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">Complete Your Profile</h2>
          <p className="mt-1 text-xs text-slate-300 max-w-md">
            RoomDekho requires your location and lifestyle preferences to show verified rooms and match compatible roommates.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 shrink-0">
            <ErrorMessage message={serverError} />
          </div>
        )}

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
          {/* STEP 1: DEVICE LOCATION */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <MapPin size={15} /> 1. Location & City
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Navigation size={13} className={detectingLocation ? "animate-spin" : ""} />
                {detectingLocation ? "Detecting GPS..." : "Auto-Detect GPS"}
              </button>
            </div>

            {locationSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-2 text-xs text-emerald-300">
                <CheckCircle2 size={15} />
                <span>{locationSuccess}</span>
              </div>
            )}

            {locationError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/30 p-2 text-xs text-rose-300">
                <ShieldAlert size={15} />
                <span>{locationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Preferred City *</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  {...register("city", { required: "City is required" })}
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Locality / Area *"
                placeholder="e.g. Karol Bagh / Sector 62 / Koramangala"
                error={errors.locality?.message}
                {...register("locality", { required: "Locality is required" })}
              />
            </div>
          </div>

          {/* STEP 2: PERSONAL IDENTITY */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <User size={15} /> 2. Personal & Professional Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Gender *</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none capitalize"
                  {...register("gender", { required: true })}
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-white capitalize">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Age (Years) *"
                type="number"
                min="18"
                max="80"
                placeholder="23"
                error={errors.age?.message}
                {...register("age", { required: "Age is required" })}
              />

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Occupation *</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  {...register("occupation", { required: true })}
                >
                  {OCCUPATION_OPTIONS.map((o) => (
                    <option key={o} value={o} className="bg-slate-900 text-white">
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">About Yourself (Bio) *</label>
              <textarea
                rows={2}
                placeholder="A couple sentences about your routine, personality, or what you're looking for..."
                className="w-full rounded-xl border border-white/20 bg-slate-800 p-2.5 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                {...register("bio", { required: "Please provide a short bio" })}
              />
              {errors.bio && <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>}
            </div>
          </div>

          {/* STEP 3: BUDGET & LIFESTYLE */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <IndianRupee size={15} /> 3. Budget Range & Lifestyle Habits
            </span>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Budget (₹ / mo) *"
                type="number"
                step="500"
                placeholder="6000"
                {...register("budgetMin", { required: true })}
              />
              <Input
                label="Max Budget (₹ / mo) *"
                type="number"
                step="500"
                placeholder="16000"
                {...register("budgetMax", { required: true })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Food Habit</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  {...register("foodPreference")}
                >
                  {FOOD_OPTIONS.map((f) => (
                    <option key={f} value={f} className="bg-slate-900 text-white">
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Sleep Routine</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  {...register("sleepSchedule")}
                >
                  {SLEEP_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Cleanliness Level</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  {...register("cleanliness")}
                >
                  {CLEANLINESS_OPTIONS.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-1 text-xs text-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-white/20 text-amber-500 focus:ring-0 bg-slate-800"
                  {...register("smoking")}
                />
                <span>Smoker friendly</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-white/20 text-amber-500 focus:ring-0 bg-slate-800"
                  {...register("pets")}
                />
                <span>Pet friendly</span>
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full !bg-amber-500 hover:!bg-amber-600 font-extrabold text-sm py-3 shadow-lg shadow-amber-500/20"
              loading={isSubmitting}
            >
              Save Profile & Start Exploring Rooms
            </Button>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              🔒 All details can be updated anytime from your Profile settings.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

