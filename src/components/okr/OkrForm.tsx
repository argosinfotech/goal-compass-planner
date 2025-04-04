
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Objective } from '@/contexts/OkrContext';

interface ObjectiveFormProps {
  initialData?: Partial<Objective>;
  onSubmit: (data: Omit<Objective, 'id'>) => void;
  onCancel: () => void;
}

const ObjectiveForm = ({ initialData, onSubmit, onCancel }: ObjectiveFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Objective, 'id'>>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'Growth',
      startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            placeholder="Objective title" 
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe your objective" 
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select defaultValue={initialData?.category || 'Growth'}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Revenue">Revenue</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate" 
              type="date" 
              {...register('startDate', { required: 'Start date is required' })}
            />
            {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              type="date" 
              {...register('endDate', { required: 'End date is required' })}
            />
            {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Objective' : 'Create Objective'}
        </Button>
      </div>
    </form>
  );
};

export default ObjectiveForm;
