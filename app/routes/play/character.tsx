import { DashboardView } from 'app/views/play/Dashboard.view';
import type { Route } from "../+types/home";
import { CharacterSheet } from 'app/views/play/CharacterSheet';
import { useEffect, useState } from 'react';
import type { FriendConnection, User } from 'shared/dist';
import { friendConnectionController } from 'app/utils/controller';
import { useSelector } from 'react-redux';
import { selectPlayCharacters } from 'app/store/playEvent.slice';
import { useNavigate, useParams } from 'react-router';
import Loading from 'app/components/Loading';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play - My Character" },
    { name: "description", content: "" },
  ];
}

export default function PlayCharacter() {
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [friendUsers, setFriendUsers] = useState<User[]>([]);
  const { characterId } = useParams();
  const characters = useSelector(selectPlayCharacters);
  const character = characters.find(c => c.id === characterId);
  const navigate = useNavigate();

  const getFriends = async (forceRefresh = false) => {
    if (friends && !forceRefresh) return;
    const result = await friendConnectionController.getFriendConnections();
    setFriends(result.friendConnections);
    setFriendUsers(result.users);
  };

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    if (!characterId) {
      navigate('/404');
      return;
    }
  }, [characterId, navigate]);

  if (!character) {
    return <Loading type="spinner" page />;
  }

  return (
    <CharacterSheet
      character={character}
      friendUsers={friendUsers}
      friendConnections={friends}
      onCharacterUpdate={() => {}}
    />
  );
}
