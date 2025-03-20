import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, Typography, Stack } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { EnumRole } from '../types';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [dropdownMenuAnchor, setDropdownMenuAnchor] = useState<null | HTMLElement>(null);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
    setDropdownMenuAnchor(null);
  };

  const handleDropdownMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDropdownMenuAnchor(event.currentTarget);
    setAccountMenuAnchor(null);
  };

  const handleClose = () => {
    setAccountMenuAnchor(null);
    setDropdownMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    if (!user) return [];


    switch (user.role) {
        case EnumRole.Traveler:  // 1 => Traveler
          return [
            { label: 'Seyahatlerim', path: '/myTravel' },
            { label: 'Turlar', path: '/tours' },
          ];
        case EnumRole.Agency:    // 2 => Agency
          return [
            { label: 'Tur Ekle', path: '/addTour' },
            { label: 'Onay Bekleyen Turlarım', path: '/approvalTours' },
          ];
        case EnumRole.Owner:     // 3 => Owner
          return [
            { label: 'Mekan Ekle', path: '/addPlace' },
            { label: 'Onay Bekleyen Mekanlarım', path: '/approvalPlaces' },
          ];
        default:
          return [];
      }
      
  };

  const menuItems = getMenuItems();

  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Home button */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => handleNavigation('/home')}>Gezgineri</Button>
        </Typography>

        {/* Dropdown menu */}
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <Box>
            <Button color="inherit" onClick={handleDropdownMenuOpen}>
                {user?.role === EnumRole.Traveler ? 'Seyahatler' : user?.role === EnumRole.Agency ? 'Turlar' : 'Mekanlar'}
            </Button>
            <Menu
              anchorEl={dropdownMenuAnchor}
              open={Boolean(dropdownMenuAnchor)}
              onClose={handleClose}
            >
              {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={() => handleNavigation(item.path)}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Stack>

        {/* Account menu */}
        <Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleAccountMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleNavigation('/profile')}>Hesabım</MenuItem>
            <MenuItem onClick={handleLogout}>Çıkış</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
