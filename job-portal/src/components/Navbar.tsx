"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { user, signIn, signOut } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    router.push("/profile");
  };

  const handleApplicationsClick = () => {
    handleClose();
    router.push("/applications");
  };

  const handleSettingsClick = () => {
    handleClose();
    router.push("/settings");
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      className="bg-white"
    >
      <Toolbar className="container mx-auto">
        <Box className="flex items-center gap-2 mr-8">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/" className="text-xl font-bold">
            JobPortal
          </Link>
        </Box>

        <Box className="flex-1 max-w-2xl">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search jobs, companies, or keywords"
            size="small"
            className="bg-gray-50 rounded-lg"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-500" />
                </InputAdornment>
              ),
              sx: {
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              },
            }}
          />
        </Box>

        <Box className="flex items-center gap-4">
          <Button color="inherit" className="hover:text-primary">
            Find Jobs
          </Button>
          <Button color="inherit" className="hover:text-primary">
            Companies
          </Button>
          <Button color="inherit" className="hover:text-primary">
            Career Advice
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="rounded-full px-6"
          >
            Post a Job
          </Button>

          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          <IconButton color="inherit">
            <BookmarkIcon />
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenu} color="inherit" className="ml-2">
                <Avatar
                  src={user.photoURL}
                  alt={user.name}
                  className="w-8 h-8"
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon className="mr-2" /> Profile
                </MenuItem>
                <MenuItem onClick={handleApplicationsClick}>
                  <WorkIcon className="mr-2" /> My Applications
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                  <SettingsIcon className="mr-2" /> Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon className="mr-2" /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={signIn}
              startIcon={<PersonIcon />}
            >
              Sign In with Google
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
