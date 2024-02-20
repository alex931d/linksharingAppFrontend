"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _reactAuthKit = require("react-auth-kit");

var _reactRouterDom = require("react-router-dom");

var IsAuth = function IsAuth() {
  var isAuthenticated = (0, _reactAuthKit.useIsAuthenticated)();
  var navigate = (0, _reactRouterDom.useNavigate)();
  (0, _react.useEffect)(function () {
    if (isAuthenticated()) {
      navigate('/editor/links');
    }
  }, [isAuthenticated, navigate]);
};

var _default = IsAuth;
exports["default"] = _default;