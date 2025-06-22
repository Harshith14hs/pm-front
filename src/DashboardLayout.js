import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ProjectTaskBoard from './components/ProjectTaskBoard';
import ClientMessages from './components/ClientMessages';
import './DashboardLayout.css';

const DashboardLayout = ({ messages, setMessages, showToast, setCurrentPage }) => {
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [search, setSearch] = useState('');

  const handleShowMyProjects = () => setShowMyProjects(true);
  const handleShowAllProjects = () => setShowMyProjects(false);
  const handleSearch = (query) => setSearch(query);

  return (
    <div className="dashboard-layout">
      <Sidebar
        onMyProjects={handleShowMyProjects}
        onShowAllProjects={handleShowAllProjects}
        messages={messages}
        setMessages={setMessages}
        setCurrentPage={setCurrentPage}
      />
      <div className="dashboard-main-content">
        <TopBar onSearch={handleSearch} showToast={typeof showToast === 'function' ? showToast : undefined} setCurrentPage={setCurrentPage} />
        <ProjectTaskBoard showMyProjects={showMyProjects} search={search} setCurrentPage={setCurrentPage} />
      </div>
      <ClientMessages messages={messages} setMessages={setMessages} />
    </div>
  );
};

export default DashboardLayout; 