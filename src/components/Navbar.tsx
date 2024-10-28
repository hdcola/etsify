import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Stack,
    Avatar,
    Badge,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useState, MouseEvent } from "react";
import Logo from "./logo.png";
import SearchBar from "./SearchBar";

/* const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  })); */

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Plug in logged state

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                display: "flex",
                backgroundColor: "white",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", py: "8px" }}>
                <IconButton edge="start" color="inherit">
                    <Box
                        component="img"
                        mt={-1}
                        height={50}
                        src={Logo}
                        alt="Etsify Logo"
                    />
                </IconButton>
                <Stack
                    spacing={4}
                    direction={"row"}
                    sx={{ flexGrow: 1 }}
                    mx={{ xs: 1, sm: 4, md: 8 }}
                >
                    <Button color="primary" startIcon={<MenuIcon />}>
                        Categories
                    </Button>
                    <SearchBar setSearchQuery={setSearchQuery} />
                </Stack>
                <Stack
                    spacing={4}
                    direction="row"
                    sx={{ justifyContent: "right" }}
                >
                    <IconButton>
                        <FavoriteBorderOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <Badge badgeContent={4} color="primary">
                            <ShoppingCartOutlinedIcon />
                        </Badge>
                    </IconButton>
                    {isLoggedIn ? (
                        <IconButton onClick={handleClick}>
                            <Avatar>TP</Avatar>
                        </IconButton>
                    ) : (
                        <Button color="primary">Sign in</Button>
                    )}
                </Stack>
                <Menu
                    id="account-menu"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    elevation={2}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        View profile
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <ShoppingBasketOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Purchase history
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <GradeOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Order reviews
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <StorefrontOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Sell on etsify
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Account settings
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
