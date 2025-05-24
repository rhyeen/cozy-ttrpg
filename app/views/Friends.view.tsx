import { useEffect, useState } from 'react';
import { friendConnectionController } from '../utils/services';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { Friend, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import Button from 'app/components/Button';
import Form from 'app/components/Form';
import Divider from 'app/components/Divider';
import Input from 'app/components/Input';
import { Validator, ValidatorError } from 'app/utils/validator';
import { FirebaseError } from 'firebase/app';
import { FriendCard } from './Friend.card';
import SettingsIcon from 'app/components/Icons/Settings';
import Menu from 'app/components/Menu';
import HeartBrokenIcon from 'app/components/Icons/HeartBroken';
import HeartIcon from 'app/components/Icons/Heart';

function isValidInput(
  friendEmail: string,
  setFriendEmailError: (error: string | null) => void,
) {
  let hasError = false;
  try {
    Validator.assertValidEmail(friendEmail);
  } catch (error) {
    if (error instanceof ValidatorError) {
      setFriendEmailError(error.genericMessage);
      hasError = true;
    }
  }
  if (hasError) {
    return false;
  }
  setFriendEmailError(null);
  return !hasError;
};

export async function inviteFriend(
  friendEmail: string,
  setFriendEmail: (email: string) => void,
  setFriendEmailError: (error: string | null) => void,
  setAddFriend?: (add: boolean) => void,
  setFriends?: React.Dispatch<React.SetStateAction<FriendConnection[] | undefined>>,
  setFriendUsers?: React.Dispatch<React.SetStateAction<User[]>>,
): Promise<FriendConnection | null> {
  if (!isValidInput(friendEmail, setFriendEmailError)) {
    return null;
  }
  try {
    const newFriendConnection = await friendConnectionController.inviteFriend(friendEmail);
    const newUser = new User(newFriendConnection.invited.uid, friendEmail, '');
    if (setFriends) {
      setFriends((prev) => (prev ? [...prev, newFriendConnection] : [newFriendConnection]));
    }
    if (setFriendUsers) {
      setFriendUsers((prev) => (prev ? [...prev, newUser] : [newUser]));
    }
    if (setAddFriend) {
      setAddFriend(false);
    }
    setFriendEmail('');
    setFriendEmailError(null);
    return newFriendConnection;
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === 'functions/not-found') {
        setFriendEmailError('Email not found. Make sure your friend has signed up for their own account.');
      } else if (error.code === 'functions/already-exists') {
        setFriendEmailError('You are already friends with this user.');
      } else if (error.code === 'functions/invalid-argument') {
        if (error.message.toLowerCase().includes('invite yourself')) {
          setFriendEmailError('You cannot invite yourself.');
        } else {
          setFriendEmailError(error.message);
        }
      } else {
        console.error('Error inviting friend:', error.code, error);
        setFriendEmailError('Unexpected error while sending invite.');
      }
    } else {
      console.error('Error inviting friend:', error);
      setFriendEmailError('Something unexpected happened. Try again later.');
    }
    return null;
  }
}

export function FriendsView() {
  const [friends, setFriends] = useState<FriendConnection[] | undefined>();
  const [friendUsers, setFriendUsers] = useState<User[]>([]);
  const [addFriend, setAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendEmailError, setFriendEmailError] = useState<string | null>(null);
  const [viewDeniedFriends, setViewDeniedFriends] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFriends = async () => {
    const result = await friendConnectionController.getFriendConnections();
    setFriends(result.friendConnections);
    setFriendUsers(result.users);
  };

  const _inviteFriend = async () => {
    setLoading(true);
    await inviteFriend(
      friendEmail,
      setFriendEmail,
      setFriendEmailError,
      setAddFriend,
      setFriends,
      setFriendUsers,
    );
    setLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);
  
  if (!friends) {
    return <Loading type="spinner" page />;
  }

  const filteredFriends = friends.filter((friend) => {
    if (viewDeniedFriends) return true;
    return !friend.invited.deniedAt && !friend.invitedBy.deniedAt;
  });

  return (
    <Section>
      <Header type="h1" icon={
        <Menu
          icon={<SettingsIcon />}
          items={[
            {
              label: viewDeniedFriends ? 'View Approved' : 'View Denied',
              onClick: () => {
                setViewDeniedFriends(!viewDeniedFriends);
              },
              icon: viewDeniedFriends ? <HeartIcon /> : <HeartBrokenIcon />,
            },
          ]}
        />
      }>
        Friends
      </Header>
      {filteredFriends.map((friendConnection) => (
        <FriendCard
          key={friendConnection.id}
          friendConnection={friendConnection}
          friendUsers={friendUsers}
          onSetFriendConnection={(updatedFriendConnection) => {
            setFriends((prev) => {
              if (!prev) return prev;
              const index = prev.findIndex((fc) => fc.id === updatedFriendConnection.id);
              if (index === -1) return prev;
              const newFriends = [...prev];
              newFriends[index] = updatedFriendConnection;
              return newFriends;
            });
          }}
        />
      ))}
      {addFriend ? (
        <Section>
          <Divider />
          <Form onSubmit={_inviteFriend}>
            <Input
              type="email"
              label="Friend's Email"
              value={friendEmail}
              onChange={(e) => {
                setFriendEmail(e.target.value);
                setFriendEmailError(null);
              }}
              required
              error={friendEmailError}
            />
            <Button
              type="primary"
              onClick={_inviteFriend}
              disabled={!!friendEmailError}
            >Send Invite</Button>
            <Button type="secondary" onClick={() => setAddFriend(false)}>Cancel</Button>
          </Form>
        </Section>
      ) : (
        <Button
          type={filteredFriends.length ? 'secondary' : 'primary'}
          onClick={() => {
            setAddFriend(true);
            setFriendEmail('');
          }}
          loading={loading}
        >Add Friend</Button>
      )}
    </Section>
  );
}
