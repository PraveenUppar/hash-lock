import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { z } from "zod";
import { randomBytes } from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // 1. Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    // SECURITY TIP: Even if the user doesn't exist, we return 200 OK.
    // This prevents "Email Enumeration" (hackers checking which emails valid).
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // 2. Generate a secure random token
    // We use crypto to generate a hex string
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 Hour from now

    // 3. Store token in DB
    // We delete old tokens for this email first to keep things clean
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // 4. Send Email (MOCKED)
    // In production, use Resend/SendGrid here.
    const resetLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    console.log("----------------------------------------");
    console.log("📧 MOCK EMAIL TO:", email);
    console.log("🔗 RESET LINK:", resetLink);
    console.log("----------------------------------------");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
