import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  participantId: z.string({
    required_error: "Please select a participant",
  }),
  amount: z.string().min(1, { message: "Amount is required" }),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  paymentMethod: z.string({
    required_error: "Please select a payment method",
  }),
  notes: z.string().optional(),
});

interface PaymentFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  isOpen?: boolean;
}

const PaymentForm = ({
  onSubmit = () => {},
  isOpen = true,
}: PaymentFormProps) => {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participantId: "",
      amount: "",
      paymentMethod: "",
      notes: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setPaymentProof(null);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real implementation, you would handle the file upload here
    // and combine it with the form values
    onSubmit(values);
  };

  // Mock data for participants
  const participants = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Michael Johnson" },
    { id: "4", name: "Sarah Williams" },
  ];

  // Payment methods
  const paymentMethods = [
    { id: "bank_transfer", name: "Bank Transfer" },
    { id: "credit_card", name: "Credit Card" },
    { id: "cash", name: "Cash" },
    { id: "check", name: "Check" },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Record Payment</h2>
          <p className="text-gray-500">
            Enter payment details for a participant
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="participantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a participant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants.map((participant) => (
                        <SelectItem key={participant.id} value={participant.id}>
                          {participant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the participant making the payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">
                          $
                        </span>
                        <Input
                          placeholder="0.00"
                          className="pl-7"
                          {...field}
                          type="number"
                          step="0.01"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Payment Proof</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                {!paymentProof ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                          Upload a file
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                        {paymentProof.type.includes("image") ? (
                          <img
                            src={URL.createObjectURL(paymentProof)}
                            alt="Preview"
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="text-xs text-center">PDF</div>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 truncate">
                          {paymentProof.name}
                        </p>
                        <p className="text-gray-500">
                          {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add any additional notes about this payment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Payment</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
