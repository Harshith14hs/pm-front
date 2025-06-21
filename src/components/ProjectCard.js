import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProjectCard.css';

const pastelColors = [
  '#fdf6e3', '#fce4ec', '#e3fcef', '#e3e8fd', '#fff3e0', '#f3e5f5'
];

const ProjectCard = ({ project, colorIdx = 0, onAddTask, onDeleteProject, hasTask, tasks = [], showTaskDropdown, onToggleDropdown, showTaskFormBelow, onDeleteTask, children, progressType, createdBy }) => {
  const color = pastelColors[colorIdx % pastelColors.length];
  const { user } = useAuth();
  const isOwner = user && createdBy && (createdBy._id === user._id || createdBy === user._id);
  let progress = 0;
  if (progressType === 'progress1') {
    progress = tasks[0]?.progress1 ?? 0;
  } else if (progressType === 'progress2') {
    progress = tasks[0]?.progress2 ?? 0;
  } else if (progressType === 'completed') {
    progress = 100;
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        if (onToggleDropdown) onToggleDropdown(false);
      }
    };
    if (showTaskDropdown || menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTaskDropdown, menuOpen, onToggleDropdown]);

  const handleCardClick = (e) => {
    if (menuRef.current && menuRef.current.contains(e.target)) return;
    if (onToggleDropdown) onToggleDropdown(!showTaskDropdown);
  };

  // Calculate days left until soonest deadline
  let daysLeftText = 'No deadline';
  if (tasks && tasks.length > 0) {
    const deadlines = tasks
      .map(task => task.deadline && new Date(task.deadline))
      .filter(date => date && !isNaN(date));
    if (deadlines.length > 0) {
      const soonest = deadlines.reduce((a, b) => a < b ? a : b);
      const now = new Date();
      const diffTime = soonest.setHours(0,0,0,0) - now.setHours(0,0,0,0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) daysLeftText = `${diffDays} days left`;
      else if (diffDays === 1) daysLeftText = '1 day left';
      else if (diffDays === 0) daysLeftText = 'Due today';
      else daysLeftText = 'Overdue';
    }
  }

  // For demo: use the first task's progress1 and progress2, or 0 if not present
  const progress1 = tasks[0]?.progress1 ?? 0;
  const progress2 = tasks[0]?.progress2 ?? 0;

  return (
    <div className="project-card" style={{ background: color, position: 'relative' }} onClick={handleCardClick}>
      <div className="project-card-header">
        <span className="project-card-date">{project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (project.date || 'July 2, 2020')}</span>
        {isOwner && (
          <span className="project-card-menu" ref={menuRef} onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}>⋮
            {menuOpen && (
              <div className="project-card-dropdown">
                <div className="dropdown-item" onClick={() => { setMenuOpen(false); onAddTask && onAddTask(project); }}>{hasTask ? 'Edit Task' : 'Add Task'}</div>
                <div className="dropdown-item" onClick={() => { setMenuOpen(false); onDeleteProject && onDeleteProject(project); }}>Delete Project</div>
              </div>
            )}
          </span>
        )}
      </div>
      <div className="project-card-title centered-title" style={{ cursor: 'pointer' }}>{project.name}</div>
      <div className="project-card-desc centered-desc">{project.description || 'Prototyping'}</div>
      <div className="project-card-progress">
        <div className="progress-label">Progress</div>
        <div className="progress-bar">
          <div className="progress-bar-inner" style={{ width: progress + '%' }}></div>
        </div>
        <span className="progress-percent">{progress}%</span>
      </div>
      <div className="project-card-footer">
        <div className="project-card-creator-avatar" title={createdBy?.username || 'Project Creator'}>
          <img
            src={createdBy?.username
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(createdBy.username)}&background=1976d2&color=fff&size=64&rounded=true`
              : 'https://ui-avatars.com/api/?name=User&background=1976d2&color=fff&size=64&rounded=true'}
            alt={createdBy?.username || 'User'}
            className="project-avatar"
          />
          <span className="project-creator-name">{createdBy?.username || ''}</span>
        </div>
        <div className="project-card-timer">{daysLeftText}</div>
      </div>
      {showTaskDropdown && (
        <div className="project-task-dropdown" ref={dropdownRef}>
          {tasks.length > 0 ? (
            <div className="project-task-details" style={{overflowY: 'auto', maxHeight: '260px'}}>
              {tasks.map(task => (
                <div key={task._id} className="task-item-in-card task-item-clean">
                  <div className="task-content-in-card">
                    <div className="task-title-in-card">{task.title}</div>
                    <div className="task-desc-in-card">{task.description}</div>
                    <div className="task-status-in-card">Status: <span>{task.status}</span></div>
                    <div className="task-assigned-in-card">Assigned to: <span>{task.assignedTo}</span></div>
                    <div className="task-deadline-in-card">Deadline: <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</span></div>
                  </div>
                  <button className="delete-task-btn-corner" title="Delete Task" onClick={e => { e.stopPropagation(); onDeleteTask && onDeleteTask(project._id, task._id); }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path d="M7.5 7.5V14.5M10 7.5V14.5M12.5 7.5V14.5M4.5 5.5H15.5M8.5 3.5H11.5C12.0523 3.5 12.5 3.94772 12.5 4.5V5.5H7.5V4.5C7.5 3.94772 7.94772 3.5 8.5 3.5Z" stroke="#d12a2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="project-task-details">No tasks added yet.</div>
          )}
        </div>
      )}
      {showTaskFormBelow && children}
    </div>
  );
};

export default ProjectCard; 