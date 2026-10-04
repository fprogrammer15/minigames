import './button.scss';
import type { AuthMode } from '../../types/auth';
import { escapeHtml } from '../../utils/dom';

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
  type?: 'button' | 'submit';
  // Buttons with this option open the auth dialog in the given mode
  authMode?: AuthMode;
  // Extra data attributes, for example { retry: '' } => data-retry=""
  data?: Record<string, string>;
}

function dataAttributesHtml(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([name, value]) => `data-${name}="${escapeHtml(value)}"`)
    .join(' ');
}

export function buttonHtml(options: ButtonOptions): string {
  const {
    text,
    variant = ButtonVariant.Filled,
    size = ButtonSize.Medium,
    className = '',
    type = 'button',
    authMode,
    data = {},
  } = options;
  const classNames = ['button', `button--${variant}`, `button--${size}`, className]
    .filter(Boolean)
    .join(' ');
  const authAttribute = authMode ? `data-auth="${authMode}"` : '';

  return `<button class="${classNames}" type="${type}" ${authAttribute} ${dataAttributesHtml(data)}>${text}</button>`;
}
