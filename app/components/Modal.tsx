import React from 'react';
import styles from './Modal.module.css';
import { AlertDialog, Dialog } from '@base-ui-components/react';
import Button from './Button';

interface ModalProps {
  title: string;
  secondaryBtn?: {
    onClick: () => void;
    label?: string;
  } | boolean;
  primaryBtn?: {
    onClick: () => void;
    label?: string;
  } | boolean;
  children: React.ReactNode;
  preventOuterClickClose?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const Component = props.preventOuterClickClose ? AlertDialog : Dialog;

  return (
    <Component.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Component.Portal>
        <Component.Backdrop className={styles.backdrop} />
        <Component.Popup className={styles.popup}>
          <Component.Title className={styles.title}>{props.title}</Component.Title>
          <Component.Description className={styles.description}>
            {props.children}
          </Component.Description>
          <div className={styles.actions}>
            {props.secondaryBtn && (
              <Button
                type="secondary"
                loading={props.loading}
                onClick={() => {
                  if (typeof props.secondaryBtn === 'object') {
                    props.secondaryBtn.onClick();
                  }
                  props.onOpenChange(false);
                }}
                asComponent={Component.Close}
              >
                {(typeof props.secondaryBtn === 'object' && props.secondaryBtn.label) ? props.secondaryBtn.label : 'Close'}
              </Button>
            )}
            {props.primaryBtn && (
              <Button
                type="primary"
                loading={props.loading}
                onClick={() => {
                  if (typeof props.primaryBtn === 'object') {
                    props.primaryBtn.onClick();
                  }
                  props.onOpenChange(false);
                }}
                asComponent={Component.Close}
              >
                {(typeof props.primaryBtn === 'object' && props.primaryBtn.label) ? props.primaryBtn.label : 'Confirm'}
              </Button>
            )}
          </div>
        </Component.Popup>
      </Component.Portal>
    </Component.Root>
  );
};

export default Modal;