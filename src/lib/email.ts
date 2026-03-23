import { Resend } from "resend";

export async function sendInviteEmail({
  to,
  eventTitle,
  date,
  role,
}: {
  to: string;
  eventTitle: string;
  date: string;
  role: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  console.log("RESEND_API_KEY exists:", !!apiKey);
  console.log("Sending email to:", to);

  if (!apiKey) {
    console.error("RESEND_API_KEY is missing");
    return;
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from: "Aldești Service Team <onboarding@resend.dev>",
    to,
    subject: `Invitație nouă • ${eventTitle}`,
    html: `
      <div style="margin:0; padding:0; background-color:#070707;">
        <div style="display:none; max-height:0; overflow:hidden;">
          Ai primit o invitație nouă pentru echipa de închinare.
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#070707; margin:0; padding:24px 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; margin:0 auto; background:linear-gradient(180deg,#161616 0%, #0b0b0b 100%); border:1px solid rgba(255,255,255,0.08); border-radius:24px; overflow:hidden;">
                
                <tr>
                  <td style="padding:32px 32px 18px 32px; background:
                    radial-gradient(circle at top left, rgba(220,68,68,0.20), transparent 32%),
                    linear-gradient(180deg,#181818 0%, #101010 100%);
                  ">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <div style="width:56px; height:56px; border-radius:18px; background:rgba(220,68,68,0.10); border:1px solid rgba(220,68,68,0.22); display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            <img
                              src="http://localhost:3000/logo.png"
                              alt="Aldești Worship"
                              width="40"
                              height="40"
                              style="display:block; object-fit:contain;"
                            />
                          </div>
                        </td>
                        <td style="padding-left:14px; vertical-align:middle;">
                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:18px; font-weight:800; color:#ffffff; line-height:1.2;">
                            Biserica Penticostală Aldești
                          </div>
                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#a1a1aa; padding-top:4px;">
                            Worship Team Scheduling
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 32px 0 32px;">
                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:#fca5a5; margin-bottom:12px;">
                      Invitație nouă
                    </div>

                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:32px; line-height:1.1; font-weight:800; color:#ffffff; margin-bottom:14px;">
                      Ai primit o invitație
                    </div>

                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:1.7; color:#d4d4d8; margin-bottom:24px;">
                      Ai fost invitat să slujești în echipa de închinare. Mai jos găsești toate detaliile importante despre invitația ta.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 8px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px;">
                      <tr>
                        <td style="padding:20px;">
                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#a1a1aa; margin-bottom:6px;">
                            Eveniment
                          </div>
                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:18px; font-weight:700; color:#ffffff; margin-bottom:18px;">
                            ${eventTitle}
                          </div>

                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#a1a1aa; margin-bottom:6px;">
                            Data
                          </div>
                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:16px; font-weight:600; color:#ffffff; margin-bottom:18px;">
                            ${date}
                          </div>

                          <div style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#a1a1aa; margin-bottom:6px;">
                            Rol
                          </div>
                          <div style="display:inline-block; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:700; color:#fca5a5; background:rgba(220,68,68,0.10); border:1px solid rgba(220,68,68,0.22); border-radius:999px; padding:8px 12px;">
                            ${role}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 32px 8px 32px;">
                    <a
                      href="http://localhost:3000/dashboard"
                      style="display:inline-block; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; background:linear-gradient(135deg,#c93d3d 0%, #ef4444 100%); border-radius:16px; padding:14px 20px; box-shadow:0 12px 26px rgba(220,68,68,0.24);"
                    >
                      Vezi în aplicație
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 32px 30px 32px;">
                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.7; color:#a1a1aa;">
                      Te rugăm să intri în aplicație pentru a confirma sau refuza invitația. Dacă ai întrebări, discută cu liderul echipei.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 28px 32px;">
                    <div style="height:1px; background:rgba(255,255,255,0.08);"></div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 30px 32px;">
                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.7; color:#71717a;">
                      Acest email a fost trimis automat de platforma echipei de închinare – Biserica Penticostală Aldești.
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  console.log("Resend result:", result);
}
