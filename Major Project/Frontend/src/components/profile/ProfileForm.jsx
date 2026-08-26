import { useForm } from "react-hook-form";
import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import defaultAvatar from "/images/default-avatar.jpg";
import { api } from "../../services/api/axios";

const GENDER_OPTIONS = ["male", "female", "other", "prefer_not_to_say"];

/**
 * Basic identity fields — see server/src/modules/users user.service.js
 * updateProfile() allow-list: name, bio, avatarUrl, gender, dob.
 */
export default function ProfileForm({ initialValues, onSubmit }) {
  const [preview, setPreview] = useState(initialValues?.avatarUrl);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({ defaultValues: initialValues });

  const handleAvatarPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      // Backend endpoint to be added: POST /users/me/avatar (multipart, Cloudinary upload)
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.data?.avatarUrl) setValue("avatarUrl", data.data.avatarUrl);
    } catch {
      // Endpoint not live yet — preview still updates locally above
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center gap-4">
        <img src={preview || defaultAvatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        <label className="cursor-pointer rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Change photo
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
        </label>
        <input type="hidden" {...register("avatarUrl")} />
      </div>

      <Input label="Full name" {...register("name", { required: true })} />
      <Textarea label="Bio" placeholder="Tell people a bit about yourself..." rows={3} {...register("bio")} />

      <div className="grid grid-cols-2 gap-4">
        <Select label="Gender" options={GENDER_OPTIONS} {...register("gender")} />
        <Input label="Date of birth" type="date" {...register("dob")} />
      </div>

      <Button type="submit" loading={isSubmitting}>Save changes</Button>
    </form>
  );
}
