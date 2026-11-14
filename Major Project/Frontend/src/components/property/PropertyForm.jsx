import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, X, MapPin } from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import ImageUpload from "../common/ImageUpload";
import {
  PROPERTY_TYPES, SHARING_TYPES, FURNISHING_TYPES, GENDER_PREFERENCES, AMENITIES,
} from "../../utils/constants";

const DEFAULTS = {
  title: "",
  description: "",
  propertyType: "room",
  sharingType: "single",
  rent: "",
  securityDeposit: "",
  furnishing: "unfurnished",
  amenities: [],
  houseRules: [""],
  occupancy: { totalBeds: 1, availableBeds: 1, genderPreference: "any" },
  moveInDate: "",
  address: { line1: "", locality: "", city: "Delhi", state: "", pincode: "" },
  location: { coordinates: [77.2090, 28.6139] },
  images: [],
};

/**
 * Shared create/edit form for a listing. Submits the exact shape expected
 * by POST/PUT /rooms (server/src/modules/rooms/room.validator.js).
 */
export default function PropertyForm({ initialValues, onSubmit, submitLabel = "Save listing" }) {
  const initialImages =
    (Array.isArray(initialValues?.images) && initialValues.images.length > 0)
      ? initialValues.images
      : (initialValues?.media || []).map((m) => m?.url || m).filter(Boolean);
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { ...DEFAULTS, ...initialValues } });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setValue("location.coordinates.1", lat);
        setValue("location.coordinates.0", lng);
        setValue("latitude", lat);
        setValue("longitude", lng);
        setGpsStatus(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setGpsLoading(false);

        // Store in user_gps
        localStorage.setItem("user_gps", JSON.stringify({ lat, lng }));

        // Reverse geocode to fill city & locality
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const geo = await res.json();
          const city = geo.address?.city || geo.address?.state_district || geo.address?.town || geo.address?.suburb;
          const locality = geo.address?.neighbourhood || geo.address?.suburb || geo.address?.residential;
          const pincode = geo.address?.postcode;
          if (city) setValue("address.city", city);
          if (locality) setValue("address.locality", locality);
          if (pincode) setValue("address.pincode", pincode);
        } catch {
          // ignore geocode error
        }
      },
      (err) => {
        console.warn("GPS detection error:", err);
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (initialValues?.location?.coordinates?.[1] && initialValues?.location?.coordinates?.[0]) {
      setGpsStatus(`${Number(initialValues.location.coordinates[1]).toFixed(4)}, ${Number(initialValues.location.coordinates[0]).toFixed(4)}`);
    } else if (navigator.geolocation) {
      detectLocation();
    }
  }, []);

  useEffect(() => {
    if (initialValues) {
      reset({ ...DEFAULTS, ...initialValues });
      const imgs = (Array.isArray(initialValues.images) && initialValues.images.length > 0)
        ? initialValues.images
        : (initialValues.media || []).map((m) => m?.url || m).filter(Boolean);
      setUploadedImages(imgs);
    }
  }, [initialValues, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "houseRules" });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      images: uploadedImages,
      media: uploadedImages.map((url) => ({ url })),
      houseRules: data.houseRules.filter(Boolean),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* 1. Basic details */}
      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Basic details</h2>
        <Input label="Title" placeholder="Sunny 2BHK near Metro Station" error={errors.title?.message}
          {...register("title", { required: "Title is required", minLength: { value: 5, message: "Too short" } })} />
        <Textarea label="Description" placeholder="Describe the room, the neighbourhood, and what makes it a good fit..."
          {...register("description")} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Property type" options={PROPERTY_TYPES} error={errors.propertyType?.message}
            {...register("propertyType", { required: true })} />
          <Select label="Sharing type" options={SHARING_TYPES} error={errors.sharingType?.message}
            {...register("sharingType", { required: true })} />
        </div>
      </section>

      {/* 2. Photo Upload Section */}
      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <ImageUpload
          images={uploadedImages}
          onChange={(newUrls) => {
            setUploadedImages(newUrls);
            setValue("images", newUrls);
          }}
          maxImages={8}
          label="Property & Room Photos"
          description="Upload high quality photos of bedroom, bathroom and building (PNG, JPG, WEBP)"
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Rent &amp; furnishing</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Monthly rent (₹)" type="number" error={errors.rent?.message}
            {...register("rent", { required: "Rent is required", min: { value: 0, message: "Must be positive" } })} />
          <Input label="Security deposit (₹)" type="number" {...register("securityDeposit")} />
        </div>
        <Select label="Furnishing" options={FURNISHING_TYPES} {...register("furnishing")} />

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Amenities</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" value={a} {...register("amenities")} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                {a.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Occupancy &amp; move-in</h2>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Total beds" type="number" min={1} {...register("occupancy.totalBeds", { valueAsNumber: true })} />
          <Input label="Available beds" type="number" min={0} {...register("occupancy.availableBeds", { valueAsNumber: true })} />
          <Select label="Gender preference" options={GENDER_PREFERENCES} {...register("occupancy.genderPreference")} />
        </div>
        <Input label="Move-in date" type="date" {...register("moveInDate")} />
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Location & GPS Coordinates</h2>
            <p className="text-xs text-gray-500">Accurate GPS ensures nearby room seekers find your property first!</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={MapPin}
            loading={gpsLoading}
            onClick={detectLocation}
            className="!text-amber-700 !border-amber-300 hover:!bg-amber-50 text-xs font-bold"
          >
            {gpsLoading ? "Detecting GPS..." : "📍 Use My GPS Location"}
          </Button>
        </div>

        {gpsStatus && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <span>✓ Exact GPS Detected:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">{gpsStatus}</span>
            <span className="text-emerald-700 font-normal ml-auto">Seekers nearest to this location will see this room first</span>
          </div>
        )}

        <Input label="Address line" placeholder="Flat No., House/Building Name, Street" {...register("address.line1")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Locality / Sector" placeholder="e.g. Sector 62 or Karol Bagh" {...register("address.locality")} />
          <Input label="City" placeholder="e.g. Noida or Delhi" error={errors.address?.city?.message}
            {...register("address.city", { required: "City is required" })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="State" placeholder="e.g. Uttar Pradesh or Delhi" {...register("address.state")} />
          <Input label="Pincode" placeholder="e.g. 201301" {...register("address.pincode")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Latitude (GPS)" type="number" step="any"
            {...register("location.coordinates.1", { valueAsNumber: true })} />
          <Input label="Longitude (GPS)" type="number" step="any"
            {...register("location.coordinates.0", { valueAsNumber: true })} />
        </div>
        <p className="text-[11px] text-slate-500">
          💡 Click "Use My GPS Location" above to automatically lock your property coordinates on the map.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">House rules</h2>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input placeholder="e.g. No smoking indoors" {...register(`houseRules.${index}`)} className="flex-1" />
            <button type="button" onClick={() => remove(index)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Remove rule">
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append("")}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <Plus size={15} /> Add a rule
        </button>
      </section>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
