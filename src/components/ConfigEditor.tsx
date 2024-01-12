import {
  DataSourcePluginOptionsEditorProps,
  onUpdateDatasourceJsonDataOption,
} from '@grafana/data';
import { InlineField, Input } from '@grafana/ui';
import React from 'react';
import { EdsDataSourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<EdsDataSourceOptions> {}

export const ConfigEditor = (props: Props) => {
  const { options } = props;
  const { jsonData } = options;

  // Fill in defaults
  if (!jsonData.edsPort) {
    jsonData.edsPort = '5590';
  }

  return (
    <div>
      <div className="gf-form-group">
        <h3 className="page-heading">Edge Data Store</h3>
        <div>
          <InlineField label="Port" tooltip="The port number used by Edge Data Store" labelWidth={20}>
            <Input
              required={true}
              placeholder="5590"
              width={40}
              onChange={onUpdateDatasourceJsonDataOption(props, 'edsPort')}
              value={jsonData.edsPort || ''}
            />
          </InlineField>
        </div>
      </div>
    </div>
  );
};
