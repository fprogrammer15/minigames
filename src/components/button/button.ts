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
  // A longer name for screen readers, for example "Details: Cat Mail Co."
  ariaLabel?: string;
}

export interface LinkButtonOptions {
  text: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

function getClassNames(variant: ButtonVariant, size: ButtonSize, className: string): string {
  return ['button', `button--${variant}`, `button--${size}`, className].filter(Boolean).join(' ');
}

// A link to an app page that looks like a button
export function linkButtonHtml(options: LinkButtonOptions): string {
  const {
    text,
    href,
    variant = ButtonVariant.Filled,
    size = ButtonSize.Medium,
    className = '',
  } = options;

  return `<a class="${getClassNames(variant, size, className)}" href="${href}" data-link>${text}</a>`;
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
    ariaLabel,
  } = options;
  const classNames = getClassNames(variant, size, className);
  const authAttribute = authMode ? `data-auth="${authMode}"` : '';
  const labelAttribute = ariaLabel ? `aria-label="${escapeHtml(ariaLabel)}"` : '';

  return `<button class="${classNames}" type="${type}" ${authAttribute} ${labelAttribute} ${dataAttributesHtml(data)}>${text}</button>`;
}
