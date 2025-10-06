'use client';

import DashboardLayout from '../../components/DashboardLayout';
import RolesAndPermissions from '../../components/UserManagement/RolesAndPermissions';

export default function RolesPage() {
  return (
    <DashboardLayout>
      <RolesAndPermissions />
    </DashboardLayout>
  );
}
