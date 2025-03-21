import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";

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

// Create a mock DocumentUpload component since the actual one is causing import issues
const DocumentUpload = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <div className="text-center">
        <h4 className="font-medium text-gray-700 mb-2">Upload Documents</h4>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your ID documents or payment proof here, or click to
          browse
        </p>
        <Button variant="outline" className="mb-2">
          Browse Files
        </Button>
        <p className="text-xs text-gray-400">
          Supported formats: PDF, JPG, PNG (Max size: 5MB)
        </p>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-500 mr-3">
              PDF
            </div>
            <div>
              <p className="text-sm font-medium">passport.pdf</p>
              <p className="text-xs text-gray-500">1.2 MB</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  dateOfBirth: z.string(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z
    .string()
    .min(5, { message: "Zip code must be at least 5 characters." }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters." }),
  paymentStatus: z.string(),
});

interface ParticipantFormProps {
  participant?: z.infer<typeof formSchema>;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}

const ParticipantForm = ({
  participant = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentStatus: "pending",
  },
  onSubmit = (data) => console.log("Form submitted:", data),
}: ParticipantFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: participant,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Participant Information
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-4 col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-gray-500" />
                          <Input placeholder="(123) 456-7890" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Section */}
            <div className="space-y-4 col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip/Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Status Section */}
            <div className="space-y-4 col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current status of participant's payment for the trip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Document Upload Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Document Upload
              </h3>
              <DocumentUpload />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Participant
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ParticipantForm;
