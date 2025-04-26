"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!code) {
        setError("No authorization code received");
        return;
      }

      try {
        await login(code);
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Authentication failed");
      }
    };

    if (code && !isAuthenticated) {
      handleCallback();
    } else if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [code, login, router, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {error ? "Authentication Error" : "Authenticating..."}
          </h2>

          {error ? (
            <div className="mt-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Please wait while we authenticate you...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
