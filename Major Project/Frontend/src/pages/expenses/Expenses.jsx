import { useEffect, useState } from "react";
import { Calculator, SplitSquareHorizontal } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import ExpenseSummary from "../../components/expenses/ExpenseSummary";
import ExpenseChart from "../../components/expenses/ExpenseChart";
import ExpenseCard from "../../components/expenses/ExpenseCard";
import ExpenseForm from "../../components/expenses/ExpenseForm";
import ExpenseSplitter from "../../components/expenses/ExpenseSplitter";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { expenseApi } from "../../services/api/expense.api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [splitterOpen, setSplitterOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await expenseApi.myExpenses();
      setExpenses(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <PageContainer
      title="Expenses"
      subtitle="Rent, electricity, WiFi, and food — split and tracked in one place"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" icon={Calculator} onClick={() => setCalculatorOpen(true)}>
            Rent calculator
          </Button>
          <Button icon={SplitSquareHorizontal} onClick={() => setSplitterOpen(true)}>
            Split an expense
          </Button>
        </div>
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <ExpenseSummary expenses={expenses} />

          {expenses.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Spending by category</h2>
              <ExpenseChart expenses={expenses} />
            </div>
          )}

          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">This month</h2>
            {!expenses.length ? (
              <EmptyState
                title="No expenses tracked yet"
                description="Split your first shared cost to start tracking rent, electricity, WiFi, and food."
                actionLabel="Split an expense"
                onAction={() => setSplitterOpen(true)}
              />
            ) : (
              <div className="space-y-2">
                {expenses.map((e) => (
                  <ExpenseCard key={e._id} expense={e} onUpdated={load} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal open={calculatorOpen} onClose={() => setCalculatorOpen(false)} title="Rent & deposit calculator" size="sm">
        <ExpenseForm />
      </Modal>

      <Modal open={splitterOpen} onClose={() => setSplitterOpen(false)} title="Split an expense" size="md">
        <ExpenseSplitter onSplit={() => { setSplitterOpen(false); load(); }} />
      </Modal>
    </PageContainer>
  );
}
