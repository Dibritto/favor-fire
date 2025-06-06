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

const favorFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be 100 characters or less."),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500,"Description must be 500 characters or less."),
  urgency: z.enum(["low", "medium", "high"], { required_error: "Urgency level is required." }),
  location: z.string().min(3, "Location is required."),
  type: z.enum(["volunteer", "paid"], { required_error: "Favor type is required." }),
  preferredDateTime: z.date().optional(),
  amount: z.coerce.number().positive("Amount must be positive.").optional(),
}).refine(data => data.type === 'volunteer' || (data.type === 'paid' && data.amount !== undefined && data.amount > 0), {
  message: "Amount is required for paid favors and must be greater than 0.",
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
      title: "Favor Submitted!",
      description: "Your favor request has been posted to the community.",
    });
    router.push("/favors"); // Redirect to discovery page
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Submit a New Favor</CardTitle>
          <CardDescription>Let the community know what help you need or what you can offer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favor Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Need help with gardening" {...field} />
                    </FormControl>
                    <FormDescription>A short, clear title for your favor.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the favor in detail..." {...field} rows={4} />
                    </FormControl>
                     <FormDescription>Provide as much information as possible.</FormDescription>
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
                        <FormLabel>Urgency Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
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
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Downtown Anytown or Remote" {...field} />
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
                    <FormLabel>Favor Type</FormLabel>
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
                          <FormLabel className="font-normal">Volunteer (Unpaid)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="paid" />
                          </FormControl>
                          <FormLabel className="font-normal">Paid</FormLabel>
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
                      <FormLabel>Payment Amount (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <DollarSign className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="number" placeholder="e.g., 20" {...field} className="pl-8" onChange={event => field.onChange(+event.target.value)} />
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
                    <FormLabel>Preferred Date & Time (Optional)</FormLabel>
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
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
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
                      Suggest a date and time for the favor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">Submit Favor</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
