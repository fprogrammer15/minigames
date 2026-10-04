import { IconName } from '../components/icon/icon';
import type { FooterColumn, NavLink, SocialLink } from '../types/navigation';
import { AppRoute, PageName } from '../types/routes';

export const RS_SCHOOL_COURSE_URL = 'https://rs.school/courses/short-track';
export const DEVELOPER_GITHUB_URL = 'https://github.com/fprogrammer15';
export const DEVELOPER_GITHUB_NAME = '@fprogrammer15';

// Links to pages that do not exist in the mockup point to Home
export const MAIN_NAV_LINKS: NavLink[] = [
  { label: 'Home', href: AppRoute.Home, page: PageName.Home },
  { label: 'Library', href: AppRoute.Library, page: PageName.Library },
  { label: 'Tournaments', href: AppRoute.Home },
  { label: 'Community', href: AppRoute.Home },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: AppRoute.Home },
      { label: 'Library', href: AppRoute.Library },
      { label: 'Categories', href: AppRoute.Library },
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
