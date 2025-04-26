"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <main className="max-w-md w-full space-y-10 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            OAuth Integration Demo
          </h1>
          <p className="text-gray-500">Choose an OAuth implementation method</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Server-side OAuth (Traditional)
          </Link>

          <Link
            href="/clientoauth"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Client-side OAuth (Frontend Only)
          </Link>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Google OAuth implementation using{" "}
              <span className="font-mono">@react-oauth/google</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          Learn more about this implementation in{" "}
          <Link
            href="/GOOGLE-OAUTH-README.md"
            className="text-indigo-600 hover:text-indigo-800"
          >
            our documentation
          </Link>
        </p>
      </footer>
    </div>
  );
}
