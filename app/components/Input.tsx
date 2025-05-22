import React, { type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';
import ErrorIcon from './Icons/Error';
import SaveStateIcon, { type SaveState } from './Icons/SaveState';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  helper?: string | null;
  saveState?: SaveState;
  onStateChange?: (state: SaveState) => void;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  const icon = (
    props.icon ||
    (props.error && props.saveState !== 'error' ? <ErrorIcon /> : null) ||
    (props.saveState && props.onStateChange ? (
      <SaveStateIcon
        state={props.saveState}
        onStateChange={props.onStateChange}
      />
    ) : null)
  );

  return (
    <div className={`${styles.wrapper} ${props.error ? styles.error : ''}`}>
      <label className={styles.label}>
        <span className={styles.textLabel}>{label}</span>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type={props.type || 'text'}
            placeholder={props.placeholder}
            onChange={props.onChange}
            value={props.value}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            onInput={props.onInput}
            readOnly={props.readOnly}
            disabled={props.disabled || props.loading}
            required={props.required}
            autoComplete={props.autoComplete}
            autoFocus={props.autoFocus}
            maxLength={props.maxLength}
            minLength={props.minLength}
          />
          {!!icon && (
            <div className={`${styles.icon} ${props.saveState === 'hide' ? styles.hide : ''}`}>{icon}</div>
          )}
        </div>
        {!!props.error && <span className={styles.helper}>{props.error}</span>}
        {!!props.helper && !props.error && <span className={styles.helper}>{props.helper}</span>}
      </label>
    </div>
  );
};

export default Input;