import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b127aff', // Microsoft blue
      light: '#40e0d0',
      dark: '#005a9e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#605e5c', // Microsoft grey
      light: '#8a8886',
      dark: '#323130',
      contrastText: '#ffffff',
    },
    background: {
      default: '#faf9f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#181616ff',
      secondary: '#423c36ff',
    },
    divider: '#edebe9',
    error: {
      main: '#d13438',
    },
    warning: {
      main: '#ffb900',
    },
    success: {
      main: '#107c10',
    },
    info: {
      main: '#0078d4',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#323130',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#323130',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#323130',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#323130',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#323130',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#323130',
    },
    body1: {
      fontSize: '0.875rem',
      color: '#323130',
    },
    body2: {
      fontSize: '0.75rem',
      color: '#605e5c',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '6px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '5px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#323130',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #edebe9',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f3f2f1',
          borderRight: '1px solid #edebe9',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: '#deecf9',
            '&:hover': {
              backgroundColor: '#c7e0f4',
            },
          },
          '&:hover': {
            backgroundColor: '#f3f2f1',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '2px',
            '& fieldset': {
              borderColor: '#d2d0ce',
            },
            '&:hover fieldset': {
              borderColor: '#0078d4',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0078d4',
            },
          },
        },
      },
    },

  },
});
