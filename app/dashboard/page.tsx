import styles from "./dashboard.module.css";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard — Sniplink",
  description: "Manage your short links and view analytics.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className={styles.page}>
      <DashboardClient />
    </div>
  );
}
