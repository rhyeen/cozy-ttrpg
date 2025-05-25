import { Fragment, useState } from 'react';
import { Campaign } from '@rhyeen/cozy-ttrpg-shared';
import Header from 'app/components/Header';
import Modal from 'app/components/Modal';
import Card from 'app/components/Card';
import IconButton from 'app/components/IconButton';
import SettingsIcon from 'app/components/Icons/Settings';
import Menu from 'app/components/Menu';
import Paragraph from 'app/components/Paragraph';
import PlayCircleIcon from 'app/components/Icons/PlayCircle';
import GroupAddIcon from 'app/components/Icons/GroupAdd';
import DeleteIcon from 'app/components/Icons/Delete';
import { campaignController } from 'app/utils/services';
import { useNavigate } from 'react-router';
import Book2Icon from 'app/components/Icons/Book2';

interface Props {
  key: string;
  campaign: Campaign;
  onSetCampaign: (campaign: Campaign) => void;
}

export function CampaignCard({
  campaign,
  onSetCampaign,
}: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteCampaign, setDeleteCampaign] = useState(false);
 
  const handleDeleteCampaign = async () => {
    setLoading(true);
    try {
      await campaignController.deleteCampaign(campaign.id);
      const _campaign = campaign.copy();
      _campaign.deletedAt = new Date();
      onSetCampaign(_campaign);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setLoading(false);
      setDeleteCampaign(false);
    }
  };

  return (
    <Fragment key={campaign.id}>
      <Card onClick={() => {
        navigate(`/campaigns/${campaign.id}`);
      }}>
        <Card.Header>
          <Card.Header.Left>
            <Header type="h3">{campaign.name}</Header>
            <Paragraph>{campaign.description}</Paragraph>
          </Card.Header.Left>
          <Card.Header.Right>
            <IconButton.Bar>
              <Menu
                icon={<SettingsIcon />}
                items={[
                  {
                    label: 'View Campaign',
                    onClick: () => navigate(`/campaigns/${campaign.id}`),
                    icon: <Book2Icon />,
                  },
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
            </IconButton.Bar>
          </Card.Header.Right>
        </Card.Header>
      </Card>
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
    </Fragment>
  );
}
