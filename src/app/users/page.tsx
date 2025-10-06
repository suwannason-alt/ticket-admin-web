'use client';

import DashboardLayout from '../../components/DashboardLayout';
import UsersList from '../../components/UserManagement/UsersList';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersList />
    </DashboardLayout>
  );
}
