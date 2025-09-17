
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
import { CalendarIcon, DollarSign, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from 'date-fns/locale';
import { createFavor } from "@/lib/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";


const states = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];


const favorFormSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres.").max(100, "O título deve ter 100 caracteres ou menos."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres.").max(500,"A descrição deve ter 500 caracteres ou menos."),
  urgency: z.enum(["low", "medium", "high"], { required_error: "O nível de urgência é obrigatório." }),
  state: z.string({ required_error: "O estado é obrigatório." }),
  city: z.string().min(1, "A cidade é obrigatória."),
  bairro: z.string().min(1, "O bairro é obrigatório."),
  address: z.string().optional(),
  type: z.enum(["volunteer", "paid"], { required_error: "O tipo de favor é obrigatório." }),
  participationType: z.enum(["individual", "collective"], { required_error: "O modo de participação é obrigatório." }),
  numberOfPeople: z.coerce.number().positive("O número de pessoas deve ser positivo.").optional(),
  preferredDateTime: z.date().optional(),
  amount: z.coerce.number().positive("O valor deve ser positivo.").optional(),
}).refine(data => data.type !== 'paid' || (data.amount !== undefined && data.amount > 0), {
  message: "O valor é obrigatório para favores pagos e deve ser maior que 0.",
  path: ["amount"],
}).refine(data => data.participationType !== 'collective' || (data.numberOfPeople !== undefined && data.numberOfPeople > 0), {
    message: "A quantidade de pessoas é obrigatória para favores coletivos.",
    path: ["numberOfPeople"],
});

type FavorFormValues = z.infer<typeof favorFormSchema>;

export default function SubmitFavorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FavorFormValues>({
    resolver: zodResolver(favorFormSchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      bairro: "",
      address: "",
      type: "volunteer",
      participationType: "individual",
      urgency: "medium",
    },
  });

  const watchFavorType = form.watch("type");
  const watchParticipationType = form.watch("participationType");

  async function onSubmit(data: FavorFormValues) {
    setIsSubmitting(true);
    const location = data.address ? `${data.address}, ${data.bairro}, ${data.city} - ${data.state}` : `${data.bairro}, ${data.city} - ${data.state}`;
    
    // @ts-ignore
    const submissionData = {
        ...data,
        location,
        preferredDateTime: data.preferredDateTime?.toISOString(),
    };

    // Remove os campos que não fazem parte do modelo de dados final do Favor
    delete (submissionData as any).city;
    delete (submissionData as any).state;
    delete (submissionData as any).address;
    delete (submissionData as any).bairro;

    const result = await createFavor(submissionData);

    if (result.success) {
        toast({
            title: "Favor Enviado!",
            description: "Seu pedido de favor foi publicado para a comunidade.",
        });
        router.push("/favores");
    } else {
        toast({
            title: "Erro ao Enviar",
            description: result.message,
            variant: "destructive",
        });
        setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <article>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Pedir um Novo Favor</CardTitle>
            <CardDescription>Deixe a comunidade saber que tipo de ajuda você precisa.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                
                <div className="space-y-4">
                  <FormLabel>Localização</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger>
                                      <SelectValue placeholder="Selecione o estado" />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {states.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                              <Input placeholder="Ex: São Paulo" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </div>
                   <FormField
                      control={form.control}
                      name="bairro"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                          <Input placeholder="Ex: Centro" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Endereço (Opcional)</FormLabel>
                          <FormControl>
                          <Input placeholder="Ex: Rua Principal, 123" {...field} />
                          </FormControl>
                           <FormDescription>Seja específico, se necessário para o favor.</FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                </div>

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
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Favor (Remuneração)</FormLabel>
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
                  name="participationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Modo de Participação</FormLabel>
                      <FormDescription>Como outras pessoas podem ajudar?</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="individual" />
                            </FormControl>
                            <FormLabel className="font-normal">Individual (Uma pessoa)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="collective" />
                            </FormControl>
                            <FormLabel className="font-normal">Coletivo (Grupo de pessoas)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                 {watchParticipationType === "collective" && (
                  <FormField
                    control={form.control}
                    name="numberOfPeople"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Pessoas</FormLabel>
                        <FormControl>
                          <div className="relative">
                              <Users className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input type="number" placeholder="Ex: 5" {...field} className="pl-8" onChange={event => field.onChange(+event.target.value)} min="2" />
                          </div>
                        </FormControl>
                        <FormDescription>Quantas pessoas são necessárias para este favor?</FormDescription>
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
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                            initialFocus
                            locale={ptBR}
                          />
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

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Enviando...' : 'Enviar Pedido de Favor'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
