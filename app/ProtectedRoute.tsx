import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { selectFirebaseUser, setFirebaseUser, type FirebaseUser } from './store/userSlice'; // Adjust the import path as needed
import { auth } from './utils/firebase';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const firebaseUser = useSelector(selectFirebaseUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (firebaseUser === null && location.pathname !== '/login') {
      navigate('/login');
    }
    if (!!firebaseUser && location.pathname === '/login') {
      navigate('/');
    }
  }, [firebaseUser, navigate, location]);

  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      const firebaseUser: FirebaseUser | null = user ? {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        providerData: user.providerData.map(p => ({
          providerId: p.providerId,
          uid: p.uid,
          email: p.email,
        })),
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
      } : null;
      dispatch(setFirebaseUser(firebaseUser));
    });
  }, []);

  // @NOTE: This means we're still loading the user.
  if (firebaseUser === undefined) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;