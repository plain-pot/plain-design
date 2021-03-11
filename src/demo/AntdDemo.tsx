import {AutoComplete, Cascader, Checkbox, DatePicker, Form, Input, InputNumber} from "antd";
import 'antd/dist/antd.min.css'
import React, {useState} from "react";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import moment from "moment";

export const AntdDemo = () => {

    const renders: { label: string, value: any, render: any }[] = [
        (() => {
            const [value, setValue] = useState('')
            const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
            return {
                value,
                label: '输入框',
                render: <>
                    <Input value={value} onChange={onInputChange}/>
                    <Input value={value} onChange={onInputChange}/>
                </>,
            }
        })(),
        (() => {
            const [value, setValue] = useState(true)
            const onCheckChange = (e: CheckboxChangeEvent) => setValue(e.target.checked)
            return {
                value: String(value),
                label: '复选框',
                render: <>
                    <Checkbox checked={value} onChange={onCheckChange}>同意协议</Checkbox>
                    <Checkbox checked={value} onChange={onCheckChange}>同意协议</Checkbox>
                </>
            }
        })(),
        (() => {
            const [value, setValue] = useState('')
            return {
                label: '自动补全',
                value,
                render: <>
                    <AutoComplete value={value} onChange={setValue} options={[
                        {value: '春节'},
                        {value: '万圣节'},
                        {value: '端午节'},
                    ]}/>
                    <AutoComplete value={value} onChange={setValue} options={[
                        {value: '春节'},
                        {value: '万圣节'},
                        {value: '端午节'},
                    ]}/>
                </>
            }
        })(),
        (() => {
            const [value, setValue] = useState([] as (string | number)[])
            const options = [
                {
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [
                        {
                            value: 'hangzhou',
                            label: 'Hangzhou',
                            children: [
                                {
                                    value: 'xihu',
                                    label: 'West Lake',
                                },
                            ],
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [
                        {
                            value: 'nanjing',
                            label: 'Nanjing',
                            children: [
                                {
                                    value: 'zhonghuamen',
                                    label: 'Zhong Hua Men',
                                },
                            ],
                        },
                    ],
                },
            ];
            return {
                label: '级联选择',
                value,
                render: <>
                    <Cascader
                        value={value}
                        options={options}
                        onChange={setValue}
                    />
                    <Cascader
                        value={value}
                        options={options}
                        onChange={setValue}
                    />
                </>
            }
        })(),
        (() => {
            const [value, setValue] = useState(null as null | moment.Moment)
            return {
                label: '日期选择',
                value: !value ? 'null' : value.format('YYYY-MM-DD HH:mm:ss'),
                render: <>
                    <DatePicker value={!value ? null : moment(value)} onChange={setValue}/>
                    <DatePicker value={!value ? null : moment(value)} onChange={setValue}/>
                </>
            }
        })(),
        (() => {
            const dateFormat = 'YYYY/MM/DD';
            const [value, setValue] = useState(null as null | [moment.Moment | null, moment.Moment | null])
            return {
                label: '日期范围选择',
                value: (() => {
                    const val1 = !value ? 'null' : moment(value[0]).format(dateFormat)
                    const val2 = !value ? 'null' : moment(value[1]).format(dateFormat)
                    return `${val1}_${val2}`
                })(),
                render: <>
                    <DatePicker.RangePicker
                        value={value}
                        format={dateFormat}
                        onChange={setValue}
                    />
                    <DatePicker.RangePicker
                        value={value}
                        format={dateFormat}
                        onChange={setValue}
                    />
                </>
            }
        })(),
        (() => {

            /**
             * value的类型与onChange的类型不一致
             * @author  韦胜健
             * @date    2021/3/1 19:54
             */
            const [value, setValue] = useState(100 as number | undefined)
            const onChange = (val: string | number | null | undefined) => setValue(val == null ? undefined : Number(val))

            return {
                label: '数字输入框',
                value,
                render: <>
                    <InputNumber value={value} onChange={onChange}/>
                    <InputNumber value={value} onChange={onChange}/>
                </>
            }
        })(),
    ]

    return (
        <div style={{
            padding: '100px',
        }}>
            <div style={{width: '800px'}}>
                <Form>
                    <Form.Item label={"表单对象"}>
                        <ul>
                            {renders.map((item, index) => (
                                <li key={index}>
                                    {item.label}, {item.value}
                                </li>
                            ))}
                        </ul>
                    </Form.Item>

                    {renders.map((item, index) => (
                        <Form.Item label={item.label} key={index}>
                            {item.render}
                        </Form.Item>
                    ))}
                </Form>

            </div>
        </div>
    )
}