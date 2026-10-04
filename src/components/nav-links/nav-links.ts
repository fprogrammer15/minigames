import { MAIN_NAV_LINKS } from '../../constants/navigation';
import type { NavLink } from '../../types/navigation';
import type { PageName } from '../../types/routes';

const NAV_PAGE_SELECTOR = '[data-nav-page]';

function navLinkHtml(link: NavLink, linkClass: string): string {
  const pageAttribute = link.page ? `data-nav-page="${link.page}"` : '';

  return `
    <li>
      <a class="${linkClass}" href="${link.href}" data-link ${pageAttribute}>${link.label}</a>
    </li>
  `;
}

export function navLinksHtml(linkClass: string): string {
  return MAIN_NAV_LINKS.map((link) => navLinkHtml(link, linkClass)).join('');
}

// Marks the link of the open page in the header and in the mobile menu
export function updateActiveNavLinks(pageName: PageName): void {
  for (const link of document.querySelectorAll<HTMLElement>(NAV_PAGE_SELECTOR)) {
    link.setAttribute('aria-current', link.dataset.navPage === pageName ? 'page' : 'false');
  }
}
