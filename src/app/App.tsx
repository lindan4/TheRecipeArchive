import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { Box } from '@mui/material';
import { Dashboard } from '../features/navigation/components/Dashboard';
import Main from '../features/recipes/pages/Main';
import SearchResults from '../features/recipes/pages/SearchResults';
import MealInfo from '../features/recipes/pages/MealInfo';
import MyFavourites from '../features/recipes/pages/MyFavourites';
import Profile from '../features/profile/pages/Profile';
import ErrorPage from '../features/error/pages/ErrorPage';
import app from '../shared/firebase';
import { clearUserState, logOnUser, setReduxName, setUserFavourites, setUserId } from '../features/user/state/UserSlice';
import { useAppDispatch } from '../features/user/state/hooks';

const AppLayout = () => (
  <Box sx={{ minHeight: '100vh', width: '100%' }}>
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--surface-border)',
        background: 'var(--surface-glass)'
      }}
    >
      <Dashboard />
    </Box>
    <Box component="main" sx={{ width: '100%', minHeight: 'calc(100vh - 68px)' }}>
      <Outlet />
    </Box>
  </Box>
);

function App() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const dispatch = useAppDispatch();
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        localStorage.setItem('authUser', user.uid);
        dispatch(setUserId(user.uid));
        dispatch(logOnUser());
      } else {
        localStorage.removeItem('authUser');
        dispatch(clearUserState());
      }

      setAuthUser(user);
    });

    return unsubscribe;
  }, [auth, dispatch]);

  useEffect(() => {
    if (!authUser || authUser.isAnonymous) {
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', authUser.uid), (userData) => {
      if (userData.exists()) {
        const rawData = userData.data() as { name?: string; favourites?: string[] };
        dispatch(setReduxName(rawData.name ?? ''));
        dispatch(setUserFavourites(rawData.favourites ?? []));
      }
    });

    return unsubscribe;
  }, [authUser, db, dispatch]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/meal" element={<MealInfo />} />
        <Route path="/favourites" element={<MyFavourites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
