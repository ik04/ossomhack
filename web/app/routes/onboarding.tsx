import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import axios from "axios";

type ProfileData = {
  location: string;
  occupation: string;
  age: number;
};

type IncomeData = {
  name: string;
  amount: number;
  type: number;
};

type ExpenseData = {
  name: string;
  amount: number;
  type: number;
};

type LoanData = {
  principal: number;
  rate_of_interest: number;
  tenure: number;
};

type InvestmentData = {
  principal: number;
  rate_of_interest: number;
  number_of_times: number;
  time: number;
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    location: "",
    occupation: "",
    age: 0,
  });

  const [incomes, setIncomes] = useState<IncomeData[]>([
    { name: "", amount: 0, type: 0 },
  ]);

  const [expenses, setExpenses] = useState<ExpenseData[]>([
    { name: "", amount: 0, type: 0 },
  ]);

  const [loans, setLoans] = useState<LoanData[]>([]);
  const [investments, setInvestments] = useState<InvestmentData[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/onboard",
        {
          profile,
          incomes,
          expenses,
          loans,
          investments,
        },
        {
          withCredentials: true,
        }
      );

      if (data.status) {
        navigate("/profile");
      } else {
        setError(data.message || "Submission failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-sentient text-primary">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary">
                  Location
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                >
                  <option value="">Select location</option>
                  <option value="urban">Urban</option>
                  <option value="suburban">Suburban</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary">
                  Occupation
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.occupation}
                  onChange={(e) =>
                    setProfile({ ...profile, occupation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary">
                  Age
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-sentient text-primary">
              Income Sources
            </h2>
            {incomes.map((income, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Source Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={income.name}
                    onChange={(e) => {
                      const newIncomes = [...incomes];
                      newIncomes[index].name = e.target.value;
                      setIncomes(newIncomes);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={income.amount}
                    onChange={(e) => {
                      const newIncomes = [...incomes];
                      newIncomes[index].amount = parseFloat(e.target.value);
                      setIncomes(newIncomes);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={income.type}
                    onChange={(e) => {
                      const newIncomes = [...incomes];
                      newIncomes[index].type = parseInt(e.target.value);
                      setIncomes(newIncomes);
                    }}
                  >
                    <option value={0}>Salary</option>
                    <option value={1}>Investment</option>
                    <option value={2}>Business</option>
                    <option value={3}>Other</option>
                  </select>
                </div>
                {incomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setIncomes(incomes.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setIncomes([...incomes, { name: "", amount: 0, type: 0 }])
              }
              className="text-secondary"
            >
              Add Income Source
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-sentient text-primary">Expenses</h2>
            {expenses.map((expense, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={expense.name}
                    onChange={(e) => {
                      const newExpenses = [...expenses];
                      newExpenses[index].name = e.target.value;
                      setExpenses(newExpenses);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={expense.amount}
                    onChange={(e) => {
                      const newExpenses = [...expenses];
                      newExpenses[index].amount = parseFloat(e.target.value);
                      setExpenses(newExpenses);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={expense.type}
                    onChange={(e) => {
                      const newExpenses = [...expenses];
                      newExpenses[index].type = parseInt(e.target.value);
                      setExpenses(newExpenses);
                    }}
                  >
                    <option value={0}>Housing</option>
                    <option value={1}>Food</option>
                    <option value={2}>Transportation</option>
                    <option value={3}>Other</option>
                  </select>
                </div>
                {expenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpenses(expenses.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setExpenses([...expenses, { name: "", amount: 0, type: 0 }])
              }
              className="text-secondary"
            >
              Add Expense
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-sentient text-primary">Loans</h2>
            {loans.map((loan, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Principal
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={loan.principal}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].principal = parseFloat(e.target.value);
                      setLoans(newLoans);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Rate of Interest (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={loan.rate_of_interest}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].rate_of_interest = parseFloat(
                        e.target.value
                      );
                      setLoans(newLoans);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Tenure (months)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={loan.tenure}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].tenure = parseInt(e.target.value);
                      setLoans(newLoans);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLoans(loans.filter((_, i) => i !== index))}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setLoans([
                  ...loans,
                  { principal: 0, rate_of_interest: 0, tenure: 0 },
                ])
              }
              className="text-secondary"
            >
              Add Loan
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-sentient text-primary">Investments</h2>
            {investments.map((investment, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Principal
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={investment.principal}
                    onChange={(e) => {
                      const newInvestments = [...investments];
                      newInvestments[index].principal = parseFloat(
                        e.target.value
                      );
                      setInvestments(newInvestments);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Rate of Interest (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={investment.rate_of_interest}
                    onChange={(e) => {
                      const newInvestments = [...investments];
                      newInvestments[index].rate_of_interest = parseFloat(
                        e.target.value
                      );
                      setInvestments(newInvestments);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Compounding Frequency
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={investment.number_of_times}
                    onChange={(e) => {
                      const newInvestments = [...investments];
                      newInvestments[index].number_of_times = parseInt(
                        e.target.value
                      );
                      setInvestments(newInvestments);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Time Period (years)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={investment.time}
                    onChange={(e) => {
                      const newInvestments = [...investments];
                      newInvestments[index].time = parseInt(e.target.value);
                      setInvestments(newInvestments);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setInvestments(investments.filter((_, i) => i !== index))
                  }
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setInvestments([
                  ...investments,
                  {
                    principal: 0,
                    rate_of_interest: 0,
                    number_of_times: 12,
                    time: 0,
                  },
                ])
              }
              className="text-secondary"
            >
              Add Investment
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`w-8 h-8 rounded-full ${
                    currentStep === step
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
              {error}
            </div>
          )}

          {renderStep()}

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="bg-gray-200 px-4 py-2 rounded-md"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
