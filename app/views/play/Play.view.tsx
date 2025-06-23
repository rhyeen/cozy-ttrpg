import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { Play } from '@rhyeen/cozy-ttrpg-shared';
import { usePlayEventSnapshot } from 'app/utils/hooks/usePlayEvent.snapshot';
import { useSelector } from 'react-redux';
import { selectPlayCampaign, selectPlayCharacters } from 'app/store/playEvent.slice';

interface Props {
  play: Play;
}

export function PlayView({ play }: Props) {
  // @NOTE: This needs to be initialized and retained at the root level of the play session.
  // Do not initialize this in a child component.
  usePlayEventSnapshot(
    play.campaignId,
    play.uid,
    play.characterId,
  );
  const campaign = useSelector(selectPlayCampaign);
  const characters = useSelector(selectPlayCharacters);
  // @TODO: Most of the entities at this point need to be fetched from selectors/dispatches
  // So that we can ensure they stay in sync as the play session progresses.
  return (
    <Section>
      <Header type="h1">{play.campaignId}</Header>
      <Header type="h2">{campaign?.name}</Header>
      <Header type="h3">Characters</Header>
      <ul>
        {characters.map(character => (
          <li key={character.id}>
            {character.name} ({character.id})
          </li>
        ))}
      </ul>
    </Section>
  );
}
