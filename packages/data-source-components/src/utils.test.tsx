// import {getColumnSchema} from "../src";
import {toTreeData, useDataSource} from './utils';
import {describe, expect, it} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter';
import {FC, useEffect} from "react";
import {observer} from "mobx-react-lite";
import container from "../test/container";
import {AxiosInstance} from 'axios'
import Wrap from "../test/Wrap";
// describe('it', () => {
//     it('test getColumnSchema', () => {
//         const schema = {}
//         const result = getColumnSchema(schema, ['foo', 'bar'])
//
//         expect(result).toBeUndefined();
//     });
// });
describe("Utils test", () => {
    interface User {
        id: number
        name: string
    }

    const data = [
        {id: 2, name: 'm1', parent: 1},
        {id: 1, name: 'admin', parent: 0},
        {id: 3, name: 'm2', parent: 1},
        {id: 4, name: 'G', parent: 0},
    ];
    it('should useDataSource', async () => {
        const http = container.get<AxiosInstance>('request')

        const mock = new MockAdapter(http);
        mock.onGet('/api/users').reply(config => {
            return [
                200,
                {
                    data,
                    total: 1000
                }
            ];
        });
        const App: FC = observer(() => {
            const ds = useDataSource<User>("users")
            useEffect(() => {
                ds.fetch()
            }, [])
            return (
                <ul>
                    <li>Total: {ds.total}</li>
                    {ds.data.map(item => <li key={item.id} id={item.name + item.id}>{item.name}</li>)}
                </ul>
            )
        })
        render(<Wrap><App /></Wrap>)

        await waitFor(() => screen.getByText('admin'))
        screen.debug();
    });

    it('to tree data', () => {

        const rs = toTreeData(data, 'parent', 'id', 'items');

        expect(rs[0]['items'].length).toBe(2);
        expect(rs[1]['items'].length).toBe(2);
    });

})