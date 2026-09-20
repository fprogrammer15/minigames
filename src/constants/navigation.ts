import { IconName } from '../components/icon/icon';
import type { FooterColumn, NavLink, SocialLink } from '../types/navigation';
import { AppRoute } from '../types/routes';

export const RS_SCHOOL_COURSE_URL = 'https://rs.school/courses/short-track';
export const DEVELOPER_GITHUB_URL = 'https://github.com/fprogrammer15';
export const DEVELOPER_GITHUB_NAME = '@fprogrammer15';

// Only the Home page exists for now, so all links point to it
export const MAIN_NAV_LINKS: NavLink[] = [
  { label: 'Home', href: AppRoute.Home, isCurrent: true },
  { label: 'Library', href: AppRoute.Home },
  { label: 'Tournaments', href: AppRoute.Home },
  { label: 'Community', href: AppRoute.Home },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: AppRoute.Home },
      { label: 'Library', href: AppRoute.Home },
      { label: 'Categories', href: AppRoute.Home },
      { label: 'Tournaments', href: AppRoute.Home },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: AppRoute.Home },
      { label: 'Contact', href: AppRoute.Home },
      { label: 'Privacy Policy', href: AppRoute.Home },
      { label: 'Terms of Service', href: AppRoute.Home },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Share', href: AppRoute.Home, icon: IconName.Share },
  { label: 'Chat', href: AppRoute.Home, icon: IconName.Chat },
  { label: 'RSS feed', href: AppRoute.Home, icon: IconName.RssFeed },
];
