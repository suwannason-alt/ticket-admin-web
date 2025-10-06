'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  Settings,
  ExpandLess,
  ExpandMore,
  PersonAdd,
  Security,
  AccountCircle,
  Logout,
  Notifications,
  SwapHoriz,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { getCurrentUser, logout } from '../lib/slices/authSlice';
import CompanySwitcherDialog from './CompanySwitcher/CompanySwitcherDialog';
import NotificationDisplay from './Notification/notification';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children?: React.ReactNode;
  onNavigate?: (viewId: string, title: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  badge?: number;
}

export default function DashboardLayout({ children, onNavigate }: DashboardLayoutProps) {

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <People />,
      children: [
        {
          id: 'users',
          label: 'Users',
          icon: <People />,
          path: '/users',
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
          icon: <Security />,
          path: '/roles',
        },
        {
          id: 'invitations',
          label: 'Invitations',
          icon: <PersonAdd />,
          path: '/invitations',
          badge: 3,
        },
      ],
    },
    {
      id: 'company',
      label: 'Company Profile',
      icon: <Business />,
      path: '/company',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      path: '/settings',
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['user-management']));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentTitle, setCurrentTitle] = useState('Dashboard');
  const [companySwitcherOpen, setCompanySwitcherOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { user, currentCompany, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleExpandClick = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavItemClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      handleExpandClick(item.id);
    } else {
      setActiveItem(item.id);
      setCurrentTitle(item.label);
      if (onNavigate) {
        onNavigate(item.id, item.label);
      }
      // Close mobile drawer when item is selected
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };


  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
  };

  const handleSwitchCompany = () => {
    setCompanySwitcherOpen(true);
    handleProfileMenuClose();
  };


  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            selected={isActive}
            onClick={() => handleNavItemClick(item)}
            sx={{
              minHeight: 48,
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
                color: isActive ? 'primary.main' : 'inherit',
              }}
            >
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                color: isActive ? 'primary.main' : 'inherit',
                '& .MuiListItemText-primary': {
                  fontWeight: isActive ? 600 : 400,
                },
              }}
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderNavItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentCompany?.name || 'Loading...'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {navigationItems.map((item) => renderNavItem(item))}
        </List>
      </Box>

      {user && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user.firstName[0]}{user.lastName[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.role.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

    return (
      <>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <AppBar
            position="fixed"
            sx={{
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { md: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {currentTitle}
              </Typography>

              <IconButton color="inherit" sx={{ mr: 1 }} onClick={handleNotificationClick}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {user && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.firstName[0]}{user.lastName[0]}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={handleProfileMenuClose}>
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleSwitchCompany}>
                      <ListItemIcon>
                        <SwapHoriz fontSize="small" />
                      </ListItemIcon>
                      Switch Company
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Toolbar>
          </AppBar>


          <NotificationDisplay anchorEl={notificationAnchorEl} setAnchorEl={setNotificationAnchorEl} />

          <CompanySwitcherDialog
            open={companySwitcherOpen}
            onClose={() => setCompanySwitcherOpen(false)}
          />

          <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { md: `calc(100% - ${drawerWidth}px)` },
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Box sx={{ p: 3 }}>
              {children}
            </Box>
          </Box>
        </Box>
      </>
    );

}
