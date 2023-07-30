import {Button, Card, Col, Row, Select, Space} from "antd";
import {ComponentProps} from "react";

interface Props {
    position?: 'right' | 'left' | 'center'
    disabledPrev?: boolean
    disabledNext?: boolean
    showSizeChanger?: boolean
    pageSizeOptions?: number[]
    pageSize?: number
    onClickPrev?: () => void
    onClickNext?: () => void
    onShowSizeChange?: (current: number) => void
    size?:  ComponentProps<typeof Button>['size']
}

export default ((
    {
        position = 'center',
        disabledPrev,
        disabledNext,
        showSizeChanger = true,
        pageSizeOptions = [10, 20, 50, 100],
        pageSize = 20,
        onShowSizeChange,
        onClickPrev,
        onClickNext,
        size,
    }: Props
) => {
    return (
        <Row justify={"center"}>
            <Col style={{padding: 10}}>
                <Space size={size} >
                    <Button disabled={disabledPrev} size={size} onClick={onClickPrev}>&lt; 上一页</Button>
                    <Button disabled={disabledNext} size={size} onClick={onClickNext}>下一页 &gt;</Button>

                    {showSizeChanger &&
                    <Select
                        value={pageSize}
                        size={size}
                        onChange={onShowSizeChange}
                        options={pageSizeOptions.map(num => ({label: `${num} 条/页`, value: num}))} />}

                </Space>
            </Col>
        </Row>
    )
})
