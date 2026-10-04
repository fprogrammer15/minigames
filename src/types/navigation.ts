import type { IconName } from '../components/icon/icon';
import type { PageName } from './routes';

export interface NavLink {
  label: string;
  href: string;
  // The page this link opens, used to mark the active link
  page?: PageName;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}
