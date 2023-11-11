import * as z from "zod";
export function handleZodErrors(error: z.ZodError<any>) {
  return `${error.issues[0].path[0]} ${error.issues[0].message.toLowerCase()}`;
}
