"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError("Email sau parolă invalidă.");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="auth-wrapper">
      <div className="auth-card">
        <section className="auth-right">
          <div className="form-wrap">
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    color: "#fca5a5",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Secure access
                </p>

                <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
                  Sign in
                </h2>

                <p className="helper-text">
                  Intră în cont pentru a vedea cererile primite, evenimentele
                  acceptate și lineup-ul confirmat.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gap: 16 }}
              >
                <div>
                  <label className="soft-label">Email</label>
                  <input
                    type="email"
                    className="input-ui"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplu@biserica.ro"
                    required
                  />
                </div>

                <div>
                  <label className="soft-label">Parolă</label>
                  <input
                    type="password"
                    className="input-ui"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introdu parola"
                    required
                  />
                </div>

                {error ? (
                  <div
                    style={{
                      border: "1px solid rgba(239,68,68,0.22)",
                      background: "rgba(239,68,68,0.08)",
                      color: "#fca5a5",
                      borderRadius: 16,
                      padding: "12px 14px",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
