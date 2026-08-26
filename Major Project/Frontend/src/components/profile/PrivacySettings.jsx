import { useState } from "react";
import Button from "../common/Button";
import Select from "../common/Select";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public — anyone can view my profile" },
  { value: "verified_only", label: "Verified users only" },
  { value: "private", label: "Private — hidden from search" },
];

/**
 * Maps to User.privacy in server/src/modules/users/user.model.js:
 * showPhone, showLastSeen, profileVisibility.
 */
export default function PrivacySettings({ initialValues, onSubmit }) {
  const [values, setValues] = useState({
    showPhone: false,
    showLastSeen: true,
    profileVisibility: "public",
    ...initialValues,
  });
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Privacy</h2>

      <Select
        label="Profile visibility"
        options={VISIBILITY_OPTIONS}
        value={values.profileVisibility}
        onChange={(e) => set("profileVisibility", e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.showPhone}
          onChange={(e) => set("showPhone", e.target.checked)}
          className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
        />
        Show my phone number to matched roommates
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.showLastSeen}
          onChange={(e) => set("showLastSeen", e.target.checked)}
          className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
        />
        Show my online/last-seen status in chat
      </label>

      <Button type="submit" loading={saving}>Save privacy settings</Button>
    </form>
  );
}
