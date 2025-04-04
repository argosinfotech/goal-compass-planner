
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useOkr } from '@/contexts/OkrContext';
import { addDays, format, isWithinInterval, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DayContent, DayContentProps } from 'react-day-picker';

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'objective' | 'key-result' | 'meeting';
};

// Sample events data
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Quarterly OKRs Review',
    description: 'Team meeting to review Q2 progress',
    date: addDays(new Date(), 2),
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Deadline: Increase Market Share',
    description: 'Objective deadline',
    date: addDays(new Date(), 5),
    type: 'objective',
  },
  {
    id: '3',
    title: 'Key Result Check-in',
    description: 'Review progress on key results',
    date: addDays(new Date(), -2),
    type: 'key-result',
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    type: 'meeting',
  });

  const { objectives, keyResults } = useOkr();

  // Function to get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Function to check if an objective falls on a specific day
  const objectiveFallsOnDay = (day: Date) => {
    return objectives.some(objective => {
      const startDate = parseISO(objective.startDate);
      const endDate = parseISO(objective.endDate);
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  };

  // Handle add event form submission
  const handleAddEvent = () => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents([...events, event]);
    setShowAddEventDialog(false);
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      type: 'meeting',
    });
  };

  // Function to render day content in calendar
  const renderDayContent = (props: DayContentProps) => {
    const day = props.date;
    
    if (!day) return <>{props.children}</>;
    
    const dayEvents = getEventsForDay(day);
    const hasObjective = objectiveFallsOnDay(day);
    
    return (
      <div className="relative w-full h-full">
        <div>{day.getDate()}</div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-0 right-0 left-0 flex justify-center">
            <span className="h-1.5 w-1.5 bg-primary rounded-full" />
          </div>
        )}
        {hasObjective && (
          <div className="absolute bottom-2 right-0 left-0 flex justify-center">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
          </div>
        )}
      </div>
    );
  };

  const selectedDayEvents = date ? getEventsForDay(date) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track your OKRs timeline and important events
            </p>
          </div>
          <Button onClick={() => setShowAddEventDialog(true)}>
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>OKRs Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow"
                components={{
                  DayContent: renderDayContent
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDayEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge variant={
                          event.type === 'meeting' ? 'outline' : 
                          event.type === 'objective' ? 'default' : 'secondary'
                        }>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No events scheduled for this day
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event on your OKRs calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Title</Label>
              <Input 
                id="event-title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea 
                id="event-description" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input 
                id="event-date" 
                type="date"
                value={newEvent.date ? format(newEvent.date, 'yyyy-MM-dd') : ''}
                onChange={(e) => setNewEvent({
                  ...newEvent, 
                  date: e.target.value ? new Date(e.target.value) : new Date()
                })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-type">Type</Label>
              <select
                id="event-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newEvent.type}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  type: e.target.value as 'objective' | 'key-result' | 'meeting'
                })}
              >
                <option value="meeting">Meeting</option>
                <option value="objective">Objective</option>
                <option value="key-result">Key Result</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Calendar;
