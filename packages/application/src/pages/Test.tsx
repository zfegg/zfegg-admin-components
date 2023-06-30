import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, Result, Space, Statistic} from 'antd';
import {LikeOutlined} from '@ant-design/icons';

const Test = () => {
    return (
        <PageContainer
            content={'content'}
            tabList={[
                {
                    tab: '基本信息',
                    key: 'base',
                },
                {
                    tab: '详细信息',
                    key: 'info',
                },
            ]}
            extraContent={
                <Space size={24}>
                    <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
                    <Statistic title="Unmerged" value={93} suffix="/ 100" />
                </Space>
            }
            extra={[
                <Button key="3">操作</Button>,
                <Button key="2">操作</Button>,
                <Button key="1" type="primary">
                    主操作
                </Button>,
            ]}
            footer={[
                <Button key="3">重置</Button>,
                <Button key="2" type="primary">
                    提交
                </Button>,
            ]}
        >
            <div
                style={{
                    height: '120vh',
                }}
            >
                <Result
                    status="404"
                    style={{
                        height: '100%',
                        background: '#fff',
                    }}
                    title="Hello World"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary">Back Home</Button>}
                />
            </div>
        </PageContainer>
    );
};

export default Test;
