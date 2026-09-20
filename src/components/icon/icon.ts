import './icon.scss';

export enum IconName {
  Share = 'share',
  Chat = 'chat',
  RssFeed = 'rss-feed',
  Code = 'code',
}

const ICON_PATHS: Record<IconName, string> = {
  [IconName.Share]:
    'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
  [IconName.Chat]:
    'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  [IconName.RssFeed]:
    'M6.18 15.64a2.18 2.18 0 1 0 0 4.36 2.18 2.18 0 0 0 0-4.36zM4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z',
  [IconName.Code]:
    'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
};

export function iconHtml(name: IconName, className = ''): string {
  const classNames = ['icon', className].filter(Boolean).join(' ');

  return `
    <svg class="${classNames}" viewBox="0 0 24 24" aria-hidden="true">
      <path d="${ICON_PATHS[name]}"></path>
    </svg>
  `;
}
