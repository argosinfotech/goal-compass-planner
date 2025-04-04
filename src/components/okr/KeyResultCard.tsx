
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyResult } from '@/contexts/OkrContext';
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface KeyResultCardProps {
  keyResult: KeyResult;
  onEdit?: () => void;
}

const KeyResultCard = ({ keyResult, onEdit }: KeyResultCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{keyResult.title}</CardTitle>
          <CardDescription className="mt-1">{keyResult.description}</CardDescription>
        </div>
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-2 flex-grow">
        <ProgressBar progress={keyResult.progress} size="md" showLabel />
      </CardContent>
    </Card>
  );
};

export default KeyResultCard;
