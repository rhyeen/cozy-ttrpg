import { useEffect } from 'react';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';
import styles from './SaveState.module.css';
import SyncIcon from './Sync';
import CheckCircleIcon from './CheckCircle';
import ErrorIcon from './Error';

export type SaveState = 'saving' | 'success' | 'hide' | 'error';

interface SaveProps extends IconProps {
  state: SaveState;
  onStateChange: (state: SaveState) => void;
  hideIcon?: React.ReactNode;
}

function SaveStateIcon({ state, onStateChange, hideIcon }: SaveProps) {
  useEffect(() => {
    if (state === 'success' || state === 'error') {
      const timer = setTimeout(() => {
        onStateChange('hide');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, onStateChange]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.fade} style={{ opacity: state === 'hide' ? 1 : 0 }}>
        {hideIcon}
      </div>
      <div className={styles.fade} style={{ opacity: state === 'saving' ? 1 : 0 }}>
        <SyncIcon animation color='var(--borderFocusColor)' />
      </div>
      <div className={styles.fade} style={{ opacity: state === 'success' ? 1 : 0 }}>
        <CheckCircleIcon color='var(--iconSuccessColor)' />
      </div>
      <div className={styles.fade} style={{ opacity: state === 'error' ? 1 : 0 }}>
        <ErrorIcon color='var(--iconErrorColor)' />
      </div>
    </div>
  );
}

export default SaveStateIcon;