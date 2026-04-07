"use client";

import { useMemo, useState } from "react";

type UserItem = {
  id: string;
  name: string;
  email: string;
  blocked: boolean;
  departments: {
    id: string;
    name: string;
  }[];
};

type DepartmentItem = {
  id: string;
  name: string;
};

export default function SendRequestForm({
  eventId,
  users,
  departments,
  action,
}: {
  eventId: string;
  users: UserItem[];
  departments: DepartmentItem[];
  action: (formData: FormData) => void;
}) {
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "");

  const filteredUsers = useMemo(() => {
    if (!departmentId) return users;

    const matching = users.filter((user) =>
      user.departments.some((d) => d.id === departmentId),
    );

    const nonMatching = users.filter(
      (user) => !user.departments.some((d) => d.id === departmentId),
    );

    return [...matching, ...nonMatching];
  }, [users, departmentId]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />

      <div>
        <label className="mb-1 block text-sm text-zinc-300">Department</label>
        <select
          name="departmentId"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
          required
        >
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-zinc-300">User</label>
        <select
          name="userId"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
          required
        >
          {filteredUsers.map((user) => {
            const matchesDepartment = user.departments.some(
              (d) => d.id === departmentId,
            );

            return (
              <option key={user.id} value={user.id}>
                {user.name} {matchesDepartment ? "(MATCH)" : "(OTHER)"}{" "}
                {user.blocked ? "• BLACKOUT" : "• AVAILABLE"}
              </option>
            );
          })}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90"
      >
        Send request
      </button>
    </form>
  );
}
