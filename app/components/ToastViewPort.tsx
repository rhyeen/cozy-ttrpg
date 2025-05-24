import styles from './Toast.module.css';
import { Toast } from '@base-ui-components/react/toast';
import CloseIcon from './Icons/Close';

const ToastViewPort = () => {
  const  { toasts } = Toast.useToastManager();

  return (
    <Toast.Viewport className={styles.viewport}>
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} className={styles.toast} toast={toast}>
          <Toast.Title className={styles.title} />
          <Toast.Description className={styles.description} />
          <Toast.Close className={styles.close} aria-label="Close">
            <CloseIcon />
          </Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
};

export default ToastViewPort;