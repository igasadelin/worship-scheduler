import Link from "next/link";
import { requireAdmin } from "@/lib/permissions";
import Navbar from "@/components/navbar";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Admin</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 760 }}>
            Gestionează utilizatorii, evenimentele și departamentele platformei.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Link href="/admin/users" className="btn-primary">
            Manage users
          </Link>

          <Link href="/admin/events" className="btn-primary">
            Manage events
          </Link>

          <Link href="/admin/departments" className="btn-primary">
            Manage departments
          </Link>
        </div>
      </main>
    </>
  );
}