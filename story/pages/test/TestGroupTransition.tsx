import {designComponent} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import {PlDate} from "../../../src";
import {PDate} from "../../../src/utils/plainDate";

const DesignPage = designComponent({
    setup() {

        const today = PlDate.plainDate.today('YYYY年MM月DD日 A HH:mm 星期d', 'YYYY-MM-DD')

        const getDisplay = (pd: PDate) => {
            const display = pd.getDisplay()
            return display
                .replace(' AM ', ' 上午 ')
                .replace(' PM ', ' 下午 ')

                .replace('星期1', '星期一')
                .replace('星期2', '星期二')
                .replace('星期3', '星期三')
                .replace('星期4', '星期四')
                .replace('星期5', '星期五')
                .replace('星期6', '星期六')
                .replace('星期0', '星期日')
        }

        const list = [
            {
                name: '今天', val: getDisplay(today)
            },
            {name: '星期一', val: getDisplay(today.useValue('2021-09-06'))},
            {name: '星期二', val: getDisplay(today.useValue('2021-09-07'))},
            {name: '星期三', val: getDisplay(today.useValue('2021-09-08'))},
            {name: '星期四', val: getDisplay(today.useValue('2021-09-09'))},
            {name: '星期五', val: getDisplay(today.useValue('2021-09-10'))},
            {name: '星期六', val: getDisplay(today.useValue('2021-09-11'))},
            {name: '星期日', val: getDisplay(today.useValue('2021-09-12'))},
        ]

        return () => (
            <div className={'test-page'}>
                <ul>
                    {list.map(i => (
                        <li key={i.name}>
                            {i.name}:{i.val}
                        </li>
                    ))}
                </ul>
            </div>
        )
    },
})

// export default FcPage
export default DesignPage
