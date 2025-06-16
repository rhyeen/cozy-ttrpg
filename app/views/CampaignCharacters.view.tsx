import { useEffect, useState } from 'react';
import { characterController, playController } from '../utils/controller';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { Campaign, Character, FriendConnection, Play, User } from '@rhyeen/cozy-ttrpg-shared';
import { selectFirebaseUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';
import Button from 'app/components/Button';
import { useNavigate } from 'react-router';
import IconButton from 'app/components/IconButton';
import ArrowBackIcon from 'app/components/Icons/ArrowBack';
import { CharacterCard } from './Character.card';
import { CharacterSheet } from './play/CharacterSheet';

interface Props {
  campaign: Campaign;
  onSetCampaign: (campaign: Campaign) => void;
  friendUsers: User[];
  onSetFriendUsers: (users: User[]) => void;
  friendConnections: FriendConnection[];
  onSetFriendConnections: (connections: FriendConnection[]) => void;
  viewOtherPlayerCharacters?: boolean;
}

export function CampaignCharactersView({
  campaign,
  onSetCampaign,
  friendUsers,
  onSetFriendUsers,
  friendConnections,
  onSetFriendConnections,
  viewOtherPlayerCharacters = false,
}: Props) {
  const [characters, setCharacters] = useState<Character[] | undefined>();
  const [viewCharacter, setViewCharacter] = useState<Character | undefined>();
  const [plays, setPlays] = useState<Play[] | undefined>();
  const [loading, setLoading] = useState(false);
  const firebaseUser = useSelector(selectFirebaseUser);
  const navigate = useNavigate();

  const getCharacters = async () => {
    const result = await playController.getCampaignPlays(campaign.id);
    let _characters = result.characters;
    let _plays = result.plays;
    if (viewOtherPlayerCharacters) {
      // @NOTE: get only my characters
      _characters = result.characters.filter((character) => character.uid === firebaseUser?.uid);
      _plays = result.plays.filter((play) => play.uid === firebaseUser?.uid);
    }
    setCharacters(_characters);
    setPlays(_plays);
  };

  const handleCreateCharacter = async () => {
    setLoading(true);
    const newCharacter = await characterController.createSelfCharacter();
    const newPlay = await playController.setSelfPlay(newCharacter.id, campaign.id, true);
    navigate(`/play/${newPlay.id}`);
  };

  const handleCharacterUpdate = async (character: Character) => {
    setCharacters((prev) => prev ? prev.map((c) => c.id === character.id ? character : c) : []);
  };

  useEffect(() => {
    getCharacters();
  }, []);

  if (!characters) {
    return <Loading type="spinner" page />;
  }

  if (viewCharacter) {
    const character = characters.find((c) => c.id === viewCharacter.id);
    if (!character) {
      setViewCharacter(undefined);
      return <Loading type="spinner" page />;
    }
    const play = plays?.find((p) => p.characterId === character.id);
    return (
      <CharacterSheet
        character={character}
        campaign={campaign}
        friendUsers={friendUsers}
        friendConnections={friendConnections}
        onClose={() => setViewCharacter(undefined)}
        onCharacterUpdate={handleCharacterUpdate}
        play={play}
      />
    );
  }

  const filteredCharacters = characters.filter((character) => !character.deletedAt);

  return (
    <Section>
      <Header type="h3" iconLeft={
        <IconButton onClick={() => navigate(`/campaigns/${campaign.id}`)}>
          <ArrowBackIcon />
        </IconButton>
      }>{campaign.name}</Header>
      <Header type="h1">Characters</Header>
      {filteredCharacters.map((character) => (
        <CharacterCard
          friendUsers={friendUsers}
          character={character}
          key={character.id}
          friendConnections={friendConnections}
          onSetFriendConnections={onSetFriendConnections}
          onCharacterUpdate={handleCharacterUpdate}
          onViewCharacter={() => setViewCharacter(character)}
          campaigns={[campaign]}
          onSetCampaign={onSetCampaign}
          playOnClick
        />
      ))}
      <Button
        type={filteredCharacters.length ? 'secondary' : 'primary'}
        onClick={handleCreateCharacter}
        loading={loading}
      >Add Character</Button>
    </Section>
  );
}
