"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignOutButton from "./sign-out-button";

type NavbarProps = {
  role?: "ADMIN" | "MEMBER";
};

export default function Navbar({ role = "MEMBER" }: NavbarProps) {
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

  const memberLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/dashboard/blackouts", label: "Blackouts" },
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/dashboard/blackouts", label: "Blackouts" },
    { href: "/admin", label: "Admin" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/events", label: "Manage Events" },
  ];

  const links = role === "ADMIN" ? adminLinks : memberLinks;

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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}

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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(isActive(link.href))}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <SignOutButton />
        </div>
      )}
    </div>
  );
}
