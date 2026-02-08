import { NotionAPI } from 'notion-client';
import BLOG from '~/blog.config';
import { normalizeRecordMap } from './normalizeRecordMap';

export const getPostBlocks = async (id: string) => {
  const authToken = BLOG.notionAccessToken;
  const api = new NotionAPI({ authToken });
  const pageBlock = normalizeRecordMap(await api.getPage(id));
  return pageBlock;
};
