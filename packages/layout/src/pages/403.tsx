import {Button, Result} from 'antd';
import {useService} from '@moln/react-ioc';
import {History} from 'history';
import React from 'react';

const Forbidden: React.FC = () => {
    const history = useService<History>('history');

    return (
        <Result
            status="403"
            title="403"
            subTitle="您无权访问该页面."
            extra={
                <Button type="primary" onClick={() => history.push('/')}>
                    返回首页
                </Button>
            }
        />
    );
};

export default Forbidden;
