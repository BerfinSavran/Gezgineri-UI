import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { EnumRole } from '../types';
import Button from '@mui/material/Button';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== EnumRole.Admin) {
    return null;
  }

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // veya giriş sayfan hangisiyse
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Çıkışı alta ittirmek için
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/adminDashboard')}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/approvalPlaces')}>
              <ListItemText primary="Onay Bekleyen Mekanlar" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/approvalTours')}>
              <ListItemText primary="Onay Bekleyen Turlar" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/categories')}>
              <ListItemText primary="Kategori Ayarları" />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ p: 2 }}>
          <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
