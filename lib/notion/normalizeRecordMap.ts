import { ExtendedRecordMap } from 'notion-types/build/esm/maps';

/**
 * Normalizes the Notion API response to handle breaking changes in the
 * internal API format (2025+).
 *
 * 1. Flattens double-nested value: { spaceId, value: { value, role } } → { value, role }
 * 2. Extracts collection_group_results.blockIds → blockIds
 */
export const normalizeRecordMap = (recordMap: ExtendedRecordMap): ExtendedRecordMap => {
  for (const key of ['block', 'collection', 'collection_view'] as const) {
    const records = recordMap[key];
    if (!records) continue;
    for (const [id, record] of Object.entries(records)) {
      const r = record as Record<string, unknown>;
      if (r?.value && typeof r.value === 'object') {
        const inner = r.value as Record<string, unknown>;
        if ('value' in inner && 'role' in inner) {
          (records as Record<string, unknown>)[id] = {
            value: inner.value,
            role: inner.role,
          };
        }
      }
    }
  }

  if (recordMap.collection_query) {
    for (const views of Object.values(recordMap.collection_query)) {
      for (const [vid, viewData] of Object.entries(views as Record<string, Record<string, unknown>>)) {
        const cgr = viewData?.collection_group_results as
          | { type?: string; blockIds?: string[]; hasMore?: boolean }
          | undefined;
        if (cgr?.blockIds && !viewData?.blockIds) {
          (views as Record<string, unknown>)[vid] = {
            ...viewData,
            type: cgr.type ?? viewData.type,
            blockIds: cgr.blockIds,
            hasMore: cgr.hasMore ?? false,
          };
        }
      }
    }
  }

  return recordMap;
};
