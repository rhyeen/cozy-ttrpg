import React, { type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';
import ErrorIcon from './Icons/Error';
import SaveStateIcon, { type SaveState } from './Icons/SaveState';

interface InputMultiLineProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
  helper?: string | null;
  saveState?: SaveState;
  onStateChange?: (state: SaveState) => void;
  loading?: boolean;
  icon?: React.ReactNode;
  rows?: number;
}

const InputMultiLine: React.FC<InputMultiLineProps> = ({ label, ...props }) => {
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
          <textarea
            style={{ resize: props.rows ? 'none' : 'vertical' }}
            rows={props.rows || 5}
            className={styles.input}
            placeholder={props.placeholder}
            onChange={props.readOnly ? undefined : props.onChange}
            value={props.value}
            onBlur={props.readOnly ? undefined : props.onBlur}
            onFocus={props.readOnly ? undefined : props.onFocus}
            onInput={props.readOnly ? undefined : props.onInput}
            readOnly={props.readOnly}
            disabled={props.disabled || props.loading}
            required={props.required}
            autoComplete={props.autoComplete}
            autoFocus={props.readOnly ? undefined : props.autoFocus}
            maxLength={props.maxLength}
            minLength={props.minLength}
          />
          {!!icon && (
            <div className={`${styles.icon} ${props.saveState === 'hide' && !props.error ? styles.hide : ''}`}>{icon}</div>
          )}
        </div>
        {!!props.error && <span className={styles.helper}>{props.error}</span>}
        {!!props.helper && !props.error && <span className={styles.helper}>{props.helper}</span>}
      </label>
    </div>
  );
};

export default InputMultiLine;