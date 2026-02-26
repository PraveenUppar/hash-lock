import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { loginSchema } from "@/lib/validators/auth";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { z } from "zod";
import { ratelimit } from "@/lib/redis/ratelimit";

export async function POST(request: Request) {
  // 1. Get IP
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // 2. CHECK RATE LIMIT
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  // If the limit is hit (success is false), return a 429 error immediately.
  if (!success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // 3. Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 4. Verify User exists AND has a password
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5. Verify Password
    const isValid = await verifyPassword(user.passwordHash, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 6. Create Session & Set Cookie
    await createSession(user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
