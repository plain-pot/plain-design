function genAssignmentCode(types, vModelValue, handlerParameter) {
    const object = vModelValue.object;
    const property = vModelValue.property;
    let propertyName = vModelValue.computed ? property : types.StringLiteral(property.name || property.value)
    return types.ExpressionStatement(
        types.CallExpression(
            types.MemberExpression(types.Identifier("React"), types.Identifier("$$set")),
            [object, propertyName, handlerParameter]
        )
    );
};

/**
 * v-change 适用于 ant-design 之类的组件；会编译成语法糖 value 以及 onChange；
 * 如果即使用了 v-change绑定某个属性，也显示地传递了onChange属性。那么 v-change的onChange与显示地传递的onChange会合并为一个函数。
 * 并且 v-change的onChange先执行；但是如果是在结构中传递的onChange，会导致某个onChange失效。如果v-model在结构对象之后，那么结构对象的onChange将无效；
 * 反之亦然。
 *
 * v-model 为专门用于 plain-design的组件。会编译成语法糖 value 以及 onUpdateModelValue。
 * 因为 plain-design的组件在派发时间 onUpdateModelValue的同时，也会派发onChange事件，所以没有v-change的问题。也不需要合并onChange属性。
 * 同时v-model支持绑定多个属性。比如 v-model-start 会编译成 start与 onUpdateStart，v-model-end 会编译成 end与onUpdateEnd
 *
 * @author  韦胜健
 * @date    2021/3/9 15:09
 */
module.exports = function (babel) {
    const {types} = babel;
    return {
        inherits: require("babel-plugin-syntax-jsx"),
        visitor: {
            JSXOpeningElement: tagPath => {
                /*标签的名称，比如input、button，el-form等鞥*/
                const tagName = tagPath.node.name.name;
                const handlePaths = {vModel: [], vChange: null, onChange: null,}

                tagPath.get("attributes").forEach(attrPath => {
                    if (!attrPath.node.name) {return;}
                    if (attrPath.node.name.name.indexOf("v-model") === 0) {handlePaths.vModel.push(attrPath)}
                    if (attrPath.node.name.name === "v-change") {handlePaths.vChange = attrPath}
                    if (attrPath.node.name.name === "onChange") {handlePaths.onChange = attrPath}
                });

                /*---------------------------------------处理v-change-------------------------------------------*/

                if (!!handlePaths.vChange) {
                    /*v-model 属性表达式*/
                    const sugarValueExpression = handlePaths.vChange.node.value.expression;
                    if (!('property' in sugarValueExpression)) {throw new Error('v-model value must be a valid JavaScript member expression.')}
                    /*语法糖value属性值*/
                    const sugarValue = types.JSXAttribute(types.jSXIdentifier("value"), types.JSXExpressionContainer(tagName === 'input' || tagName === 'textarea' ? types.logicalExpression("||", sugarValueExpression, types.StringLiteral("")) : sugarValueExpression,));
                    /*语法糖onChange属性函数的第一个参数*/
                    const handlerFirstParameter = types.Identifier("$event");
                    /*语法糖onChange属性值*/
                    const sugarOnChange = types.JSXAttribute(types.JSXIdentifier("onChange"), types.JSXExpressionContainer(types.ArrowFunctionExpression([handlerFirstParameter], types.BlockStatement([
                        genAssignmentCode(types, sugarValueExpression, handlerFirstParameter),
                        ...(!!handlePaths.onChange ? [types.ExpressionStatement(types.CallExpression(handlePaths.onChange.node.value.expression, [handlerFirstParameter])),] : [])
                    ]))));

                    handlePaths.vChange.replaceWithMultiple([...[sugarValue, sugarOnChange]]);
                }
                if (!!handlePaths.vChange && !!handlePaths.onChange) {handlePaths.onChange.remove()}

                /*---------------------------------------处理v-model-------------------------------------------*/

                handlePaths.vModel.forEach(vModel => {
                    /*v-model 属性表达式*/
                    const sugarValueExpression = vModel.node.value.expression;
                    if (!('property' in sugarValueExpression)) {throw new Error('v-model value must be a valid JavaScript member expression.')}
                    /*propName 绑定的字段名*/
                    let propName = vModel.node.name.name.slice(8)
                    if (!propName) {propName = 'value'}
                    const isNativeInput = tagName === 'input' || tagName === 'textarea'
                    /*语法糖value属性值*/
                    const sugarValue = types.JSXAttribute(types.jSXIdentifier(propName), types.JSXExpressionContainer(isNativeInput ? types.logicalExpression("||", sugarValueExpression, types.StringLiteral("")) : sugarValueExpression));
                    /*语法糖change handler属性函数的第一个参数*/
                    const handlerFirstParameter = types.Identifier("$event");
                    /*语法糖change handler属性名*/
                    const handlerPropName = propName === 'value' ? !isNativeInput ? 'onUpdateModelValue' : 'onInput' : 'onUpdate' + propName.charAt(0).toUpperCase() + propName.slice(1);
                    /*语法糖onChange属性值*/
                    const sugarOnChange = types.JSXAttribute(types.JSXIdentifier(handlerPropName), types.JSXExpressionContainer(types.ArrowFunctionExpression([handlerFirstParameter], types.BlockStatement([
                        genAssignmentCode(types, sugarValueExpression, handlerFirstParameter),
                    ]))));

                    vModel.replaceWithMultiple([...[sugarValue, sugarOnChange]]);
                })
            }
        }
    };
};
