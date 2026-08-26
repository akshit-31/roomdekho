import { Download } from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { documentApi } from "../../services/api/document.api";

/**
 * Itemized payment receipt view/download — pairs with
 * server/src/modules/payments (Razorpay payment records) once a
 * receipt document is generated per successful transaction.
 */
export default function ReceiptViewer({ receipt }) {
  if (!receipt) return null;

  const handleDownload = async () => {
    const { data } = await documentApi.download(receipt._id);
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${receipt._id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Payment receipt</p>
          <p className="text-xs text-gray-400">{formatDate(receipt.paidAt)} · #{receipt.orderId}</p>
        </div>
        <Button size="sm" variant="secondary" icon={Download} onClick={handleDownload}>Download</Button>
      </div>

      <div className="space-y-2 py-3 text-sm">
        {(receipt.items || []).map((item, i) => (
          <div key={i} className="flex justify-between text-gray-600">
            <span>{item.label}</span>
            <span>{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-gray-50 pt-3 text-sm font-semibold text-gray-900">
        <span>Total paid</span>
        <span>{formatCurrency(receipt.amount)}</span>
      </div>
    </div>
  );
}
