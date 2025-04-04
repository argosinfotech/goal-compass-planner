
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useOkr, KeyResult } from '@/contexts/OkrContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import KeyResultCard from '@/components/okr/KeyResultCard';
import { useForm } from 'react-hook-form';

interface KeyResultFormData {
  title: string;
  description: string;
  objectiveId: string;
  progress: number;
}

const KeyResults = () => {
  const { objectives, keyResults, addKeyResult, updateKeyResult } = useOkr();
  const [showNewKeyResultDialog, setShowNewKeyResultDialog] = useState(false);
  const [editingKeyResult, setEditingKeyResult] = useState<KeyResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<KeyResultFormData>({
    defaultValues: {
      title: '',
      description: '',
      objectiveId: '',
      progress: 0
    }
  });

  // Filter key results based on search query and selected objective
  const filteredKeyResults = keyResults.filter(kr => {
    const matchesSearch = kr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         kr.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesObjective = !selectedObjective || kr.objectiveId === selectedObjective;
    return matchesSearch && matchesObjective;
  });

  // Open dialog for new key result
  const openNewKeyResultDialog = () => {
    reset({
      title: '',
      description: '',
      objectiveId: objectives.length > 0 ? objectives[0].id : '',
      progress: 0
    });
    setProgress(0);
    setEditingKeyResult(null);
    setShowNewKeyResultDialog(true);
  };

  // Open dialog for editing key result
  const openEditKeyResultDialog = (keyResult: KeyResult) => {
    reset({
      title: keyResult.title,
      description: keyResult.description,
      objectiveId: keyResult.objectiveId,
      progress: keyResult.progress
    });
    setProgress(keyResult.progress);
    setEditingKeyResult(keyResult);
    setShowNewKeyResultDialog(true);
  };

  // Handle submit form
  const onSubmit = (data: KeyResultFormData) => {
    if (editingKeyResult) {
      updateKeyResult(editingKeyResult.id, {
        ...data,
        progress
      });
    } else {
      addKeyResult({
        ...data,
        progress
      });
    }
    setShowNewKeyResultDialog(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Key Results</h1>
            <p className="text-muted-foreground mt-1">
              Metrics that measure your progress toward objectives
            </p>
          </div>
          <Button onClick={openNewKeyResultDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Key Result
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search key results..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedObjective || ''} onValueChange={(value) => setSelectedObjective(value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by objective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Objectives</SelectItem>
              {objectives.map((obj) => (
                <SelectItem key={obj.id} value={obj.id}>{obj.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Results Grid */}
        {filteredKeyResults.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredKeyResults.map((keyResult) => (
              <KeyResultCard
                key={keyResult.id}
                keyResult={keyResult}
                onEdit={() => openEditKeyResultDialog(keyResult)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No key results found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery || selectedObjective 
                ? "Try different search terms or filters" 
                : "Add key results to track your progress"}
            </p>
          </div>
        )}
      </div>

      {/* New/Edit Key Result Dialog */}
      <Dialog open={showNewKeyResultDialog} onOpenChange={setShowNewKeyResultDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingKeyResult ? 'Edit Key Result' : 'Create New Key Result'}</DialogTitle>
            <DialogDescription>
              {editingKeyResult 
                ? 'Update the details of your key result and track its progress.'
                : 'Add a new key result to track progress toward your objective.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectiveId">Related Objective</Label>
                <Select 
                  defaultValue={editingKeyResult?.objectiveId || (objectives.length > 0 ? objectives[0].id : '')}
                  onValueChange={(value) => setValue('objectiveId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>{obj.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Key Result title" 
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your key result" 
                  {...register('description')}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="progress">Progress: {progress}%</Label>
                </div>
                <Slider
                  id="progress"
                  defaultValue={[editingKeyResult?.progress || 0]}
                  max={100}
                  step={1}
                  onValueChange={(values) => setProgress(values[0])}
                  className="py-4"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowNewKeyResultDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingKeyResult ? 'Update Key Result' : 'Create Key Result'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default KeyResults;
