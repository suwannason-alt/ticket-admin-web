'use client';

import React, { useEffect, useState } from 'react';

import DashboardLayout from '../components/DashboardLayout';
import UsersList from '../components/UserManagement/UsersList';
import RolesAndPermissions from '../components/UserManagement/roles';
import InvitationsManagement from '../components/UserManagement/InvitationsManagement';
import CompanyProfileForm from '../components/CompanyProfile/CompanyProfileForm';
import SettingsPage from '../components/Settings/SettingsPage';
import CategoryPage from './category/page';
import DashboardView from '../components/Dashboard';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [element, setElement] = useState<any>(null);

  const handleNavigate = (viewId: string, title: string) => {
    setCurrentView(viewId);
  };

  useEffect(() => {
    let viewComponent;

    switch (currentView) {
      case 'users':
        viewComponent = <UsersList />
        break;
      case 'category':
        viewComponent = <CategoryPage />
        break;
      case 'roles':
        viewComponent = <RolesAndPermissions />
        break;
      case 'invitations':
        viewComponent = <InvitationsManagement />
        break;
      case 'company':
        viewComponent = <CompanyProfileForm />
        break;
      case 'settings':
        viewComponent = <SettingsPage />
        break;
      case 'dashboard':
      default:
        viewComponent = <DashboardView />
    }

    setElement(viewComponent);
  }, [currentView])


  return (

    <DashboardLayout onNavigate={handleNavigate}>
        {element}
    </DashboardLayout>

  );
}
