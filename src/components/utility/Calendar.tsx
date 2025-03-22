import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Event {
  id: string;
  title: string;
  date: Date;
  type: "trip" | "meeting" | "deadline";
  description: string;
}

const demoEvents: Event[] = [
  {
    id: "1",
    title: "Church Trip to Rome",
    date: new Date(2024, 3, 15),
    type: "trip",
    description: "Annual church trip to Rome with 25 participants."
  },
  {
    id: "2",
    title: "Host Family Meeting",
    date: new Date(2024, 3, 10),
    type: "meeting",
    description: "Orientation meeting for new host families."
  },
  {
    id: "3",
    title: "Payment Deadline",
    date: new Date(2024, 3, 5),
    type: "deadline",
    description: "Final payment deadline for Rome trip participants."
  }
];

const EventCard = ({ event }: { event: Event }) => {
  const typeColors = {
    trip: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    meeting: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    deadline: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
  };

  return (
    <div className={`p-4 rounded-lg border ${typeColors[event.type]}`}>
      <div className="flex flex-col">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">
          {event.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {event.description}
        </p>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          {event.date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </span>
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="h-full bg-white dark:bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Calendar
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage events and schedules
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-[350px,1fr] gap-6">
        <div className="border rounded-lg p-4 bg-white dark:bg-slate-900">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4 pr-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Upcoming Events
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {demoEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CalendarPage; 