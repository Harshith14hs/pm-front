import React, { useState } from 'react';
import ProjectList from './ProjectList';
import TaskList from './TaskList';
import './ProjectTaskBoard.css';

const ProjectTaskBoard = ({ showMyProjects, search }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="project-task-board">
      <ProjectList
        onSelectProject={setSelectedProject}
        selectedProject={selectedProject}
        showMyProjects={showMyProjects}
        search={search}
      />
      {selectedProject ? (
        <TaskList project={selectedProject} />
      ) : null}
    </div>
  );
};

export default ProjectTaskBoard; 