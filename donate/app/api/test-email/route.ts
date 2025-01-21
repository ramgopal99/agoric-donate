import { sendEmail } from "@/lib/emails";
import WelcomeEmail from "@/emails/welcome-email";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test welcome email
    const result = await sendEmail({
      to: "ramgopalbagh009@gmail.com", // Replace with your email
      subject: "Test Welcome Email",
      template: WelcomeEmail,
      props: {
        name: "Test User",
        verificationUrl: "http://localhost:3000/verify",
      },
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Failed to send test email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
