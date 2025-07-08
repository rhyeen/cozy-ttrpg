import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { useSelector } from 'react-redux';
import { selectPlayCampaign, selectPlayCharacters } from 'app/store/playEvent.slice';

export function DashboardView() {
  const campaign = useSelector(selectPlayCampaign);
  const characters = useSelector(selectPlayCharacters);
  // @TODO: Most of the entities at this point need to be fetched from selectors/dispatches
  // So that we can ensure they stay in sync as the play session progresses.
  return (
    <Section>
      <Header type="h1">{campaign?.id}</Header>
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
