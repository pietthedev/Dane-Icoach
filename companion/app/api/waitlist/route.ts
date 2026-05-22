import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, interest } = body as {
      name?: string;
      email?: string;
      interest?: string;
    };

    console.log("[waitlist] Received submission:", { name, email, interest });

    // --- Validate ---
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // --- Airtable ---
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    console.log("[waitlist] Airtable config:", {
      hasApiKey: !!apiKey,
      baseId,
      tableName,
    });

    if (!apiKey || !baseId || !tableName) {
      console.error("[waitlist] Missing Airtable environment variables:", {
        hasApiKey: !!apiKey,
        hasBaseId: !!baseId,
        hasTableName: !!tableName,
      });
      return NextResponse.json(
        { error: "Server configuration error — missing Airtable env vars." },
        { status: 500 }
      );
    }

    try {
      const base = new Airtable({ apiKey }).base(baseId);

      console.log('Sending to Airtable:', { Name: name, Email: email, Interest: interest })
      console.log('Table name:', process.env.AIRTABLE_TABLE_NAME)
      console.log('Base ID:', process.env.AIRTABLE_BASE_ID)

      const record = await base(tableName).create([
        {
          fields: {
            'Name': String(name),
            'Email': String(email),
            'Interest': String(interest),
          },
        },
      ]);

      console.log("[waitlist] Airtable record created:", record[0]?.id);
    } catch (airtableErr: unknown) {
      const msg =
        airtableErr instanceof Error
          ? airtableErr.message
          : String(airtableErr);
      console.error("[waitlist] Airtable error:", msg, airtableErr);
      return NextResponse.json(
        { error: `Airtable error: ${msg}` },
        { status: 500 }
      );
    }

    // --- Resend notification ---
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    console.log("[waitlist] Resend config:", {
      hasResendKey: !!resendApiKey,
      notificationEmail,
    });

    if (resendApiKey && notificationEmail) {
      try {
        const resend = new Resend(resendApiKey);

        const emailResult = await resend.emails.send({
          from: "Companion Waitlist <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `New Waitlist Signup — ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #2E2A36;">
              <div style="background: #2E1A47; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 20px;">
                  New Waitlist Signup ✦
                </h1>
                <p style="color: rgba(255,255,255,0.65); margin: 6px 0 0; font-size: 13px;">
                  Companion by Danè
                </p>
              </div>
              <div style="background: #FAF9FD; padding: 28px 32px; border: 1px solid #E8E1F7; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 13px; color: #6E667A; width: 110px;">Name</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 14px; font-weight: 600; color: #2E1A47;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 13px; color: #6E667A;">Email</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E8E1F7; font-size: 14px; color: #2E1A47;">
                      <a href="mailto:${email}" style="color: #4B2E83; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 13px; color: #6E667A;">Interest</td>
                    <td style="padding: 10px 0; font-size: 14px; color: #2E1A47;">${interest || "—"}</td>
                  </tr>
                </table>
                <p style="margin: 24px 0 0; font-size: 12px; color: #6E667A;">
                  Signed up ${new Date().toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}
                </p>
              </div>
            </div>
          `,
        });

        console.log("[waitlist] Resend email sent:", emailResult);
      } catch (resendErr: unknown) {
        // Log but don't fail the request — the signup was already saved to Airtable
        const msg =
          resendErr instanceof Error ? resendErr.message : String(resendErr);
        console.error("[waitlist] Resend error (non-fatal):", msg, resendErr);
      }
    } else {
      console.log("[waitlist] Skipping Resend — env vars not configured.");
    }

    console.log("[waitlist] Submission complete for:", email);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[waitlist] Unhandled error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
