import { useForm } from "react-hook-form";
import { useState } from "react";
import { MapPin, Navigation, User, Phone, Briefcase, Calendar } from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import defaultAvatar from "/images/default-avatar.jpg";
import { api } from "../../services/api/axios";

const GENDER_OPTIONS = ["male", "female", "other"];
const CITIES = [
  "Delhi",
  "Noida",
  "Gurgaon",
  "Bengaluru",
  "Jaipur",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chandigarh",
  "Kolkata",
  "Other"
];

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
  "Property Owner",
  "Other"
];

export default function ProfileForm({ initialValues, onSubmit }) {
  const [preview, setPreview] = useState(initialValues?.avatarUrl || initialValues?.avatar);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(null);

  const isOwner = initialValues?.role === "owner";
  const defaultCity =
    initialValues?.city ||
    initialValues?.propertyCity ||
    initialValues?.preferredLocations?.[0] ||
    "Delhi";
  const defaultLocality =
    initialValues?.locality ||
    initialValues?.propertyLocality ||
    initialValues?.preferredLocations?.[1] ||
    "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      bio: initialValues?.bio || "",
      gender: initialValues?.gender || "male",
      age: initialValues?.age || 23,
      dob: initialValues?.dob || "",
      occupation: initialValues?.occupation || (isOwner ? "Property Owner" : "Working Professional"),
      city: defaultCity,
      locality: defaultLocality,
      intent: initialValues?.intent || initialValues?.lookingFor || "both",
      propertyAddress: initialValues?.propertyAddress || "",
      avatarUrl: initialValues?.avatarUrl || initialValues?.avatar || "",
    },
  });

  const handleAvatarPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.data?.avatarUrl) setValue("avatarUrl", data.data.avatarUrl);
    } catch {
      // preview stays locally
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    setLocationSuccess(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.state_district ||
            data.address?.town ||
            "Delhi";
          const detectedLoc =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.road ||
            "";
          setValue("city", detectedCity);
          if (detectedLoc) setValue("locality", detectedLoc);
          setLocationSuccess(`Detected: ${detectedLoc ? detectedLoc + ", " : ""}${detectedCity}`);
        } catch {
          setLocationSuccess(`GPS locked (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        } finally {
          setDetectingLocation(false);
        }
      },
      () => setDetectingLocation(false),
      { timeout: 8000 }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
      {/* Avatar Section */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-amber-100 bg-amber-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            initialValues?.name?.[0]?.toUpperCase() || "U"
          )}
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          </label>
          <p className="mt-1 text-[11px] text-slate-400">JPG, PNG or WebP</p>
          <input type="hidden" {...register("avatarUrl")} />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" {...register("name", { required: true })} />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          {...register("phone")}
        />
      </div>

      {/* Gender & Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Gender</label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 capitalize focus:border-amber-400 focus:outline-none"
            {...register("gender")}
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g} className="capitalize">
                {g}
              </option>
            ))}
          </select>
        </div>

        <Input label="Age (Years)" type="number" min="18" max="80" {...register("age")} />
      </div>

      {/* Profession & Intent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Profession / Occupation</label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-400 focus:outline-none"
            {...register("occupation")}
          >
            {OCCUPATION_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {!isOwner && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Looking For</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-400 focus:outline-none"
              {...register("intent")}
            >
              <option value="find_room">🏠 Finding a Room</option>
              <option value="find_roommate">👥 Finding a Roommate</option>
              <option value="both">✨ Both (Room & Roommate)</option>
            </select>
          </div>
        )}
      </div>

      {/* Location / City with GPS Button */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin size={14} className="text-amber-500" /> {isOwner ? "Property City & Locality" : "Target City / Location"}
          </span>
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={detectingLocation}
            className="flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-500/30 transition-all disabled:opacity-50"
          >
            <Navigation size={11} className={detectingLocation ? "animate-spin" : ""} />
            {detectingLocation ? "Detecting..." : "Detect Device GPS"}
          </button>
        </div>

        {locationSuccess && (
          <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            ✓ {locationSuccess}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">City</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-amber-400 focus:outline-none"
              {...register("city")}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input label="Locality / Sector" placeholder="e.g. Saket Metro" {...register("locality")} />
        </div>
      </div>

      {isOwner && (
        <Input
          label="Full Property Address"
          placeholder="House/Flat number, Street name"
          {...register("propertyAddress")}
        />
      )}

      {/* Bio */}
      <Textarea
        label="About Me / Bio"
        placeholder="Tell potential roommates or tenants a bit about yourself..."
        rows={3}
        {...register("bio")}
      />

      <div className="pt-2">
        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full !bg-amber-500 hover:!bg-amber-600 font-bold"
        >
          Save Profile Credentials
        </Button>
      </div>
    </form>
  );
}
