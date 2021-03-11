import * as React from "react";

function _extends() {
    _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}

var props = {
    age: 111,
    onChange: function onChange(e) {
        console.log('wahaha');
    }
};
var html = React.createElement("div", {"class": "yes"},
    React.createElement("h1", null, "good good study, day day up"),
    React.createElement("input", _extends({
        type: "text",
        value: state.text || "",
        onChange: function onChange($event) {
            React.$$set(state, "text", $event);
        }
    }, props))
);
