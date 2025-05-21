import { useEffect, useState } from 'react';
import { friendConnectionController } from '../utils/services';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { FriendConnection } from '@rhyeen/cozy-ttrpg-shared';

export function FriendsView() {
  const [friends, setFriends] = useState<FriendConnection[] | undefined>();

  const getFriends = async () => {
    const result = await friendConnectionController.getFriendConnections();
    setFriends(result);
  };

  useEffect(() => {
    getFriends();
  }, []);
  
  if (!friends) {
    return <Loading type="spinner" page />;
  }

  return (
    <Section>
      <Header type="h2">Friends</Header>
      {friends.map((friendConnection) => (
        <Header type="h3" key={friendConnection.id}>{friendConnection.id}</Header>
      ))}
    </Section>
  );
}
