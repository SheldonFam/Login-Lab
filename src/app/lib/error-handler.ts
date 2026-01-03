import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

type ApiErrorType = {
  message: string;
  status: number;
  code?: string;
};

export function createApiError(
  message: string,
  status: number = 500,
  code?: string
): ApiErrorType {
  return {
    message,
    status,
    code,
  };
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    "status" in error
  ) {
    const apiError = error as ApiErrorType;
    return NextResponse.json(
      { message: apiError.message },
      { status: apiError.status }
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 400 }
        );
      case "P2025":
        return NextResponse.json(
          { message: "Record not found" },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          { message: "Database error occurred" },
          { status: 500 }
        );
    }
  }

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}

// Note: Email and password validation should be done using Zod schemas
// from src/app/schemas/auth.schema.ts instead of these functions.
// This file should only contain error handling utilities.

export const validateRequiredFields = (
  data: Record<string, unknown>,
  fields: string[]
): string | null => {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
};
