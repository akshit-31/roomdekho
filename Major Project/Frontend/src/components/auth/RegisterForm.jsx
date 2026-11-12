import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  FileText,
  Navigation,
  Sparkles,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  IndianRupee,
  Moon,
  Utensils,
  ChevronRight,
  ChevronLeft,
  DoorOpen,
  Users
} from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errorHandler";
import { isEmail, isStrongPassword } from "../../utils/validators";

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
  "Property Owner",
  "Other"
];

const ID_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Electricity / Utility Bill",
  "Property Tax Receipt",
  "Voter ID",
  "Driving License"
];

export default function RegisterForm({ onSuccess, isModal = false }) {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("seeker"); // "seeker" (User) | "owner"
  const [userIntent, setUserIntent] = useState("both"); // "find_room" | "find_roommate" | "both"
  const [currentStep, setCurrentStep] = useState(1); // 1: Credentials, 2: Profile & Location, 3: Preferences/Verification
  const [serverError, setServerError] = useState(null);
  const [ownerPendingSuccess, setOwnerPendingSuccess] = useState(false);

  // GPS Location detection states
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      gender: "male",
      age: 23,
      occupation: "Working Professional",
      bio: "",
      city: "Delhi",
      locality: "",
      budgetMin: 7000,
      budgetMax: 16000,
      foodPreference: "Vegetarian",
      sleepSchedule: "Night Owl",
      cleanliness: "High",
      smoking: false,
      pets: false,
      propertyAddress: "",
      idProofType: "Aadhaar Card",
      idProofNumber: "",
    },
  });

  const city = watch("city");
  const password = watch("password");

  // GPS Device Location handler
  const handleDetectLocation = () => {
    setLocationError(null);
    setLocationSuccess(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Please select city manually.");
      return;
    }

    setDetectingLocation(true);
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
            data.address?.county ||
            "Delhi";
          const detectedLocality =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.road ||
            "";

          setValue("city", detectedCity);
          if (detectedLocality) setValue("locality", detectedLocality);
          setLocationSuccess(`📍 Detected: ${detectedLocality ? detectedLocality + ", " : ""}${detectedCity}`);
        } catch {
          setLocationSuccess(`📍 GPS coordinates locked (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        if (err.code === 1) {
          setLocationError("Location permission denied. Please choose your city manually.");
        } else {
          setLocationError("Could not retrieve GPS coordinates. Choose city manually.");
        }
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  // Step navigation guards
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger(["name", "email", "phone", "password"]);
      if (valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await trigger(["gender", "age", "occupation", "city"]);
      if (valid) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: selectedRole,
        intent: userIntent,
        lookingFor: userIntent,
        gender: data.gender,
        age: parseInt(data.age, 10) || 23,
        occupation: data.occupation,
        bio: data.bio || (data.city ? `Hi! I am based in ${data.city}. Looking forward to connecting on RoomDekho.` : ""),
        city: data.city,
        locality: data.locality,
        preferredLocations: [data.city, data.locality].filter(Boolean),
      };

      if (selectedRole === "seeker") {
        payload.budgetMin = Number(data.budgetMin) || 6000;
        payload.budgetMax = Number(data.budgetMax) || 16000;
        payload.foodPreference = data.foodPreference;
        payload.sleepSchedule = data.sleepSchedule;
        payload.cleanliness = data.cleanliness;
        payload.smoking = Boolean(data.smoking);
        payload.pets = Boolean(data.pets);
      } else {
        // Owner specific fields
        payload.propertyCity = data.city;
        payload.propertyLocality = data.locality;
        payload.propertyAddress = data.propertyAddress || `${data.locality}, ${data.city}`;
        payload.idProofType = data.idProofType;
        payload.idProofNumber = data.idProofNumber;
      }

      await registerUser(payload).unwrap();

      if (selectedRole === "owner") {
        setOwnerPendingSuccess(true);
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          // If finding room, direct to rooms; if roommate, to roommates; else profile
          if (userIntent === "find_room") {
            navigate("/rooms", { state: { justRegistered: true } });
          } else if (userIntent === "find_roommate") {
            navigate("/roommates", { state: { justRegistered: true } });
          } else {
            navigate("/profile", { state: { justRegistered: true } });
          }
        }
      }
    } catch (err) {
      setServerError(getErrorMessage(err) || err || "Unable to create account");
    }
  };

  // If Owner registration is submitted and pending admin approval
  if (ownerPendingSuccess) {
    return (
      <div className="w-full text-center py-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-xl font-bold text-white">Application Submitted!</h2>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
          Your Room Owner account and property location details have been saved for verification.
        </p>
        <div className="my-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left text-xs text-amber-300 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-amber-200">
            <ShieldCheck size={16} /> Admin Approval in Progress
          </p>
          <p className="text-[11px] text-amber-200/80">
            Our admin team will review your property address and ID details. Once approved, you can log in and publish room listings.
          </p>
        </div>
        <Button
          onClick={() => {
            if (onSuccess) onSuccess();
            navigate("/login");
          }}
          className="w-full !bg-amber-500 hover:!bg-amber-600 font-bold"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Role Selection Tabs - User vs Room Owner (Admin is hidden) */}
      <div className="mb-3.5 flex rounded-2xl border border-white/20 bg-black/30 p-1">
        <button
          type="button"
          onClick={() => {
            setSelectedRole("seeker");
            setValue("occupation", "Working Professional");
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            selectedRole === "seeker"
              ? "bg-amber-500 text-white shadow-md"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <UserCheck size={15} />
          User
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedRole("owner");
            setValue("occupation", "Property Owner");
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            selectedRole === "owner"
              ? "bg-amber-500 text-white shadow-md"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Building2 size={15} />
          Room Owner
        </button>
      </div>

      {/* User Intent Choice - Finding Room, Finding Roommate, Both */}
      {selectedRole === "seeker" && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-slate-800/80 p-2.5">
          <p className="text-[11px] font-bold text-slate-300 mb-1.5 px-1">I am looking for:</p>
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setUserIntent("find_room")}
              className={`flex flex-col sm:flex-row items-center justify-center text-center gap-0.5 sm:gap-1.5 rounded-xl py-1.5 sm:py-2 px-1 text-[10px] sm:text-[11px] font-bold transition-all ${
                userIntent === "find_room"
                  ? "bg-amber-500 text-white ring-2 ring-amber-300/40 shadow-sm"
                  : "bg-black/30 text-slate-300 hover:bg-white/10"
              }`}
            >
              <DoorOpen size={13} className="shrink-0" />
              <span className="leading-tight truncate sm:overflow-visible">Room</span>
            </button>

            <button
              type="button"
              onClick={() => setUserIntent("find_roommate")}
              className={`flex flex-col sm:flex-row items-center justify-center text-center gap-0.5 sm:gap-1.5 rounded-xl py-1.5 sm:py-2 px-1 text-[10px] sm:text-[11px] font-bold transition-all ${
                userIntent === "find_roommate"
                  ? "bg-amber-500 text-white ring-2 ring-amber-300/40 shadow-sm"
                  : "bg-black/30 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Users size={13} className="shrink-0" />
              <span className="leading-tight truncate sm:overflow-visible">Roommate</span>
            </button>

            <button
              type="button"
              onClick={() => setUserIntent("both")}
              className={`flex flex-col sm:flex-row items-center justify-center text-center gap-0.5 sm:gap-1.5 rounded-xl py-1.5 sm:py-2 px-1 text-[10px] sm:text-[11px] font-bold transition-all ${
                userIntent === "both"
                  ? "bg-amber-500 text-white ring-2 ring-amber-300/40 shadow-sm"
                  : "bg-black/30 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Sparkles size={13} className="shrink-0" />
              <span className="leading-tight truncate sm:overflow-visible">Both</span>
            </button>
          </div>
        </div>
      )}

      {/* Step Progress Stepper Bar */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              currentStep === 1
                ? "bg-amber-500 text-white ring-2 ring-amber-400/40"
                : currentStep > 1
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-white/60"
            }`}
          >
            {currentStep > 1 ? "✓" : "1"}
          </span>
          <span className={`text-xs font-semibold ${currentStep === 1 ? "text-amber-300" : "text-white/70"}`}>
            Credentials
          </span>
        </div>

        <div className="h-0.5 w-6 bg-white/20 sm:w-10" />

        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              currentStep === 2
                ? "bg-amber-500 text-white ring-2 ring-amber-400/40"
                : currentStep > 2
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-white/60"
            }`}
          >
            {currentStep > 2 ? "✓" : "2"}
          </span>
          <span className={`text-xs font-semibold ${currentStep === 2 ? "text-amber-300" : "text-white/70"}`}>
            Profile & GPS
          </span>
        </div>

        <div className="h-0.5 w-6 bg-white/20 sm:w-10" />

        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              currentStep === 3
                ? "bg-amber-500 text-white ring-2 ring-amber-400/40"
                : "bg-white/10 text-white/60"
            }`}
          >
            3
          </span>
          <span className={`text-xs font-semibold ${currentStep === 3 ? "text-amber-300" : "text-white/70"}`}>
            {selectedRole === "seeker" ? "Preferences" : "Verification"}
          </span>
        </div>
      </div>

      {serverError && (
        <div className="mb-4">
          <ErrorMessage message={typeof serverError === "string" ? serverError : "Unable to create account"} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* ================= STEP 1: CREDENTIALS ================= */}
        {currentStep === 1 && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <User size={15} className="text-amber-400" /> Account Credentials
              </h3>
              <p className="text-[11px] text-slate-300">Enter your name, login email and secure password.</p>
            </div>

            <Input
              label="Full Name"
              placeholder={selectedRole === "seeker" ? "Aman Sharma" : "Rajesh Kumar (Owner)"}
              error={errors.name?.message}
              {...register("name", {
                required: "Full name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                validate: (v) => isEmail(v) || "Enter a valid email address",
              })}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required for account verification",
                minLength: { value: 10, message: "Enter at least 10 digits" },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                validate: (v) => isStrongPassword(v) || "Use at least 8 characters",
              })}
            />

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full !bg-amber-500 hover:!bg-amber-600 font-bold mt-3 flex items-center justify-center gap-1.5"
            >
              Continue to Profile Details <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* ================= STEP 2: PROFILE & GPS LOCATION ================= */}
        {currentStep === 2 && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin size={15} className="text-amber-400" /> Personal Profile & Location
              </h3>
              <p className="text-[11px] text-slate-300">This helps roommates and owners identify your location.</p>
            </div>

            {/* Gender and Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">Gender</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white capitalize focus:border-amber-400 focus:outline-none"
                  {...register("gender")}
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-white capitalize">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Age (Years)"
                type="number"
                min="18"
                max="80"
                placeholder="23"
                error={errors.age?.message}
                {...register("age", { required: "Age is required" })}
              />
            </div>

            {/* Profession / Occupation */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">Profession / Occupation</label>
              <select
                className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                {...register("occupation")}
              >
                {OCCUPATION_OPTIONS.map((o) => (
                  <option key={o} value={o} className="bg-slate-900 text-white">
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Location / City Selection with GPS Button */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Navigation size={13} /> {selectedRole === "owner" ? "Property City" : "Target City / Location"}
                </span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Navigation size={11} className={detectingLocation ? "animate-spin" : ""} />
                  {detectingLocation ? "Detecting..." : "Detect Device GPS"}
                </button>
              </div>

              {locationSuccess && (
                <p className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-500/30">
                  {locationSuccess}
                </p>
              )}
              {locationError && (
                <p className="text-[11px] font-semibold text-rose-300 bg-rose-950/40 px-2 py-1 rounded-md border border-rose-500/30">
                  {locationError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">City</label>
                  <select
                    className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    {...register("city", { required: true })}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Locality / Sector"
                  placeholder="e.g. Saket / Sector 62 / Koramangala"
                  {...register("locality")}
                />
              </div>
            </div>

            {/* Short Bio */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">About Me / Bio</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                placeholder={
                  selectedRole === "seeker"
                    ? "e.g. Looking for a clean, peaceful flat near metro station."
                    : "e.g. Managing well-furnished rooms with 24/7 security."
                }
                {...register("bio")}
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevStep}
                className="flex-1 !bg-slate-800 hover:!bg-slate-700 text-white text-xs font-bold"
              >
                <ChevronLeft size={15} /> Back
              </Button>
              <Button
                type="button"
                onClick={handleNextStep}
                className="flex-[2] !bg-amber-500 hover:!bg-amber-600 font-bold text-xs"
              >
                Next Step <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PREFERENCES (USER) OR PROPERTY VERIFICATION (OWNER) ================= */}
        {currentStep === 3 && (
          <div className="space-y-3.5 animate-fade-in">
            {selectedRole === "seeker" ? (
              <>
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-amber-400" />
                    {userIntent === "find_room"
                      ? "Room Finding Preferences"
                      : userIntent === "find_roommate"
                      ? "Roommate Matching Preferences"
                      : "Living & Budget Preferences"}
                  </h3>
                  <p className="text-[11px] text-slate-300">These will be saved directly to your profile matching credentials.</p>
                </div>

                {/* Budget Range */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min Budget (₹/mo)"
                    type="number"
                    step="500"
                    placeholder="6000"
                    {...register("budgetMin")}
                  />
                  <Input
                    label="Max Budget (₹/mo)"
                    type="number"
                    step="500"
                    placeholder="15000"
                    {...register("budgetMax")}
                  />
                </div>

                {/* Habits */}
                <div className="grid grid-cols-2 gap-3">
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
                </div>

                {/* Habits Checkboxes */}
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      className="rounded accent-amber-500 h-4 w-4"
                      {...register("smoking")}
                    />
                    Smoker
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                    <input
                      type="checkbox"
                      className="rounded accent-amber-500 h-4 w-4"
                      {...register("pets")}
                    />
                    Pet Friendly
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-amber-400" /> Property Verification Credentials
                  </h3>
                  <p className="text-[11px] text-slate-300">Admin validates your property address and ID before room listing.</p>
                </div>

                <Input
                  label="Full Property Address"
                  placeholder="e.g. Flat 304, Tower B, Green Heights, Saket"
                  error={errors.propertyAddress?.message}
                  {...register("propertyAddress", {
                    required: "Complete property address is required for owner approval",
                  })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">ID Proof Document Type</label>
                    <select
                      className="w-full rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      {...register("idProofType")}
                    >
                      {ID_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-slate-900 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Document / ID Number"
                    placeholder="e.g. XXXX-XXXX-4589"
                    error={errors.idProofNumber?.message}
                    {...register("idProofNumber", {
                      required: "ID number is required for verification",
                    })}
                  />
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-[11px] text-blue-200">
                  🛡️ <strong>Admin Approval Required:</strong> Super Admin will verify your property credentials and activate room posting.
                </div>
              </>
            )}

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevStep}
                className="flex-1 !bg-slate-800 hover:!bg-slate-700 text-white text-xs font-bold"
              >
                <ChevronLeft size={15} /> Back
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                className="flex-[2] !bg-amber-500 hover:!bg-amber-600 font-bold text-xs"
              >
                {selectedRole === "owner" ? "Submit Owner Application" : "Complete Registration"}
              </Button>
            </div>
          </div>
        )}
      </form>

      <p className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-amber-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
