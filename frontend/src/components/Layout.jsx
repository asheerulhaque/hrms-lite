import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Menu,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DRAWER_WIDTH = 264;

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Attendance', path: '/attendance', icon: Calendar },
];

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const currentPage = navItems.find((item) => item.path === location.pathname);

  const sidebar = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0f172a',
        color: '#e2e8f0',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#3b82f6',
            width: 38,
            height: 38,
            borderRadius: 2,
          }}
        >
          <Building2 size={20} />
        </Avatar>
        <div>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}
          >
            HRMS Lite
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
            HR Management System
          </Typography>
        </div>
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ ml: 'auto', color: '#94a3b8' }}
          >
            <ChevronLeft size={20} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: '#1e293b' }} />

      <Typography
        variant="overline"
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1,
          color: '#475569',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: 1.2,
        }}
      >
        Main Menu
      </Typography>

      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <ListItemButton
              key={path}
              onClick={() => handleNav(path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                py: 1.2,
                bgcolor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: active ? '#60a5fa' : '#94a3b8',
                '&:hover': {
                  bgcolor: active
                    ? 'rgba(59,130,246,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  color: active ? '#60a5fa' : '#e2e8f0',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                }}
              />
              {active && (
                <ChevronRight size={16} style={{ opacity: 0.5 }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#1e293b' }} />

      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.15)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}
          >
            HRMS Lite v1.0.0
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#475569', fontSize: '0.65rem' }}
          >
            Single Admin Mode
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '4px 0 32px rgba(0,0,0,0.15)',
            },
          }}
        >
          {sidebar}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'auto',
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            color: '#0f172a',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, md: 68 }, px: { xs: 2, md: 4 } }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2 }}
              >
                <Menu size={22} />
              </IconButton>
            )}
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.3 }}
              >
                {currentPage?.label ?? 'HRMS Lite'}
              </Typography>
              <Breadcrumbs
                separator="›"
                sx={{ '& .MuiBreadcrumbs-separator': { color: '#cbd5e1' } }}
              >
                <Link
                  underline="hover"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                >
                  Home
                </Link>
                {currentPage && currentPage.path !== '/' && (
                  <Typography
                    color="text.primary"
                    sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {currentPage.label}
                  </Typography>
                )}
              </Breadcrumbs>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4, md: 5 },
            maxWidth: 1600,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
