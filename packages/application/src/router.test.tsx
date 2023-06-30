import {matchRoutes, generatePath} from './router';
import {RouteConfig} from "./interfaces";
import {render} from '@testing-library/react';
import Routes from "./components/Routes";
import {MemoryRouter, Outlet} from "react-router-dom";
import React from "react";

const data: RouteConfig[] = [
    {
        path: '/',
        element: <div id="layout"> Layout <Outlet/></div>,
        children: [
            {
                name: 'Home',
                index: true,
                element: <span>Home</span>,
            },
            {
                name: "User",
                path: "users",
                children: [
                    {
                        name: "Detail",
                        path: ":id",
                        element: <span>User Detail</span>,
                    },
                    {
                        name: "New user",
                        path: "new",
                        element: <span>New User</span>,
                    }
                ]
            },
        ]
    },
    {
        path: '/login', name: 'Login',
        element: <span>Login</span>,
    },
    {
        path: '(.*)', name: 'Not found',
        element: <span>Not found</span>,
    },
];

test('Routes component', () => {

    const result = render(
        <MemoryRouter initialEntries={["/users/123"]}>
            <Routes routes={data} />
        </MemoryRouter>
    );
    expect(result.getByText(/Layout/i)).toBeInTheDocument();
    expect(result.getByText(/User Detail/i)).toBeInTheDocument();
});

test('Match routes', () => {
    const rs = matchRoutes(data, '/users/123');

    expect(rs).toHaveLength(3);
});

test('generatePath', () => {
    const rs = generatePath('/users/:id(123|456)?', {id: 123});

    expect(rs).toBe("/users/123");
});
