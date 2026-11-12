import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Plus, Link as LinkIcon } from "lucide-react";
import { uploadApi } from "../../services/api/upload.api";

export default function ImageUpload({
  images = [],
  onChange,
  maxImages = 8,
  label = "Upload Photos",
  description = "PNG, JPG, WEBP up to 10MB each",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await uploadApi.uploadFiles(formData);
      const newUrls = res.data?.data?.urls || (res.data?.data?.url ? [res.data?.data?.url] : []);
      onChange?.([...images, ...newUrls]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (indexToRemove) => {
    const next = images.filter((_, idx) => idx !== indexToRemove);
    onChange?.(next);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    onChange?.([...images, manualUrl.trim()]);
    setManualUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800">{label}</label>
          <p className="text-[11px] text-slate-500">{description}</p>
        </div>
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          {images.length} / {maxImages}
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Grid of uploaded thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="group relative h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
          >
            <img
              src={url}
              alt={`Upload ${idx + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {idx === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-amber-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 backdrop-blur-sm">
                Cover Photo
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-90 hover:opacity-100 hover:bg-red-600 transition-all shadow-md"
              title="Remove image"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {/* Upload Trigger Tile */}
        {images.length < maxImages && (
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-3 text-center transition-all hover:border-amber-500 hover:bg-amber-50/40 active:scale-95 ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-1.5 text-amber-600">
                <Loader2 size={22} className="animate-spin" />
                <span className="text-[11px] font-bold">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-1">
                  <Upload size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700">Choose Photos</span>
                <span className="text-[10px] text-slate-400">or Drag & Drop</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Alternative URL button */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-600 transition-colors"
        >
          <LinkIcon size={12} />
          <span>{showUrlInput ? "Hide URL input" : "Or paste image web link"}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 animate-fade-in">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/room-photo.jpg"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition-all"
          >
            Add Link
          </button>
        </div>
      )}
    </div>
  );
}

