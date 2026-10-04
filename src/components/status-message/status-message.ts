import './status-message.scss';
import { escapeHtml } from '../../utils/dom';
import { buttonHtml } from '../button/button';
import { iconHtml, IconName } from '../icon/icon';

export const RETRY_SELECTOR = '[data-retry]';

// Shown instead of the content when a request fails
export function errorBannerHtml(title: string, message: string): string {
  return `
    <div class="status-message status-message--error" role="alert">
      ${iconHtml(IconName.Error, 'status-message__icon')}
      <p class="status-message__title">${escapeHtml(title)}</p>
      <p class="status-message__text">${escapeHtml(message)}</p>
      ${buttonHtml({ text: 'Retry', className: 'status-message__button', data: { retry: '' } })}
    </div>
  `;
}

// Shown when a request succeeds but there is nothing to show
export function emptyStateHtml(title: string, message: string): string {
  return `
    <div class="status-message status-message--empty" role="status">
      ${iconHtml(IconName.Search, 'status-message__icon')}
      <p class="status-message__title">${escapeHtml(title)}</p>
      <p class="status-message__text">${escapeHtml(message)}</p>
    </div>
  `;
}
