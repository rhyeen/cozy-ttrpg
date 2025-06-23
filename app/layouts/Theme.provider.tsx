import React, {
  createContext, useContext,
  useState, useLayoutEffect,
  type ReactNode,
  useEffect
} from 'react';
import { UserColorTheme } from '@rhyeen/cozy-ttrpg-shared';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from 'app/store/user.slice';
import { userController } from 'app/utils/controller';

interface ThemeCtx {
  theme: UserColorTheme;
  setTheme: (t: UserColorTheme) => void;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>');
  return ctx;
};

const STORAGE_KEY = '_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<UserColorTheme | null>(null);
  const firebaseUser = useSelector(selectFirebaseUser);

  const retrieveTrueTheme = async () => {
    if (!firebaseUser) return;
    const result = await userController.getSelfAsUser();
    if (result) {
      setTheme(result.colorTheme);
    }
  };

  // @NOTE: Read stored preference BEFORE first paint
  useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as UserColorTheme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    retrieveTrueTheme();
  }, [firebaseUser]);

  // @NOTE: Update the document root and localStorage whenever the theme changes
  useLayoutEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme: theme || UserColorTheme.ForestShade, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
