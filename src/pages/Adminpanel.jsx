import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  // Sample data - In real app, fetch from API
  const [pendingTeachers, setPendingTeachers] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@university.edu",
      department: "Computer Science",
      subject: "Web Development",
      registeredAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Prof. Sarah Johnson",
      email: "sarah.j@university.edu",
      department: "Mathematics",
      subject: "Calculus",
      registeredAt: "2024-01-16"
    }
  ]);

  const [pendingStudents, setPendingStudents] = useState([
    {
      id: 1,
      name: "Alice Cooper",
      email: "alice.c@university.edu",
      registeredAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob.w@university.edu",
      registeredAt: "2024-01-16"
    }
  ]);

  const [approvedUsers, setApprovedUsers] = useState([
    {
      id: 1,
      name: "Dr. Michael Brown",
      email: "michael.b@university.edu",
      role: "teacher",
      department: "Physics",
      approvedAt: "2024-01-10"
    }
  ]);

  const handleApprove = async (userId, userType) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (userType === 'teacher') {
        const teacher = pendingTeachers.find(t => t.id === userId);
        setPendingTeachers(prev => prev.filter(t => t.id !== userId));
        setApprovedUsers(prev => [...prev, {
          ...teacher,
          role: 'teacher',
          approvedAt: new Date().toISOString().split('T')[0]
        }]);
      } else {
        const student = pendingStudents.find(s => s.id === userId);
        setPendingStudents(prev => prev.filter(s => s.id !== userId));
        setApprovedUsers(prev => [...prev, {
          ...student,
          role: 'student',
          approvedAt: new Date().toISOString().split('T')[0]
        }]);
      }
      
      toast.success(`User approved successfully`);
    } catch (error) {
      toast.error("Failed to approve user");
    }
  };

  const handleReject = async (userId, userType) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (userType === 'teacher') {
        setPendingTeachers(prev => prev.filter(t => t.id !== userId));
      } else {
        setPendingStudents(prev => prev.filter(s => s.id !== userId));
      }
      
      toast.success(`User rejected`);
    } catch (error) {
      toast.error("Failed to reject user");
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approvals
              <Badge variant="secondary" className="ml-2">
                {pendingTeachers.length + pendingStudents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved Users
              <Badge variant="secondary" className="ml-2">
                {approvedUsers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pending Teachers</h3>
              <ScrollArea className="h-[300px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.department}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.registeredAt}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(teacher.id, 'teacher')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(teacher.id, 'teacher')}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <h3 className="text-lg font-semibold">Pending Students</h3>
              <ScrollArea className="h-[300px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.registeredAt}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(student.id, 'student')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(student.id, 'student')}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <ScrollArea className="h-[600px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Approved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.approvedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;