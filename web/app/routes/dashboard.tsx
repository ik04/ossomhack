import React, { useEffect, useState } from "react";
import { Sidebar } from "~/components/sidebar";
import axios from "axios";

interface Income {
  id: number;
  name: string;
  amount: number;
  type: number;
  created_at: string;
  user_id: number;
}

interface IncomeState {
  incomes: Income[];
  summary: {
    total: number;
    breakdown: {
      salary: number;
      sidehustle: number;
      business: number;
      withdraw: number;
    };
  };
}

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState<IncomeState>({
    incomes: [],
    summary: {
      total: 0,
      breakdown: {
        salary: 0,
        sidehustle: 0,
        business: 0,
        withdraw: 0,
      },
    },
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddIncome = async (formData: any) => {
    try {
      await axios.post("http://localhost:8000/api/incomes", formData, {
        withCredentials: true,
      });
      setShowAddModal(false);
      fetchIncome();
    } catch (error) {
      console.error("Failed to add income:", error);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    if (!confirm("Are you sure you want to delete this income?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/incomes/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        fetchIncome();
      }
    } catch (error) {
      console.error("Failed to delete income:", error);
    }
  };

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/incomes", {
        withCredentials: true,
      });
      const { summary, incomes } = response.data;
      setIncomeData({
        incomes,
        summary: {
          total: summary.total,
          breakdown: {
            salary: summary.breakdown.salary,
            sidehustle: summary.breakdown.sidehustle,
            business: summary.breakdown.business,
            withdraw: summary.breakdown.withdraw,
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch income:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/analytics", {
        withCredentials: true,
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const fetchKnowledge = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/knowledge", {
        withCredentials: true,
      });
      if (response.data.status) {
        const payload = response.data.data;
        const onboard = await axios.post("http://localhost:8080/onboarding", {
          payload,
        });
        const knowledge = await axios.post(
          "http://localhost:8080/investmenttips",
          { userId: payload.userId }
        );
      }
    } catch (error) {
      console.error("Failed to fetch knowledge:", error);
    }
  };
  useEffect(() => {
    fetchIncome();
    fetchAnalytics();
    fetchKnowledge();
  }, []);

  return (
    <div className="h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-[120px] border-b border-primary font-sentient font-medium text-[69px] px-5 flex justify-between items-end">
          <span>Income</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 px-6 py-2 bg-primary text-white rounded-lg text-base font-normal"
          >
            Add Income
          </button>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-background border-2 border-primary rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-sentient text-primary mb-4">
                Add New Income
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddIncome({
                    name: formData.get("name"),
                    amount: parseFloat(formData.get("amount") as string),
                    type: parseInt(formData.get("type") as string),
                  });
                }}
              >
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Income Name"
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
                    <option value="0">Salary</option>
                    <option value="1">Side Hustle</option>
                    <option value="2">Business</option>
                    <option value="3">Withdrawal</option>
                  </select>
                  <div className="flex justify-end space-x-3 mt-6">
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

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Salary Income
              </h3>
              <p className="text-3xl font-medium">
                ₹{incomeData.summary.breakdown.salary.toLocaleString()}
              </p>
            </div>

            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Passive Income
              </h3>
              <p className="text-3xl font-medium">
                ₹{incomeData.summary.breakdown.sidehustle.toLocaleString()}
              </p>
            </div>

            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Business Income
              </h3>
              <p className="text-3xl font-medium">
                ₹{incomeData.summary.breakdown.business.toLocaleString()}
              </p>
            </div>

            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Withdrawals
              </h3>
              <p className="text-3xl font-medium">
                ₹{incomeData.summary.breakdown.withdraw.toLocaleString()}
              </p>
            </div>

            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Income Summary
              </h3>
              <p className="text-3xl font-medium">
                ₹{incomeData.summary.total.toLocaleString()}
              </p>
            </div>

            {/* Large Analytics Box */}
            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Analytics
              </h3>
              {loading ? (
                <p>Loading analytics...</p>
              ) : (
                <div className="h-full flex items-center justify-center">
                  {/* Analytics content will go here */}
                </div>
              )}
            </div>
          </div>

          {/* Income List Table */}
          <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-sentient text-primary">
                All Incomes
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-4 px-4 font-sentient">Name</th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 font-sentient">Type</th>
                    <th className="text-left py-4 px-4 font-sentient">Date</th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incomeData.incomes.map((income) => (
                    <tr
                      key={income.id}
                      className="border-b-2 border-primary hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">{income.name}</td>
                      <td className="py-4 px-4">
                        ₹{income.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        {income.type === 0
                          ? "Salary"
                          : income.type === 1
                          ? "Side Hustle"
                          : income.type === 2
                          ? "Business"
                          : "Withdrawal"}
                      </td>
                      <td className="py-4 px-4">
                        {new Date(income.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDeleteIncome(income.id)}
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
      </div>
    </div>
  );
};

export default Dashboard;
