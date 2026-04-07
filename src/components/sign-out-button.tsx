"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import ConfirmSignOutModal from "./confirm-sign-out-modal";

export default function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="post">
      <button
        type="submit"
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Sign out
      </button>
    </form>
  );
}
