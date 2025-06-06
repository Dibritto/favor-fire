"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ratingFormSchema = z.object({
  rating: z.coerce.number().min(1, "A avaliação é obrigatória.").max(5, "A avaliação não pode exceder 5."),
  feedback: z.string().max(300, "O feedback deve ter 300 caracteres ou menos.").optional(),
});

type RatingFormValues = z.infer<typeof ratingFormSchema>;

interface RatingFormProps {
  favorId: string;
  onRatedUserType: 'requester' | 'executor'; // Who is being rated
  onSubmitRating: (data: RatingFormValues) => Promise<void>; // Function to handle submission
  isSubmitting?: boolean;
}

export function RatingForm({ favorId, onRatedUserType, onSubmitRating, isSubmitting }: RatingFormProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const { toast } = useToast();

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      rating: 0,
      feedback: "",
    },
  });
  const currentRating = form.watch("rating");

  const ratedUserTypeName = onRatedUserType === 'requester' ? 'solicitante' : 'ajudante';

  async function handleSubmit(data: RatingFormValues) {
    try {
      await onSubmitRating(data);
      toast({
        title: "Avaliação Enviada",
        description: `Seu feedback para o ${ratedUserTypeName} foi registrado.`,
      });
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar sua avaliação. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 border p-6 rounded-lg shadow-sm">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua Avaliação (1-5 Estrelas)</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors
                        ${(hoverRating >= star || currentRating >= star) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Compartilhe sua experiência com o ${ratedUserTypeName}...`}
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || currentRating === 0}>
          {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </form>
    </Form>
  );
}
