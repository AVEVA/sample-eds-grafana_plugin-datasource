import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface EdsQuery extends DataQuery {
  collection: string;
  queryText: string;
  id: string;
  name: string;
}

export const DEFAULT_QUERY: Partial<EdsQuery> = {
  collection: 'streams',
  queryText: '',
  id: '',
  name: '',
};

export interface EdsDataSourceOptions extends DataSourceJsonData {
  edsPort: string;
}
