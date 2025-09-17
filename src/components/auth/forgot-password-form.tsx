"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    console.log("Dados de recuperação de senha:", data);
    toast({
      title: "Verifique seu E-mail",
      description: "Se uma conta com este e-mail existir, enviamos um link para redefinir sua senha.",
    });
    
    setTimeout(() => {
      router.push("/auth/entrar");
    }, 2000);
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Esqueceu sua Senha?</CardTitle>
        <CardDescription>Não se preocupe. Insira seu e-mail e enviaremos um link para você criar uma nova senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="voce@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Enviar Link de Recuperação
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          Lembrou da senha?{" "}
          <Link href="/auth/entrar" className="underline text-primary hover:text-primary/80">
            Voltar para o Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
