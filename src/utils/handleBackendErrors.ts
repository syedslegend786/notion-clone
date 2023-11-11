import { NextResponse } from "next/server";
import { handleZodErrors } from "./handleZodErrors";
import * as z from "zod";
export function handleBackendErrors(error: Error) {
  if (error instanceof z.ZodError) {
    const zodError = handleZodErrors(error);
    return new NextResponse(zodError, { status: 400 });
  }
  return new NextResponse(error.message, { status: 500 });
}
