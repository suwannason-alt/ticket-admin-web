'use client'

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
  Logout,
  Notifications,
  SwapHoriz,
  Category,
  LanguageOutlined,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { getCurrentUser, logout } from '../lib/slices/authSlice';
import CompanySwitcherDialog from './CompanySwitcher/CompanySwitcherDialog';
import NotificationDisplay from './Notification/notification';
import { useTranslations, useLocale } from 'next-intl';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { setNav } from '../lib/slices/navSlice';


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

export default function DashboardLayout({ children }: DashboardLayoutProps) {

  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter()

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <Dashboard />,
      path: '/',
    },
    {
      id: 'user-management',
      label: t('usermanagement'),
      icon: <People />,
      children: [
        {
          id: 'users',
          label: t('users'),
          icon: <People />,
          path: '/users',
        },
        {
          id: 'roles',
          label: t('roleAndPermission'),
          icon: <Security />,
          path: '/roles',
        },
        {
          id: 'invitations',
          label: t('invitations'),
          icon: <PersonAdd />,
          path: '/invitations',
          badge: 3,
        },
      ],
    },
    {
      id: 'category',
      label: t('category'),
      icon: <Category />,
      path: '/category',
    },
    {
      id: 'company',
      label: t('companyProfile'),
      icon: <Business />,
      path: '/company',
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: <Settings />,
      path: '/settings',
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['user-management']));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [companySwitcherOpen, setCompanySwitcherOpen] = useState(false);

  const { title, path, id } = useAppSelector((state) => state.nav)

  const dispatch = useAppDispatch();
  const { user, currentCompany } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log({ path, id });
    
  }, [dispatch])
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavItemClick = (item: NavItem) => {
    if (item.path) {
      router.push(item.path)
      dispatch(setNav({ title: item.label, path: item.id, id: item.id }))
      setMobileOpen(false);
    }

  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  }

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };


  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
  };

  const handleSwitchCompany = () => {
    setCompanySwitcherOpen(true);
    handleProfileMenuClose();
  };

  const handleLanguageChange = (lang: string) => {
    if (locale !== lang) {
      Cookies.set('locale', lang);
      window.location.reload()
    } else {
      setLanguageAnchorEl(null);
    }

  }


  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = id === item.id;
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
          Admin web
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
              S
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                Suwannason Sisuk
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Admin
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
              {title}
            </Typography>

            <IconButton color={'info'} sx={{ mr: 1 }} onClick={handleLanguageClick}>
              <Badge badgeContent={locale.toUpperCase()}>
                <LanguageOutlined />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem onClick={() => handleLanguageChange('th')}>TH</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('en')}>EN</MenuItem>
            </Menu>

            <IconButton color="inherit" sx={{ mr: 1 }} onClick={handleNotificationClick}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {user && (
              <>
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
