import { use, useEffect, useState } from 'react';
import { characterController } from '../utils/services';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { Campaign, Character, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { selectFirebaseUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';

interface Props {
  campaign: Campaign;
  onSetCampaign: (campaign: Campaign) => void;
  friendUsers: User[];
  onSetFriendUsers: (users: User[]) => void;
  friendConnections: FriendConnection[];
  onSetFriendConnections: (connections: FriendConnection[]) => void;
  selectPlay?: boolean;
}

export function CampaignCharactersView({
  campaign,
  onSetCampaign,
  friendUsers,
  onSetFriendUsers,
  friendConnections,
  onSetFriendConnections,
  selectPlay = false,
}: Props) {
  const [characters, setCharacters] = useState<Character[] | undefined>();
  const firebaseUser = useSelector(selectFirebaseUser);

  const getCharacters = async () => {
    const result = await characterController.getCampaignCharacters(campaign.id);
    let _characters = result;
    if (selectPlay) {
      // @NOTE: get only my characters
      _characters = result.filter((character) => character.uid === firebaseUser?.uid);
    }
    setCharacters(_characters);
  };

  useEffect(() => {
    getCharacters();
  }, []);

  if (!characters) {
    return <Loading type="spinner" page />;
  }

  return (
    <Section>
      <Header type="h1">Characters</Header>
      {characters.map((character) => (
        <Header type="h3" key={character.id}>{character.name}</Header>
      ))}
    </Section>
  );
}
