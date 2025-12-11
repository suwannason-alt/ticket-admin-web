import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserRole } from '@/service/role.service';

export interface Permission {
  uuid: string;
  service_uuid: string;
  serviceName: string;
  featureName: string;
  view: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  user_uuid: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  role_uuid: string;
  company_uuid: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: 'active' | 'pending' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  invitedBy?: string;
}

export interface Group {
  uuid: string;
  name: string;
  description: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  roleId: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

interface UserManagementState {
  users: User[];
  groups: { data: Group[], rowCount: number; };
  roles: Role;
  permissions: Permission[];
  invitations: UserInvitation[];
  services: string[];
  loading: {
    users: boolean;
    roles: boolean;
    permissions: boolean;
    invitations: boolean;
  };
  error: string | null;
}

const initialState: UserManagementState = {
  users: [],
  groups: { data: [], rowCount: 0 },
  roles: {
    user_uuid: '',
    name: '',
    permissions: [],
    createdAt: '',
    updatedAt: '',
    role_uuid: '',
    company_uuid: null,
  },
  permissions: [],
  invitations: [],
  services: ['User Management', 'Content Management', 'Analytics', 'Settings', 'Billing', 'Security'],
  loading: {
    users: false,
    roles: false,
    permissions: false,
    invitations: false,
  },
  error: null,
};

// Async thunks for API calls (mock implementations)
export const fetchUsers = createAsyncThunk('userManagement/fetchUsers', async () => {
  // Mock API call
  return new Promise<User[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          email: 'admin@company.com',
          firstName: 'John',
          lastName: 'Doe',
          role: {
            user_uuid: '1',
            name: 'Administrator',
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            company_uuid: null,
            role_uuid: '',
          },
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  });
});

export const fetchRoles = createAsyncThunk<Role>('userManagement/fetchRoles', async () => {
  const userRole = await getUserRole()
  const result = userRole.data;
  const permissions: any[] = [];
  result.permission.map((item: any) => {
    permissions.push({
      uuid: item.uuid,
      service_uuid: item.service_uuid,
      serviceName: item.serviceName,
      featureName: item.featureName,
      view: item.permission.view,
      insert: item.permission.insert,
      update: item.permission.update,
      delete: item.permission.delete,
    })
  })
  return {
    user_uuid: result.role.user_uuid,
    name: result.role.name,
    permissions,
    createdAt: result.role.createdAt,
    updatedAt: result.role.updatedAt,
    role_uuid: result.role.role_uuid,
    company_uuid: result.role.company_uuid
  }
});

export const inviteUser = createAsyncThunk(
  'userManagement/inviteUser',
  async (inviteData: { email: string; roleId: string; invitedBy: string }) => {
    // Mock API call
    return new Promise<UserInvitation>((resolve) => {
      setTimeout(() => {
        const invitation: UserInvitation = {
          id: Math.random().toString(36).substr(2, 9),
          email: inviteData.email,
          roleId: inviteData.roleId,
          invitedBy: inviteData.invitedBy,
          status: 'pending',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        resolve(invitation);
      }, 1000);
    });
  }
);

export const createRole = createAsyncThunk(
  'userManagement/createRole',
  async (roleData: { name: string; description: string; permissions: Permission[] }) => {
    // Mock API call
    return new Promise<Role>((resolve) => {
      setTimeout(() => {
        const role: Role = {
          user_uuid: Math.random().toString(36).substr(2, 9),
          name: roleData.name,
          permissions: roleData.permissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          company_uuid: null,
          role_uuid: '',
        };
        resolve(role);
      }, 1000);
    });
  }
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: User['status'] }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.status = action.payload.status;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    cancelInvitation: (state, action: PayloadAction<string>) => {
      state.invitations = state.invitations.filter(invitation => invitation.id !== action.payload);
    },
    setCompanyGroups: (state, action) => {
      state.groups.data = action.payload.data
      state.groups.rowCount = action.payload.rowCount;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading.users = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading.users = false;
        state.error = 'Failed to fetch users';
      })
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading.roles = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading.roles = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.loading.roles = false;
        state.error = 'Failed to fetch roles';
      })
      // Invite user
      .addCase(inviteUser.pending, (state) => {
        state.loading.invitations = true;
        state.error = null;
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.loading.invitations = false;
        state.invitations.push(action.payload);
      })
      .addCase(inviteUser.rejected, (state) => {
        state.loading.invitations = false;
        state.error = 'Failed to send invitation';
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading.roles = true;
        state.error = null;
      })
      .addCase(createRole.rejected, (state) => {
        state.loading.roles = false;
        state.error = 'Failed to create role';
      });
  },
});

export const {
  setError,
  updateUserStatus,
  deleteUser,
  cancelInvitation,
  setCompanyGroups
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
