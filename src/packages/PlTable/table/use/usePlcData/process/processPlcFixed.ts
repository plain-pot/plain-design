import {StyleProperties} from "plain-design-composition"
import {tPlc, tPlcType} from "../../../../plc/core/plc.utils";
import {ePlcFixedType} from "../../../utils/table.utils";

/**
 * 处理plc的fixed定位
 * @author  韦胜健
 * @date    2020/12/19 16:50
 */
export function processPlcFixed(flatPlcList: tPlc[]) {
    const collect = (() => {
        const left = [] as tPlc[]
        const right = [] as tPlc[]
        flatPlcList.forEach(plc => {
            switch (plc.state.fixed) {
                case ePlcFixedType.left:
                    left.push(plc)
                    break
                case ePlcFixedType.right:
                    right.push(plc)
                    break
            }
        })
        return {
            left,
            right,
        }
    })();
    const width = {
        left: 0,
        right: 0,
    };
    Object.keys(collect).forEach((item) => {
        const key = item as 'left' | 'right'
        let list = collect[key]!
        if (key === 'right') {list = list.reverse()}

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            width[key] += element.state.width
            if (i === 0) {
                element.fixedPosition[key] = 0
            } else {
                const {state: {width: prevWidth}, fixedPosition: {[key]: prevValue}} = list[i - 1]!
                element.fixedPosition[key] = Number(prevWidth) + prevValue
            }
        }
    })
}

/**
 * 获取plcFixed样式
 * @author  韦胜健
 * @date    2020/12/19 16:55
 */
export function getPlcFixedStyle(plc: tPlcType) {
    const {state: {fixed}} = plc
    const styles = {} as StyleProperties
    if (fixed === ePlcFixedType.center) {
        return styles
    }
    styles.position = 'sticky'
    styles.zIndex = 3

    if (!plc.group) {
        (styles as any)[fixed] = (plc.fixedPosition as any)[fixed] + 'px'
    } else {
        let count = 10
        const isFixedLeft = fixed === ePlcFixedType.left
        while (!!plc && plc.group && count > 0) {
            plc = plc.children[isFixedLeft ? 0 : plc.children.length - 1]
            count--
        }
        if (count === 0 && !!plc) {
            throw new Error('解析异常')
        }
        if (!!plc) {
            (styles as any)[fixed] = (plc.fixedPosition as any)[fixed] + 'px'
        }
    }
    return styles
}