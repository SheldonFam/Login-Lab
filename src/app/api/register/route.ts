import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import {
  handleApiError,
  validateRequiredFields,
  createApiError,
} from "../../lib/error-handler";
import { BCRYPT_ROUNDS } from "../../lib/constants";
import { registerSchema } from "../../schemas/auth.schema";

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

    // Validate using Zod schema
    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword: password, // For validation purposes
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      throw createApiError(firstError.message, 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createApiError("User already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

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
