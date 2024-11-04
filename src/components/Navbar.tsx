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
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../store/useLoginStore';
import { useAppContext } from '../App';
import useCartCount from '../hooks/useCartCount';

const Navbar = () => {
    const { cartCount } = useAppContext();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { isLoggedIn, logout, username, picture } = useLoginStore();
    useCartCount();

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
            logout();
            handleClose();
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    const navigateCreateStore = async () => {
        navigate('/stores/dashboard');
    };

    return (
        <>
            {/* TODO: Workaround until actual functionality is plugged in. */}
            {<div hidden>{searchQuery}</div>}
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
                                    minWidth: {
                                        xs: '50px',
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
                                <Link to="/cart">
                                    <Badge
                                        badgeContent={cartCount}
                                        color="primary"
                                    >
                                        <ShoppingCartOutlinedIcon />
                                    </Badge>
                                </Link>
                            </IconButton>
                            {isLoggedIn ? (
                                <IconButton onClick={handleClick}>
                                    {picture ? (
                                        <Avatar
                                            alt={username}
                                            src={picture}
                                        ></Avatar>
                                    ) : (
                                        <Avatar>{username.charAt(0)}</Avatar>
                                    )}
                                </IconButton>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        color="secondary"
                                    >
                                        Register
                                    </Button>
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
                                    <StorefrontOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                Sell on etsify
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    navigate('/settings');
                                }}
                            >
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
