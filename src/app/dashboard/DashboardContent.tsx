"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { Loading } from "@/app/components/Loading";

export default function DashboardContent() {
  const { session, isLoading } = useAuth();
  const [lastLogin, setLastLogin] = useState<string>("");

  useEffect(() => {
    // Use a consistent date format that doesn't depend on locale
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    let hours = now.getHours();

    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // the hour '0' should be '12'

    const formattedTime = `${String(hours).padStart(
      2,
      "0"
    )}:${minutes}:${seconds} ${ampm}`;
    const formattedDateTime = `${year}-${month}-${day} ${formattedTime}`;

    setLastLogin(formattedDateTime);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!session) {
    return null; // This should never happen due to the server-side check
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Image
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
                className="h-8 w-auto"
                width={32}
                height={32}
                priority
              />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">{session.user?.email}</div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="max-w-2xl text-base leading-7 text-gray-700">
                <p>Welcome back {session.user?.name || "User"}!</p>
                <p className="mt-2">Last login: {lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
