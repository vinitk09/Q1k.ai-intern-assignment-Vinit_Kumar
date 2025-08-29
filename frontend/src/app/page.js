'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const [stats, setStats] = useState({
    total_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const statsResponse = await fetch('http://localhost:8000/api/dashboard/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      
      const tasksResponse = await fetch('http://localhost:8000/api/tasks?limit=5');
      if (!tasksResponse.ok) throw new Error('Failed to fetch recent tasks');
      const tasksData = await tasksResponse.json();

      setStats(statsData);
      setRecentTasks(tasksData || []); 
    } catch (err) { // CORRECTED: Added curly braces for the catch block
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'medium': return 'border-orange-500/50 bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default: return 'border-green-500/50 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
  };
  
  const calculateProgress = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Skeleton UI can be added here */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 dark:text-red-400 mb-4">Error: {error}</div>
            <Button onClick={fetchDashboardData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* UPDATED: Header section with responsive classes */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-center sm:text-left">Dashboard</h1>
          <div className="flex items-center justify-center space-x-2 sm:justify-end">
            <a href="/tasks/new">
              <Button>Add Task</Button>
            </a>
            <a href="/tasks">
              <Button variant="outline">View All Tasks</Button>
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_tasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_tasks}</div>
              <Progress value={calculateProgress(stats.pending_tasks, stats.total_tasks)} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.in_progress_tasks}</div>
              <Progress value={calculateProgress(stats.in_progress_tasks, stats.total_tasks)} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed_tasks}</div>
              <Progress value={calculateProgress(stats.completed_tasks, stats.total_tasks)} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tasks yet</p>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {task.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="/tasks/new" className="block">
                <Button className="w-full">Add New Task</Button>
              </a>
              <a href="/tasks" className="block">
                <Button variant="outline" className="w-full">View All Tasks</Button>
              </a>
              <div className="space-y-4 pt-4">
                <h4 className="font-medium">Status Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{stats.completed_tasks}</span>
                  </div>
                  <Progress value={calculateProgress(stats.completed_tasks, stats.total_tasks)} />
                  <div className="flex justify-between text-sm">
                    <span>In Progress</span>
                    <span>{stats.in_progress_tasks}</span>
                  </div>
                  <Progress value={calculateProgress(stats.in_progress_tasks, stats.total_tasks)} />
                  <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span>{stats.pending_tasks}</span>
                  </div>
                  <Progress value={calculateProgress(stats.pending_tasks, stats.total_tasks)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
