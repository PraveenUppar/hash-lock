import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // 1. Find the token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // 2. Validate Token
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // 3. Hash new password
    const hashedPassword = await hashPassword(password);

    // 4. Update User
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash: hashedPassword },
    });

    // 5. Clean up: Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

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
