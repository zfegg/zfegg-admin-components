import {PageContainer} from "@ant-design/pro-layout";
import {memo} from "react";
import {Button} from "antd";
import {AxiosInstance} from "axios";
import {useService} from "@moln/react-ioc";
const Home = memo(() => {
    console.log('render home')

    const http = useService<AxiosInstance>('request')

    return (
        <PageContainer>
            <Button onClick={() => {
                http.post('/book/books', {name: 'abc'})
            }}>422</Button>
        </PageContainer>
    );
});

export default Home
