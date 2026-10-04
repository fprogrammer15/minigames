import './skeleton.scss';

// Grey placeholder block shown while data is loading
export function skeletonHtml(className = ''): string {
  return `<span class="skeleton ${className}" aria-hidden="true"></span>`;
}
