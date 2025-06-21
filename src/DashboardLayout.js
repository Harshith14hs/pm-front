import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ProjectTaskBoard from './components/ProjectTaskBoard';
import ClientMessages from './components/ClientMessages';
import { useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ messages, setMessages, showToast }) => {
  const navigate = useNavigate();
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
      />
      <div className="dashboard-main-content">
        <TopBar onSearch={handleSearch} showToast={typeof showToast === 'function' ? showToast : undefined} />
        <ProjectTaskBoard showMyProjects={showMyProjects} search={search} />
      </div>
      <ClientMessages messages={messages} setMessages={setMessages} />
    </div>
  );
};

export default DashboardLayout; 