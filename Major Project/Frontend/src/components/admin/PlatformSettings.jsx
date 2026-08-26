import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { api } from "../../services/api/axios";

/**
 * Generic platform configuration form (commission rate, feature
 * toggles, etc). Backend endpoint to be added: PUT /admin/settings
 */
export default function PlatformSettings({ initialValues = {} }) {
  const [values, setValues] = useState({
    commissionPercent: 5,
    maxListingsPerOwner: 20,
    kycRequiredForBooking: true,
    maintenanceMode: false,
    ...initialValues,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/settings", values);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Platform configuration</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Commission (%)"
          type="number"
          value={values.commissionPercent}
          onChange={(e) => set("commissionPercent", Number(e.target.value))}
        />
        <Input
          label="Max listings per owner"
          type="number"
          value={values.maxListingsPerOwner}
          onChange={(e) => set("maxListingsPerOwner", Number(e.target.value))}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.kycRequiredForBooking}
          onChange={(e) => set("kycRequiredForBooking", e.target.checked)}
          className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
        />
        Require KYC verification before booking a visit
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.maintenanceMode}
          onChange={(e) => set("maintenanceMode", e.target.checked)}
          className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
        />
        Maintenance mode (blocks new bookings platform-wide)
      </label>

      <Button type="submit" loading={saving}>{saved ? "Saved" : "Save settings"}</Button>
    </form>
  );
}
