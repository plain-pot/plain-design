import {designPage, useRefs} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";

import treeData from '../data/tree.data.json'
import addressData from '../data/address.json'
import {deepcopy} from "plain-utils/object/deepcopy";
import PlTree from "../../../src/packages/PlTree";
import $$message from "../../../src/packages/$$message";
import {DemoLine} from "../../components/DemoLine";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        checkTree: PlTree,
        lazyTree: PlTree,
        checkStrictlyTree: PlTree,
        checkableTree: PlTree,
        scopedSlotDemo: PlTree,
        renderDemo: PlTree,
        currentTree: PlTree,
        virtualTree: PlTree,
        dragTree: PlTree,
        dragAndCheckTree: PlTree,
        virtualTreeWithDrag: PlTree,
    })

    const tree1 = (() => ({
        ...useRefs({tree: PlTree}),
        showCurrent: () => {
            let current = tree1.refs.tree!.getCurrent()
            $$message(!!current ? current.data.name : '未选中任何节点！')
        },
        expandSome: async () => {
            // console.log(this.$refs.tree1.state)
            await tree1.refs.tree!.expand(['2-2-2', '3-1-2'])
        },
        expandAndSelect: () => {
            tree1.refs.tree!.expand('2-2-2')
            tree1.refs.tree!.setCurrent('2-2-2')
        },
    }))();


    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'全部展开'} onClick={() => tree1.refs.tree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => tree1.refs.tree!.collapseAll()}/>
                        <PlButton label={'展开特定节点'} onClick={() => tree1.refs.tree!.expand('2-2-2')}/>
                        <PlButton label={'展开部分节点'} onClick={() => tree1.expandSome()}/>
                        <PlButton label={'当前选中节点'} onClick={() => tree1.showCurrent()}/>
                        <PlButton label={'展开并且设置当前选中节点'} onClick={() => tree1.expandAndSelect()}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={tree1.onRef.tree}
                        data={treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                        expandOnClickNode
                    />
                </div>
            </DemoRow>

            <DemoRow title={'多选'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.checkTree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.checkTree!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.checkTree!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.checkTree!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.checkTree!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.checkTree!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={onRef.checkTree}
                        height="330px"
                        showCheckbox
                        expandOnClickNode
                        data={treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                    />
                </div>
            </DemoRow>
        </div>
    )
})