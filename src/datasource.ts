import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
  SelectableValue,
} from '@grafana/data';
import { getBackendSrv, FetchResponse } from '@grafana/runtime';
import { Dispatch, SetStateAction } from 'react';
import { lastValueFrom, zip,map } from 'rxjs';
import { DEFAULT_QUERY, EdsDataSourceOptions, EdsQuery } from './types';

export class DataSource extends DataSourceApi<EdsQuery, EdsDataSourceOptions> {
  edsPort: string;

  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<EdsDataSourceOptions>) {
    super(instanceSettings);

    this.edsPort = instanceSettings.jsonData?.edsPort || '5590';
  }

  async query(options: DataQueryRequest<EdsQuery>): Promise<DataQueryResponse> {
    const requests = options.targets.map((target) => {
      if (target.id === '') {
        return getBackendSrv().fetch({
          url: `http://localhost:${this.edsPort}/api/v1/tenants/default/namespaces/default/streams?query=${target.queryText}`,
          method: 'GET',
        });
      } else {
        const from = options.range.from.utc().format();
        const to = options.range.to.utc().format();
        return getBackendSrv().fetch({
          url: `http://localhost:${this.edsPort}/api/v1/tenants/default/namespaces/default/streams/${target.id}/data?startIndex=${from}&endIndex=${to}`,
          method: 'GET',
        });
      }
    });

    return lastValueFrom(zip(requests).pipe(
      map((responses) => {
        let i = 0;
        const data = responses.map((r: FetchResponse) => {
          if (!r || !r.data.length) {
            return new MutableDataFrame();
          }

          const target = options.targets[i];
          i++;
          return new MutableDataFrame({
            refId: target.refId,
            name: target.name,
            fields: Object.keys(r.data[0]).map((name) => {
              const val0 = r.data[0][name];
              const date = Date.parse(val0);
              const num = Number(val0);
              const type =
                typeof val0 === 'string' && !isNaN(date)
                  ? FieldType.time
                  : val0 === true || val0 === false
                  ? FieldType.boolean
                  : !isNaN(num)
                  ? FieldType.number
                  : FieldType.string;

              let values = [];
              if (type === FieldType.boolean) {
                values = r.data.map((d: any) => {
                  return d[name]?.toString().toLowerCase() === 'true' ? 1 : 0;
                });
              } else {
                values = r.data.map((d: any) => (type === FieldType.time ? Date.parse(d[name]) : d[name]));
              }

              return {
                name,
                values: values,
                type: type === FieldType.boolean ? FieldType.number : type,
              };
            }),
          });
        });

        return { data };
      })
    ));
  }

  async getStreams(
    query: string,
    stateAction: Dispatch<SetStateAction<boolean | Array<SelectableValue<string>>>>
  ): Promise<Array<SelectableValue<string>>> {
    const request = this.query({
      targets: [
        { ...DEFAULT_QUERY, refId: 'eds-stream-autocomplete', queryText: query, collection: 'streams', id: '' },
      ],
    } as DataQueryRequest<EdsQuery>);

    const response = await Promise.resolve(request);

    if (!Array.isArray(response?.data) || response?.data.length === 0) {
      return [];
    }

    const dataFrame = response.data[0] as DataFrame;

    if (!Array.isArray(dataFrame?.fields) || dataFrame?.fields.length === 0) {
      return [];
    }

    const ids = dataFrame.fields[dataFrame.fields.findIndex((field) => field.name === 'Id')].values;
    const names = dataFrame.fields[dataFrame.fields.findIndex((field) => field.name === 'Name')].values;

    const selectables = [];
    for (let i = 0; i < ids.length; i++) {
      selectables.push({ value: ids[i], label: names[i] });
    }

    // Set state to persist selectables list
    stateAction(selectables);

    return selectables;
  }

  async testDatasource() {
    const request = this.query({
      targets: [
        { ...DEFAULT_QUERY, refId: 'eds-stream-autocomplete', queryText: '*', collection: 'streams', id: '' },
      ],
    } as DataQueryRequest<EdsQuery>);

    const response = await Promise.resolve(request);

    if (Array.isArray(response?.data)) {
      return {
        status: 'success',
        message: 'Success',
      };
    }

    return {
      status: 'failure',
      message: 'Failure. Check port number.',
    };
  }
}
