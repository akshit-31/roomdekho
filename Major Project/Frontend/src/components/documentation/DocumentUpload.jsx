import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import Button from "../common/Button";
import { api } from "../../services/api/axios";

/**
 * Uploads supporting documents (ownership papers, ID proof, etc.) for
 * verification. Backend endpoint to be added: POST /documents/upload
 * (server/src/modules/verification — multipart, stored via Cloudinary).
 */
export default function DocumentUpload({ label = "Upload document", accept = ".pdf,.jpg,.jpeg,.png", onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("document", file);
      const { data } = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.(data.data);
      setFile(null);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-center">
      <input ref={inputRef} type="file" accept={accept} onChange={pick} className="hidden" />

      {!file ? (
        <button onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center gap-2 py-4 text-gray-500 hover:text-brand-600">
          <UploadCloud size={28} />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-gray-400">PDF, JPG or PNG, up to 10MB</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="flex items-center gap-2 truncate text-sm text-gray-700">
            <FileText size={16} className="shrink-0 text-gray-400" /> {file.name}
          </span>
          <button onClick={() => setFile(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100" aria-label="Remove file">
            <X size={15} />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {file && (
        <Button className="mt-3" size="sm" loading={uploading} onClick={upload}>
          Upload
        </Button>
      )}
    </div>
  );
}
