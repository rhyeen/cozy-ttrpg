import Header from 'app/components/Header';
import { FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { selectFirebaseUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';
import Card from 'app/components/Card';
import IconButton from 'app/components/IconButton';
import { useEffect, useState } from 'react';
import EditIcon from 'app/components/Icons/Edit';
import Menu from 'app/components/Menu';
import ReceiptLongIcon from 'app/components/Icons/ReceiptLong';
import HeartBrokenIcon from 'app/components/Icons/HeartBroken';
import SettingsIcon from 'app/components/Icons/Settings';
import Form from 'app/components/Form';
import Input from 'app/components/Input';
import type { SaveState } from 'app/components/Icons/SaveState';
import { friendConnectionController } from 'app/utils/services';

interface Props {
  friendConnection: FriendConnection;
  onSetFriendConnection: (friendConnection: FriendConnection) => void;
  friendUsers: User[];
}

export const FriendView: React.FC<Props> = ({
  friendConnection,
  friendUsers,
  onSetFriendConnection
}) => {
  const [ editFriend, setEditFriend ] = useState(false);
  const [ denyFriend, setDenyFriend ] = useState(false);
  const [ viewFriend, setViewFriend ] = useState(false);
  const [ friendNickname, setFriendNickname ] = useState('');
  const [ friendNote, setFriendNote ] = useState('');
  const [ friendNicknameSaveState, setFriendNicknameSaveState ] = useState<SaveState>('hide');
  const [ friendNoteSaveState, setFriendNoteSaveState ] = useState<SaveState>('hide');
  const [ friendNicknameError, setFriendNicknameError ] = useState<string | null>(null);
  const [ friendNoteError, setFriendNoteError ] = useState<string | null>(null);

  useEffect(() => {
    setFriendNickname(friend.otherFriendViewableContext.nickname);
    setFriendNote(friend.otherFriendViewableContext.note);
  }, [ editFriend ]);

  const firebaseUser = useSelector(selectFirebaseUser);
  const friend = (
    friendConnection.invited.uid === firebaseUser?.uid ? friendConnection.invitedBy : friendConnection.invited
  );
  const friendUser = friendUsers.find(u => u.uid === friend.uid);
  const self = (
    friendConnection.invited.uid === firebaseUser?.uid ? friendConnection.invited : friendConnection.invitedBy
  );

  const editFriendHandler = async (saving: 'nickname' | 'note') => {
    const setSaveState = saving === 'nickname' ? setFriendNicknameSaveState : setFriendNoteSaveState;
    const errorState = saving === 'nickname' ? setFriendNicknameError : setFriendNoteError;
    setSaveState('saving');
    try {
      await friendConnectionController.updateFriendContext(
        friendConnection.id,
        self.uid === friendConnection.invited.uid ? 'invited' : 'invitedBy',
        {
          ...friend.otherFriendViewableContext,
          nickname: friendNickname,
          note: friendNote,
        },
      );
      const updatedFriendConnection = await friendConnection.copy();
      if (self.uid === friendConnection.invited.uid) {
        updatedFriendConnection.invitedBy.otherFriendViewableContext.nickname = friendNickname;
        updatedFriendConnection.invitedBy.otherFriendViewableContext.note = friendNote;
      } else {
        updatedFriendConnection.invited.otherFriendViewableContext.nickname = friendNickname;
        updatedFriendConnection.invited.otherFriendViewableContext.note = friendNote;
      }
      onSetFriendConnection(updatedFriendConnection);
      setSaveState('success');
    } catch (error) {
      console.error('Error updating friend context:', error);
      setSaveState('error');
      errorState('Error updating friend context.');
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Header.Left>
          <Header type="h4">{friend.otherFriendViewableContext.nickname || friendUser?.displayName || 'Unnamed Friend'}</Header>
          <p>{friend.otherFriendViewableContext.note || friendUser?.email || friendConnection.id}</p>
        </Card.Header.Left>
        <Card.Header.Right>
          <IconButton.Bar>
            <IconButton onClick={() => {
              setEditFriend(!editFriend);
              setViewFriend(false);
            }}>
              <EditIcon />
            </IconButton>
            <Menu
              icon={<SettingsIcon />}
              items={[
                {
                  label: 'View Details',
                  onClick: () => {
                    setViewFriend(true);
                    setEditFriend(false);
                  },
                  icon: <ReceiptLongIcon />,
                },
                {
                  label: 'Deny Friendship',
                  onClick: () => setDenyFriend(true),
                  icon: <HeartBrokenIcon />,
                },
              ]}
            />
          </IconButton.Bar>
        </Card.Header.Right>
      </Card.Header>
      {editFriend || viewFriend ? (
        <Card.Body>
          {editFriend && (
            <Form>
              <Input
                type="text"
                label="Friend's Nickname"
                value={friendNickname}
                onChange={(e) => {
                  setFriendNickname(e.target.value);
                  setFriendNicknameError(null);
                }}
                helper="This is only visible to you."
                onBlur={() => editFriendHandler('nickname')}
                saveState={friendNicknameSaveState}
                onStateChange={setFriendNicknameSaveState}
                error={friendNicknameError}
              />
              <Input
                type="text"
                label="Note about this friend"
                value={friendNote}
                onChange={(e) => {
                  setFriendNote(e.target.value);
                  setFriendNoteError(null);
                }}
                helper="This is only visible to you."
                onBlur={() => editFriendHandler('note')}
                saveState={friendNoteSaveState}
                onStateChange={setFriendNoteSaveState}
                error={friendNoteError}
              />
            </Form>
          )}
          {viewFriend && <p>Viewing friend...</p>}
        </Card.Body>
      ) : null}
    </Card>
  );
};
