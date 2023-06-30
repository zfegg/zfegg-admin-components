import {ComponentProps, FC} from "react";
import {Login as AppLogin} from '@zfegg/admin-application'
import {useService} from "@moln/react-ioc";
import {AxiosInstance} from "axios";

const Login: FC<ComponentProps<typeof AppLogin>> = (props) => {

    const http = useService<AxiosInstance>('request')

    return <AppLogin onSubmit={(data) => http.post('/auth/login', data)} {...props} />
}

export default Login