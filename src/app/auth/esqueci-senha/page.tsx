import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-blue-100/30 p-4">
      <Link href="/" className="mb-10">
        <Logo size="lg" />
      </Link>
      <ForgotPasswordForm />
    </div>
  );
}
