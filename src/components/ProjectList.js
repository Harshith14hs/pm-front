import React, { useEffect, useState } from 'react';
import './ProjectList.css';
import ProjectCard from './ProjectCard';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://pm-back.onrender.com';

const API_URL = `${API_BASE_URL}/api/projects`;
const TASKS_URL = `${API_BASE_URL}/api/tasks`;

const ProjectList = ({ onSelectProject, selectedProject, showMyProjects = false, search }) => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskProgress1, setTaskProgress1] = useState(0);
  const [taskProgress2, setTaskProgress2] = useState(0);
  const [taskProgressType, setTaskProgressType] = useState('progress');
  const [projectTasks, setProjectTasks] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openDropdownProjectId, setOpenDropdownProjectId] = useState(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      let url = API_URL;
      let headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      };
      const token = localStorage.getItem('token');
      if (showMyProjects && token) {
        url = API_URL + '/mine';
        headers['Authorization'] = `Bearer ${token}`;
        }
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
    const data = await res.json();
    setProjects(data);
      
      // Fetch all tasks at once
      const tasksRes = await fetch(TASKS_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!tasksRes.ok) throw new Error('Failed to fetch tasks');
      const allTasks = await tasksRes.json();

      // Group tasks by project
      const grouped = {};
      allTasks.forEach(task => {
        // Handle both populated and non-populated project field
        const pid = typeof task.project === 'object' && task.project !== null
          ? String(task.project._id)
          : String(task.project);
        if (!grouped[pid]) grouped[pid] = [];
        grouped[pid].push(task);
      });
      setProjectTasks(grouped);

    } catch (err) {
      console.error('Error fetching projects or tasks:', err);
      setError(err.message || 'Failed to load projects or tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching projects, showMyProjects:', showMyProjects);
    fetchProjects();
  }, [showMyProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to create a project.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Creating project with payload:', { name, description });
      const res = await fetch(API_URL, {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      body: JSON.stringify({ name, description })
    });

      console.log('Response status:', res.status);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Project created successfully:', data);

    setName('');
    setDescription('');
    fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      if (selectedProject && selectedProject._id === projectId) {
        onSelectProject(null);
      }
      
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateTask = async (projectId) => {
    setLoading(true);
    setError('');
    try {
      const existingTask = projectTasks[projectId] && projectTasks[projectId][0];
      let res;
      let newTask;
      if (existingTask) {
        // Update task
        res = await fetch(`${TASKS_URL}/${existingTask._id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
            project: projectId,
            assignedTo: taskAssignedTo,
            deadline: taskDeadline || undefined,
            progress1: taskProgress1,
            progress2: taskProgress2,
            progressType: taskProgressType
          })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        newTask = await res.json();
      } else {
        // Add new task
        res = await fetch(TASKS_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          project: projectId,
          assignedTo: taskAssignedTo,
            deadline: taskDeadline || undefined,
            progress1: taskProgress1,
            progress2: taskProgress2,
            progressType: taskProgressType
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
        newTask = await res.json();
      }
      // Refresh all tasks from backend to ensure latest values
      await fetchProjects();
      setShowTaskForm(null);
      setOpenDropdownProjectId(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskAssignedTo('');
      setTaskDeadline('');
      setTaskStatus('todo');
      setTaskProgress1(0);
      setTaskProgress2(0);
      setTaskProgressType('progress');
    } catch (err) {
      setError(err.message || 'Failed to create/update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (projectId, taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${TASKS_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      // Update tasks for this specific project by removing the deleted task
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: prev[projectId].filter(task => task._id !== taskId)
      }));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getProjectProgressType = (projectId) => {
    const tasks = projectTasks[projectId] || [];
    if (tasks.length > 0) {
      return tasks[0].progressType || 'progress';
    }
    return 'progress';
  };

  const renderTaskForm = (projectId) => (
              <div className="task-form-container">
      <form onSubmit={e => { e.preventDefault(); handleAddOrUpdateTask(projectId); }}>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    placeholder="Task title"
                    required
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                    placeholder="Description"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={taskAssignedTo}
                    onChange={e => setTaskAssignedTo(e.target.value)}
                    placeholder="Assigned to"
                    disabled={loading}
                  />
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={e => setTaskDeadline(e.target.value)}
                    disabled={loading}
                  />
                  <select
          value={taskProgressType}
          onChange={e => setTaskProgressType(e.target.value)}
                    disabled={loading}
                  >
          <option value="progress1">Progress 1</option>
          <option value="progress2">Progress 2</option>
                    <option value="completed">Completed</option>
                  </select>
        {taskProgressType === 'progress1' && (
          <input
            type="number"
            value={taskProgress1}
            onChange={e => setTaskProgress1(Number(e.target.value))}
            placeholder="Progress 1 (0-100)"
            min={0}
            max={100}
            disabled={loading}
          />
        )}
        {taskProgressType === 'progress2' && (
          <input
            type="number"
            value={taskProgress2}
            onChange={e => setTaskProgress2(Number(e.target.value))}
            placeholder="Progress 2 (0-100)"
            min={0}
            max={100}
            disabled={loading}
          />
        )}
                  <div className="task-form-actions">
                    <button type="submit" disabled={loading}>
            {loading ? (projectTasks[projectId]?.length > 0 ? 'Updating...' : 'Adding...') : (projectTasks[projectId]?.length > 0 ? 'Update Task' : 'Add Task')}
                    </button>
                    <button
                      type="button"
            onClick={() => {
              setShowTaskForm(null);
              setOpenDropdownProjectId(null);
            }}
                      disabled={loading}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
  );

  const filteredProjects = search
    ? projects.filter(p =>
        (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      )
    : projects;

  return (
    <div className="project-list-container">
      {!selectedProject && (
        <div className="select-project-above-cards">
          <span style={{fontSize: '1.2rem', fontWeight: 500}}>Select a project to view tasks.</span>
      </div>
      )}
      <div className="project-list-grid">
        {filteredProjects.length === 0 ? (
          <div className="no-projects-message">No projects. Add your project!</div>
        ) : (
          filteredProjects.map((project, idx) => {
            const projectTasksArr = projectTasks[project._id] || [];
            const showTaskFormBelow = showTaskForm === project._id;
            return (
              <ProjectCard
                key={project._id}
                project={project}
                colorIdx={idx}
                onAddTask={() => {
                  // If editing, prefill form with task values
                  if (projectTasksArr.length > 0) {
                    const task = projectTasksArr[0];
                    setTaskTitle(task.title || '');
                    setTaskDescription(task.description || '');
                    setTaskAssignedTo(task.assignedTo || '');
                    setTaskDeadline(task.deadline ? task.deadline.slice(0, 10) : '');
                    setTaskStatus(task.status || 'todo');
                    setTaskProgress1(task.progress1 || 0);
                    setTaskProgress2(task.progress2 || 0);
                    setTaskProgressType(task.progressType || 'progress');
                  } else {
                    setTaskTitle('');
                    setTaskDescription('');
                    setTaskAssignedTo('');
                    setTaskDeadline('');
                    setTaskStatus('todo');
                    setTaskProgress1(0);
                    setTaskProgress2(0);
                    setTaskProgressType('progress');
                  }
                  setShowTaskForm(project._id);
                }}
                onDeleteProject={() => handleDelete(project._id)}
                hasTask={!!(projectTasksArr && projectTasksArr.length)}
                tasks={projectTasksArr}
                showTaskDropdown={openDropdownProjectId === project._id}
                onToggleDropdown={v => setOpenDropdownProjectId(v ? project._id : null)}
                showTaskFormBelow={showTaskForm === project._id}
                onDeleteTask={handleDeleteTask}
                progressType={getProjectProgressType(project._id)}
                createdBy={project.createdBy}
              >
                {showTaskForm === project._id && renderTaskForm(project._id)}
              </ProjectCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectList; 