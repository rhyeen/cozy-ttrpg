import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { selectFirebaseUser, setFirebaseUser, type FirebaseUser } from './store/userSlice'; // Adjust the import path as needed
import { auth } from './utils/firebase';
import { User } from '@rhyeen/cozy-ttrpg-shared';
import { userController } from './utils/controller';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const firebaseUser = useSelector(selectFirebaseUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [ selfAsUser, setSelfAsUser ] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (firebaseUser === null && location.pathname !== '/login') {
      navigate('/login');
      return;
    }
    if (!!firebaseUser) {
      ensureUserIsGenerated();
    }
  }, [firebaseUser, navigate, location]);

  const dispatch = useDispatch();

  const ensureUserIsGenerated = async () => {
    let result = await userController.getSelfAsUser();
    if (result === null) {
      result = await userController.createSelfAsUser({ displayName: '' });
    }
    setSelfAsUser(result);
    if (location.pathname === '/login') {
      navigate('/');
    }
  };

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
  if (firebaseUser === undefined || (
    selfAsUser === undefined && firebaseUser !== null
  )) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;