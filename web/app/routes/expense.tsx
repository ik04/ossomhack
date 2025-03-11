import { useEffect, useState } from "react";
import { Sidebar } from "~/components/sidebar";
import axios from "axios";

interface Expense {
  id: number;
  name: string;
  amount: number;
  type: number; // 0: Daily, 1: Monthly, 2: Yearly
  user_id: number;
  created_at: string;
}

interface ExpenseData {
  expenses: Expense[];
  summary: {
    monthly_total: number;
    breakdown: {
      daily: number;
      monthly: number;
      weekly: number;
    };
  };
}

export default function Expenses() {
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    expenses: [],
    summary: {
      monthly_total: 0,
      breakdown: {
        daily: 0,
        monthly: 0,
        weekly: 0,
      },
    },
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/expenses", {
        withCredentials: true,
      });
      console.log(response);

      if (response.data.status) {
        setExpenseData({
          expenses: response.data.expenses,
          summary: response.data.summary,
        });
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (formData: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/expenses",
        {
          name: formData.name,
          amount: formData.amount,
          type: parseInt(formData.type),
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setShowAddModal(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/expenses/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-[120px] border-b border-primary font-sentient font-medium text-[69px] px-5 flex justify-between items-end">
          <span>Expenses</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 px-6 py-2 bg-primary text-white rounded-lg text-base font-normal"
          >
            Add Expense
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-xl text-gray-600">Loading expenses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
                <h3 className="text-xl font-sentient text-primary mb-2">
                  Daily Expenses
                </h3>
                <p className="text-3xl font-medium">
                  ₹{expenseData.summary.breakdown.daily}
                </p>
              </div>

              <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
                <h3 className="text-xl font-sentient text-primary mb-2">
                  Weekly Expenses
                </h3>
                <p className="text-3xl font-medium">
                  ₹{expenseData.summary.breakdown.weekly}
                </p>
              </div>

              <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
                <h3 className="text-xl font-sentient text-primary mb-2">
                  Monthly Expenses
                </h3>
                <p className="text-3xl font-medium">
                  ₹{expenseData.summary.breakdown.monthly}
                </p>
              </div>

              <div className="col-span-3">
                <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-sentient text-primary mb-2">
                    Total Expenses
                  </h3>
                  <p className="text-3xl font-medium">
                    ₹{expenseData.summary.monthly_total}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expense List */}
        <div className="p-8 mt-4">
          <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-sentient text-primary">
                All Expenses
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Add New
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.expenses.map((expense) => (
                    <tr key={expense.id} className="border-b-2 border-primary">
                      <td className="py-3">{expense.name}</td>
                      <td className="py-3">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3">
                        {expense.type === 0
                          ? "Daily"
                          : expense.type === 1
                          ? "Monthly"
                          : "Yearly"}
                      </td>
                      <td className="py-3">
                        {new Date(expense.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-background border-2 border-primary rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-sentient text-primary mb-4">
                Add New Expense
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddExpense({
                    name: formData.get("name"),
                    amount: parseFloat(formData.get("amount") as string),
                    type: parseInt(formData.get("type") as string),
                  });
                }}
              >
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Expense Name"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <select
                    name="type"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  >
                    <option value="0">Daily</option>
                    <option value="1">Weekly</option>
                    <option value="2">Monthly</option>
                  </select>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border-2 border-primary text-primary rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
