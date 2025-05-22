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
import KeyValue from 'app/components/KeyValue';
import Modal from 'app/components/Modal';
import HeartIcon from 'app/components/Icons/Heart';
import Button from 'app/components/Button';

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
  const [ loading, setLoading ] = useState(false);

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

  const updateFriendStatus = async (status: 'approved' | 'denied') => {
    setLoading(true);
    try {
      await friendConnectionController.updateFriendStatus(
        friendConnection.id,
        self.uid === friendConnection.invited.uid ? 'invited' : 'invitedBy',
        status,
      );
      const updatedFriendConnection = await friendConnection.copy();
      if (status === 'approved') {
        if (self.uid === friendConnection.invited.uid) {
          updatedFriendConnection.invited.approvedAt = new Date();
          updatedFriendConnection.invited.deniedAt = null;
        } else {
          updatedFriendConnection.invitedBy.approvedAt = new Date();
          updatedFriendConnection.invitedBy.deniedAt = null;
        }
      } else {
        if (self.uid === friendConnection.invited.uid) {
          updatedFriendConnection.invited.deniedAt = new Date();
          updatedFriendConnection.invited.approvedAt = null;
        } else {
          updatedFriendConnection.invitedBy.deniedAt = new Date();
          updatedFriendConnection.invitedBy.approvedAt = null;
        }
      }
      onSetFriendConnection(updatedFriendConnection);
    } catch (error) {
      console.error('Error denying friend:', error);
    } finally {
      setLoading(false);
      setDenyFriend(false);
    }
  };

  return (
    <>
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
                    label: viewFriend ? 'Hide Details' : 'View Details',
                    onClick: () => {
                      setViewFriend(!viewFriend);
                      setEditFriend(false);
                    },
                    icon: <ReceiptLongIcon />,
                  },
                  {
                    label: self.approvedAt ? 'Deny Friendship' : 'Approve Friendship',
                    onClick: () => {
                      if (self.approvedAt) {
                        setDenyFriend(true);
                      } else {
                        updateFriendStatus('approved');
                      }
                    },
                    icon: self.approvedAt ? <HeartBrokenIcon /> : <HeartIcon />,
                  },
                ]}
              />
            </IconButton.Bar>
          </Card.Header.Right>
        </Card.Header>
        {editFriend || viewFriend || !self.approvedAt ? (
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
            {viewFriend && (
              <KeyValue>
                <KeyValue.Item
                  itemKey="Name"
                  itemValue={friendUser?.displayName || 'Unknown'}
                  align="left"
                />
                <KeyValue.Item
                  itemKey="Email"
                  itemValue={friendUser?.email || 'Unknown'}
                  align="left"
                />
                <KeyValue.Item
                  itemKey="UID"
                  itemValue={friendUser?.uid || 'Unknown'}
                  align="left"
                />
                <KeyValue.Item
                  itemKey="Connection ID"
                  itemValue={friendConnection.id}
                  align="left"
                />
                <KeyValue.Item
                  itemKey="Invited At"
                  itemValue={friendConnection.createdAt.toLocaleString()}
                  align="left"
                />
                {!friend.deniedAt && (
                  <KeyValue.Item
                    itemKey="Approved At"
                    itemValue={friend.approvedAt?.toLocaleString() || 'Pending'}
                    align="left"
                  />
                )}
                {friend.deniedAt && (
                  <KeyValue.Item
                    itemKey="Denied At"
                    itemValue={friend.deniedAt.toLocaleString()}
                    align="left"
                  />
                )}
                {friend.otherFriendViewableContext.nickname && (
                  <KeyValue.Item
                    itemKey="Your Nickname"
                    itemValue={friend.otherFriendViewableContext.nickname || 'Unknown'}
                    align="left"
                  />
                )}
                {friend.otherFriendViewableContext.note && (
                  <KeyValue.Item
                    itemKey="Your Note"
                    itemValue={friend.otherFriendViewableContext.note || 'Unknown'}
                    align="left"
                  />
                )}
                {self.approvedAt && (
                  <KeyValue.Item
                    itemKey="You Approved At"
                    itemValue={self.approvedAt.toLocaleString()}
                    align="left"
                  />
                )}
                {self.deniedAt && (
                  <KeyValue.Item
                    itemKey="You Denied At"
                    itemValue={self.deniedAt.toLocaleString()}
                    align="left"
                  />
                )}
              </KeyValue>
            )}
            {!self.approvedAt && !editFriend && !viewFriend && (
              <Button
                type="primary"
                onClick={() => updateFriendStatus('approved')}
                loading={loading}
              >
                Approve Friendship
              </Button>
            )}
          </Card.Body>
        ) : null}
      </Card>
      <Modal
        title="Deny Friendship"
        secondaryBtn
        primaryBtn={{ onClick: () => updateFriendStatus('denied'), label: 'Deny Request' }}
        open={denyFriend}
        onOpenChange={setDenyFriend}
        loading={loading}
      >
        Are you sure you want to deny this friend request?
        This will prevent you and your friend from seeing each other's information.
      </Modal>
    </>
  );
};
