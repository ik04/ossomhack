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
  name: string;
  amount: number;
  monthly_emi: number;
  tenure_left: number;
  is_paid: boolean;
};

enum CompoundingFrequency {
  ANNUALLY = 1,
  SEMI_ANNUALLY = 2,
  QUARTERLY = 4,
  MONTHLY = 12,
  DAILY = 365,
}

// Add investment types
const INVESTMENT_TYPES = [
  "Fixed Deposit",
  "Mutual Fund",
  "Stocks",
  "Bonds",
  "Real Estate",
  "Others",
] as const;

type InvestmentData = {
  principal: number;
  rate_of_interest: number;
  compounding_frequency: number;
  time: number;
  type: string;
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
        navigate("/dashboard");
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
                  <option value="">Select city</option>
                  <optgroup label="North India">
                    <option value="delhi">Delhi</option>
                    <option value="noida">Noida</option>
                    <option value="gurgaon">Gurgaon</option>
                    <option value="chandigarh">Chandigarh</option>
                    <option value="lucknow">Lucknow</option>
                  </optgroup>
                  <optgroup label="South India">
                    <option value="bangalore">Bangalore</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="chennai">Chennai</option>
                    <option value="kochi">Kochi</option>
                    <option value="mysore">Mysore</option>
                  </optgroup>
                  <optgroup label="West India">
                    <option value="mumbai">Mumbai</option>
                    <option value="pune">Pune</option>
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="surat">Surat</option>
                    <option value="nagpur">Nagpur</option>
                  </optgroup>
                  <optgroup label="East India">
                    <option value="kolkata">Kolkata</option>
                    <option value="bhubaneswar">Bhubaneswar</option>
                    <option value="patna">Patna</option>
                    <option value="guwahati">Guwahati</option>
                    <option value="ranchi">Ranchi</option>
                  </optgroup>
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
                    <option value={1}>Passive Income</option>
                    <option value={2}>Business</option>
                    <option value={3}>Withdraw</option>
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
                    <option value={0}>Daily</option>
                    <option value={1}>Weekly</option>
                    <option value={2}>Monthly</option>
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
                    Loan Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={loan.name}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].name = e.target.value;
                      setLoans(newLoans);
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
                    value={loan.amount}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].amount = parseFloat(e.target.value);
                      setLoans(newLoans);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Monthly EMI
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={loan.monthly_emi}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].monthly_emi = parseFloat(e.target.value);
                      setLoans(newLoans);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Tenure Left (months)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={loan.tenure_left}
                    onChange={(e) => {
                      const newLoans = [...loans];
                      newLoans[index].tenure_left = parseInt(e.target.value);
                      setLoans(newLoans);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Loan Status
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary shadow-sm"
                        checked={loan.is_paid}
                        onChange={(e) => {
                          const newLoans = [...loans];
                          newLoans[index].is_paid = e.target.checked;
                          setLoans(newLoans);
                        }}
                      />
                      <span className="ml-2">Paid</span>
                    </label>
                  </div>
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
                  {
                    name: "",
                    amount: 0,
                    monthly_emi: 0,
                    tenure_left: 0,
                    is_paid: false,
                  },
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
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={investment.compounding_frequency}
                    onChange={(e) => {
                      const newInvestments = [...investments];
                      newInvestments[index].compounding_frequency = parseInt(
                        e.target.value
                      );
                      setInvestments(newInvestments);
                    }}
                  >
                    <option value={CompoundingFrequency.ANNUALLY}>
                      Annually
                    </option>
                    <option value={CompoundingFrequency.SEMI_ANNUALLY}>
                      Semi-Annually
                    </option>
                    <option value={CompoundingFrequency.QUARTERLY}>
                      Quarterly
                    </option>
                    <option value={CompoundingFrequency.MONTHLY}>
                      Monthly
                    </option>
                    <option value={CompoundingFrequency.DAILY}>Daily</option>
                  </select>
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
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Investment Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={investment.type}
                    onChange={(e) => {
                      const newInvestments = [...investments];
                      newInvestments[index].type = e.target.value;
                      setInvestments(newInvestments);
                    }}
                  >
                    <option value="">Select type</option>
                    {INVESTMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
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
                    compounding_frequency: 0,
                    time: 0,
                    type: "",
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
