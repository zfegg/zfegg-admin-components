import React, {FC} from 'react';
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest'
import Wrap from "../Wrap";
import {useDataSource, Table} from "../../src";
import {roles, type Role, User} from "../constants";

describe('EditFormDrawer', () => {

    it('renders learn react link', async () => {
        const App: FC = () => {
            const ds = useDataSource<Role>(roles)

            return (
                <Table<Role>
                    columns={[
                        {
                            dataIndex: 'id'
                        },
                        {
                            render: (_, row) => {
                                return <span>{row.name}</span>
                            }
                        }
                    ]}
                    dataSource={ds}
                />
            )
        }

        render(<Wrap><App /></Wrap>);
        const linkElement = screen.getByText(/admin/i);
        screen.debug()
        expect(linkElement).toBeInstanceOf(HTMLElement);
    });

})