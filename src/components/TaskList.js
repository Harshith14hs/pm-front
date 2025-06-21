import React, { useEffect, useState } from 'react';
// import './TaskList.css';
const API_BASE_URL =  'https://pm-back.onrender.com';

const API_URL = `${API_BASE_URL}/api/tasks`;

const TaskList = ({ project }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('todo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    if (!project) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/project/${project._id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      fetchTasks();
    }
  }, [project]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !project) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          status,
          project: project._id,
          assignedTo,
          deadline: deadline || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDeadline('');
      setStatus('todo');
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div>Select a project to view tasks</div>;
  }

  return (
    <div className="task-list">
      <h3>Tasks for: {project.name}</h3>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleCreate} className="task-form">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          required
          disabled={loading}
        />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          disabled={loading}
        />
        <input
          type="text"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          placeholder="Assigned to"
          disabled={loading}
        />
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          disabled={loading}
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          disabled={loading}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul className="tasks">
          {tasks.map(task => (
            <li key={task._id} className={`task-item ${task.status}`}>
              <div className="task-header">
                <h4>{task.title}</h4>
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(task._id, e.target.value)}
                  disabled={loading}
                >
                <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
              </select>
              </div>
              <p>{task.description}</p>
              {task.assignedTo && <p>Assigned to: {task.assignedTo}</p>}
              {task.deadline && <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList; 