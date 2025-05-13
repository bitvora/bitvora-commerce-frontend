import { app_routes } from '@/lib/constants';

export const links = [
  {
    label: 'features',
    href: '/#features'
  },
  {
    label: 'pricing',
    href: '/#pricing'
  },
  {
    label: 'self-hosting',
    href: '/#self-hosting'
  },
  {
    label: 'faq',
    href: '/#faq'
  }
];

export const footer_links = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'API Documentation',
    href: 'https://developers.bitvora.com/',
    isExternal: true
  },
  {
    label: 'System Status',
    href: 'https://bitvora.instatus.com/',
    isExternal: true
  }
];

export const social_links = [
  {
    href: 'https://x.com/bitvora',
    label: 'X',
    image: '/img/landing/social-media/twitter.svg'
  },
  {
    href: 'https://github.com/bitvora',
    label: 'Github',
    image: '/img/landing/social-media/github.svg'
  },
  {
    href: 'https://t.me/bitvora_devs',
    label: 'Telegram',
    image: '/img/landing/social-media/telegram.svg'
  },
  {
    href: 'https://discord.gg/drdnYyQA4v',
    label: 'Discord',
    image: '/img/landing/social-media/discord.svg'
  },
  {
    href: 'https://njump.me/npub13tv0rauv3cgevcjzu298eg2ujd4j82ve6haer0lyu3rjuttw4a2s6mgea0',
    label: 'Nostr',
    image: '/img/landing/social-media/nostr.svg'
  }
];

export const self_hosting_features = [
  'No monthly fees or transaction limits.',
  'Complete data privacy and control.',
  'Customize to fit your specific needs.'
];

export const bitvora_github_link = 'https://github.com/bitvora/';

export const bitvora_self_host_link = 'https://github.com/bitvora/';

export const bitvora_developer_portal_link = 'https://developers.bitvora.com/';

export interface PricingPlan {
  image: string;
  title: string;
  text: string;
  price: {
    value: string;
    label: string;
  };
  cta: {
    label: string;
    href: string;
    isExternal?: boolean;
  };
  isMostPopular?: boolean;
}
export const pricing_plans: PricingPlan[] = [
  {
    image: '/img/landing/pricing/free.svg',
    title: 'Free',
    text: 'Perfect for small businesses or individuals just getting started with Bitcoin payments.',
    price: {
      value: '$0',
      label: 'Per Month'
    },
    cta: {
      label: 'Get Started',
      href: app_routes.signup
    }
  },
  {
    image: '/img/landing/pricing/premium.svg',
    title: 'Pro',
    text: 'For growing businesses that need more volume and advanced features.',
    isMostPopular: true,
    price: {
      value: '$19',
      label: 'Per Month'
    },
    cta: {
      label: 'Go Pro',
      href: `${app_routes.signup}?plan=pro`
    }
  },
  {
    image: '/img/landing/pricing/pro.svg',
    title: 'Self-Hosted',
    text: 'For technical users who want complete control over their payment infrastructure.',
    price: {
      value: 'Free',
      label: 'Forever'
    },
    cta: {
      label: 'View on Git Hub',
      href: bitvora_self_host_link,
      isExternal: true
    }
  }
];

export const features = [
  { id: 'one', src: '/img/landing/features/1.svg', width: 'w-2/3', maxW: 'max-w-[800px]' },
  { id: 'two', src: '/img/landing/features/2.svg', width: 'w-1/3', maxW: 'max-w-[400px]' },
  { id: 'three', src: '/img/landing/features/3.svg', width: 'w-1/2', maxW: 'max-w-[500px]' },
  { id: 'four', src: '/img/landing/features/4.svg', width: 'w-1/2', maxW: 'max-w-[500px]' },
  { id: 'five', src: '/img/landing/features/5.svg', width: 'w-2/3', maxW: 'max-w-[800px]' },
  { id: 'six', src: '/img/landing/features/6.svg', width: 'w-1/3', maxW: 'max-w-[400px]' }
];
