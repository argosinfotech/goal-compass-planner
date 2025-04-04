
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOkr } from '@/contexts/OkrContext';
import { format, addMonths, subMonths } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'objective' | 'keyresult' | 'meeting' | 'other';
}

const CalendarPage = () => {
  const { objectives, keyResults } = useOkr();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'OKR Review',
      description: 'Monthly review of team objectives and key results',
      date: new Date(),
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Objective Due Date',
      description: 'Deadline for the main Q2 objective',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      type: 'objective',
    },
  ]);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    type: 'meeting',
  });

  // Handle next and previous month navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Get events for the selected date
  const eventsForSelectedDate = events.filter(
    (event) => format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  // Open dialog to add new event
  const openNewEventDialog = (date: Date) => {
    setSelectedDate(date);
    setNewEvent({
      title: '',
      description: '',
      date,
      type: 'meeting',
    });
    setShowEventDialog(true);
  };

  // Handle saving a new event
  const handleSaveEvent = () => {
    setEvents([
      ...events,
      {
        ...newEvent,
        id: Math.random().toString(36).substring(2, 9),
      },
    ]);
    setShowEventDialog(false);
  };

  // Get event types for rendering in calendar
  const getDayEvents = (date: Date) => {
    return events.filter(
      (event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Function to render dots for events on a specific day
  const renderEventIndicators = (date: Date) => {
    const dayEvents = getDayEvents(date);
    
    if (dayEvents.length === 0) return null;
    
    return (
      <div className="flex mt-1 justify-center space-x-1">
        {dayEvents.slice(0, 3).map((event, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              event.type === 'objective'
                ? 'bg-blue-500'
                : event.type === 'keyresult'
                ? 'bg-green-500'
                : event.type === 'meeting'
                ? 'bg-purple-500'
                : 'bg-gray-500'
            }`}
          />
        ))}
        {dayEvents.length > 3 && (
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track important dates, deadlines, and meetings
            </p>
          </div>
          <Button onClick={() => openNewEventDialog(selectedDate)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Calendar Section */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between px-6">
              <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 pl-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="p-3 pointer-events-auto"
                components={{
                  DayContent: ({ day, date }) => (
                    <>
                      <div>{date.getDate()}</div>
                      {renderEventIndicators(date)}
                    </>
                  ),
                }}
                modifiers={{
                  event: (date) => getDayEvents(date).length > 0,
                }}
                modifiersClassNames={{
                  event: "relative cursor-pointer",
                }}
              />
            </CardContent>
          </Card>

          {/* Day Details */}
          <Card>
            <CardHeader>
              <CardTitle>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            event.type === 'objective'
                              ? 'bg-blue-500'
                              : event.type === 'keyresult'
                              ? 'bg-green-500'
                              : event.type === 'meeting'
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                          }`}
                        />
                        <h4 className="font-medium">{event.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No events for this day</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => openNewEventDialog(selectedDate)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new calendar event for {format(selectedDate, 'MMMM d, yyyy')}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value: 'objective' | 'keyresult' | 'meeting' | 'other') =>
                  setNewEvent({ ...newEvent, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="objective">Objective</SelectItem>
                  <SelectItem value="keyresult">Key Result</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Enter event description"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent}>Save Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CalendarPage;
