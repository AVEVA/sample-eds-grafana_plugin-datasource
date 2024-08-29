import { DataQueryRequest, DataSourceInstanceSettings, FieldType, MutableDataFrame } from '@grafana/data';
import { EdsDataSourceOptions, EdsQuery } from './types';
import { DataSource } from './datasource';
import { BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { Observable } from 'rxjs';


describe('DataSource', () => {
  const edsPort = 'PORT';
  const adhSettings: DataSourceInstanceSettings<EdsDataSourceOptions> = {
    id: 0,
    uid: '',
    name: '',
    access: 'direct',
    type: '',
    meta: null as any,
    jsonData: {
      edsPort: edsPort,
    },
    readOnly: false,
  };

  const backendSrv = {
    fetch(options: BackendSrvRequest): Observable<FetchResponse<unknown>> {
      const edsResponse = {
        data: [
          {
            TimeStamp: '2020-01-01',
            Boolean: true,
            Number: 1,
            String: 'A',
          },
        ],
      } as FetchResponse;

      return new Observable((subscriber) => {
        subscriber.next(edsResponse);
      });
    },
  };

  jest.mock('@grafana/runtime', () => {
    const original = jest.requireActual('@grafana/runtime');
    return {
      ...original,
      getBackendSrv: () => (backendSrv)
    };
  });

  describe('query', () => {
    it('should query with the expected parameters', (done) => {
      const options = {
        range: {
          from: {
            utc: () => ({
              format: () => 'FROM',
            }),
          },
          to: {
            utc: () => ({
              format: () => 'TO',
            }),
          },
        },
        targets: [
          {
            refId: 'REFID',
            name: 'STREAM',
            querytext: 'QUERYTEXT',
            collection: 'COLLECTION',
            id: 'ID',
          },
        ],
      } as unknown as DataQueryRequest<EdsQuery>;

      const datasource = new DataSource(adhSettings);

      const results = datasource.query(options);

      Promise.resolve(results).then((result) => {
        console.log('Hi!');
        expect(JSON.stringify(result)).equal(
          JSON.stringify({
            data: [
              new MutableDataFrame({
                refId: 'REFID',
                name: 'STREAM',
                fields: [
                  {
                    name: 'TimeStamp',
                    type: FieldType.time,
                    values: [Date.parse('2020-01-01')],
                  },
                  {
                    name: 'Boolean',
                    type: FieldType.number,
                    values: [1],
                  },
                  {
                    name: 'Number',
                    type: FieldType.number,
                    values: [1],
                  },
                  {
                    name: 'String',
                    type: FieldType.string,
                    values: ['A'],
                  },
                ],
              }),
            ],
          })
        );
        done();
      },
      );
    });
  });

  describe('getStreams', () => {
    it('should query for streams', (done) => {
      const datasource = new DataSource(adhSettings);

      datasource.query = jest.fn(() => {
        return new Promise(() => {
          return {
            data: [
              new MutableDataFrame({
                refId: 'REFID',
                name: 'STREAM',
                fields: [
                  {
                    name: 'Id',
                    type: FieldType.string,
                    values: ['Id1', 'Id2'],
                  },
                  {
                    name: 'Name',
                    type: FieldType.string,
                    values: ['Name1', 'Name2'],
                  },
                ],
              }),
            ],
          }
        });
      });

      const results = datasource.getStreams('QUERY', () => { });

      results.then((r) => {
        expect(r).equal([
          { value: 'Id1', label: 'Name1' },
          { value: 'Id2', label: 'Name2' },
        ]);
        done();
      });
    });
  });
});
