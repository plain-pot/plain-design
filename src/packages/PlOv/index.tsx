import {designComponent} from "plain-design-composition";

export const PlOv = designComponent({
    props: {
        modelValue: {type: [String, Number]},
        lov: {type: String},
    },
})

export default PlOv
