import { useEffect, useState } from 'react';
import { characterController } from '../utils/services';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { Character } from '@rhyeen/cozy-ttrpg-shared';

export function CharactersView() {
  const [characters, setCharacters] = useState<Character[] | undefined>();

  const getCharacters = async () => {
    const result = await characterController.getSelfCharacters();
    setCharacters(result);
  };

  useEffect(() => {
    getCharacters();
  }, []);

  if (!characters) {
    return <Loading type="spinner" page />;
  }

  return (
    <Section>
      <Header type="h2">Characters</Header>
      {characters.map((character) => (
        <Header type="h3" key={character.id}>{character.name}</Header>
      ))}
    </Section>
  );
}
