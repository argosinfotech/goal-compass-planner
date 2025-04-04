
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar } from 'lucide-react';
import { Objective } from '@/contexts/OkrContext';
import ProgressBar from './ProgressBar';
import { format } from 'date-fns';

interface ObjectiveCardProps {
  objective: Objective;
  progress: number;
  keyResultsCount: number;
  onClick?: () => void;
}

const ObjectiveCard = ({ objective, progress, keyResultsCount, onClick }: ObjectiveCardProps) => {
  // Determine status badge color
  const getStatusBadge = () => {
    if (progress < 25) return <Badge variant="destructive">At Risk</Badge>;
    if (progress < 75) return <Badge variant="default" className="bg-warning">In Progress</Badge>;
    return <Badge variant="default" className="bg-success">On Track</Badge>;
  };

  return (
    <Card 
      className="card-hover cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline">{objective.category}</Badge>
          {getStatusBadge()}
        </div>
        <CardTitle className="mt-2">{objective.title}</CardTitle>
        <CardDescription>{objective.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            {format(new Date(objective.startDate), 'MMM d')} - {format(new Date(objective.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        
        <ProgressBar progress={progress} />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Target className="mr-2 h-4 w-4" />
          <span>{keyResultsCount} Key Results</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ObjectiveCard;
