import { useEffect, useState } from 'react';
import { User, UserColorTheme } from '@rhyeen/cozy-ttrpg-shared';
import { userController } from '../utils/controller';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import Input from 'app/components/Input';
import Form from 'app/components/Form';
import type { SaveState } from 'app/components/Icons/SaveState';
import { Validator, ValidatorError } from 'app/utils/validator';
import Menu from 'app/components/Menu';
import { useTheme } from 'app/layouts/Theme.provider';
import BrushIcon from 'app/components/Icons/Brush';

export function ProfileView() {
  const [user, setUser] = useState<User | null | undefined>();
  const [initialUser, setInitialUser] = useState<User | null | undefined>();
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [displayNameSaveState, setDisplayNameSaveState] = useState<SaveState>('hide');
  const { setTheme, theme } = useTheme();

  const changeTheme = async (theme: UserColorTheme) => {
    setTheme(theme);
    const updatedUser = user?.copy();
    if (!updatedUser) return;
    updatedUser.colorTheme = theme;
    await userController.updateSelfAsUser(updatedUser);
  };

  const getProfile = async () => {
    let result = await userController.getSelfAsUser();
    if (result === null) {
      throw new Error('User not found. Please sign in and out to refresh.');
    }
    setUser(result);
    setInitialUser(result);
  };

  const invalidDisplayName = (displayName: string | undefined) => {
    try {
      Validator.assertValidName(displayName ?? '');
    } catch (error) {
      if (error instanceof ValidatorError) {
        setDisplayNameError(error.genericMessage);
        return true;
      }
    }
    setDisplayNameError(null);
    return false;
  };

  const updateDisplayName = async (updatedUser?: User) => {
    const _user = updatedUser || user;
    if (_user?.displayName === initialUser?.displayName) return;
    if (invalidDisplayName(_user?.displayName)) {
      return;
    }
    if (!_user) return;
    setDisplayNameSaveState('saving');
    try {
      const updatedUser = await userController.updateSelfAsUser(_user);
      setDisplayNameSaveState('success');
      setUser(updatedUser);
      setInitialUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      setDisplayNameError('Unexpected error while saving.');
      setDisplayNameSaveState('error');
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const themeItems = [
    {
      label: 'Forest Shade',
      value: UserColorTheme.ForestShade,
      onClick: () => changeTheme(UserColorTheme.ForestShade),
      icon: <BrushIcon color="#5e6f34" />,
    },
    {
      label: 'Sea Breeze',
      value: UserColorTheme.SeaBreeze,
      onClick: () => changeTheme(UserColorTheme.SeaBreeze),
      icon: <BrushIcon color="#1d6e91" />,
    },
    {
      label: 'Poppy Pink',
      value: UserColorTheme.PoppyPink,
      onClick: () => changeTheme(UserColorTheme.PoppyPink),
      icon: <BrushIcon color="#c13684" />,
    },
  ];

  if (!user) {
    return <Loading type="spinner" page />;
  }

  return (
    <Section>
      <Header type="h1">Profile</Header>
      <Form>
        <Input
          type="email"
          label="Email"
          value={user.email}
          readOnly
        />
        <Input
          type="text"
          label="Display Name"
          value={user.displayName}
          onChange={(e) => {
            const _user = user.copy();
            _user.displayName = e.target.value;
            setUser(_user);
          }}
          onBlur={() => updateDisplayName()}
          error={displayNameError}
          onInput={() => setDisplayNameError(null)}
          saveState={displayNameSaveState}
          onStateChange={setDisplayNameSaveState}
        />
        <Menu
          text={{
            label: 'Color Theme',
            trigger: themeItems.find(i => i.value === theme)?.label || 'Forest Shade',
          }}
          items={themeItems}
        />
      </Form>
    </Section>
  );
}
