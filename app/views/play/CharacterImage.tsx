import React, { useEffect } from 'react';
import type { Character, StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import StorageImage from 'app/components/StorageImage';
import Loading from 'app/components/Loading';

interface Props {
  character: Character;
  canEdit?: boolean;
  onCharacterUpdate?: (character: Character) => void;
}

const CharacterImage: React.FC<Props> = ({
  character,
  canEdit,
  onCharacterUpdate,
}) => {
  const [ storageFile, setStorageFile ] = React.useState<StorageFile | null>(null);
  const [ storageFileId, setStorageFileId ] = React.useState<string | null>(null);

  const getStorageFile = async () => {
    if (!storageFileId) return;
  };

  useEffect(() => {
    if (
      character.profileImage?.storageFileId &&
      character.profileImage.storageFileId !== storageFileId
    ) {
      setStorageFile(null);
      setStorageFileId(character.profileImage.storageFileId);
    }
  }, [character]);

  useEffect(() => {
    if (storageFileId) {
      getStorageFile();
    }
  }, [storageFileId]);

  if (!storageFileId) return null;

  if (!storageFile) return <Loading type="spinner" />; 

  return (
    <StorageImage file={storageFile} />
  );
};

export default CharacterImage;