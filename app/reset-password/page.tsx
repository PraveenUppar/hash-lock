"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return <div className="text-red-500">Invalid Link</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);

    // Redirect after 2 seconds
    setTimeout(() => router.push("/login"), 2000);
  };

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">Success!</h1>
        <p>Your password has been reset. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {isLoading ? "Resetting..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
