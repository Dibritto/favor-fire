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
  rating: z.coerce.number().min(1, "Rating is required.").max(5, "Rating cannot exceed 5."),
  feedback: z.string().max(300, "Feedback must be 300 characters or less.").optional(),
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

  async function handleSubmit(data: RatingFormValues) {
    try {
      await onSubmitRating(data);
      toast({
        title: "Rating Submitted",
        description: `Your feedback for the ${onRatedUserType} has been recorded.`,
      });
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit your rating. Please try again.",
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
              <FormLabel>Your Rating (1-5 Stars)</FormLabel>
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
              <FormLabel>Feedback (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Share your experience with the ${onRatedUserType}...`}
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || currentRating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </form>
    </Form>
  );
}
