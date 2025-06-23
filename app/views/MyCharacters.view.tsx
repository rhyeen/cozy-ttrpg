import { useEffect, useState } from 'react';
import { campaignController, characterController } from '../utils/controller';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { Campaign, Character } from '@rhyeen/cozy-ttrpg-shared';
import { CharacterCard } from './Character.card';
import { useNavigate } from 'react-router';
import Button from 'app/components/Button';
import Paragraph from 'app/components/Paragraph';

interface Props {
  onSelectForPlay?: () => void;
}

export function MyCharactersView({ onSelectForPlay }: Props) {
  const [characters, setCharacters] = useState<Character[] | undefined>();
  const [campaigns, setCampaigns] = useState<Campaign[] | undefined>();
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  const getCharacters = async () => {
    setLoading(true);
    const result = await characterController.getSelfCharacters();
    setCharacters(result);
    setLoading(false);
  };

  const getCampaigns = async () => {
    setLoading(true);
    const result = await campaignController.getCampaigns();
    setCampaigns(result);
    setLoading(false);
  };

  const handleCharacterUpdate = async (character: Character) => {
    setCharacters((prev) => prev ? prev.map((c) => c.id === character.id ? character : c) : []);
  };

  const createCharacter = async () => {
    setLoading(true);
    const createdCharacter = await characterController.createSelfCharacter();
    setCharacters((prev) => (prev ? [...prev, createdCharacter] : [createdCharacter]));
    setLoading(false);
    navigate('/characters/' + createdCharacter.id);
  };

  useEffect(() => {
    getCharacters();
    getCampaigns();
  }, []);

  if (!characters || !campaigns || loading) {
    return <Loading type="spinner" page />;
  }

  const filteredCharacters = characters.filter(character => !character.deletedAt);


  return (
    <Section>
      <Header type="h1">{onSelectForPlay ? 'Select a Character to Play' : 'Characters'}</Header>
      {filteredCharacters.map((character) => (
        <CharacterCard
          friendUsers={[]}
          character={character}
          key={character.id}
          friendConnections={[]}
          onSetFriendConnections={() => {}}
          onCharacterUpdate={handleCharacterUpdate}
          onViewCharacter={() => navigate('/characters/' + character.id)}
          campaigns={campaigns}
          onSetCampaign={campaign => {
            setCampaigns((prev) => prev ? prev.map(c => c.id === campaign.id ? campaign : c) : []);
          }}
          onPlayOnClick={onSelectForPlay}
        />
      ))}
      {!onSelectForPlay &&
        <Button
          type={filteredCharacters.length ? 'secondary' : 'primary'}
          onClick={createCharacter}
          loading={loading}
        >
          Create Character
        </Button>
      }
      {onSelectForPlay && !filteredCharacters.length && (
        <>
          <Paragraph>No characters available. Please join or create a campaign and create or assign a character to it to get started.</Paragraph>
          <Button
            type="primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </>
      )}
    </Section>
  );
}
