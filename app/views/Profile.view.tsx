import { useEffect, useState } from 'react';
import { Campaign, User } from '@rhyeen/cozy-ttrpg-shared';
import { userController } from '../utils/services';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import Input from 'app/components/Input';
import Form from 'app/components/Form';

export function ProfileView() {
  const [user, setUser] = useState<User | null | undefined>();

  const getProfile = async () => {
    let result = await userController.getSelfAsUser();
    if (result === null) {
      result = await userController.createSelfAsUser({ displayName: '' });
    }
    setUser(result);
  };

  const updateProfile = async () => {
    if (!user) return;
    const updatedUser = await userController.updateSelfAsUser(user);
    setUser(updatedUser);
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
          placeholder="Email"
          value={user.email}
          disabled
        />
        <Input
          type="text"
          placeholder="Display Name"
          value={user.displayName}
          onChange={(e) => {
            const _user = user.copy();
            _user.displayName = e.target.value;
            setUser(_user);
          }}
          onBlur={updateProfile}
        />
      </Form>
    </Section>
  );
}
