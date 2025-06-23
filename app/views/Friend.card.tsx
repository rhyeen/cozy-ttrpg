import Header from 'app/components/Header';
import { FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
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
import { friendConnectionController } from 'app/utils/controller';
import KeyValue from 'app/components/KeyValue';
import Modal from 'app/components/Modal';
import HeartIcon from 'app/components/Icons/Heart';
import Button from 'app/components/Button';
import Paragraph from 'app/components/Paragraph';
import { useFriend, type FriendContext } from 'app/utils/hooks/useFriend';
import { Toast } from '@base-ui-components/react';

interface Props {
  friendConnection: FriendConnection;
  onSetFriendConnection: (friendConnection: FriendConnection) => void;
  friendUsers: User[];
  noBorder?: boolean;
  setByDefault?: 'showView' | 'showEdit';
}

export async function updateFriendStatus(
  friendConnection: FriendConnection,
  friend: FriendContext,
  status: 'approved' | 'denied'
): Promise<FriendConnection> {
  await friendConnectionController.updateFriendStatus(
    friendConnection.id,
    friend.selfAsFriend.uid === friendConnection.invited.uid ? 'invited' : 'invitedBy',
    status,
  );
  const updatedFriendConnection = await friendConnection.copy();
  if (status === 'approved') {
    if (friend.selfAsFriend.uid === friendConnection.invited.uid) {
      updatedFriendConnection.invited.approvedAt = new Date();
      updatedFriendConnection.invited.deniedAt = null;
    } else {
      updatedFriendConnection.invitedBy.approvedAt = new Date();
      updatedFriendConnection.invitedBy.deniedAt = null;
    }
  } else {
    if (friend.selfAsFriend.uid === friendConnection.invited.uid) {
      updatedFriendConnection.invited.deniedAt = new Date();
      updatedFriendConnection.invited.approvedAt = null;
    } else {
      updatedFriendConnection.invitedBy.deniedAt = new Date();
      updatedFriendConnection.invitedBy.approvedAt = null;
    }
  }
  return updatedFriendConnection;
};

export const FriendCard: React.FC<Props> = ({
  friendConnection,
  friendUsers,
  onSetFriendConnection,
  noBorder,
  setByDefault,
}) => {
  const toastManager = Toast.useToastManager();
  const [ editFriend, setEditFriend ] = useState(setByDefault === 'showEdit');
  const [ denyFriend, setDenyFriend ] = useState(false);
  const [ viewFriend, setViewFriend ] = useState(setByDefault === 'showView');
  const [ friendNickname, setFriendNickname ] = useState('');
  const [ friendNote, setFriendNote ] = useState('');
  const [ friendNicknameSaveState, setFriendNicknameSaveState ] = useState<SaveState>('hide');
  const [ friendNoteSaveState, setFriendNoteSaveState ] = useState<SaveState>('hide');
  const [ friendNicknameError, setFriendNicknameError ] = useState<string | null>(null);
  const [ friendNoteError, setFriendNoteError ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    setFriendNickname(friend.friend.otherFriendViewableContext.nickname);
    setFriendNote(friend.friend.otherFriendViewableContext.note);
  }, [ editFriend ]);

  const friend = useFriend(friendConnection, friendUsers);

  const editFriendHandler = async (saving: 'nickname' | 'note') => {
    const setSaveState = saving === 'nickname' ? setFriendNicknameSaveState : setFriendNoteSaveState;
    const errorState = saving === 'nickname' ? setFriendNicknameError : setFriendNoteError;
    setSaveState('saving');
    try {
      await friendConnectionController.updateFriendContext(
        friendConnection.id,
        friend.selfAsFriend.uid === friendConnection.invited.uid ? 'invited' : 'invitedBy',
        {
          ...friend.friend.otherFriendViewableContext,
          nickname: friendNickname,
          note: friendNote,
        },
      );
      const updatedFriendConnection = await friendConnection.copy();
      if (friend.selfAsFriend.uid === friendConnection.invited.uid) {
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
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to update friend details.`,
      });
      setSaveState('error');
      errorState('Error updating friend context.');
    }
  };

  const _updateFriendStatus = async (status: 'approved' | 'denied') => {
    setLoading(true);
    try {
      const updatedFriendConnection = await updateFriendStatus(friendConnection, friend, status);
      onSetFriendConnection(updatedFriendConnection);
    } catch (error) {
      console.error('Error denying friend:', error);
      toastManager.add({
        title: 'Unexpected Error',
        description: `Failed to update friend status.`,
      });
    } finally {
      setLoading(false);
      setDenyFriend(false);
    }
  };

  return (
    <>
      <Card noBorder={noBorder}>
        <Card.Header>
          <Card.Header.Left>
            <Header type="h4">{friend.friendDisplayName}</Header>
            <Paragraph type="caption">{friend.friendNote}</Paragraph>
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
                    label: friend.selfAsFriend.approvedAt ? 'Deny Friendship' : 'Approve Friendship',
                    onClick: () => {
                      if (friend.selfAsFriend.approvedAt) {
                        setDenyFriend(true);
                      } else {
                        _updateFriendStatus('approved');
                      }
                    },
                    icon: friend.selfAsFriend.approvedAt ? <HeartBrokenIcon /> : <HeartIcon />,
                  },
                ]}
              />
            </IconButton.Bar>
          </Card.Header.Right>
        </Card.Header>
        {editFriend || viewFriend || !friend.selfAsFriend.approvedAt ? (
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
                  itemValue={friend.friendAsUser?.displayName || 'Unknown'}
                  align="left"
                />
                <KeyValue.Item
                  itemKey="Email"
                  itemValue={friend.friendAsUser?.email || 'Unknown'}
                  align="left"
                />
                <KeyValue.Item
                  itemKey="UID"
                  itemValue={friend.friendAsUser?.uid || 'Unknown'}
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
                {!friend.friend.deniedAt && (
                  <KeyValue.Item
                    itemKey="Approved At"
                    itemValue={friend.friend.approvedAt?.toLocaleString() || 'Pending'}
                    align="left"
                  />
                )}
                {friend.friend.deniedAt && (
                  <KeyValue.Item
                    itemKey="Denied At"
                    itemValue={friend.friend.deniedAt.toLocaleString()}
                    align="left"
                  />
                )}
                {friend.friend.otherFriendViewableContext.nickname && (
                  <KeyValue.Item
                    itemKey="Your Nickname"
                    itemValue={friend.friend.otherFriendViewableContext.nickname || 'Unknown'}
                    align="left"
                  />
                )}
                {friend.friend.otherFriendViewableContext.note && (
                  <KeyValue.Item
                    itemKey="Your Note"
                    itemValue={friend.friend.otherFriendViewableContext.note || 'Unknown'}
                    align="left"
                  />
                )}
                {friend.selfAsFriend.approvedAt && (
                  <KeyValue.Item
                    itemKey="You Approved At"
                    itemValue={friend.selfAsFriend.approvedAt.toLocaleString()}
                    align="left"
                  />
                )}
                {friend.selfAsFriend.deniedAt && (
                  <KeyValue.Item
                    itemKey="You Denied At"
                    itemValue={friend.selfAsFriend.deniedAt.toLocaleString()}
                    align="left"
                  />
                )}
              </KeyValue>
            )}
            {!friend.selfAsFriend.approvedAt && !editFriend && !viewFriend && (
              <Button
                type="primary"
                onClick={() => _updateFriendStatus('approved')}
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
        primaryBtn={{ onClick: () => _updateFriendStatus('denied'), label: 'Deny Request' }}
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
