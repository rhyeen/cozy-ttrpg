import { Toast } from '@base-ui-components/react';
import { Campaign, Character, FriendConnection, Play, PlayerScope, User } from '@rhyeen/cozy-ttrpg-shared';
import Form from 'app/components/Form';
import Header from 'app/components/Header';
import IconButton from 'app/components/IconButton';
import ArrowBackIcon from 'app/components/Icons/ArrowBack';
import ReceiptLongIcon from 'app/components/Icons/ReceiptLong';
import type { SaveState } from 'app/components/Icons/SaveState';
import Input from 'app/components/Input';
import Modal from 'app/components/Modal';
import Paragraph from 'app/components/Paragraph';
import Section from 'app/components/Section';
import { selectFirebaseUser } from 'app/store/userSlice';
import { characterController } from 'app/utils/controller';
import { useFindFriend } from 'app/utils/hooks/useFriend';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  play?: Play;
  campaign?: Campaign;
  character: Character;
  onCharacterUpdate: (character: Character) => void;
  friendUsers: User[];
  friendConnections: FriendConnection[];
  onClose?: () => void;
}

export const CharacterSheet: React.FC<Props> = ({
  play,
  character,
  onClose,
  onCharacterUpdate,
  friendUsers,
  friendConnections,
  campaign,
}) => {
  const toastManager = Toast.useToastManager();
  const [viewNameDetails, setViewNameDetails] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [nicknameSaveState, setNicknameSaveState] = useState<SaveState>('hide');

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaveState, setNameSaveState] = useState<SaveState>('hide');
  const firebaseUser = useSelector(selectFirebaseUser);
  const friend = useFindFriend(character.uid, friendConnections, friendUsers);
  const selfIsCharacter = character.uid === firebaseUser?.uid;
  const selfAsPlayer = campaign?.players.find((p) => p.uid === firebaseUser?.uid);

  const canEdit = (
    firebaseUser?.uid === character.uid ||
    selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
  );

  useEffect(() => {
    setNickname(character.nickname || '');
    setName(character.name || '');
  }, [character]);

  const editCharacterHandler = async (saving: 'nickname' | 'name') => {
    const setSaveState = saving === 'nickname' ? setNicknameSaveState : setNameSaveState;
    const errorState = saving === 'nickname' ? setNicknameError : setNameError;
    setSaveState('saving');
    try {
      const updatedCharacter = character.copy();
      updatedCharacter.name = name;
      updatedCharacter.nickname = nickname;
      await characterController.updateCharacter(updatedCharacter);
      onCharacterUpdate(updatedCharacter);
      setSaveState('success');
    } catch (error) {
      console.error('Error updating character:', error);
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to update character details.`,
      });
      setSaveState('error');
      errorState('Error updating character.');
    }
  };

  return (
    <>
      <Section>
        <Header
          type="h1"
          iconLeft={onClose ? (
            <IconButton onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
          ) : undefined}
          iconRight={play ? (
            <IconButton onClick={() => setViewNameDetails(true)}>
              <ReceiptLongIcon />
            </IconButton>
          ) : undefined}
        >
          <Paragraph type="caption">Character Sheet</Paragraph>
          {character.name || 'Unnamed Character'}
        </Header>
      </Section>
      <Modal
        title={canEdit ? 'Edit Character Name' : 'Character Name'}
        secondaryBtn
        open={viewNameDetails}
        onOpenChange={() => setViewNameDetails(false)}
      >
        <Form>
          <Paragraph type="caption">
            This is {selfIsCharacter ? 'your' : `${(friend?.friendDisplayName || 'Unknown Player')}'s`} character.
          </Paragraph>
          <Input
            type="text"
            label="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            onBlur={() => editCharacterHandler('name')}
            saveState={nameSaveState}
            onStateChange={setNameSaveState}
            error={nameError}
            readOnly={!canEdit}
          />
          <Input
            type="text"
            label="Nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError(null);
            }}
            onBlur={() => editCharacterHandler('nickname')}
            saveState={nicknameSaveState}
            onStateChange={setNicknameSaveState}
            error={nicknameError}
            readOnly={!canEdit}
          />
        </Form>
      </Modal>
    </>
  );
};
