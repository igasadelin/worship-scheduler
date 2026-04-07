import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import Navbar from "@/components/navbar";
import ConfirmSubmitButton from "@/components/confirm-submit-button";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./actions";

export default async function AdminDepartmentsPage() {
  await requireAdmin();

  const departments = await prisma.department.findMany({
    include: {
      userDepartments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Manage departments</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 760 }}>
            Adaugă, modifică și șterge departamentele din platformă.
          </p>
        </div>

        <div className="grid-2">
          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Create department</h2>

            <form
              action={createDepartment}
              style={{ display: "grid", gap: 16 }}
            >
              <div>
                <label className="soft-label">Department name</label>
                <input
                  name="name"
                  type="text"
                  className="input-ui"
                  placeholder="Ex: Solist"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Create department
              </button>
            </form>
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Departments list</h2>

            <div className="card-list">
              {departments.map((department) => (
                <div key={department.id} className="item-card">
                  <div className="item-title">{department.name}</div>

                  <div className="item-meta" style={{ marginTop: 8 }}>
                    Members: {department.userDepartments.length}
                  </div>

                  {department.userDepartments.length > 0 ? (
                    <div className="item-meta" style={{ marginTop: 8 }}>
                      {department.userDepartments
                        .map((item) => item.user.name)
                        .join(", ")}
                    </div>
                  ) : null}

                  <form
                    action={updateDepartment}
                    style={{ display: "grid", gap: 12, marginTop: 16 }}
                  >
                    <input
                      type="hidden"
                      name="departmentId"
                      value={department.id}
                    />

                    <div>
                      <label className="soft-label">Rename department</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={department.name}
                        className="input-ui"
                        required
                      />
                    </div>

                    <button type="submit" className="btn-secondary">
                      Save name
                    </button>
                  </form>

                  <form action={deleteDepartment} style={{ marginTop: 12 }}>
                    <input
                      type="hidden"
                      name="departmentId"
                      value={department.id}
                    />

                    <ConfirmSubmitButton
                      message="Ești sigur că vrei să ștergi acest departament?"
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      Delete department
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ))}

              {departments.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">Nu există departamente.</div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
