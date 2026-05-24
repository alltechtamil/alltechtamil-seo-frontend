"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const toast = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextParam, setNextParam] = useState<string | null>(null);

  // Safely extract the redirect intent parameter without breaking SSR / requiring Suspense boundary
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNextParam(searchParams.get("next"));
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Welcome back!");
      
      // Route back to the originally requested deep-link, or default to the dashboard
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push((nextParam ? nextParam : "/admin/dashboard") as any);
    } catch (err) {
      const error = err as Error;
      toast.error(error?.message || "Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-blue-500/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Sign in to access your administrative dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border ${
                  errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                placeholder="Enter Your Email"
                disabled={isLoading || isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border ${
                  errors.password ? "border-red-500/50 focus:ring-red-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all`}
                placeholder="••••••••"
                disabled={isLoading || isSubmitting}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            {(isLoading || isSubmitting) ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
