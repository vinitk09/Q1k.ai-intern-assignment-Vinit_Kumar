// app/tasks/page.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper to format date strings
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering and searching
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for pagination
  const [page, setPage] = useState(0);
  const TASKS_PER_PAGE = 10;

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    const params = new URLSearchParams();
    if (filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority !== 'all') params.append('priority', filters.priority);
    if (searchTerm) params.append('search', searchTerm);
    params.append('skip', page * TASKS_PER_PAGE);
    params.append('limit', TASKS_PER_PAGE);

    try {
      const response = await fetch(`http://localhost:8000/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data || []);
    } catch (err) {
      setError("Could not fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskToDelete._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      fetchTasks(); // Refresh the list for success feedback
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteDialog = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'completed': return 'default';
        case 'in_progress': return 'secondary';
        default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        default: return 'outline';
    }
  };


  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <Button asChild>
            <Link href="/tasks/new">Add Task</Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filters.status} onValueChange={(value) => setFilters(f => ({ ...f, status: value }))}>
                <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.priority} onValueChange={(value) => setFilters(f => ({ ...f, priority: value }))}>
                <SelectTrigger><SelectValue placeholder="Filter by priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(task.status)}>{task.status.replace('_', ' ')}</Badge></TableCell>
                      <TableCell><Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge></TableCell>
                      <TableCell>{formatDate(task.due_date)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/tasks/edit/${task._id}`}>Edit</Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDeleteDialog(task)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No tasks found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center space-x-2">
            <Button variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                Previous
            </Button>
            <span>Page {page + 1}</span>
            <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={tasks.length < TASKS_PER_PAGE}>
                Next
            </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task: "{taskToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
