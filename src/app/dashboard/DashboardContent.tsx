"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface DashboardContentProps {
  session: Session;
}

export default function DashboardContent({ session }: DashboardContentProps) {
  return (
    <div className="p-5 max-w-2xl mx-auto font-sans">
      <h1 className="text-gray-800 border-b-2 border-gray-200 pb-2.5">
        Welcome to your dashboard
      </h1>
      <p className="text-lg my-2.5">
        👋 Hello, <strong>{session.user?.name || "User"}</strong>
      </p>
      <p className="text-base text-gray-600">Email: {session.user?.email}</p>
      <button
        type="button"
        onClick={() => signOut()}
        className="px-5 py-2.5 bg-red-500 text-white border-none rounded cursor-pointer text-base mt-5"
      >
        Logout
      </button>
    </div>
  );
}
