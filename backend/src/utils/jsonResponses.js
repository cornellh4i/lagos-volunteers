"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorJson = exports.successJson = void 0;
const successJson = (data) => {
    return {
        success: true,
        data,
    };
};
exports.successJson = successJson;
const errorJson = (error) => {
    return {
        success: false,
        error: error,
    };
};
exports.errorJson = errorJson;
