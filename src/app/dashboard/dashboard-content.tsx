"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import Loading from "../components/loading";
import Button from "../components/button";
import { formatDateTime } from "../lib/utils/date";

export default function DashboardContent() {
  const { session, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const currentTime = formatDateTime();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
      // Note: If signOut fails, we reset the loading state
      // The error will be handled by NextAuth's error handling
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!session?.user) {
    return null; // This should never happen due to the server-side check
  }

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";

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
              <div className="text-sm text-gray-700" aria-label="User email">
                {userEmail}
              </div>
              <Button
                type="button"
                onClick={handleSignOut}
                isLoading={isSigningOut}
                disabled={isSigningOut}
                aria-label="Sign out of your account"
              >
                Sign out
              </Button>
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
                <p className="text-lg font-semibold text-gray-900">
                  Welcome back, {userName}!
                </p>
                <p className="mt-2 text-gray-600">
                  Current session time:{" "}
                  <time dateTime={new Date().toISOString()}>{currentTime}</time>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
