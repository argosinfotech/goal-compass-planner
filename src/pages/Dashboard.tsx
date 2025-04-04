
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useOkr } from '@/contexts/OkrContext';
import { Target, ArrowUpRight, CheckSquare, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusCard from '@/components/dashboard/StatusCard';
import ObjectiveCard from '@/components/okr/ObjectiveCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { objectives, keyResults, getObjectiveProgress } = useOkr();
  const navigate = useNavigate();

  // Calculate summary data
  const totalObjectives = objectives.length;
  const totalKeyResults = keyResults.length;
  
  // Calculate objectives by status
  const objectivesStatus = objectives.reduce(
    (acc, obj) => {
      const progress = getObjectiveProgress(obj.id);
      if (progress < 25) acc.atRisk += 1;
      else if (progress < 75) acc.inProgress += 1;
      else acc.onTrack += 1;
      return acc;
    },
    { onTrack: 0, inProgress: 0, atRisk: 0 }
  );
  
  // Calculate average progress
  const averageProgress = objectives.length 
    ? Math.round(objectives.reduce((acc, obj) => acc + getObjectiveProgress(obj.id), 0) / objectives.length) 
    : 0;
  
  // Data for progress chart
  const progressChartData = [
    { name: 'On Track', value: objectivesStatus.onTrack, color: '#10B981' },
    { name: 'In Progress', value: objectivesStatus.inProgress, color: '#F59E0B' },
    { name: 'At Risk', value: objectivesStatus.atRisk, color: '#EF4444' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your objectives and key results
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard 
            title="Total Objectives" 
            value={totalObjectives} 
            icon={Target}
            bgColor="bg-primary/10"
          />
          <StatusCard 
            title="Key Results" 
            value={totalKeyResults} 
            icon={CheckSquare}
            bgColor="bg-info/10"
          />
          <StatusCard 
            title="Average Progress" 
            value={`${averageProgress}%`} 
            icon={ArrowUpRight}
            bgColor="bg-success/10"
            trend={{ value: 12, isPositive: true }}
          />
          <StatusCard 
            title="At Risk" 
            value={objectivesStatus.atRisk} 
            icon={AlertTriangle}
            bgColor="bg-danger/10"
          />
        </div>

        {/* Charts and Recent Objectives */}
        <div className="grid gap-4 md:grid-cols-7">
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Objectives</CardTitle>
                <CardDescription>
                  Your most recently updated objectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {objectives.slice(0, 3).map((objective) => (
                    <div key={objective.id} className="border rounded-lg p-4 hover:border-primary/30 cursor-pointer transition-all"
                      onClick={() => navigate('/objectives')}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{objective.title}</h3>
                        <span className="text-xs text-muted-foreground">{objective.category}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${getObjectiveProgress(objective.id)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right text-muted-foreground">
                        {getObjectiveProgress(objective.id)}% Complete
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <ProgressChart 
              title="Objectives Status" 
              description="Distribution by completion status"
              data={progressChartData}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
