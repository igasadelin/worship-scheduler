"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignOutButton from "./sign-out-button";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(path: string) {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  }

  function linkClass(active: boolean) {
    return `btn-secondary ${active ? "bg-white/10 border-white/20" : ""}`;
  }

  return (
    <div className="page-container" style={{ paddingBottom: 0 }}>
      <div className="topbar mobile-topbar">
        <div className="brand-wrap">
          <div className="brand-mark">
            <Image
              src="/logo.png"
              alt="Logo"
              width={30}
              height={30}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div>
            <div className="brand-title">Aldești Worship</div>
            <div className="brand-subtitle">Scheduling Platform</div>
          </div>
        </div>

        <div className="desktop-nav">
          <Link href="/dashboard" className={linkClass(isActive("/dashboard"))}>
            Dashboard
          </Link>

          <Link href="/admin" className={linkClass(isActive("/admin"))}>
            Admin
          </Link>

          <Link
            href="/admin/events"
            className={linkClass(isActive("/admin/events"))}
          >
            Events
          </Link>

          <Link
            href="/admin/users"
            className={linkClass(isActive("/admin/users"))}
          >
            Users
          </Link>

          <Link
            href="/dashboard/blackouts"
            className={linkClass(isActive("/dashboard/blackouts"))}
          >
            Blackouts
          </Link>

          <SignOutButton />
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="mobile-nav glass-card">
          <Link
            href="/dashboard"
            className={linkClass(isActive("/dashboard"))}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/admin"
            className={linkClass(isActive("/admin"))}
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>

          <Link
            href="/admin/events"
            className={linkClass(isActive("/admin/events"))}
            onClick={() => setOpen(false)}
          >
            Events
          </Link>

          <Link
            href="/admin/users"
            className={linkClass(isActive("/admin/users"))}
            onClick={() => setOpen(false)}
          >
            Users
          </Link>

          <Link
            href="/dashboard/blackouts"
            className={linkClass(isActive("/dashboard/blackouts"))}
            onClick={() => setOpen(false)}
          >
            Blackouts
          </Link>

          <SignOutButton />
        </div>
      )}
    </div>
  );
}
