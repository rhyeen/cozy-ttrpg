import Header from 'app/components/Header';
import Section from 'app/components/Section';

export function HomePlayView() {
  // @TODO: Most of the entities at this point need to be fetched from selectors/dispatches
  // So that we can ensure they stay in sync as the play session progresses.
  return (
    <Section>
      <Header type="h1">Play Game!!!</Header>
    </Section>
  );
}
