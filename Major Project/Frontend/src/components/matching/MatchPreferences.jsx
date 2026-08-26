import { useForm, Controller } from "react-hook-form";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const FOOD_OPTIONS = ["veg", "non_veg", "vegan", "no_preference"];
const SLEEP_OPTIONS = ["early_bird", "night_owl", "flexible"];
const WORK_OPTIONS = ["wfh", "office", "student", "flexible"];

/**
 * Edits the lifestyle attributes consumed by the AI matching engine
 * (server/src/modules/matching/match.engine.js). Submits via
 * userApi.updateProfile({ preferences }).
 */
export default function MatchPreferences({ initialValues, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      budgetMin: "",
      budgetMax: "",
      food: "no_preference",
      sleepSchedule: "flexible",
      workSchedule: "flexible",
      cleanliness: 3,
      noiseTolerance: 3,
      smoking: false,
      pets: false,
      ...initialValues,
      preferredLocations: (initialValues?.preferredLocations || []).join(", "),
      personalityTags: (initialValues?.personalityTags || []).join(", "),
    },
  });

  const cleanliness = watch("cleanliness");
  const noiseTolerance = watch("noiseTolerance");

  const submit = (data) => {
    onSubmit({
      ...data,
      budgetMin: Number(data.budgetMin) || undefined,
      budgetMax: Number(data.budgetMax) || undefined,
      cleanliness: Number(data.cleanliness),
      noiseTolerance: Number(data.noiseTolerance),
      preferredLocations: data.preferredLocations.split(",").map((s) => s.trim()).filter(Boolean),
      personalityTags: data.personalityTags.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Min budget (₹/mo)" type="number" {...register("budgetMin")} />
        <Input label="Max budget (₹/mo)" type="number" {...register("budgetMax")} />
      </div>

      <Input
        label="Preferred locations"
        placeholder="Koramangala, Indiranagar"
        hint="Comma-separated"
        {...register("preferredLocations")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select label="Food habit" options={FOOD_OPTIONS} {...register("food")} />
        <Select label="Sleep schedule" options={SLEEP_OPTIONS} {...register("sleepSchedule")} />
      </div>

      <Select label="Daily routine" options={WORK_OPTIONS} {...register("workSchedule")} />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Cleanliness ({cleanliness}/5)
        </label>
        <Controller
          control={control}
          name="cleanliness"
          render={({ field }) => (
            <input type="range" min={1} max={5} className="w-full accent-brand-500" {...field} />
          )}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Noise tolerance ({noiseTolerance}/5)
        </label>
        <Controller
          control={control}
          name="noiseTolerance"
          render={({ field }) => (
            <input type="range" min={1} max={5} className="w-full accent-brand-500" {...field} />
          )}
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("smoking")} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
          I smoke
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("pets")} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
          I have/want pets
        </label>
      </div>

      <Input
        label="Personality/lifestyle tags"
        placeholder="introvert, social, fitness"
        hint="Comma-separated — used to find like-minded roommates"
        {...register("personalityTags")}
      />

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        Save preferences
      </Button>
    </form>
  );
}
