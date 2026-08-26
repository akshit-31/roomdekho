import { useState } from "react";
import { useForm } from "react-hook-form";
import { FileCheck2, Download } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { documentApi } from "../../services/api/document.api";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/errorHandler";

/**
 * Generates a rental agreement PDF via POST /documents/agreement
 * (server/src/modules/documents) from the booking/room terms.
 */
export default function RentalAgreement({ room, tenant, defaultDurationMonths = 11 }) {
  const [agreement, setAgreement] = useState(null);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      rent: room?.rent,
      securityDeposit: room?.securityDeposit,
      durationMonths: defaultDurationMonths,
      startDate: "",
    },
  });

  const generate = async (data) => {
    setError(null);
    try {
      const { data: res } = await documentApi.generateAgreement({
        roomId: room?._id,
        tenantId: tenant?._id,
        ...data,
      });
      setAgreement(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (agreement) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
        <FileCheck2 className="mx-auto mb-2 text-green-600" size={32} />
        <p className="text-sm font-medium text-green-800">Agreement generated</p>
        <p className="mt-1 text-xs text-green-600">Status: {agreement.status}</p>
        <a href={agreement.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block">
          <Button size="sm" icon={Download}>Download agreement</Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(generate)} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Generate rental agreement</h2>
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Monthly rent (₹)" type="number" {...register("rent", { required: true })} />
        <Input label="Security deposit (₹)" type="number" {...register("securityDeposit")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start date" type="date" {...register("startDate", { required: true })} />
        <Input label="Duration (months)" type="number" {...register("durationMonths", { required: true })} />
      </div>

      <p className="text-xs text-gray-400">
        A PDF agreement will be generated between {tenant?.name || "the tenant"} and{" "}
        {room?.owner?.name || "the owner"} for {room?.title}, at {formatCurrency(room?.rent)}/month.
      </p>

      <Button type="submit" loading={isSubmitting}>Generate agreement</Button>
    </form>
  );
}
