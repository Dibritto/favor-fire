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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from 'date-fns/locale';

const favorFormSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres.").max(100, "O título deve ter 100 caracteres ou menos."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres.").max(500,"A descrição deve ter 500 caracteres ou menos."),
  urgency: z.enum(["low", "medium", "high"], { required_error: "O nível de urgência é obrigatório." }),
  location: z.string().min(3, "A localização é obrigatória."),
  type: z.enum(["volunteer", "paid"], { required_error: "O tipo de favor é obrigatório." }),
  preferredDateTime: z.date().optional(),
  amount: z.coerce.number().positive("O valor deve ser positivo.").optional(),
}).refine(data => data.type === 'volunteer' || (data.type === 'paid' && data.amount !== undefined && data.amount > 0), {
  message: "O valor é obrigatório para favores pagos e deve ser maior que 0.",
  path: ["amount"],
});

type FavorFormValues = z.infer<typeof favorFormSchema>;

export default function SubmitFavorPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FavorFormValues>({
    resolver: zodResolver(favorFormSchema),
    defaultValues: {
      title: "",
      description: "",
      urgency: "medium",
      location: "",
      type: "volunteer",
    },
  });

  const watchFavorType = form.watch("type");

  async function onSubmit(data: FavorFormValues) {
    console.log("Favor submission data:", data);
    // In a real app, you'd save this to your backend
    // And potentially use mockUsers[0].id as requesterId
    toast({
      title: "Favor Enviado!",
      description: "Seu pedido de favor foi publicado para a comunidade.",
    });
    router.push("/favors"); // Redirect to discovery page
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Pedir um Novo Favor</CardTitle>
          <CardDescription>Deixe a comunidade saber que tipo de ajuda você precisa ou o que você pode oferecer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Favor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Preciso de ajuda com jardinagem" {...field} />
                    </FormControl>
                    <FormDescription>Um título curto e claro para o seu favor.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o favor em detalhes..." {...field} rows={4} />
                    </FormControl>
                     <FormDescription>Forneça o máximo de informações possível.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nível de Urgência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a urgência" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Centro da Cidade ou Remoto" {...field} />
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
                    <FormLabel>Tipo de Favor</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="volunteer" />
                          </FormControl>
                          <FormLabel className="font-normal">Voluntário (Não remunerado)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="paid" />
                          </FormControl>
                          <FormLabel className="font-normal">Pago</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchFavorType === "paid" && (
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Pagamento (BRL)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <DollarSign className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="number" placeholder="Ex: 20" {...field} className="pl-8" onChange={event => field.onChange(+event.target.value)} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            
              <FormField
                control={form.control}
                name="preferredDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data e Hora Preferenciais (Opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP HH:mm", { locale: ptBR }) : <span>Escolha uma data e hora</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                          initialFocus
                          locale={ptBR}
                        />
                        {/* Basic time picker, can be enhanced */}
                        <div className="p-3 border-t border-border">
                          <Input 
                            type="time"
                            defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const time = e.target.value;
                              const [hours, minutes] = time.split(':').map(Number);
                              const newDate = field.value ? new Date(field.value) : new Date();
                              newDate.setHours(hours, minutes);
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Sugira uma data e hora para o favor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">Enviar Pedido de Favor</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
