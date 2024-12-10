// assets
import { IconLink } from '@tabler/icons-react';

// constant
const icons = { IconLink };

const urlShortenerMenu = {
  id: 'url-shortener',
  title: 'URL Shortener',
  type: 'group',
  children: [
    {
      id: 'shorten-url',
      title: 'Shorten URL',
      type: 'item',
      url: '/url-shortener/shorten',
      icon: icons.IconLink,
      breadcrumbs: false
    },
    {
      id: 'view-urls',
      title: 'View URLs',
      type: 'item',
      url: '/url-shortener/view',
      icon: icons.IconLink,
      breadcrumbs: false
    }
  ]
};

export default urlShortenerMenu;
