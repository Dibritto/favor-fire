
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/types";
import { Loader2, Camera } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Label } from "@/components/ui/label";

const profileFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  displayName: z.string().min(2, "O nome de exibição deve ter pelo menos 2 caracteres.").optional(),
  bio: z.string().max(200, "A biografia deve ter no máximo 200 caracteres.").optional(),
  phone: z.string().optional(),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      bio: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        form.reset({
          name: currentUser.name,
          displayName: currentUser.displayName || "",
          bio: currentUser.bio || "",
          phone: currentUser.phone || "",
          email: currentUser.email,
        });
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    console.log("Dados do perfil atualizados:", data);
    // Em um app real, você salvaria isso no seu backend.
    toast({
      title: "Perfil Atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    router.push("/perfil");
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Carregando informações...</p>
      </div>
    );
  }
  
  const publicName = form.watch('displayName') || form.watch('name') || "Usuário";

  return (
    <article className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>Atualize suas informações e personalize sua aparência na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Imagens do Perfil</Label>
                    <CardDescription>Clique para alterar sua foto e capa.</CardDescription>
                </div>
                 <div className="relative h-32 w-full rounded-lg bg-muted">
                    <Image
                        src={`https://picsum.photos/seed/profilebanner${user?.id}/1200/200`}
                        alt="Imagem de capa do usuário"
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint="perfil capa"
                    />
                    <Button type="button" variant="outline" size="icon" className="absolute top-2 right-2 bg-background/70 hover:bg-background/90">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Alterar imagem de capa</span>
                    </Button>
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                         <div className="relative group w-24 h-24">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                <AvatarImage src={`https://picsum.photos/seed/avatar${user?.id}/128/128`} alt={publicName} data-ai-hint="foto perfil" />
                                <AvatarFallback className="text-2xl">{publicName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline" size="icon" className="absolute bottom-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90">
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">Alterar avatar</span>
                            </Button>
                        </div>
                    </div>
                </div>
              </div>

              <div className="pt-12 space-y-6">
                <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome de Exibição (Público)</FormLabel>
                        <FormControl>
                        <Input placeholder="Como você quer ser chamado" {...field} />
                        </FormControl>
                        <FormDescription>Este será seu nome público na plataforma.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sua Biografia (Público)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Fale um pouco sobre você..." {...field} rows={3} />
                        </FormControl>
                        <FormDescription>Uma breve biografia que aparecerá no seu perfil.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome Completo (Privado)</FormLabel>
                        <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormDescription>Este nome não será exibido publicamente.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                        <Input placeholder="seu@email.com" {...field} disabled />
                        </FormControl>
                        <FormDescription>O e-mail não pode ser alterado.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefone (Opcional)</FormLabel>
                        <FormControl>
                        <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                    <Link href="/perfil">Cancelar</Link>
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </article>
  );
}
