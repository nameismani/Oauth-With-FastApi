"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

// import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import dynamic from "next/dynamic";

const Oauth = dynamic(() => import("@/components/Oauth"), { ssr: false });
const GoogleLogin = dynamic(
  () => import("@react-oauth/google").then((mod) => mod.GoogleLogin),
  { ssr: false }
);
const GoogleAuth = dynamic(
  () => import("@/components/GoogleAuth").then((mod) => mod.default),
  { ssr: false }
);

export default function ClientOAuthPage() {
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    setIsLoading(false);
  }, []);

  // Standard Google button handler
  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded = jwtDecode(credentialResponse.credential);
        console.log(decoded, "decoded");
        loginWithGoogle(decoded);
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  console.log(user, "user");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Client-side OAuth
          </h1>

          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={user.picture ?? ""}
                    alt={user.name || "User"}
                    className="h-24 w-24 rounded-full object-cover border-4 border-indigo-100"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-400 h-4 w-4 rounded-full border-2 border-white"></div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-gray-600 mb-4">
                Sign in with your Google account
              </p>

              {/* Standard Google Login Button */}
              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => console.error("Login Failed")}
                  useOneTap
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="pill"
                />
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    or use custom button
                  </span>
                </div>
              </div>

              {/* Custom Google Auth Button */}
              <div className="flex justify-center">
                <GoogleAuth
                  buttonText="Sign in with Google"
                  className="w-full py-2.5 rounded-lg font-medium"
                />

                <Oauth />
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
