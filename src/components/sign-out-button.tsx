"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import ConfirmSignOutModal from "./confirm-sign-out-modal";

export default function SignOutButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary">
        Sign out
      </button>

      <ConfirmSignOutModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => signOut({ callbackUrl: "/login" })}
      />
    </>
  );
}
