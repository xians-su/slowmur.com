import { ValueOf } from 'lib/types';

const TAG_SLUGS = {
  All: 'all',
  Murmur: 'murmur',
  ThinkingFragments: 'thinking-fragments',
  Link: 'link',
  LowCodeHacker: 'lowcode-hacker',
  Productivity: 'productivity',
  Playlist: 'playlist',
  Reading: 'reading',
  FantasyBasketball: 'fantasy-basketball',
} as const;

export type TagSlug = ValueOf<typeof TAG_SLUGS>;

type TagData = {
  slug: string;
  name: string;
  emoji: string;
};

const TAG_DATA: Record<TagSlug, TagData> = {
  [TAG_SLUGS.LowCodeHacker]: {
    name: 'LowCodeHacker',
    emoji: '👾',
    slug: TAG_SLUGS.LowCodeHacker,
  },
  [TAG_SLUGS.Productivity]: {
    name: 'Productivity',
    emoji: '🛠️',
    slug: TAG_SLUGS.Productivity,
  },
  [TAG_SLUGS.Playlist]: {
    name: 'Playlist',
    emoji: '🎵',
    slug: TAG_SLUGS.Playlist,
  },
  [TAG_SLUGS.ThinkingFragments]: {
    name: '思考碎片',
    emoji: '💭',
    slug: TAG_SLUGS.ThinkingFragments,
  },
  [TAG_SLUGS.Link]: {
    name: 'Link',
    emoji: '🔗',
    slug: TAG_SLUGS.Link,
  },
  [TAG_SLUGS.FantasyBasketball]: {
    name: 'FantasyBasketball',
    emoji: '🏀',
    slug: TAG_SLUGS.FantasyBasketball,
  },
  [TAG_SLUGS.Reading]: {
    name: 'Reading',
    emoji: '📚',
    slug: TAG_SLUGS.Reading,
  },
  [TAG_SLUGS.Murmur]: {
    name: 'Murmur',
    emoji: '💫',
    slug: TAG_SLUGS.Murmur,
  },
  [TAG_SLUGS.All]: {
    name: 'All',
    emoji: '🌴',
    slug: TAG_SLUGS.All,
  },
} as const;
