import {Button, Result} from 'antd';
import {useNavigate} from "react-router";
import {FC} from "react";

const Forbidden: FC = () => {
    const navigate = useNavigate()

    return (
        <Result
            status="403"
            title="403"
            subTitle="您无权访问该页面."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    返回首页
                </Button>
            }
        />
    );
};

export default Forbidden;
