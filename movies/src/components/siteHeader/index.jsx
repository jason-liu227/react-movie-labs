import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null); // mobile menu
  const [topRatedAnchorEl, setTopRatedAnchorEl] = useState(null); // desktop hover menu
  const [topRatedFilter, setTopRatedFilter] = useState();

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "Favorites", path: "/movies/favorites" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "Popular", path: "/movies/popular" },
  ];

  // --- Mobile menu handlers ---
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuSelect = (path) => {
    setAnchorEl(null);
    navigate(path);
  };

  // --- Top Rated dropdown handlers ---
  const handleTopRatedOpen = (event) => {
    setTopRatedAnchorEl(event.currentTarget);
  };
  const handleTopRatedClose = () => {
    setTopRatedAnchorEl(null);
  };
  const handleTopRatedSelect = (filter) => {
  setTopRatedAnchorEl(null);
  navigate(`/movies/topRated/${filter}`);
};

  return (
    <>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            All you ever wanted to know about Movies!
          </Typography>

          {isMobile ? (
            // ------------------- MOBILE -------------------
            <>
              <IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {menuOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => handleMenuSelect(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => handleTopRatedSelect("allTime")}>All Time</MenuItem>
                <MenuItem onClick={() => handleTopRatedSelect("thisYear")}>This Year</MenuItem>
                <MenuItem onClick={() => handleTopRatedSelect("thisMonth")}>This Month</MenuItem>
                <MenuItem onClick={() => handleTopRatedSelect("thisWeek")}>This Week</MenuItem>
                <MenuItem onClick={() => handleTopRatedSelect("today")}>Today</MenuItem>
              </Menu>
            </>
          ) : (
            // ------------------- DESKTOP -------------------
            <>
              {menuOptions.map((opt) => (
                <Button
                  key={opt.label}
                  color="inherit"
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </Button>
              ))}

              {/* Top Rated button with hover dropdown */}
<div
  onMouseEnter={handleTopRatedOpen}
  onMouseLeave={() => setTimeout(handleTopRatedClose, 200)} // small delay for smoothness
  style={{ display: "inline-block" }}
>
  <Button
    color="inherit"
    aria-controls={Boolean(topRatedAnchorEl) ? "top-rated-menu" : undefined}
    aria-haspopup="true"
  >
    Top Rated
  </Button>

  <Menu
    id="top-rated-menu"
    anchorEl={topRatedAnchorEl}
    open={Boolean(topRatedAnchorEl)}
    onClose={handleTopRatedClose}
    MenuListProps={{
      onMouseEnter: () => clearTimeout(window.topRatedTimeout),
      onMouseLeave: () => {
        window.topRatedTimeout = setTimeout(handleTopRatedClose, 200);
      },
    }}
    sx={{
      mt: 1,
      zIndex: 1302, // ensures it's above the AppBar
    }}
  >
  <MenuItem onClick={() => handleTopRatedSelect("allTime")}>All Time</MenuItem>
  <MenuItem onClick={() => handleTopRatedSelect("thisYear")}>This Year</MenuItem>
  <MenuItem onClick={() => handleTopRatedSelect("thisMonth")}>This Month</MenuItem>
  <MenuItem onClick={() => handleTopRatedSelect("thisWeek")}>This Week</MenuItem>
  <MenuItem onClick={() => handleTopRatedSelect("today")}>Today</MenuItem>
  </Menu>
</div>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;