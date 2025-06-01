import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import {
  handleApiError,
  validatePassword,
  validateRequiredFields,
  createApiError,
} from "../../lib/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const missingField = validateRequiredFields(body, ["token", "password"]);
    if (missingField) {
      throw createApiError(missingField, 400);
    }

    const { token, password } = body;

    // Validate password strength
    if (!validatePassword(password)) {
      throw createApiError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        400
      );
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw createApiError("Invalid or expired reset token", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
