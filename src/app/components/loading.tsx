"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
