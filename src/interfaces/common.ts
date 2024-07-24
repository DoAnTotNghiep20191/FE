export interface CommonQueryParams {
  limit: number;
  page: number;
  direction?: 'ASC' | 'DESC';
  sortBy?: string;
  sortDireciton?: 'ASC' | 'DESC';
}
