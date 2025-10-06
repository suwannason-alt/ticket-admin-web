import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Permission {
  id: string;
  serviceName: string;
  featureName: string;
  view: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
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
  roles: Role[];
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
  roles: [],
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
            id: '1',
            name: 'Administrator',
            description: 'Full system access',
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  });
});

export const fetchRoles = createAsyncThunk('userManagement/fetchRoles', async () => {
  // Mock API call
  return new Promise<Role[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Administrator',
          description: 'Full system access',
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Editor',
          description: 'Content management access',
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  });
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
          id: Math.random().toString(36).substr(2, 9),
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
    updateRolePermissions: (state, action: PayloadAction<{ roleId: string; permissions: Permission[] }>) => {
      const role = state.roles.find(r => r.id === action.payload.roleId);
      if (role) {
        role.permissions = action.payload.permissions;
        role.updatedAt = new Date().toISOString();
      }
    },
    cancelInvitation: (state, action: PayloadAction<string>) => {
      state.invitations = state.invitations.filter(invitation => invitation.id !== action.payload);
    },
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
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading.roles = false;
        state.roles.push(action.payload);
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
  updateRolePermissions,
  cancelInvitation,
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
