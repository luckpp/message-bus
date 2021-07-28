"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPool = void 0;
var pubsub_js_1 = __importDefault(require("pubsub-js"));
var util_1 = require("../util/util");
var ConnectionPool = /** @class */ (function () {
    function ConnectionPool(busWrapper) {
        var _this = this;
        this._busWrapper = busWrapper;
        this._consumeQueues = [];
        setInterval(function () {
            _this.checkHealth();
        }, 2000);
    }
    ConnectionPool.prototype.checkHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _i, _a, queueName;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _loop_1 = function (queueName) {
                            var channel, result, err_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 4, , 6]);
                                        return [4 /*yield*/, this_1._busWrapper.getConsumeChannel(queueName)];
                                    case 1:
                                        channel = _c.sent();
                                        if (!channel) return [3 /*break*/, 3];
                                        console.log("check " + queueName);
                                        return [4 /*yield*/, channel.checkQueue(queueName)];
                                    case 2:
                                        result = _c.sent();
                                        console.log(result);
                                        _c.label = 3;
                                    case 3: return [3 /*break*/, 6];
                                    case 4:
                                        err_1 = _c.sent();
                                        console.log("Unhealthy queue: ", queueName);
                                        return [4 /*yield*/, this_1.executeWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.startConsumeInternal(queueName)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 5:
                                        _c.sent();
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this._consumeQueues;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        queueName = _a[_i];
                        return [5 /*yield**/, _loop_1(queueName)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConnectionPool.prototype.startConsume = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var existingQueue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existingQueue = this._consumeQueues.find(function (qn) { return qn == queueName; });
                        if (!!existingQueue) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.executeWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.startConsumeInternal(queueName)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        this._consumeQueues.push(queueName);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ConnectionPool.prototype.startConsumeInternal = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, consumerTag;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._busWrapper.getConsumeChannel(queueName)];
                    case 1:
                        channel = _a.sent();
                        if (!channel) return [3 /*break*/, 3];
                        return [4 /*yield*/, channel.consume(queueName, function (channelMessage) {
                                _this.messageHandler(queueName, channel, channelMessage);
                            }, {
                                noAck: false, // manual acknowledgment mode
                            })];
                    case 2:
                        consumerTag = (_a.sent()).consumerTag;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConnectionPool.prototype.messageHandler = function (queueName, channel, channelMessage) {
        if (channelMessage) {
            var content = channelMessage.content.toString();
            var message = JSON.parse(content);
            // TODO: check if message has valid format -> if not drop it
            var topic = queueName + "." + message.type;
            var messageWrapper = {
                message: message,
                channel: channel,
                channelMessage: channelMessage,
            };
            pubsub_js_1.default.publish(topic, messageWrapper);
        }
        else {
            // TODO: redo connection for queueName
        }
    };
    ConnectionPool.prototype.executeWithRetry = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var errorOccurred, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorOccurred = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, operation()];
                    case 2:
                        _a.sent();
                        errorOccurred = false;
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _a.sent();
                        console.error('Error occurred during operation');
                        errorOccurred = true;
                        return [4 /*yield*/, util_1.Util.Delay(1000)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        if (errorOccurred) return [3 /*break*/, 1];
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ConnectionPool;
}());
exports.ConnectionPool = ConnectionPool;
