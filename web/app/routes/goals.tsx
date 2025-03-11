import React, { useEffect, useState } from "react";
import { Sidebar } from "~/components/sidebar";
import axios from "axios";
import { useNavigate } from "@remix-run/react";

interface Goal {
  id: number;
  title: string;
  amount: number;
  mode: number;
  is_achieved: boolean;
  created_at: string;
}

interface Contribution {
  user_id: number;
  name: string;
  amount: number;
  proportion: number;
  salary: number;
}

interface GoalDetails {
  goal: {
    id: number;
    name: string;
    title: string;
    amount: number;
    mode: number;
    is_achieved: boolean;
    created_at: string;
  };
  portions: {
    contributions: Contribution[];
    goal_amount: number;
    total_contributors: number;
  };
}

interface SelectedGoal {
  goal: {
    id: number;
    name: string;
    amount: number;
    mode: number;
    is_achieved: boolean;
    created_at: string;
  };
  portions: {
    goal_amount: number;
    total_contributors: number;
    contributions: {
      user_id: number;
      name?: string;
      amount: number;
      proportion: number;
      salary?: number;
    }[];
  };
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/goals", {
        withCredentials: true,
      });
      setGoals(response.data.goals);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (formData: any) => {
    try {
      await axios.post("http://localhost:8000/api/goals", formData, {
        withCredentials: true,
      });
      setShowAddModal(false);
      fetchGoals();
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };

  const handleGoalClick = async (goalId: number) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/goals/${goalId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Goal details response:", response.data);
      setSelectedGoal(response.data);
    } catch (error) {
      console.error("Failed to fetch goal details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCopyInvite = (goalId: number) => {
    const inviteLink = `http://localhost:3000/goals/join/${goalId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-[120px] border-b border-primary font-sentient font-medium text-[69px] px-5 flex justify-between items-end">
          <span>Goals</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 px-6 py-2 bg-primary text-white rounded-lg text-base font-normal"
          >
            Add Goal
          </button>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-background border-2 border-primary rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-sentient text-primary mb-4">
                Create New Goal
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddGoal({
                    title: formData.get("name"),
                    amount: parseFloat(formData.get("amount") as string),
                    mode: parseInt(formData.get("mode") as string),
                  });
                }}
              >
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Goal Name"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <input
                    name="amount"
                    type="number"
                    placeholder="Target Amount"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  />
                  <select
                    name="mode"
                    className="w-full p-2 border-2 border-primary rounded-lg bg-background"
                    required
                  >
                    <option value="0">Equal Split</option>
                    <option value="1">Salary Based Split</option>
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
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleGoalClick(goal.id)}
                className="bg-background border-2 border-primary rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-sentient text-primary mb-2">
                  {goal.title}
                </h3>
                <p className="text-3xl font-medium mb-2">
                  ₹{goal.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Mode: {goal.mode === 0 ? "Equal Split" : "Salary Based"}
                </p>
              </div>
            ))}
          </div>

          {detailsLoading && (
            <div className="text-center py-8">Loading goal details...</div>
          )}

          {selectedGoal && !detailsLoading && (
            <div className="bg-background border-2 border-primary rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-sentient text-primary mb-2">
                    {selectedGoal.goal.name}
                  </h2>
                  <p className="text-3xl font-medium">
                    ₹{selectedGoal.goal.amount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyInvite(selectedGoal.goal.id)}
                  className={`px-4 py-2 ${
                    copied ? "bg-green-500" : "bg-primary"
                  } text-white rounded-lg transition-colors`}
                >
                  {copied ? "Copied!" : "Copy Invite Link"}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-sentient text-primary mb-4">
                  Contributors ({selectedGoal.portions.total_contributors})
                </h3>
                <div className="space-y-4">
                  {Object.values(selectedGoal.portions.contributions).map(
                    (contribution) => (
                      <div
                        key={contribution.user_id}
                        className="flex justify-between items-center p-4 bg-white rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {contribution.name ||
                              `Member ${contribution.user_id}`}
                          </p>
                          {contribution.salary && (
                            <p className="text-sm text-gray-600">
                              Salary: ₹{contribution.salary.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-medium">
                            ₹{contribution.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {(contribution.proportion * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
