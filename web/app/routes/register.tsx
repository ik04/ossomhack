import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";

export default function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.get("username"),
          full_name: formData.get("full_name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (data.status) {
        document.cookie = `token=${data.token}; Path=/; HttpOnly`;
        location.href = "/onboarding";
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo and Back button */}
      <div className="absolute top-8 left-8 flex items-center space-x-8">
        <Link
          to="/"
          className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-sentient text-lg">Back</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <img
                className="h-16 w-16"
                src="/assets/pennywise.svg"
                alt="pennywise"
              />
              <h2 className="font-sentient text-2xl font-medium text-primary">
                Create Account
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block font-sentient text-sm text-primary"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="full_name"
                  className="block font-sentient text-sm text-primary"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block font-sentient text-sm text-primary"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block font-sentient text-sm text-primary"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-sentient py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-secondary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
