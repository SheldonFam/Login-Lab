import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import {
  handleApiError,
  validateEmail,
  validatePassword,
  validateRequiredFields,
  createApiError,
} from "../../lib/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const missingField = validateRequiredFields(body, [
      "name",
      "email",
      "password",
    ]);
    if (missingField) {
      throw createApiError(missingField, 400);
    }

    const { name, email, password } = body;

    // Validate email format
    if (!validateEmail(email)) {
      throw createApiError("Invalid email format", 400);
    }

    // Validate password strength
    if (!validatePassword(password)) {
      throw createApiError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        400
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createApiError("User already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
