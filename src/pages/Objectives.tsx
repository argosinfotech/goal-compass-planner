
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useOkr } from '@/contexts/OkrContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import ObjectiveCard from '@/components/okr/ObjectiveCard';
import ObjectiveForm from '@/components/okr/OkrForm';
import { Objective } from '@/contexts/OkrContext';

const Objectives = () => {
  const { objectives, keyResults, addObjective, getObjectiveProgress } = useOkr();
  const [showNewObjectiveDialog, setShowNewObjectiveDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter objectives based on search query
  const filteredObjectives = objectives.filter(obj => 
    obj.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    obj.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count key results for each objective
  const getKeyResultsCount = (objectiveId: string) => {
    return keyResults.filter(kr => kr.objectiveId === objectiveId).length;
  };

  // Handle create new objective
  const handleCreateObjective = (data: Omit<Objective, 'id'>) => {
    addObjective(data);
    setShowNewObjectiveDialog(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Objectives</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your organization's objectives
            </p>
          </div>
          <Button onClick={() => setShowNewObjectiveDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Objective
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search objectives..."
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Objectives Grid */}
        {filteredObjectives.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredObjectives.map((objective) => (
              <ObjectiveCard
                key={objective.id}
                objective={objective}
                progress={getObjectiveProgress(objective.id)}
                keyResultsCount={getKeyResultsCount(objective.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No objectives found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? "Try a different search term" : "Create your first objective to get started"}
            </p>
          </div>
        )}
      </div>

      {/* New Objective Dialog */}
      <Dialog open={showNewObjectiveDialog} onOpenChange={setShowNewObjectiveDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Objective</DialogTitle>
            <DialogDescription>
              Define a new objective for your organization. Objectives should be ambitious but achievable.
            </DialogDescription>
          </DialogHeader>
          <ObjectiveForm 
            onSubmit={handleCreateObjective}
            onCancel={() => setShowNewObjectiveDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Objectives;
