import Link from "next/link";
import { requireAdmin } from "@/lib/permissions";
import SignOutButton from "@/components/sign-out-button";
import Navbar from "@/components/navbar";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin</h1>
        </div>

        <div className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <Link href="/admin/users" className="btn-primary">
            Manage users
          </Link>

          <Link href="/admin/events" className="btn-primary">
            Manage events
          </Link>
        </div>
      </div>
    </main>
  );
}
