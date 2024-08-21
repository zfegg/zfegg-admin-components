import {Button, Result} from 'antd';
import {FC} from 'react';
import {useNavigate} from "react-router";

const NotFound: FC<{title?: string}> = ({title}) => {
    const navigate = useNavigate()

    return (
        <Result
            status="404"
            title={title || '404 Not found'}
            subTitle="您访问的页面不存在."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    返回首页
                </Button>
            }
        />
    );
};

export default NotFound;

