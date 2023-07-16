import React, {ComponentProps, FC} from "react";
import {Card, List} from "antd";
import {useService} from "@moln/react-ioc";
import {Link} from "react-router-dom";
import {PageContainer} from "@ant-design/pro-layout";
import {BasicLayout} from "@zfegg/admin-layout";
import {observer} from "mobx-react";
import ProjectService from "../services/ProjectService";
import {useRequest} from "ahooks";

const Home: FC<ComponentProps<typeof BasicLayout>> = observer((props) => {

    const ps = useService(ProjectService);
    const {data: projects, loading} = useRequest(() => {
        return ps.fetchProjects()
    })

    if (! projects?.length) {
        return null;
    }

    return (
        <BasicLayout
            menuRender={false}
            {...{
                fixSiderbar: true,
                layout: 'top',
                splitMenus: true,
            }}
            contentWidth={'Fixed'}
            loading={loading}
            {...props}
        >
            <PageContainer>
                <Card>
                    <List
                        itemLayout="horizontal"
                        dataSource={projects}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<Link to={`/projects/${item.id}/home`}>{item.name}</Link>}
                                    description="..."
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </PageContainer>
        </BasicLayout>
    );
})

export default Home;