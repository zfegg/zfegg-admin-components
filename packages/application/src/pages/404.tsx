import {Button, Result} from 'antd';
import {useService} from '@moln/react-ioc';
import {History} from 'history';
import React from 'react';

const NotFound: React.FC = () => {
    const history = useService<History>('history');

    return (
        <Result
            status="404"
            title="404"
            subTitle="您访问的页面不存在."
            extra={
                <Button type="primary" onClick={() => history.push('/')}>
                    返回首页
                </Button>
            }
        />
    );
};

export default NotFound;
