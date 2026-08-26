import { FileText, Download, ShieldCheck, Clock } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../utils/formatDate";
import { documentApi } from "../../services/api/document.api";

const TYPE_LABELS = { agreement: "Rental agreement", receipt: "Payment receipt", id_proof: "ID proof", ownership_proof: "Ownership proof" };

const STATUS_STYLES = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  generated: "bg-blue-100 text-blue-600",
  rejected: "bg-red-100 text-red-600",
};

export default function DocumentList({ documents = [] }) {
  if (!documents.length) {
    return <EmptyState title="No documents yet" description="Agreements, receipts, and verification files will appear here." />;
  }

  const handleDownload = async (doc) => {
    const { data } = await documentApi.download(doc._id);
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.fileName || `${doc.type}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white">
      {documents.map((doc) => (
        <div key={doc._id} className="flex items-center gap-3 px-4 py-3">
          <span className="rounded-xl bg-brand-50 p-2 text-brand-600"><FileText size={16} /></span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{TYPE_LABELS[doc.type] || doc.type}</p>
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} /> {formatDate(doc.createdAt)}
            </p>
          </div>

          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[doc.status] || STATUS_STYLES.pending}`}>
            {doc.status === "verified" && <ShieldCheck size={11} className="mr-1 inline" />}
            {doc.status}
          </span>

          <button onClick={() => handleDownload(doc)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-600" aria-label="Download">
            <Download size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
