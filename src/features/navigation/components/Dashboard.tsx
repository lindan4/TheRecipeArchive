import { HomeRounded, MenuRounded } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, signUpUser } from '../../user/api/userApi';
import { SECONDARY_COLOUR } from '../../../shared/constants';
import { useAppDispatch, useAppSelector } from '../../user/state/hooks';
import { setReduxName, setUserId } from '../../user/state/UserSlice';

const modalBoxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '92vw', sm: 500 },
  maxWidth: '500px',
  bgcolor: '#fffaf0',
  border: '1px solid rgba(38, 20, 5, 0.2)',
  borderRadius: '20px',
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
  p: { xs: 3, sm: 4 }
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const loggedIn = useAppSelector((state) => state.user.isUserLoggedIn);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const showHomeButton = useMemo(() => location.pathname !== '/', [location.pathname]);

  const resetModalState = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      await loginUser(username, password);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setErrorMessage('');
      setSuccessMessage('Logged in successfully.');
      setShowSnackbar(true);
    } catch {
      setErrorMessage('Unable to login. Please verify your credentials and try again.');
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password || !name) {
      setErrorMessage('Name, email, and password are required.');
      return;
    }

    try {
      const userData = await signUpUser(username, password, name);
      dispatch(setReduxName(userData.name));
      dispatch(setUserId(userData.uid));

      setShowLoginModal(false);
      setShowSignupPage(false);
      setUsername('');
      setPassword('');
      setName('');
      setErrorMessage('');
      setSuccessMessage('Your account was created and you are now signed in.');
      setShowSnackbar(true);
    } catch (error) {
      const firebaseCode = (error as { code?: string }).code;
      if (firebaseCode === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists.');
      } else {
        setErrorMessage('Could not create account. Please try again.');
      }
    }
  };

  const renderMenuContent = () => {
    if (loggedIn) {
      return (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/favourites');
            }}
          >
            My Favourites
          </MenuItem>
          <MenuItem
            onClick={async () => {
              handleMenuClose();
              await logoutUser();
              navigate('/');
              setSuccessMessage('Successfully logged out.');
              setShowSnackbar(true);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      );
    }

    return (
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            resetModalState();
            setShowLoginModal(true);
          }}
        >
          Login
        </MenuItem>
      </Menu>
    );
  };

  return (
    <>
      <AppBar
        elevation={0}
        position="static"
        sx={{ background: 'transparent', color: 'var(--text-primary)', borderBottom: '1px solid transparent' }}
      >
        <Toolbar sx={{ width: 'min(1120px, 100%)', margin: '0 auto', minHeight: '68px' }}>
          {!isDesktop && (
            <IconButton aria-label="menu" onClick={handleMenuOpen}>
              <MenuRounded />
            </IconButton>
          )}
          {showHomeButton && !isDesktop && (
            <IconButton
              aria-label="home"
              onClick={() => {
                navigate('/');
              }}
            >
              <HomeRounded />
            </IconButton>
          )}
          <Box sx={{ marginLeft: isDesktop ? 0 : 'auto' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
              The Recipe Archive
            </Typography>
          </Box>
          {isDesktop && (
            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              {showHomeButton && (
                <Button
                  onClick={() => navigate('/')}
                  sx={{
                    color: 'var(--text-primary)',
                    transition: 'transform 180ms ease, background-color 180ms ease',
                    '&:hover': { transform: 'translateY(-1px)', backgroundColor: 'rgba(173,93,36,0.08)' }
                  }}
                >
                  Home
                </Button>
              )}
              {loggedIn ? (
                <>
                  <Button
                    onClick={() => navigate('/profile')}
                    sx={{
                      color: 'var(--text-primary)',
                      transition: 'transform 180ms ease, background-color 180ms ease',
                      '&:hover': { transform: 'translateY(-1px)', backgroundColor: 'rgba(173,93,36,0.08)' }
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    onClick={() => navigate('/favourites')}
                    sx={{
                      color: 'var(--text-primary)',
                      transition: 'transform 180ms ease, background-color 180ms ease',
                      '&:hover': { transform: 'translateY(-1px)', backgroundColor: 'rgba(173,93,36,0.08)' }
                    }}
                  >
                    Favourites
                  </Button>
                  <Button
                    onClick={async () => {
                      await logoutUser();
                      navigate('/');
                      setSuccessMessage('Successfully logged out.');
                      setShowSnackbar(true);
                    }}
                    sx={{
                      color: 'var(--text-primary)',
                      transition: 'transform 180ms ease, background-color 180ms ease',
                      '&:hover': { transform: 'translateY(-1px)', backgroundColor: 'rgba(173,93,36,0.08)' }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    resetModalState();
                    setShowLoginModal(true);
                  }}
                  sx={{
                    bgcolor: SECONDARY_COLOUR,
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px rgba(173,93,36,0.28)' }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {!isDesktop && renderMenuContent()}

      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Box sx={modalBoxStyle}>
          {!showSignupPage ? (
            <>
              <Typography variant="h5" fontWeight={700}>
                Login
              </Typography>
              <Box component="form" sx={{ mt: 2, display: 'grid', gap: 2 }} onSubmit={handleLogin}>
                <TextField
                  id="email-field"
                  label="Email"
                  variant="outlined"
                  value={username}
                  type="email"
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
                <TextField
                  id="password-field"
                  label="Password"
                  variant="outlined"
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button type="submit" variant="contained" sx={{ mt: 1, bgcolor: SECONDARY_COLOUR }}>
                  Login
                </Button>
              </Box>

              <Typography sx={{ mt: 3 }}>
                Don&apos;t have an account?{' '}
                <Link
                  component="button"
                  underline="hover"
                  onClick={() => {
                    setShowSignupPage(true);
                    resetModalState();
                  }}
                >
                  Sign up here
                </Link>
                .
              </Typography>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={700}>
                  Sign Up
                </Typography>
                <Button
                  variant="text"
                  sx={{ color: SECONDARY_COLOUR }}
                  onClick={() => {
                    setShowSignupPage(false);
                    resetModalState();
                  }}
                >
                  Back
                </Button>
              </Box>

              <Box component="form" sx={{ mt: 2, display: 'grid', gap: 2 }} onSubmit={handleSignUp}>
                <TextField
                  id="name-field"
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <TextField
                  id="signup-email-field"
                  label="Email"
                  variant="outlined"
                  value={username}
                  type="email"
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
                <TextField
                  id="signup-password-field"
                  label="Password"
                  variant="outlined"
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button type="submit" variant="contained" sx={{ mt: 1, bgcolor: SECONDARY_COLOUR }}>
                  Create Account
                </Button>
              </Box>
            </>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3500}
        onClose={() => {
          setShowSnackbar(false);
          setSuccessMessage('');
        }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export { Dashboard };
