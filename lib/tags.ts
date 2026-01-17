import { ValueOf } from 'lib/types';

const TAG_SLUGS = {
  All: 'all',
  Murmur: 'murmur',
  Thinking: 'thinking',
  Link: 'link',
  LowCode: 'low-code',
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
  [TAG_SLUGS.LowCode]: {
    name: 'Low-Code',
    emoji: '👾',
    slug: TAG_SLUGS.LowCode,
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
  [TAG_SLUGS.Thinking]: {
    name: 'Thinking',
    emoji: '💭',
    slug: TAG_SLUGS.Thinking,
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

export const getTagDataBySlug = (slug: TagSlug): TagData => TAG_DATA[slug];

// Create a lookup map for case-insensitive matching by slug or name
const TAG_LOOKUP_MAP: Record<string, TagData> = {};
Object.values(TAG_DATA).forEach((data) => {
  TAG_LOOKUP_MAP[data.slug.toLowerCase()] = data;
  TAG_LOOKUP_MAP[data.name.toLowerCase()] = data;
});

// Find tag data by slug or name (case-insensitive)
export const getTagData = (tag: string): TagData | undefined => {
  const key = tag.trim().toLowerCase();
  return TAG_LOOKUP_MAP[key];
};
