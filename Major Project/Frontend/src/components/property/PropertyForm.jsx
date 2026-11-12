import { useState } from "react";
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
    initialValues?.images || (initialValues?.media || []).map((m) => m.url || m) || [];
  const [uploadedImages, setUploadedImages] = useState(initialImages);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { ...DEFAULTS, ...initialValues } });

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
        <h2 className="text-sm font-semibold text-gray-900">Location</h2>
        <Input label="Address line" {...register("address.line1")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Locality" {...register("address.locality")} />
          <Input label="City" error={errors.address?.city?.message}
            {...register("address.city", { required: "City is required" })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="State" {...register("address.state")} />
          <Input label="Pincode" {...register("address.pincode")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Latitude (Optional)" type="number" step="any"
            {...register("location.coordinates.1", { valueAsNumber: true })} />
          <Input label="Longitude (Optional)" type="number" step="any"
            {...register("location.coordinates.0", { valueAsNumber: true })} />
        </div>
        <p className="text-[11px] text-slate-500">
          💡 Map coordinates are automatically placed based on city/locality if left blank.
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
