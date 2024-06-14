import {Button, List, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useService} from "@moln/react-ioc";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import ProfileService from "../../services/ProfileService";
import {UserProfile} from "../../interfaces";

const {Text} = Typography;
const Bindings = () => {

    const profileService = useService(ProfileService);
    const [user, setUser] = useState<UserProfile>();
    //
    useEffect(() => {
        (async () => {
            setUser(await profileService.fetchUserProfile());
        })();
    }, []);

    const ds = Object.entries({} as Record<string, any>).map(([key, name]) => ({key, name}))

    return (
        <PageContainer loading={!user}>
            {user && (
                <ProCard>
                    <List
                        bordered
                        dataSource={ds}
                        renderItem={({key, name}) => {
                            const binding = user.bindings.find(item => item.provider === key)
                            if (! binding) {
                                return (
                                    <List.Item
                                        key={key}
                                        actions={[
                                            <Button type={'link'} target={"_blank"} href={`/api/user-binding/login/${key}`}>
                                                绑定
                                            </Button>
                                        ]}
                                    >
                                        {name}：<Text type={"danger"}>尚未绑定</Text>
                                    </List.Item>
                                )
                            }
                            return (
                                <List.Item
                                    key={key}
                                    actions={[
                                        <Text type={"secondary"}>解绑请联系系统管理员</Text>,
                                        // <Button danger type={'link'}>
                                        //     解绑
                                        // </Button>,
                                    ]}
                                >
                                    {name}: {binding.info?.username}
                                </List.Item>
                            );
                        }}
                    />
                </ProCard>
            )}
        </PageContainer>
    );
};

export default Bindings