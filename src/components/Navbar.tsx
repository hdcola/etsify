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
    Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useState, MouseEvent } from 'react';
import Logo from '../assets/logo.png';
import LogoImage from '../assets/logo-image.png';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Plug in logged state
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        try {
            console.log('logout ...');
             await axios.post(`${apiUrl}/api/users/logout`); 
            localStorage.removeItem('token');             
        } catch (error) {
            console.error('Logout failed', error);            
        }
    };
    const navigateCreateStore = async () => {
        navigate('/stores/create'); 
    };

    return (
        <>
            {/* TODO: Workaround until actual functionality is plugged in. */}
            {
                <div hidden>
                    <button
                        type="button"
                        onClick={() => setIsLoggedIn((prev) => !prev)}
                    >
                        {searchQuery}
                    </button>
                </div>
            }
            <AppBar
                position="sticky"
                elevation={0}
                sx={(theme) => ({
                    display: 'flex',
                    bgcolor: 'transparent',
                    [theme.breakpoints.up('xs')]: { mb: '0px' },
                    [theme.breakpoints.up('md')]: { mb: '16px' },
                })}
            >
                <Container disableGutters>
                    <Toolbar
                        sx={{
                            justifyContent: 'space-between',
                            py: '8px',
                            backdropFilter: 'blur(24px)',
                        }}
                    >
                        <Link to="/">
                            <Box
                                component="img"
                                mt={{ xs: 0, md: -1 }}
                                paddingRight={2}
                                sx={{
                                    content: {
                                        xs: `url(${LogoImage})`,
                                        sm: `url(${Logo})`,
                                    },
                                    maxHeight: '50px',
                                }}
                                alt="Etsify Logo"
                            />
                        </Link>
                        <Stack
                            mx={{ xs: 1, md: 3 }}
                            spacing={{ xs: 0, md: 2 }}
                            direction="row"
                            sx={{ flexGrow: 1, alignItems: 'center' }}
                        >
                            <Box display={{ xs: 'none', md: 'block' }}>
                                <Button
                                    color="primary"
                                    startIcon={<MenuIcon />}
                                >
                                    Categories
                                </Button>
                            </Box>
                            <SearchBar setSearchQuery={setSearchQuery} />
                        </Stack>
                        <Stack
                            spacing={{ xs: 1, md: 4 }}
                            direction="row"
                            sx={{ justifyContent: 'right' }}
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
                                <>
                                    <Button color="primary">Login</Button>
                                    <Button color="secondary">Register</Button>
                                </>
                            )}
                        </Stack>
                        <Menu
                            id="account-menu"
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
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
                            <MenuItem onClick={navigateCreateStore}>
                                    <ListItemIcon>
                                        <StorefrontOutlinedIcon fontSize='small' />
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
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;
