import type { BasePageBlock } from 'notion-types';

export const getMetadata = (rawMetadata: BasePageBlock) => {
  const metadata = {
    locked: rawMetadata?.format?.block_locked,
    page_full_width: rawMetadata?.format?.page_full_width,
    page_font: (rawMetadata?.format as Record<string, unknown>)?.page_font,
    page_small_text: rawMetadata?.format?.page_small_text,
    created_time: rawMetadata.created_time,
    last_edited_time: rawMetadata.last_edited_time,
  };
  return metadata;
};
