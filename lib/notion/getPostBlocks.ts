import { NotionAPI } from 'notion-client';
import BLOG from '~/blog.config';

export const getPostBlocks = async (id: string) => {
  try {
    const authToken = BLOG.notionAccessToken;
    const api = new NotionAPI({ authToken });
    const pageBlock = await api.getPage(id);
    return pageBlock;
  } catch (error) {
    console.error(`Failed to fetch Notion page blocks for id: ${id}`, error);
    throw error;
  }
};
