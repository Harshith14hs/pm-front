import React, { useState } from 'react';
import ProjectList from './ProjectList';
import TaskList from './TaskList';
import './ProjectTaskBoard.css';

const ProjectTaskBoard = ({ showMyProjects, search, setCurrentPage }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="project-task-board">
      <ProjectList
        onSelectProject={setSelectedProject}
        selectedProject={selectedProject}
        showMyProjects={showMyProjects}
        search={search}
        setCurrentPage={setCurrentPage}
      />
      {selectedProject ? (
        <TaskList project={selectedProject} setCurrentPage={setCurrentPage} />
      ) : null}
    </div>
  );
};

export default ProjectTaskBoard; 