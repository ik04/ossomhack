import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import axios from "axios";

export const loader = async ({ params }: { params: { id: number } }) => {
  return { goalId: params.id };
};

export default function JoinGoal() {
  const { goalId } = useLoaderData<{ goalId: number }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  console.log("fuck this");

  const handleJoinGoal = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:8000/api/goals/${goalId}/join`,
        {},
        { withCredentials: true }
      );

      if (response.data.status) {
        navigate("/goals");
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to join goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-background border-2 border-primary rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-sentient text-primary mb-6 text-center">
          Join Goal
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <p className="text-center mb-8">
          You've been invited to join this goal. Click below to join and start
          contributing.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleJoinGoal}
            disabled={loading}
            className={`px-6 py-3 bg-primary text-white rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
            }`}
          >
            {loading ? "Joining..." : "Join Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}
