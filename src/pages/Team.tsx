
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const teamMembers = [
  { 
    id: 1, 
    name: 'Alex Johnson', 
    role: 'Product Manager',
    email: 'alex.j@company.com',
    department: 'Product',
    objectives: 3,
    avatar: '/placeholder.svg'
  },
  { 
    id: 2, 
    name: 'Sarah Miller', 
    role: 'Lead Developer',
    email: 's.miller@company.com',
    department: 'Engineering',
    objectives: 5,
    avatar: '/placeholder.svg'
  },
  { 
    id: 3, 
    name: 'David Chen', 
    role: 'UX Designer',
    email: 'd.chen@company.com',
    department: 'Design',
    objectives: 2,
    avatar: '/placeholder.svg'
  },
  { 
    id: 4, 
    name: 'Emily Rodriguez', 
    role: 'Marketing Specialist',
    email: 'e.rodriguez@company.com',
    department: 'Marketing',
    objectives: 4,
    avatar: '/placeholder.svg'
  },
  { 
    id: 5, 
    name: 'Michael Wong', 
    role: 'Customer Success',
    email: 'm.wong@company.com',
    department: 'Support',
    objectives: 3,
    avatar: '/placeholder.svg'
  }
];

const Team = () => {
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Team;
