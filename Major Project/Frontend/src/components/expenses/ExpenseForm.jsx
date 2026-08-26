import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { expenseApi } from "../../services/api/expense.api";

/**
 * Rent & deposit calculator — POST /expenses/rent-calculator
 * (server/src/modules/expenses). Advance rent, deposit, and brokerage
 * (if any) are combined into a one-time move-in cost estimate.
 */
export default function ExpenseForm() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [depositMonths, setDepositMonths] = useState(2);
  const [brokerage, setBrokerage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await expenseApi.calculateRent({
        monthlyRent: Number(monthlyRent),
        depositMonths: Number(depositMonths),
        brokerage: Number(brokerage) || 0,
      });
      setResult(data.data);
    } catch {
      // Fallback client-side calculation if the endpoint isn't ready yet
      const deposit = Number(monthlyRent) * Number(depositMonths);
      const total = Number(monthlyRent) + deposit + (Number(brokerage) || 0);
      setResult({ deposit, firstMonthRent: Number(monthlyRent), brokerage: Number(brokerage) || 0, total });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={calculate} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Rent &amp; deposit calculator</h2>

      <Input label="Monthly rent (₹)" type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} required />
      <Input label="Security deposit (months of rent)" type="number" value={depositMonths} onChange={(e) => setDepositMonths(e.target.value)} />
      <Input label="Brokerage, if any (₹)" type="number" value={brokerage} onChange={(e) => setBrokerage(e.target.value)} />

      <Button type="submit" loading={loading} className="w-full">Calculate</Button>

      {result && (
        <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
          <div className="flex justify-between py-1"><span>First month's rent</span><span>{formatCurrency(result.firstMonthRent)}</span></div>
          <div className="flex justify-between py-1"><span>Security deposit</span><span>{formatCurrency(result.deposit)}</span></div>
          {result.brokerage > 0 && (
            <div className="flex justify-between py-1"><span>Brokerage</span><span>{formatCurrency(result.brokerage)}</span></div>
          )}
          <div className="mt-1 flex justify-between border-t border-brand-100 pt-2 font-semibold">
            <span>Total move-in cost</span><span>{formatCurrency(result.total)}</span>
          </div>
        </div>
      )}
    </form>
  );
}
