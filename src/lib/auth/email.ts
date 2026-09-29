const RESEND_API_URL = "https://api.resend.com/emails";

type MenuunEmailInput = {
  to: string;
  subject: string;
  preview: string;
  heading: string;
  body: string;
  actionLabel: string;
  actionUrl: string;
  footer: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendMenuunEmail(input: MenuunEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Menuun <noreply@mail.menuun.com>";
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: [
        input.preview,
        "",
        input.body,
        "",
        `${input.actionLabel}: ${input.actionUrl}`,
        "",
        input.footer,
      ].join("\n"),
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f7f4ef;font-family:Arial,sans-serif;color:#1d1b18">
    <div style="max-width:560px;margin:32px auto;padding:24px">
      <div style="background:#fff;border:1px solid #e7e0d6;border-radius:18px;padding:32px">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;letter-spacing:.08em">MENUUN</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2">${escapeHtml(input.heading)}</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#5e5952">${escapeHtml(input.body)}</p>
        <a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#1d1b18;color:#fff;text-decoration:none;font-weight:700">${escapeHtml(input.actionLabel)}</a>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#777067">${escapeHtml(input.footer)}</p>
      </div>
    </div>
  </body>
</html>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend email request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
}
