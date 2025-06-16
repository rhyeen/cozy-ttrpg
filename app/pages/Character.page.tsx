import { useEffect, useState } from 'react';
import { Campaign, Character, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { campaignController, characterController, friendConnectionController } from 'app/utils/controller';
import Loading from 'app/components/Loading';
import { useNavigate } from 'react-router';
import { CharacterSheet } from 'app/views/play/CharacterSheet';

interface Props {
  characterId: string;
}

export function CharacterPage({ characterId }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>();
  const [character, setCharacter] = useState<Character | undefined>();
  const [friends, setFriends] = useState<FriendConnection[] | undefined>();
  const [friendUsers, setFriendUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const getFriends = async (forceRefresh = false) => {
    if (friends && !forceRefresh) return;
    const result = await friendConnectionController.getFriendConnections();
    setFriends(result.friendConnections);
    setFriendUsers(result.users);
  };

  const getCampaigns = async () => {
    const result = await campaignController.getCampaigns();
    setCampaigns(result);
  };

  const getCharacter = async () => {
    const result = await characterController.getSelfCharacters();
    const character = result.find((c) => c.id === characterId);
    if (!character) {
      navigate('/404');
      return;
    }
    setCharacter(character);
  };

  useEffect(() => {
    getCampaigns();
    getCharacter();
    getFriends();
  }, [characterId]);

  if (!campaigns || !character || !friends || !friendUsers) {
    return <Loading type="spinner" page />;
  }

  const setCharacterState = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
  };

  return (
    <CharacterSheet
      character={character}
      friendUsers={friendUsers}
      friendConnections={friends}
      onCharacterUpdate={setCharacterState}
      onClose={() => navigate(-1)}
    />
  );
}
