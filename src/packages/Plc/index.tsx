import PLC from '../PlTable/plc/core/Plc'
import * as Standard from '../PlTable/plc/standard'
import * as Edit from '../PlTable/plc/edit'

export const Plc = Object.assign(PLC, {
    ...Standard,
    ...Edit
})

export default Plc