import './button.scss';
import type { AuthMode } from '../../types/auth';

export enum ButtonVariant {
  Filled = 'filled',
  Outlined = 'outlined',
  OutlinedInverse = 'outlined-inverse',
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export interface ButtonOptions {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  // Buttons with this option open the auth dialog in the given mode
  authMode?: AuthMode;
}

export function buttonHtml(options: ButtonOptions): string {
  const {
    text,
    variant = ButtonVariant.Filled,
    size = ButtonSize.Medium,
    className = '',
    authMode,
  } = options;
  const classNames = ['button', `button--${variant}`, `button--${size}`, className]
    .filter(Boolean)
    .join(' ');
  const authAttribute = authMode ? `data-auth="${authMode}"` : '';

  return `<button class="${classNames}" type="button" ${authAttribute}>${text}</button>`;
}
