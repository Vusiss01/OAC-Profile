import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Home, Phone, Mail, Users, MapPin, Info } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  familyName: z.string().min(2, { message: "Family name is required" }),
  contactPerson: z.string().min(2, { message: "Contact person is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  preferences: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type HostFamilyFormValues = z.infer<typeof formSchema>;

interface HostFamilyFormProps {
  initialData?: HostFamilyFormValues;
  onSubmit?: (data: HostFamilyFormValues) => void;
  isEditing?: boolean;
}

const HostFamilyForm = ({
  initialData,
  onSubmit,
  isEditing = false,
}: HostFamilyFormProps = {}) => {
  const defaultValues: Partial<HostFamilyFormValues> = {
    familyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    capacity: "2",
    preferences: "",
    additionalInfo: "",
    ...initialData,
  };

  const form = useForm<HostFamilyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: HostFamilyFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form submitted:", data);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? "Edit Host Family" : "Add New Host Family"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Family Name */}
            <FormField
              control={form.control}
              name="familyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Smith Family"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Person */}
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Contact</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="John Smith"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        type="email"
                        placeholder="john.smith@example.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="(555) 123-4567"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="123 Main St"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="New York"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3">3 People</SelectItem>
                      <SelectItem value="4">4 People</SelectItem>
                      <SelectItem value="5">5+ People</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Maximum number of participants this family can host
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferences */}
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Preferences</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        className="pl-10 min-h-[80px]"
                        placeholder="Preferences for participants (e.g., gender, age, language)"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Any specific preferences for the participants you would like
                    to host
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Information */}
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Any additional information about your family or home"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Host Family" : "Add Host Family"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HostFamilyForm;
