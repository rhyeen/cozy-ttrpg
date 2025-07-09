import { Toast } from '@base-ui-components/react';
import { Campaign, Character, FriendConnection, PlayerScope, User } from '@rhyeen/cozy-ttrpg-shared';
import Form from 'app/components/Form';
import Header from 'app/components/Header';
import IconButton from 'app/components/IconButton';
import ArrowBackIcon from 'app/components/Icons/ArrowBack';
import HistoryEduIcon from 'app/components/Icons/HistoryEdu';
import ReceiptLongIcon from 'app/components/Icons/ReceiptLong';
import type { SaveState } from 'app/components/Icons/SaveState';
import Input from 'app/components/Input';
import InputMultiLine from 'app/components/InputMultiLine';
import Menu from 'app/components/Menu';
import Modal from 'app/components/Modal';
import Paragraph from 'app/components/Paragraph';
import Section from 'app/components/Section';
import { selectFirebaseUser } from 'app/store/user.slice';
import { characterController } from 'app/utils/controller';
import { useFindFriend } from 'app/utils/hooks/useFriend';
import { useIsPlaying } from 'app/utils/hooks/usePlaySessionToken';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  campaign?: Campaign;
  character: Character;
  onCharacterUpdate: (character: Character) => void;
  friendUsers: User[];
  friendConnections: FriendConnection[];
  onClose?: () => void;
}

enum Tab {
  Background = 'background',
}

export const CharacterSheet: React.FC<Props> = (props: Props) => {
  const {
    onClose,
    onCharacterUpdate,
    friendUsers,
    friendConnections,
    campaign,
  } = props;
  const toastManager = Toast.useToastManager();
  const [viewNameDetails, setViewNameDetails] = useState(false);
  const [nickname, setNickname] = useState(props.character.nickname || '');
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [nicknameSaveState, setNicknameSaveState] = useState<SaveState>('hide');
  const [character, setCharacter] = useState<Character>(props.character);
  const [background, setBackground] = useState(character.background || '');
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [backgroundSaveState, setBackgroundSaveState] = useState<SaveState>('hide');
  const [privateBackground, setPrivateBackground] = useState(character.private.background || '');
  const [privateBackgroundError, setPrivateBackgroundError] = useState<string | null>(null);
  const [privateBackgroundSaveState, setPrivateBackgroundSaveState] = useState<SaveState>('hide');

  const [name, setName] = useState(character.name || '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaveState, setNameSaveState] = useState<SaveState>('hide');
  const firebaseUser = useSelector(selectFirebaseUser);
  const friend = useFindFriend(character.uid, friendConnections, friendUsers);
  const selfIsCharacter = character.uid === firebaseUser?.uid;
  const selfAsPlayer = campaign?.players.find((p) => p.uid === firebaseUser?.uid);
  const [tab, setTab] = useState<Tab>(Tab.Background);
  const tabItems = [
    {
      label: 'Background',
      value: Tab.Background,
      icon: <HistoryEduIcon />,
    },
  ];
  const isPlaying = useIsPlaying();

  const canEdit = (
    firebaseUser?.uid === character.uid ||
    selfAsPlayer?.scopes.includes(PlayerScope.GameMaster)
  );

  useEffect(() => {
    setNickname(props.character.nickname || '');
    setName(props.character.name || '');
    setBackground(props.character.background || '');
    // @NOTE: We need this check for any fields that are private because we could
    // receive both a private and public version of the event. If the public one comes in first,
    // and we were the one that wrote the data that triggered the event, then the value we
    // have in the field will be overwritten by the newly updated character, which does not
    // yet have the private data set. So we don't update what we wrote in the field, if we
    // were the one that wrote it. Give the private event time to catch up and it will all
    // sync up anyway.
    if (character.private.background === privateBackground) {
      setPrivateBackground(props.character.private.background || '');
    }
    setCharacter(props.character);
  }, [props.character]);

  const editCharacterHandler = async (
    saving: 'nickname' | 'name' | 'background' | 'privateBackground',
  ) => {
    let setSaveState;
    let errorState;
    switch (saving) {
      case 'background':
        setSaveState = setBackgroundSaveState;
        errorState = setBackgroundError;
        break;
      case 'nickname':
        setSaveState = setNicknameSaveState;
        errorState = setNicknameError;
        break;
      case 'name':
        setSaveState = setNameSaveState;
        errorState = setNameError;
        break;
      case 'privateBackground':
        setSaveState = setPrivateBackgroundSaveState;
        errorState = setPrivateBackgroundError;
        break;
      default:
        throw new Error('Invalid saving type');
    }
    if (saving === 'nickname' && nickname === character.nickname) return;
    if (saving === 'name' && name === character.name) return;
    if (saving === 'background' && background === character.background) return;
    setSaveState('saving');
    try {
      const updatedCharacter = character.copy();
      if (name.trim() !== character.name || '') {
        updatedCharacter.name = name.trim();
      }
      if (nickname.trim() !== character.nickname || '') {
        updatedCharacter.nickname = nickname.trim();
      }
      if (background.trim() !== character.background || '') {
        updatedCharacter.background = background.trim();
      }
      if (privateBackground.trim() !== character.private.background || '') {
        updatedCharacter.private.background = privateBackground.trim();
      }
      await characterController.updateCharacter(
        updatedCharacter,
        character,
      );
      if (!isPlaying) onCharacterUpdate(updatedCharacter);
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
        <Paragraph type="overline">Character Sheet</Paragraph>
        <Header
          type="h2"
          ignoreUppercase
          iconLeft={onClose ? (
            <IconButton onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
          ) : undefined}
          iconRight={canEdit ? (
            <IconButton onClick={() => setViewNameDetails(true)}>
              <ReceiptLongIcon />
            </IconButton>
          ) : undefined}
        >
          {character.name || 'Unnamed Character'}
          {character.nickname ? ` (${character.nickname})` : ''}
        </Header>
        <Menu
          icon={tabItems.find(t => t.value === tab)?.icon}
          text={{ trigger: tabItems.find(t => t.value === tab)?.label || '???' }}
          items={tabItems}
        />
      </Section>
      {tab === Tab.Background &&
        <Section>
          <InputMultiLine
            label="Public Background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            onBlur={() => editCharacterHandler('background')}
            saveState={backgroundSaveState}
            onStateChange={setBackgroundSaveState}
            error={backgroundError}
            readOnly={!canEdit}
          />
          <InputMultiLine
            label="Private Background"
            value={privateBackground}
            onChange={(e) => setPrivateBackground(e.target.value)}
            onBlur={() => editCharacterHandler('privateBackground')}
            saveState={privateBackgroundSaveState}
            onStateChange={setPrivateBackgroundSaveState}
            error={privateBackgroundError}
            readOnly={!canEdit}
          />
        </Section>
      }
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
