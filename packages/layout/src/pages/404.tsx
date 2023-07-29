import {Button, Result} from 'antd';
import {useService} from '@moln/react-ioc';
import {History} from '@remix-run/router';
import React from 'react';

const NotFound: React.FC<{title?: string}> = ({title}) => {
    const history = useService<History>('history');

    return (
        <Result
            status="404"
            title={title || '404 Not found'}
            subTitle={"您访问的页面不存在."}
            extra={
                <Button type="primary" onClick={() => history.push('/')}>
                    返回首页
                </Button>
            }
        />
    );
};

export default NotFound;
