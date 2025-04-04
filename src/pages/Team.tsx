
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { useOkr } from '@/contexts/OkrContext';
import { PlusCircle, CheckCircle2 } from 'lucide-react';

// Extended team member type with assigned objectives
type TeamMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  department: string;
  objectives: number;
  assignedObjectives?: string[];
  avatar: string;
};

const teamMembers: TeamMember[] = [
  { 
    id: 1, 
    name: 'Alex Johnson', 
    role: 'Product Manager',
    email: 'alex.j@company.com',
    department: 'Product',
    objectives: 3,
    assignedObjectives: ['1'],
    avatar: '/placeholder.svg'
  },
  { 
    id: 2, 
    name: 'Sarah Miller', 
    role: 'Lead Developer',
    email: 's.miller@company.com',
    department: 'Engineering',
    objectives: 5,
    assignedObjectives: ['2', '3'],
    avatar: '/placeholder.svg'
  },
  { 
    id: 3, 
    name: 'David Chen', 
    role: 'UX Designer',
    email: 'd.chen@company.com',
    department: 'Design',
    objectives: 2,
    assignedObjectives: [],
    avatar: '/placeholder.svg'
  },
  { 
    id: 4, 
    name: 'Emily Rodriguez', 
    role: 'Marketing Specialist',
    email: 'e.rodriguez@company.com',
    department: 'Marketing',
    objectives: 4,
    assignedObjectives: ['1'],
    avatar: '/placeholder.svg'
  },
  { 
    id: 5, 
    name: 'Michael Wong', 
    role: 'Customer Success',
    email: 'm.wong@company.com',
    department: 'Support',
    objectives: 3,
    assignedObjectives: ['3'],
    avatar: '/placeholder.svg'
  }
];

const Team = () => {
  const { objectives } = useOkr();
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");

  // Open assign objective dialog
  const handleOpenAssignDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setSelectedObjectiveId("");
    setShowAssignDialog(true);
  };

  // Assign objective to team member
  const handleAssignObjective = () => {
    if (!selectedMember || !selectedObjectiveId) return;

    setMembers(prevMembers => 
      prevMembers.map(member => {
        if (member.id === selectedMember.id) {
          const currentAssigned = member.assignedObjectives || [];
          // Only add if not already assigned
          if (!currentAssigned.includes(selectedObjectiveId)) {
            return {
              ...member,
              assignedObjectives: [...currentAssigned, selectedObjectiveId],
              objectives: member.objectives + 1
            };
          }
        }
        return member;
      })
    );
    
    setShowAssignDialog(false);
  };

  // Get objective title by id
  const getObjectiveTitleById = (id: string) => {
    const objective = objectives.find(obj => obj.id === id);
    return objective ? objective.title : 'Unknown Objective';
  };

  // Filter out objectives that are already assigned to the selected member
  const getAvailableObjectives = () => {
    if (!selectedMember) return objectives;
    
    const assignedIds = selectedMember.assignedObjectives || [];
    return objectives.filter(obj => !assignedIds.includes(obj.id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their objectives
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              View and manage team members assigned to objectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Objectives</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.department}</Badge>
                    </TableCell>
                    <TableCell>{member.objectives}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenAssignDialog(member)}
                      >
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Assign Objective
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Member Objectives Card */}
        {selectedMember && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Objectives for {selectedMember.name}</CardTitle>
              <CardDescription>
                Review all objectives assigned to this team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMember.assignedObjectives && selectedMember.assignedObjectives.length > 0 ? (
                <div className="space-y-2">
                  {selectedMember.assignedObjectives.map(objectiveId => (
                    <div key={objectiveId} className="flex items-center p-2 border rounded-md">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      {getObjectiveTitleById(objectiveId)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No objectives assigned yet</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assign Objective Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Objective</DialogTitle>
            <DialogDescription>
              {selectedMember ? `Assign an objective to ${selectedMember.name}` : 'Select a team member first'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Select Objective</h4>
              
              <Select onValueChange={setSelectedObjectiveId} value={selectedObjectiveId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an objective" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableObjectives().map(objective => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {getAvailableObjectives().length === 0 && (
                <p className="text-sm text-amber-500 mt-1">
                  All objectives are already assigned to this team member
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignObjective} 
              disabled={!selectedObjectiveId || !selectedMember}
            >
              Assign Objective
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Team;
