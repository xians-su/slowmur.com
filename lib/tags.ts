import { ValueOf } from 'lib/types';

const TAG_SLUGS = {
  Alls: 'alls',
  Murmur: 'murmur',
  ThinkingFragment: 'thinking-fragment',
  Links: 'links',
  LowCodeHacker: 'lowcode-hacker',
  Productivity: 'productivity',
  Playlist: 'playlist',
  Readings: 'readings',
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
    name: 'LowCode-Hacker',
    emoji: '👾',
    slug: TAG_SLUGS.LowCodeHacker,
  },
  [TAG_SLUGS.Productivity]: {
    name: 'productivity',
    emoji: '🛠️',
    slug: TAG_SLUGS.Productivity,
  },
  [TAG_SLUGS.Playlist]: {
    name: 'Playlist',
    emoji: '🎵',
    slug: TAG_SLUGS.Playlist,
  },
  [TAG_SLUGS.ThinkingFragment]: {
    name: '思考碎片',
    emoji: '💭',
    slug: TAG_SLUGS.ThinkingFragment,
  },
  [TAG_SLUGS.Links]: {
    name: 'Links',
    emoji: '🔗',
    slug: TAG_SLUGS.Links,
  },
  [TAG_SLUGS.FantasyBasketball]: {
    name: 'FantasyBasketball',
    emoji: '🏀',
    slug: TAG_SLUGS.FantasyBasketball,
  },
  [TAG_SLUGS.Readings]: {
    name: 'Readings',
    emoji: '📚',
    slug: TAG_SLUGS.Readings,
  },
  [TAG_SLUGS.Murmur]: {
    name: 'Murmur',
    emoji: '💫',
    slug: TAG_SLUGS.Murmur,
  },
  [TAG_SLUGS.Alls]: {
    name: 'Alls',
    emoji: '🌴',
    slug: TAG_SLUGS.Alls,
  },
} as const;

export const getTagDataBySlug = (slug: TagSlug): TagData => TAG_DATA[slug];
