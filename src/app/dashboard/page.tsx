import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "../dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardContent />;
}
