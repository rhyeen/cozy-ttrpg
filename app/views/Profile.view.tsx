import { useEffect, useState } from 'react';
import { Campaign, User } from '@rhyeen/cozy-ttrpg-shared';
import { userController } from '../utils/services';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import Input from 'app/components/Input';
import Form from 'app/components/Form';
import type { SaveState } from 'app/components/Icons/SaveState';
import { Validator, ValidatorError } from 'app/utils/validator';

export function ProfileView() {
  const [user, setUser] = useState<User | null | undefined>();
  const [initialUser, setInitialUser] = useState<User | null | undefined>();
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [displayNameSaveState, setDisplayNameSaveState] = useState<SaveState>('hide');

  const getProfile = async () => {
    let result = await userController.getSelfAsUser();
    if (result === null) {
      result = await userController.createSelfAsUser({ displayName: '' });
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

  const updateProfile = async () => {
    if (user?.displayName === initialUser?.displayName) return;
    if (invalidDisplayName(user?.displayName)) {
      return;
    }
    if (!user) return;
    setDisplayNameSaveState('saving');
    try {
      const updatedUser = await userController.updateSelfAsUser(user);
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

  if (!user) {
    return <Loading type="spinner" page />;
  }

  return (
    <Section>
      <Header type="h2">Profile</Header>
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
          onBlur={updateProfile}
          error={displayNameError}
          onInput={() => setDisplayNameError(null)}
          saveState={displayNameSaveState}
          onStateChange={setDisplayNameSaveState}
        />
      </Form>
    </Section>
  );
}
