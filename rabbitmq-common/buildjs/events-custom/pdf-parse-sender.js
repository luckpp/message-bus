"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfParseSender = void 0;
var base_sender_1 = require("../events/base-sender");
var message_types_1 = require("../events/message-types");
var queue_names_1 = require("../events/queue-names");
var PdfParseSender = /** @class */ (function (_super) {
    __extends(PdfParseSender, _super);
    function PdfParseSender(busWrapper) {
        var _this = _super.call(this, busWrapper) || this;
        _this._queueName = queue_names_1.QueueNames.worker;
        _this._messageType = message_types_1.MessageTypes.pdfParse;
        return _this;
    }
    return PdfParseSender;
}(base_sender_1.BaseSender));
exports.PdfParseSender = PdfParseSender;
