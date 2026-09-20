import { MAIN_NAV_LINKS } from '../../constants/navigation';
import type { NavLink } from '../../types/navigation';

function navLinkHtml(link: NavLink, linkClass: string): string {
  const className = link.isCurrent ? `${linkClass} ${linkClass}--current` : linkClass;
  const currentAttribute = link.isCurrent ? 'aria-current="page"' : '';

  return `
    <li>
      <a class="${className}" href="${link.href}" data-link ${currentAttribute}>${link.label}</a>
    </li>
  `;
}

export function navLinksHtml(linkClass: string): string {
  return MAIN_NAV_LINKS.map((link) => navLinkHtml(link, linkClass)).join('');
}
