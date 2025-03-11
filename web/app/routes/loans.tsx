import { useEffect, useState } from "react";
import { Sidebar } from "~/components/sidebar";
import axios from "axios";

interface Loan {
  id: number;
  name: string;
  amount: number;
  monthly_emi: number;
  tenure_left: number;
  is_paid: boolean;
  user_id: number;
  created_at: string;
}

interface LoanSummary {
  savings_after_emi: number;
  total_emi: number;
  loans: {
    name: string;
    emi: number;
    tenure_left: number;
  }[];
}

interface LoanData {
  loans: Loan[];
  summary: LoanSummary;
}

interface AddLoanForm {
  name: string;
  amount: number;
  monthly_emi: number;
  tenure_left: number;
  is_paid: boolean;
}

export default function Loans() {
  const [loanData, setLoanData] = useState<LoanData>({
    loans: [],
    summary: {
      savings_after_emi: 0,
      total_emi: 0,
      loans: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/loans", {
        withCredentials: true,
      });
      console.log(response.data);

      if (response.status === 200) {
        setLoanData({
          loans: response.data.loans,
          summary: response.data.summary,
        });
      }
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLoan = async (formData: AddLoanForm) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/loans",
        {
          ...formData,
          is_paid: false,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status) {
        setShowAddModal(false);
        fetchLoans();
      }
    } catch (error) {
      console.error("Failed to add loan:", error);
    }
  };

  const handleDeleteLoan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this loan?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/loans/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        fetchLoans();
      }
    } catch (error) {
      console.error("Failed to delete loan:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-[120px] border-b border-primary font-sentient font-medium text-[69px] px-5 flex justify-between items-end">
          <span>Loans</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 px-6 py-2 bg-primary text-white rounded-lg text-base font-normal"
          >
            Add Loan
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Total Loan Amount
              </h3>
              <p className="text-3xl font-medium">
                ₹
                {loanData.loans
                  .reduce((acc, loan) => acc + loan.amount, 0)
                  .toLocaleString()}
              </p>
            </div>

            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Monthly EMI
              </h3>
              <p className="text-3xl font-medium">
                ₹{loanData.summary.total_emi.toLocaleString()}
              </p>
            </div>

            <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 h-[200px]">
              <h3 className="text-xl font-sentient text-primary mb-2">
                Average Tenure Left
              </h3>
              <p className="text-3xl font-medium">
                {loanData.summary.loans.reduce(
                  (acc, loan) => acc + loan.tenure_left,
                  0
                ) / loanData.summary.loans.length}{" "}
                months
              </p>
            </div>
          </div>

          <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-sentient text-primary">All Loans</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-4 px-4 font-sentient">Name</th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Monthly EMI
                    </th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Tenure Left
                    </th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-sentient">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loanData.loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">{loan.name}</td>
                      <td className="py-4 px-4">
                        ₹{loan.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        ₹{loan.monthly_emi.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">{loan.tenure_left} months</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            loan.is_paid
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {loan.is_paid ? "Paid" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
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

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-background border-2 border-primary rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-sentient text-primary mb-4">
                Add New Loan
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddLoan({
                    name: formData.get("name") as string,
                    amount: parseFloat(formData.get("amount") as string),
                    monthly_emi: parseFloat(
                      formData.get("monthly_emi") as string
                    ),
                    tenure_left: parseInt(
                      formData.get("tenure_left") as string
                    ),
                    is_paid: false,
                  });
                }}
              >
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Loan Name"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <input
                    name="amount"
                    type="number"
                    placeholder="Loan Amount"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <input
                    name="monthly_emi"
                    type="number"
                    placeholder="Monthly EMI"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <input
                    name="tenure_left"
                    type="number"
                    placeholder="Tenure Left (months)"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
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
