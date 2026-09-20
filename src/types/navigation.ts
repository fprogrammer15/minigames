import type { IconName } from '../components/icon/icon';

export interface NavLink {
  label: string;
  href: string;
  isCurrent?: boolean;
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
