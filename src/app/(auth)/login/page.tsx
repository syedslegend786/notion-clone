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
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { protectLoginRegister } from "@/hoc/protectLoginRegister";
import Link from "next/link";
import { URLS } from "@/utils/URLS";

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required"),
});
const Login = () => {
  const router = useRouter();
  const { data } = useSession();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  console.log(data);
  async function handleSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });
      if (response?.error) {
        alert(response.error);
        return;
      }
      alert("success");
      router.refresh();
    } catch (error: any) {
      const err = handleApiError(error);
      alert(err);
    }
  }
  const isLoading = form.formState.isSubmitting;
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="pt-20 w-full">
        <h1 className="font-bold text-5xl text-center">Log In</h1>
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
                  <FormLabel className="dark:text-background-dark">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="w-full dark:bg-gray-100 dark:text-black focus:ring-offset-0 ring-offset-0 focus-visible:ring-offset-0 dark:ring-background-dark"
                    />
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
                  <FormLabel className="dark:text-background-dark">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                      className="w-full dark:bg-gray-100 dark:text-black focus:ring-offset-0 ring-offset-0 focus-visible:ring-offset-0 dark:ring-background-dark"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full dark:bg-background-dark dark:text-white dark:hover:bg-background-dark/70"
            >
              Login
            </Button>
            <p className="text-xs dark:text-background-dark font-semibold">
              New here?{" "}
              <Link
                href={URLS.REGISTER}
                className="text-blue-500 font-semibold cursor-pointer"
              >
                Create new account
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
