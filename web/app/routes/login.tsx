import { useState } from "react";
import { Form } from "@remix-run/react";

export default function Login() {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Logo in top left corner */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-10"
            src="/assets/pennywise.svg"
            alt="pennywise"
          />
          <div className="font-sentient uppercase font-semibold text-2xl tracking-wide text-secondary">
            pennywise
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="font-sentient text-2xl font-medium text-primary mb-6">
              Welcome Back
            </h2>

            <Form method="post" className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

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
                className="w-full bg-primary text-white font-sentient py-3 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Sign In
              </button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-secondary hover:underline font-medium"
                >
                  Sign up
                </a>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
