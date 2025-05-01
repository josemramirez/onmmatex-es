import { NextResponse } from "next/server";
import Resend from "next-auth/providers/resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    const data = await resend.emails.send({
      from: "[on]MMaTeX <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
