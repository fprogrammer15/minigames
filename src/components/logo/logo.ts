import './logo.scss';
import logoMarkUrl from '../../assets/icons/logo-mark.svg';
import { AppRoute } from '../../types/routes';

export enum LogoVariant {
  Dark = 'dark',
  Light = 'light',
}

export function logoHtml(variant: LogoVariant = LogoVariant.Dark): string {
  return `
    <a class="logo logo--${variant}" href="${AppRoute.Home}" data-link>
      <img class="logo__mark" src="${logoMarkUrl}" alt="" width="32" height="32">
      <span class="logo__text">MiniGames</span>
    </a>
  `;
}
