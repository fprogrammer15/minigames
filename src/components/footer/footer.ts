import './footer.scss';
import {
  DEVELOPER_GITHUB_NAME,
  DEVELOPER_GITHUB_URL,
  FOOTER_COLUMNS,
  RS_SCHOOL_COURSE_URL,
  SOCIAL_LINKS,
} from '../../constants/navigation';
import type { FooterColumn, SocialLink } from '../../types/navigation';
import { html } from '../../utils/dom';
import { iconHtml, IconName } from '../icon/icon';
import { logoHtml, LogoVariant } from '../logo/logo';

function linksColumnHtml(column: FooterColumn): string {
  const links = column.links
    .map(
      (link) => `
        <li>
          <a class="footer__link" href="${link.href}" data-link>${link.label}</a>
        </li>
      `,
    )
    .join('');

  return `
    <div class="footer__column">
      <h2 class="footer__heading">${column.title}</h2>
      <ul class="footer__list">${links}</ul>
    </div>
  `;
}

function socialItemHtml(social: SocialLink): string {
  return `
    <li>
      <a class="footer__social" href="${social.href}" data-link aria-label="${social.label}">
        ${iconHtml(social.icon, 'footer__social-icon')}
      </a>
    </li>
  `;
}

export function createFooter(): HTMLElement {
  return html(`
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__top">
          <div class="footer__brand">
            ${logoHtml(LogoVariant.Light)}
            <p class="footer__description">
              Take a short break and have fun. Hundreds of curated casual mini-games right in your
              web browser. No download required.
            </p>
          </div>

          <nav class="footer__nav" aria-label="Footer navigation">
            ${FOOTER_COLUMNS.map((column) => linksColumnHtml(column)).join('')}

            <div class="footer__column footer__column--community">
              <h2 class="footer__heading">Community</h2>
              <ul class="footer__socials">
                ${SOCIAL_LINKS.map((social) => socialItemHtml(social)).join('')}
              </ul>
            </div>
          </nav>
        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">© 2026 MiniGames. All rights reserved.</p>

          <div class="footer__credits">
            <a
              class="footer__credit"
              href="${RS_SCHOOL_COURSE_URL}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer__badge footer__badge--rs" aria-hidden="true">RS</span>
              <span>RS School</span>
            </a>

            <a
              class="footer__credit"
              href="${DEVELOPER_GITHUB_URL}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer__badge footer__badge--github">
                ${iconHtml(IconName.Code, 'footer__badge-icon')}
              </span>
              <span>${DEVELOPER_GITHUB_NAME}</span>
            </a>
          </div>

          <p class="footer__note">Designed with love</p>
        </div>
      </div>
    </footer>
  `);
}
