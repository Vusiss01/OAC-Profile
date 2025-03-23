import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MessageCircle, FileQuestion, BookOpen, LifeBuoy } from "lucide-react";

export const HelpSupport: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Support
            </CardTitle>
            <CardDescription>Send us an email anytime</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:support@churchtrip.com" className="text-primary hover:underline">
              support@churchtrip.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Phone Support
            </CardTitle>
            <CardDescription>Available Mon-Fri, 9am-5pm EST</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary">1-800-CHURCH-TRIP</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Help Articles</CardTitle>
          <CardDescription>Find answers in our knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <FileQuestion className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search for help articles..." />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I add a new participant?</AccordionTrigger>
            <AccordionContent>
              To add a new participant, navigate to the Participants section and click the "Add Participant" button. 
              Fill in the required information in the form and click "Save" to create the new participant record.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do I manage host family assignments?</AccordionTrigger>
            <AccordionContent>
              Go to the Assignments section where you can view all current assignments. Use the "Assign" button 
              to match participants with host families. You can also filter and search for specific assignments.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>How do I track payments?</AccordionTrigger>
            <AccordionContent>
              The Payments section allows you to track all financial transactions. You can record new payments, 
              view payment history, and generate reports. Use the filters to find specific payment records.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>What should I do if I need to update a host family's information?</AccordionTrigger>
            <AccordionContent>
              In the Host Families section, find the family you want to update and click the "Edit" button. 
              Make your changes in the form and save them. All related assignments will be automatically updated.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>How can I export data from the system?</AccordionTrigger>
            <AccordionContent>
              Most sections have an "Export" button that allows you to download data in CSV format. 
              You can filter the data before exporting to get exactly what you need.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              User Guide
            </CardTitle>
            <CardDescription>
              Detailed documentation on how to use the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View User Guide</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              Support Ticket
            </CardTitle>
            <CardDescription>
              Create a ticket for complex issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Create Ticket</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport; 