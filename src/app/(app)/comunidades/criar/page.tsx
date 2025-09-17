
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Globe, Lock, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const communityFormSchema = z.object({
  name: z.string().min(5, "O nome deve ter pelo menos 5 caracteres.").max(50, "O nome deve ter no máximo 50 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres.").max(300, "A descrição deve ter no máximo 300 caracteres."),
  type: z.enum(["public", "private"], {
    required_error: "Você deve selecionar o tipo de comunidade.",
  }),
});

type CommunityFormValues = z.infer<typeof communityFormSchema>;

export default function CreateCommunityPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "public",
    },
  });

  async function onSubmit(data: CommunityFormValues) {
    setIsSubmitting(true);
    // Lógica para criar a comunidade (simulada)
    console.log("Dados da nova comunidade:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Comunidade Criada!",
      description: `A comunidade "${data.name}" foi criada com sucesso.`,
    });
    router.push("/comunidades");
    setIsSubmitting(false);
  }

  const communityName = form.watch('name') || "Nova Comunidade";

  return (
    <main className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Criar Nova Comunidade</CardTitle>
          <CardDescription>
            Crie um espaço para conectar pessoas com interesses em comum.
            Lembre-se que a criação de comunidades é um benefício para assinantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
               <div className="space-y-2">
                 <Label>Identidade Visual da Comunidade</Label>
                 <FormDescription>Escolha uma imagem de capa e um avatar para sua comunidade.</FormDescription>
                 <div className="relative h-32 w-full rounded-lg bg-muted mt-2">
                    <Image
                        src={`https://picsum.photos/seed/newcommunitycover/1200/200`}
                        alt="Imagem de capa da comunidade"
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint="community cover abstract"
                    />
                    <Button type="button" variant="outline" size="icon" className="absolute top-2 right-2 bg-background/70 hover:bg-background/90">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Alterar imagem de capa</span>
                    </Button>
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                         <div className="relative group w-24 h-24">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                <AvatarImage src={`https://picsum.photos/seed/newcommunityavatar/128/128`} alt={communityName} data-ai-hint="community logo" />
                                <AvatarFallback className="text-2xl">{communityName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline" size="icon" className="absolute bottom-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background/90">
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">Alterar avatar da comunidade</span>
                            </Button>
                        </div>
                    </div>
                </div>
               </div>

              <div className="space-y-6 pt-12">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Comunidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Amantes de Culinária do Bairro" {...field} />
                      </FormControl>
                      <FormDescription>
                        O nome que será exibido publicamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o propósito e as regras da sua comunidade..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Comunidade</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="public" />
                          </FormControl>
                          <FormLabel className="font-normal flex-1 cursor-pointer">
                             <div className="flex items-center gap-2 font-medium mb-1"><Globe /> Pública</div>
                             <p className="text-sm text-muted-foreground">Qualquer pessoa pode ver e participar desta comunidade.</p>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="private" />
                          </FormControl>
                          <FormLabel className="font-normal flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 font-medium mb-1"><Lock /> Privada</div>
                             <p className="text-sm text-muted-foreground">Apenas membros convidados podem ver o conteúdo e participar.</p>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                 <Button type="button" variant="outline" asChild>
                    <Link href="/comunidades">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Criando..." : "Criar Comunidade"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

    