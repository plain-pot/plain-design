(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{267:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var plain_design_composition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);\n/* harmony import */ var plain_design_composition__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(plain_design_composition__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_DemoRow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(221);\n/* harmony import */ var _src_packages_PlForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(63);\n/* harmony import */ var _src_packages_PlFormItem__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(138);\n/* harmony import */ var _src_packages_PlInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(20);\n/* harmony import */ var _src_packages_PlSelect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(155);\n/* harmony import */ var _src_packages_PlSelectOption__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(59);\n/* harmony import */ var _src_packages_PlButtonGroup__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(58);\n/* harmony import */ var _src_packages_PlButton__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(16);\n/* harmony import */ var _src_packages_$$notice__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(27);\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__["default"] = (Object(plain_design_composition__WEBPACK_IMPORTED_MODULE_3__["designPage"])(function () {\n  var _useRefs = Object(plain_design_composition__WEBPACK_IMPORTED_MODULE_3__["useRefs"])({\n    form: _src_packages_PlForm__WEBPACK_IMPORTED_MODULE_5__[/* default */ "b"]\n  }),\n      refs = _useRefs.refs,\n      onRef = _useRefs.onRef;\n\n  var state = Object(plain_design_composition__WEBPACK_IMPORTED_MODULE_3__["reactive"])({\n    formData: {},\n    associateFields: {\n      address: \'addrDetail\',\n      addrDetail: \'address\',\n      parentValue: \'childValue\'\n    }\n  });\n  var formData = state.formData;\n\n  function execValidate() {\n    return _execValidate.apply(this, arguments);\n  }\n\n  function _execValidate() {\n    _execValidate = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {\n      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {\n        while (1) {\n          switch (_context.prev = _context.next) {\n            case 0:\n              _context.next = 2;\n              return refs.form.validate();\n\n            case 2:\n              _src_packages_$$notice__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"].success(\'校验通过！\');\n\n            case 3:\n            case "end":\n              return _context.stop();\n          }\n        }\n      }, _callee);\n    }));\n    return _execValidate.apply(this, arguments);\n  }\n\n  return function () {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_DemoRow__WEBPACK_IMPORTED_MODULE_4__[/* DemoRow */ "a"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlForm__WEBPACK_IMPORTED_MODULE_5__[/* default */ "b"], {\n      ref: onRef.form,\n      modelValue: formData,\n      associateFields: state.associateFields\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlFormItem__WEBPACK_IMPORTED_MODULE_6__[/* default */ "b"], {\n      label: \'并列字段\',\n      field: [\'address\', \'addrDetail\'],\n      rules: [{\n        field: \'address\',\n        required: true,\n        message: \'省市县必填\'\n      }, {\n        field: \'addrDetail\',\n        required: true,\n        message: \'街道门牌号必填\'\n      }]\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlInput__WEBPACK_IMPORTED_MODULE_7__[/* PlInput */ "a"], {\n      modelValue: formData.address,\n      onUpdateModelValue: function onUpdateModelValue($event) {\n        react__WEBPACK_IMPORTED_MODULE_2___default.a.$$set(formData, "address", $event);\n      },\n      placeholder: \'省市县\'\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", {\n      style: {\n        padding: \'0 1em\'\n      }\n    }, "~"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlInput__WEBPACK_IMPORTED_MODULE_7__[/* PlInput */ "a"], {\n      modelValue: formData.addrDetail,\n      onUpdateModelValue: function onUpdateModelValue($event) {\n        react__WEBPACK_IMPORTED_MODULE_2___default.a.$$set(formData, "addrDetail", $event);\n      },\n      placeholder: \'街道门牌号\'\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlFormItem__WEBPACK_IMPORTED_MODULE_6__[/* default */ "b"], {\n      label: \'关联字段\',\n      field: \'parentValue\'\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlSelect__WEBPACK_IMPORTED_MODULE_8__[/* PlSelect */ "a"], {\n      modelValue: formData.parentValue,\n      onUpdateModelValue: function onUpdateModelValue($event) {\n        react__WEBPACK_IMPORTED_MODULE_2___default.a.$$set(formData, "parentValue", $event);\n      },\n      onChange: function onChange() {\n        return formData.childValue = null;\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlSelectOption__WEBPACK_IMPORTED_MODULE_9__[/* PlSelectOption */ "a"], {\n      label: "\\u9009\\u9879\\u4E00",\n      val: "val_1"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlSelectOption__WEBPACK_IMPORTED_MODULE_9__[/* PlSelectOption */ "a"], {\n      label: "\\u9009\\u9879\\u4E8C",\n      val: "val_2"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlSelectOption__WEBPACK_IMPORTED_MODULE_9__[/* PlSelectOption */ "a"], {\n      label: "\\u9009\\u9879\\u4E09",\n      val: "val_3"\n    }))), !!formData.parentValue && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlFormItem__WEBPACK_IMPORTED_MODULE_6__[/* default */ "b"], {\n      label: \'子字段\',\n      field: \'childValue\',\n      required: true\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlInput__WEBPACK_IMPORTED_MODULE_7__[/* PlInput */ "a"], {\n      modelValue: formData.childValue,\n      onUpdateModelValue: function onUpdateModelValue($event) {\n        react__WEBPACK_IMPORTED_MODULE_2___default.a.$$set(formData, "childValue", $event);\n      }\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlFormItem__WEBPACK_IMPORTED_MODULE_6__[/* default */ "b"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlButtonGroup__WEBPACK_IMPORTED_MODULE_10__[/* default */ "c"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlButton__WEBPACK_IMPORTED_MODULE_11__[/* default */ "b"], {\n      label: \'校验\',\n      onClick: execValidate\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_packages_PlButton__WEBPACK_IMPORTED_MODULE_11__[/* default */ "b"], {\n      label: \'取消校验\',\n      mode: \'stroke\',\n      onClick: function onClick() {\n        return refs.form.clearValidate();\n      }\n    }))))));\n  };\n}));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjY3LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3RvcnkvcGFnZXMvZm9ybS9EZW1vRm9ybUFzc29jaWF0ZUZpZWxkcy50c3g/ZjE2MyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCJcclxuaW1wb3J0IHtkZXNpZ25QYWdlLCByZWFjdGl2ZSwgdXNlUmVmc30gZnJvbSBcInBsYWluLWRlc2lnbi1jb21wb3NpdGlvblwiO1xyXG5pbXBvcnQge0RlbW9Sb3d9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL0RlbW9Sb3dcIjtcclxuaW1wb3J0IFBsRm9ybSBmcm9tIFwiLi4vLi4vLi4vc3JjL3BhY2thZ2VzL1BsRm9ybVwiO1xyXG5pbXBvcnQgUGxGb3JtSXRlbSBmcm9tIFwiLi4vLi4vLi4vc3JjL3BhY2thZ2VzL1BsRm9ybUl0ZW1cIjtcclxuaW1wb3J0IHtQbElucHV0fSBmcm9tIFwiLi4vLi4vLi4vc3JjL3BhY2thZ2VzL1BsSW5wdXRcIjtcclxuaW1wb3J0IHtQbFNlbGVjdH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9wYWNrYWdlcy9QbFNlbGVjdFwiO1xyXG5pbXBvcnQge1BsU2VsZWN0T3B0aW9ufSBmcm9tIFwiLi4vLi4vLi4vc3JjL3BhY2thZ2VzL1BsU2VsZWN0T3B0aW9uXCI7XHJcbmltcG9ydCBQbEJ1dHRvbkdyb3VwIGZyb20gXCIuLi8uLi8uLi9zcmMvcGFja2FnZXMvUGxCdXR0b25Hcm91cFwiO1xyXG5pbXBvcnQgUGxCdXR0b24gZnJvbSBcIi4uLy4uLy4uL3NyYy9wYWNrYWdlcy9QbEJ1dHRvblwiO1xyXG5pbXBvcnQgJCRub3RpY2UgZnJvbSBcIi4uLy4uLy4uL3NyYy9wYWNrYWdlcy8kJG5vdGljZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVzaWduUGFnZSgoKSA9PiB7XHJcblxyXG4gICAgY29uc3Qge3JlZnMsIG9uUmVmfSA9IHVzZVJlZnMoe1xyXG4gICAgICAgIGZvcm06IFBsRm9ybVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHtcclxuICAgICAgICBmb3JtRGF0YToge30gYXMgYW55LFxyXG4gICAgICAgIGFzc29jaWF0ZUZpZWxkczoge1xyXG4gICAgICAgICAgICBhZGRyZXNzOiAnYWRkckRldGFpbCcsXHJcbiAgICAgICAgICAgIGFkZHJEZXRhaWw6ICdhZGRyZXNzJyxcclxuXHJcbiAgICAgICAgICAgIHBhcmVudFZhbHVlOiAnY2hpbGRWYWx1ZScsXHJcbiAgICAgICAgfSxcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3Qge2Zvcm1EYXRhfSA9IHN0YXRlXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gZXhlY1ZhbGlkYXRlKCkge1xyXG4gICAgICAgIGF3YWl0IHJlZnMuZm9ybSEudmFsaWRhdGUoKVxyXG4gICAgICAgICQkbm90aWNlLnN1Y2Nlc3MoJ+agoemqjOmAmui/h++8gScpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICgpID0+IChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8RGVtb1Jvdz5cclxuICAgICAgICAgICAgICAgIDxQbEZvcm0gcmVmPXtvblJlZi5mb3JtfSBtb2RlbFZhbHVlPXtmb3JtRGF0YX0gYXNzb2NpYXRlRmllbGRzPXtzdGF0ZS5hc3NvY2lhdGVGaWVsZHN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxQbEZvcm1JdGVtIGxhYmVsPXsn5bm25YiX5a2X5q61J30gZmllbGQ9e1snYWRkcmVzcycsICdhZGRyRGV0YWlsJ119IHJ1bGVzPXtbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZDogJ2FkZHJlc3MnLCByZXF1aXJlZDogdHJ1ZSwgbWVzc2FnZTogJ+ecgeW4guWOv+W/heWhqyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGQ6ICdhZGRyRGV0YWlsJywgcmVxdWlyZWQ6IHRydWUsIG1lc3NhZ2U6ICfooZfpgZPpl6jniYzlj7flv4XloasnfSxcclxuICAgICAgICAgICAgICAgICAgICBdfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFBsSW5wdXQgdi1tb2RlbD17Zm9ybURhdGEuYWRkcmVzc30gcGxhY2Vob2xkZXI9eyfnnIHluILljr8nfS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7cGFkZGluZzogJzAgMWVtJ319Pn48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQbElucHV0IHYtbW9kZWw9e2Zvcm1EYXRhLmFkZHJEZXRhaWx9IHBsYWNlaG9sZGVyPXsn6KGX6YGT6Zeo54mM5Y+3J30vPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUGxGb3JtSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8UGxGb3JtSXRlbSBsYWJlbD17J+WFs+iBlOWtl+autSd9IGZpZWxkPXsncGFyZW50VmFsdWUnfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFBsU2VsZWN0IHYtbW9kZWw9e2Zvcm1EYXRhLnBhcmVudFZhbHVlfSBvbkNoYW5nZT17KCkgPT4gZm9ybURhdGEuY2hpbGRWYWx1ZSA9IG51bGx9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsU2VsZWN0T3B0aW9uIGxhYmVsPVwi6YCJ6aG55LiAXCIgdmFsPVwidmFsXzFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGxTZWxlY3RPcHRpb24gbGFiZWw9XCLpgInpobnkuoxcIiB2YWw9XCJ2YWxfMlwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQbFNlbGVjdE9wdGlvbiBsYWJlbD1cIumAiemhueS4iVwiIHZhbD1cInZhbF8zXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1BsU2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvUGxGb3JtSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICB7ISFmb3JtRGF0YS5wYXJlbnRWYWx1ZSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQbEZvcm1JdGVtIGxhYmVsPXsn5a2Q5a2X5q61J30gZmllbGQ9eydjaGlsZFZhbHVlJ30gcmVxdWlyZWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGxJbnB1dCB2LW1vZGVsPXtmb3JtRGF0YS5jaGlsZFZhbHVlfS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUGxGb3JtSXRlbT5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDxQbEZvcm1JdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8UGxCdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQbEJ1dHRvbiBsYWJlbD17J+agoemqjCd9IG9uQ2xpY2s9e2V4ZWNWYWxpZGF0ZX0vPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsQnV0dG9uIGxhYmVsPXsn5Y+W5raI5qCh6aqMJ30gbW9kZT17J3N0cm9rZSd9IG9uQ2xpY2s9eygpID0+IHJlZnMuZm9ybSEuY2xlYXJWYWxpZGF0ZSgpfS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUGxCdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICA8L1BsRm9ybUl0ZW0+XHJcbiAgICAgICAgICAgICAgICA8L1BsRm9ybT5cclxuICAgICAgICAgICAgPC9EZW1vUm93PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG59KSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUdBO0FBREE7QUFGQTtBQUFBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFKQTtBQUZBO0FBTkE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQWtCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbEJBO0FBQUE7QUFDQTtBQXNCQTtBQUFBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFJQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFJQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEzQkE7QUFrQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///267\n')}}]);