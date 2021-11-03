webpackHotUpdate("app",{

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"f1ece7d4-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Navbar.vue?vue&type=template&id=41458b80&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"f1ece7d4-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Navbar.vue?vue&type=template&id=41458b80& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function () {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"nav\", { staticClass: \"NavBar-main\" }, [\n    _c(\n      \"div\",\n      { staticClass: \"NavBar-section\" },\n      [\n        _c(\"img\", {\n          staticClass: \"logo\",\n          attrs: { alt: \"Fritter logo\", src: __webpack_require__(/*! ../assets/navlogo.png */ \"./src/assets/navlogo.png\") },\n        }),\n        _c(\"h1\", { staticClass: \"NavBar-title\" }, [_vm._v(\" Fritter \")]),\n        _c(\"router-link\", {\n          staticClass: \"NavBar-icon\",\n          attrs: { to: \"/\", tag: \"img\", src: __webpack_require__(/*! @/assets/home.svg */ \"./src/assets/home.svg\") },\n        }),\n        _c(\"router-link\", { attrs: { to: \"/explore\" } }, [_vm._v(\"Explore\")]),\n        _vm.user\n          ? _c(\"router-link\", { attrs: { to: \"/profile\" } }, [\n              _vm._v(\"Profile\"),\n            ])\n          : _vm._e(),\n      ],\n      1\n    ),\n    _c(\"div\", { staticClass: \"NavBar-section\" }, [\n      _c(\"input\", {\n        directives: [\n          {\n            name: \"model\",\n            rawName: \"v-model\",\n            value: _vm.author,\n            expression: \"author\",\n          },\n        ],\n        attrs: { type: \"text\", placeholder: \"Search by author name...\" },\n        domProps: { value: _vm.author },\n        on: {\n          input: function ($event) {\n            if ($event.target.composing) {\n              return\n            }\n            _vm.author = $event.target.value\n          },\n        },\n      }),\n      _c(\"input\", {\n        attrs: { type: \"submit\", value: \"Search\", disabled: !_vm.author },\n        on: {\n          click: function ($event) {\n            $event.preventDefault()\n            return _vm.search.apply(null, arguments)\n          },\n        },\n      }),\n    ]),\n    _c(\"div\", { staticClass: \"NavBar-section\" }, [\n      _vm.user\n        ? _c(\"div\", { staticClass: \"NavBar-profile-container\" }, [\n            _vm._v(\"Welcome \" + _vm._s(_vm.user.username)),\n          ])\n        : _vm._e(),\n      !_vm.user\n        ? _c(\"input\", {\n            attrs: { type: \"submit\", value: \"Login\" },\n            on: {\n              click: function ($event) {\n                $event.preventDefault()\n                return _vm.loginPage.apply(null, arguments)\n              },\n            },\n          })\n        : _vm._e(),\n      !_vm.user\n        ? _c(\"input\", {\n            attrs: { type: \"submit\", value: \"Create New Account\" },\n            on: {\n              click: function ($event) {\n                $event.preventDefault()\n                return _vm.createAccountPage.apply(null, arguments)\n              },\n            },\n          })\n        : _vm._e(),\n      _vm.user\n        ? _c(\"input\", {\n            attrs: { type: \"submit\", value: \"Logout\" },\n            on: {\n              click: function ($event) {\n                $event.preventDefault()\n                return _vm.logout.apply(null, arguments)\n              },\n            },\n          })\n        : _vm._e(),\n    ]),\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvY2FjaGUtbG9hZGVyL2Rpc3QvY2pzLmpzP3tcImNhY2hlRGlyZWN0b3J5XCI6XCJub2RlX21vZHVsZXMvLmNhY2hlL3Z1ZS1sb2FkZXJcIixcImNhY2hlSWRlbnRpZmllclwiOlwiZjFlY2U3ZDQtdnVlLWxvYWRlci10ZW1wbGF0ZVwifSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3RlbXBsYXRlTG9hZGVyLmpzPyEuL25vZGVfbW9kdWxlcy9jYWNoZS1sb2FkZXIvZGlzdC9janMuanM/IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPyEuL3NyYy9jb21wb25lbnRzL05hdmJhci52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NDE0NThiODAmLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTmF2YmFyLnZ1ZT8xM2IyIl0sInNvdXJjZXNDb250ZW50IjpbInZhciByZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdm0gPSB0aGlzXG4gIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICB2YXIgX2MgPSBfdm0uX3NlbGYuX2MgfHwgX2hcbiAgcmV0dXJuIF9jKFwibmF2XCIsIHsgc3RhdGljQ2xhc3M6IFwiTmF2QmFyLW1haW5cIiB9LCBbXG4gICAgX2MoXG4gICAgICBcImRpdlwiLFxuICAgICAgeyBzdGF0aWNDbGFzczogXCJOYXZCYXItc2VjdGlvblwiIH0sXG4gICAgICBbXG4gICAgICAgIF9jKFwiaW1nXCIsIHtcbiAgICAgICAgICBzdGF0aWNDbGFzczogXCJsb2dvXCIsXG4gICAgICAgICAgYXR0cnM6IHsgYWx0OiBcIkZyaXR0ZXIgbG9nb1wiLCBzcmM6IHJlcXVpcmUoXCIuLi9hc3NldHMvbmF2bG9nby5wbmdcIikgfSxcbiAgICAgICAgfSksXG4gICAgICAgIF9jKFwiaDFcIiwgeyBzdGF0aWNDbGFzczogXCJOYXZCYXItdGl0bGVcIiB9LCBbX3ZtLl92KFwiIEZyaXR0ZXIgXCIpXSksXG4gICAgICAgIF9jKFwicm91dGVyLWxpbmtcIiwge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiBcIk5hdkJhci1pY29uXCIsXG4gICAgICAgICAgYXR0cnM6IHsgdG86IFwiL1wiLCB0YWc6IFwiaW1nXCIsIHNyYzogcmVxdWlyZShcIkAvYXNzZXRzL2hvbWUuc3ZnXCIpIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBfYyhcInJvdXRlci1saW5rXCIsIHsgYXR0cnM6IHsgdG86IFwiL2V4cGxvcmVcIiB9IH0sIFtfdm0uX3YoXCJFeHBsb3JlXCIpXSksXG4gICAgICAgIF92bS51c2VyXG4gICAgICAgICAgPyBfYyhcInJvdXRlci1saW5rXCIsIHsgYXR0cnM6IHsgdG86IFwiL3Byb2ZpbGVcIiB9IH0sIFtcbiAgICAgICAgICAgICAgX3ZtLl92KFwiUHJvZmlsZVwiKSxcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgOiBfdm0uX2UoKSxcbiAgICAgIF0sXG4gICAgICAxXG4gICAgKSxcbiAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcIk5hdkJhci1zZWN0aW9uXCIgfSwgW1xuICAgICAgX2MoXCJpbnB1dFwiLCB7XG4gICAgICAgIGRpcmVjdGl2ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIm1vZGVsXCIsXG4gICAgICAgICAgICByYXdOYW1lOiBcInYtbW9kZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBfdm0uYXV0aG9yLFxuICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJhdXRob3JcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBhdHRyczogeyB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiU2VhcmNoIGJ5IGF1dGhvciBuYW1lLi4uXCIgfSxcbiAgICAgICAgZG9tUHJvcHM6IHsgdmFsdWU6IF92bS5hdXRob3IgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBpbnB1dDogZnVuY3Rpb24gKCRldmVudCkge1xuICAgICAgICAgICAgaWYgKCRldmVudC50YXJnZXQuY29tcG9zaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3ZtLmF1dGhvciA9ICRldmVudC50YXJnZXQudmFsdWVcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBfYyhcImlucHV0XCIsIHtcbiAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJzdWJtaXRcIiwgdmFsdWU6IFwiU2VhcmNoXCIsIGRpc2FibGVkOiAhX3ZtLmF1dGhvciB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgcmV0dXJuIF92bS5zZWFyY2guYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdKSxcbiAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcIk5hdkJhci1zZWN0aW9uXCIgfSwgW1xuICAgICAgX3ZtLnVzZXJcbiAgICAgICAgPyBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcIk5hdkJhci1wcm9maWxlLWNvbnRhaW5lclwiIH0sIFtcbiAgICAgICAgICAgIF92bS5fdihcIldlbGNvbWUgXCIgKyBfdm0uX3MoX3ZtLnVzZXIudXNlcm5hbWUpKSxcbiAgICAgICAgICBdKVxuICAgICAgICA6IF92bS5fZSgpLFxuICAgICAgIV92bS51c2VyXG4gICAgICAgID8gX2MoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInN1Ym1pdFwiLCB2YWx1ZTogXCJMb2dpblwiIH0sXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCRldmVudCkge1xuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIF92bS5sb2dpblBhZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICA6IF92bS5fZSgpLFxuICAgICAgIV92bS51c2VyXG4gICAgICAgID8gX2MoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInN1Ym1pdFwiLCB2YWx1ZTogXCJDcmVhdGUgTmV3IEFjY291bnRcIiB9LFxuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIHJldHVybiBfdm0uY3JlYXRlQWNjb3VudFBhZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICA6IF92bS5fZSgpLFxuICAgICAgX3ZtLnVzZXJcbiAgICAgICAgPyBfYyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6IFwic3VibWl0XCIsIHZhbHVlOiBcIkxvZ291dFwiIH0sXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCRldmVudCkge1xuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIF92bS5sb2dvdXQuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICA6IF92bS5fZSgpLFxuICAgIF0pLFxuICBdKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcblxuZXhwb3J0IHsgcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnMgfSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"f1ece7d4-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Navbar.vue?vue&type=template&id=41458b80&\n");

/***/ })

})