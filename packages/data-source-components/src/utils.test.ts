// import {getColumnSchema} from "../src";
import {toTreeData} from './utils';

// describe('it', () => {
//     it('test getColumnSchema', () => {
//         const schema = {}
//         const result = getColumnSchema(schema, ['foo', 'bar'])
//
//         expect(result).toBeUndefined();
//     });
// });

test('utils to tree data', () => {
    const data = [
        {role_id: 2, name: 'm1', parent: 1},
        {role_id: 1, name: 'admin', parent: 0},
        {role_id: 3, name: 'm2', parent: 1},
        {role_id: 4, name: 'G', parent: 0},
    ];

    const rs = toTreeData(data, 'parent', 'role_id', 'items');

    expect(rs[0]['items'].length).toBe(2);
    expect(rs[1]['items'].length).toBe(2);
});
