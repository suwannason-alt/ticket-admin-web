'use client';
import { useState } from 'react';
import {
    Business,
    CheckCircle,
    Circle,
    Info,
    MarkEmailRead,
    PersonAdd,
    Security,
    Error,
    Warning,
} from '@mui/icons-material';
import { Avatar, Box, Button, Chip, IconButton, List, ListItem, ListItemAvatar, ListItemText, Popover, Typography } from '@mui/material';

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
    avatar?: React.ReactNode;
}

interface IPropsAnchor {
    anchorEl: null | HTMLElement;
    setAnchorEl: (el: null | HTMLElement) => void;
}
export default function NotificationDisplay(props: IPropsAnchor) {
    // const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    
    const mockNotifications: NotificationItem[] = [
        {
            id: '1',
            title: 'New User Invitation',
            message: 'john.doe@company.com has been invited to join the platform',
            type: 'info',
            timestamp: '5 minutes ago',
            read: false,
            avatar: <PersonAdd />,
        },
        {
            id: '2',
            title: 'Role Updated',
            message: 'Content Manager role permissions have been modified',
            type: 'success',
            timestamp: '2 hours ago',
            read: false,
            avatar: <Security />,
        },
        {
            id: '3',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur tonight at 2:00 AM',
            type: 'warning',
            timestamp: '1 day ago',
            read: true,
            avatar: <Warning />,
        },
        {
            id: '4',
            title: 'Profile Updated',
            message: 'Company profile information has been successfully updated',
            type: 'success',
            timestamp: '2 days ago',
            read: true,
            avatar: <Business />,
        },
    ];
    const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

      const unreadCount = notifications.filter(n => !n.read).length;



      const handleNotificationClose = () => {
        props.setAnchorEl(null);
      };
    
      const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
      };
    
      const handleMarkAllAsRead = () => {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
      };

        const getNotificationIcon = (type: NotificationItem['type']) => {
          switch (type) {
            case 'success':
              return <CheckCircle sx={{ color: 'success.main' }} />;
            case 'warning':
              return <Warning sx={{ color: 'warning.main' }} />;
            case 'error':
              return <Error sx={{ color: 'error.main' }} />;
            default:
              return <Info sx={{ color: 'info.main' }} />;
          }
        };

    return (
        <Popover
            open={Boolean(props.anchorEl)}
            anchorEl={props.anchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            slotProps={
                { paper: { sx: { width: 380, maxHeight: 500 } } }
            }
        >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<MarkEmailRead />}
                            onClick={handleMarkAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>
            </Box>

            <List sx={{ p: 0, maxHeight: 500, overflow: 'auto' }}>
                {notifications.length === 0 ? (
                    <ListItem>
                        <ListItemText
                            primary="No notifications"
                            secondary="You're all caught up!"
                            sx={{ textAlign: 'center' }}
                        />
                    </ListItem>
                ) : (
                    notifications.map((notification) => (
                        <ListItem
                            key={notification.id}
                            sx={{
                                bgcolor: notification.read ? 'transparent' : 'action.hover',
                                borderLeft: notification.read ? 'none' : '3px solid',
                                borderLeftColor: 'primary.main',
                            }}
                            secondaryAction={
                                !notification.read && (
                                    <IconButton
                                        edge="end"
                                        size="small"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <Circle sx={{ fontSize: 12, color: 'primary.main' }} />
                                    </IconButton>
                                )
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                                    {notification.avatar || getNotificationIcon(notification.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                                                {notification.title}
                                            </Typography>
                                            <Chip
                                                label={notification.type}
                                                size="small"
                                                color={notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : notification.type === 'success' ? 'success' : 'info'}
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {notification.timestamp}
                                            </Typography>
                                        </Box>
                                    </>
                                }
                            />
                        </ListItem>
                    ))
                )}
            </List>

            {notifications.length > 0 && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                    <Button size="small" onClick={handleNotificationClose}>
                        View All Notifications
                    </Button>
                </Box>
            )}
        </Popover>
    )

}