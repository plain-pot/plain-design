import React from "react"
import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import {DemoLine} from "../../components/DemoLine";
import {PlCascadePanel} from "../../../src/packages/PlCascadePanel/PlCascadePanel";
import {CascadeNode} from "../../../src/packages/PlCascade/utils/CascadeNode";
import {PlInput} from "../../../src/packages/PlInput";

export default designPage(() => {

    const treeData = [
        {
            id: '1',
            name: '一级 1',
            subs: [
                ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                    id: '1-' + index,
                    name: '二级 1-' + index,
                    subs: [{
                        id: `1-${index}-1`,
                        name: `三级 1-${index}-1`
                    }]
                })))
            ]
        }, {
            id: '2',
            name: '一级 2',
            subs: [
                ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                    id: '2-' + index,
                    name: '二级 2-' + index,
                    subs: [{
                        id: `2-${index}-1`,
                        name: `三级 2-${index}-1`
                    }]
                })))
            ]
        }, {
            id: '3',
            name: '一级 3',
            subs: [{
                id: '3-1',
                name: '二级 3-1',
                subs: [{
                    id: '3-1-1',
                    name: '三级 3-1-1'
                }, {
                    id: '3-1-2',
                    name: '三级 3-1-2'
                }]
            }, {
                id: '3-2',
                name: '二级 3-2',
                subs: [{
                    id: '3-2-1',
                    name: '三级 3-2-1'
                }]
            }]
        }]

    const val = reactive({
        val: {
            11: ["6", "7", "9"],
            2: ["2", "2-1", "2-1-1"],
        } as any
    }).val

    const state = reactive({
        labelFlag: true,
        filterText: '',
    })

    const lazyDemo = {
        isLeaf: (node: CascadeNode) => {
            return node.level >= 3
        },
        getChildren: (node: CascadeNode | null, resolve: any) => {
            if (!node) {
                // 加载一级数据
                lazyDemo.getCitiesByParentId(null).then(resolve)
                return
            }
            switch (node.level) {
                case 1:
                    // 加载二级数据
                    lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                    break
                case 2:
                    // 加载三级数据
                    lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                    break
                default:
                    return null
            }
        },
        getCitiesByParentId(parentId: string | null) {
            return new Promise((resolve) => {
                // 这个是模拟在数据库表中的数据
                const data = [
                    {id: '1', name: '广东省', parentId: null, subs: []},
                    {id: '2', name: '佛山市', parentId: '1', subs: []},
                    {id: '3', name: '深圳市', parentId: '1', subs: []},
                    {id: '4', name: '禅城区', parentId: '2', subs: []},
                    {id: '5', name: '南山区', parentId: '3', subs: []},

                    {id: '6', name: '湖南省', parentId: null, subs: []},
                    {id: '7', name: '长沙市', parentId: '6', subs: []},
                    {id: '8', name: '邵阳市', parentId: '6', subs: []},
                    {id: '9', name: '天心区', parentId: '7', subs: []},

                    {id: '11', name: '陕西省', parentId: null, subs: []},
                ]

                // 模拟请求，请求时间大概在1s-2s之间
                setTimeout(() => {
                    resolve(data.filter(item => item.parentId === parentId))
                }, Math.random() * 500 + 500)
            })
        },
    }

    const renderContent = ({node, index}: { node: CascadeNode, index: number }) => (<div>
        {index + 1}、{node.label}
    </div>)

    const filterMethod = (nodes: CascadeNode[], text: string) => nodes.some(node => node.label.indexOf(text) > -1)

    return () => (
        <div>
            <DemoRow title={'PlCascadePanel'}>
                <DemoRow title={'基本用法'}>
                    <DemoLine>{val[0]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[0]}
                        data={treeData}
                        labelField={state.labelFlag ? 'id' : 'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                    />
                </DemoRow>
                <DemoRow title={'懒加载'}>
                    <DemoLine>{val[1]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[1]}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        lazy
                        isLeaf={lazyDemo.isLeaf}
                        getChildren={lazyDemo.getChildren}
                    />
                </DemoRow>
                <DemoRow title={'懒加载，有默认值'}>
                    <DemoLine>{val[11]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[11]}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        lazy
                        isLeaf={lazyDemo.isLeaf}
                        getChildren={lazyDemo.getChildren}
                    />
                </DemoRow>
                <DemoRow title={'hover 触发器'}>
                    <DemoLine>{val[3]}</DemoLine>
                    <PlCascadePanel
                        trigger={'hover'}
                        v-model={val[3]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                    />
                </DemoRow>
                <DemoRow title={'禁用部分选项'}>
                    <DemoLine>禁用掉叶子节点，并且节点名称中含有[2]的节点</DemoLine>
                    <DemoLine>{val[4]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[4]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        nodeDisabled={node => node.isLeaf && node.label.indexOf('2') > 0}
                    />
                </DemoRow>
                <DemoRow title={'自定义内容-作用域插槽'}>
                    <DemoLine>{val[5]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[5]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs">
                        {({node, index}) => (
                            <div>
                                {index + 1}、{node.label}
                            </div>
                        )}
                    </PlCascadePanel>
                </DemoRow>
                <DemoRow title={'自定义内容-渲染函数'}>
                    <DemoLine>{val[5]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[5]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        renderContent={renderContent}
                    />
                </DemoRow>
                <DemoRow title={'点击分支的时候也能触发change'}>
                    <DemoLine>{val[6]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[6]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        selectBranch
                    />
                </DemoRow>
                <DemoRow title={'筛选文本以及自定义筛选函数'}>
                    <DemoLine><PlInput v-model={state.filterText}/></DemoLine>
                    <DemoLine>{val[6]}</DemoLine>
                    <PlCascadePanel
                        v-model={val[6]}
                        data={treeData}
                        labelField={state.labelFlag ? 'id' : 'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        filterText={state.filterText}
                        filterMethod={filterMethod}
                    />
                </DemoRow>
            </DemoRow>
        </div>
    )
})