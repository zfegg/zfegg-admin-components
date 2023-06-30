import React, {FC, ReactNode, useEffect, useState} from 'react';
import {PageLoading} from '@ant-design/pro-layout';
import {useService} from '@moln/react-ioc';
import {Authentication} from '../authentication';

interface SecurityProps {
    children: ReactNode;
}

const Security: FC<SecurityProps> = ({children}) => {
    const auth = useService(Authentication);

    const [isReady, setIsReady] = useState(Boolean(auth.user));

    useEffect(() => {
        if (isReady) {
            return;
        }

        (async () => {
            if (!auth.user) {
                await auth.fetchUser();
            }

            setIsReady(true);
        })();
    }, []);

    if (!isReady) {
        return <PageLoading tip={'检测认证'} />;
    }

    return children as React.ReactElement;
};

export default Security;
