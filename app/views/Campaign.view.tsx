import { useEffect, useState } from 'react';
import { Campaign, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import Header from 'app/components/Header';
import Modal from 'app/components/Modal';
import SettingsIcon from 'app/components/Icons/Settings';
import Menu from 'app/components/Menu';
import PlayCircleIcon from 'app/components/Icons/PlayCircle';
import GroupAddIcon from 'app/components/Icons/GroupAdd';
import DeleteIcon from 'app/components/Icons/Delete';
import Form from 'app/components/Form';
import Input from 'app/components/Input';
import type { SaveState } from 'app/components/Icons/SaveState';
import { campaignController } from 'app/utils/services';
import Section from 'app/components/Section';
import { useNavigate } from 'react-router';
import IconButton from 'app/components/IconButton';
import ArrowBackIcon from 'app/components/Icons/ArrowBack';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import Paragraph from 'app/components/Paragraph';
import ErrorIcon from 'app/components/Icons/Error';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from 'app/store/userSlice';

interface Props {
  campaign: Campaign;
  onSetCampaign: (campaign: Campaign) => void;
}

export function CampaignView({
  campaign,
  onSetCampaign,
}: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const firebaseUser = useSelector(selectFirebaseUser);
  const [deleteCampaign, setDeleteCampaign] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignNameError, setCampaignNameError] = useState<string | null>(null);
  const [campaignNameSaveState, setCampaignNameSaveState] = useState<SaveState>('hide');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [campaignDescriptionError, setCampaignDescriptionError] = useState<string | null>(null);
  const [campaignDescriptionSaveState, setCampaignDescriptionSaveState] = useState<SaveState>('hide');
  const selfAsPlayer = campaign.players.find((p) => p.uid === firebaseUser?.uid);
  const isOwner = selfAsPlayer?.scopes.includes(PlayerScope.Owner);
  const isGameMaster = selfAsPlayer?.scopes.includes(PlayerScope.GameMaster);
  const canEdit = isOwner || isGameMaster;
  
  useEffect(() => {
    if (campaign) {
      setCampaignName(campaign.name);
      setCampaignDescription(campaign.description || '');
    }
  }, [campaign]);

  const editCampaignHandler = async (field: 'name' | 'description') => {
    if (!campaign || !canEdit) return;
    const setSaveState = field === 'name' ? setCampaignNameSaveState : setCampaignDescriptionSaveState;
    const errorState = field === 'name' ? setCampaignNameError : setCampaignDescriptionError;
    setSaveState('saving');
    try {
      const _campaign = campaign.copy();
      _campaign.name = campaignName;
      _campaign.description = campaignDescription;
      const updatedCampaign = await campaignController.updateCampaign(_campaign);
      onSetCampaign(updatedCampaign);
      setSaveState('success');
    } catch (error) {
      console.error('Error updating campaign:', error);
      setSaveState('error');
      errorState('Error updating campaign context.');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteCampaign = async () => {
    if (!campaign) return;
    setLoading(true);
    try {
      await campaignController.deleteCampaign(campaign.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setLoading(false);
      setDeleteCampaign(false);
    }
  };

  const playerCount = campaign.players ? campaign.players.length : 0;

  return (
    <Section>
      <Header type="h3" iconPosition="left" icon={
        <IconButton onClick={() => navigate('/campaigns')}>
          <ArrowBackIcon />
        </IconButton>
      }>Campaigns</Header>
      <Header
        type="h1"
        icon={canEdit ? (
          <Menu
            icon={<SettingsIcon />}
            items={[
              {
                label: 'Play Game',
                onClick: () => navigate(`/campaigns/${campaign.id}/play`),
                icon: <PlayCircleIcon />,
              },
              {
                label: 'Manage Players',
                onClick: () => navigate(`/campaigns/${campaign.id}/players`),
                icon: <GroupAddIcon />,
              },
              {
                label: 'Delete Campaign',
                onClick: () => {
                  setDeleteCampaign(true);
                },
                icon: <DeleteIcon />,
              },
            ]}
          />
        ) : undefined}
      >Campaign</Header>
      {playerCount < 2 && 
        <Card onClick={() => navigate(`/campaigns/${campaign.id}/players`)}>
          <Card.Header>
            <Card.Header.Left>
              <Header type="h3">Missing players!</Header>
              <Paragraph>It's a lot more fun with friends! Invite others to join.</Paragraph>
            </Card.Header.Left>
            <Card.Header.Right>
              <ErrorIcon color="#d01a4a" />
            </Card.Header.Right>
          </Card.Header>
          <Card.Body>
            <Button
              type="primary"
              onClick={() => navigate(`/campaigns/${campaign.id}/players`)}
            >
              Invite Players
            </Button>
          </Card.Body>
        </Card>
      }
      <Button
        type={playerCount < 2 ? 'secondary' : 'primary'}
        onClick={() => navigate(`/campaigns/${campaign.id}/play`)}
      >
        Play Game
      </Button>
      {playerCount >= 2 && (
        <Button
          type="secondary"
          onClick={() => navigate(`/campaigns/${campaign.id}/players`)}
        >
          {canEdit ? `Manage Players (${playerCount})` : 'View Players'}
        </Button>
      )}
      <Form>
        <Header type="h3">Campaign Settings</Header>
        <Input
          type="text"
          label="Campaign Name"
          value={campaignName}
          onChange={(e) => {
            setCampaignName(e.target.value);
            setCampaignNameError(null);
          }}
          onBlur={() => editCampaignHandler('name')}
          saveState={campaignNameSaveState}
          onStateChange={setCampaignNameSaveState}
          error={campaignNameError}
          readOnly={!canEdit}
        />
        <Input
          type="text"
          label="Campaign Description"
          value={campaignDescription}
          onChange={(e) => {
            setCampaignDescription(e.target.value);
            setCampaignDescriptionError(null);
          }}
          onBlur={() => editCampaignHandler('description')}
          saveState={campaignDescriptionSaveState}
          onStateChange={setCampaignDescriptionSaveState}
          error={campaignDescriptionError}
          readOnly={!canEdit}
        />
      </Form>
      <Modal
        title="Delete Campaign"
        secondaryBtn
        primaryBtn={{ onClick: handleDeleteCampaign, label: 'Delete' }}
        open={deleteCampaign}
        onOpenChange={() => setDeleteCampaign(false)}
        loading={loading}
      >
        Are you sure you want to delete this campaign? This action cannot currently be undone.
      </Modal>
    </Section>
  );
}
