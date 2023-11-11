"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { axios } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { handleApiError } from "@/utils/handleApiError";
import { protectLoginRegister } from "@/hoc/protectLoginRegister";

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required"),
});
const Register = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function handleSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await axios.post("/auth/register", {
        email: values.email,
        password: values.password,
      });
      alert("success");
    } catch (error: any) {
      const err = handleApiError(error);
      alert(err);
    }
  }
  const isLoading = form.formState.isSubmitting;
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="pt-20 w-full">
        <h1 className="font-bold text-5xl text-center">Sign Up</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-10 w-full max-w-xl bg-gray-100 mx-auto p-6 rounded-md shadow-md"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
