import type { Request } from 'express';

export interface PageParams {
  /** True when the client explicitly asked to paginate (page or limit given). */
  paginated: boolean;
  page: number;
  limit: number;
  skip: number;
}

/**
 * Parse `?page` / `?limit` query params for list endpoints (Future_Work §3.7).
 *
 * **Opt-in & backward compatible:** when neither param is present, `paginated`
 * is `false` and callers should return the full list as before. When either is
 * present, values are clamped to safe bounds (`page ≥ 1`, `1 ≤ limit ≤ maxLimit`).
 */
export function parsePageParams(req: Request, defaultLimit = 20, maxLimit = 100): PageParams {
  const hasPage = req.query['page'] !== undefined;
  const hasLimit = req.query['limit'] !== undefined;
  const page = Math.max(1, parseInt(String(req.query['page'] ?? ''), 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(String(req.query['limit'] ?? ''), 10) || defaultLimit)
  );
  return { paginated: hasPage || hasLimit, page, limit, skip: (page - 1) * limit };
}
