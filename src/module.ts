import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { EdsQuery, EdsDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, EdsQuery, EdsDataSourceOptions>(
  DataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
