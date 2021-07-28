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
exports.BusWrapper = void 0;
var amqplib_1 = __importDefault(require("amqplib"));
var pubsub_js_1 = __importDefault(require("pubsub-js"));
var util_1 = require("../util/util");
var BusWrapper = /** @class */ (function () {
    function BusWrapper(host, port) {
        this._host = host;
        this._port = port;
        this._connection = null;
        this._channel = null;
        this._lock = false;
    }
    BusWrapper.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            var _this = this;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (this._connection && this._channel) {
                                            return [2 /*return*/];
                                        }
                                        _a = this;
                                        return [4 /*yield*/, amqplib_1.default.connect("amqp://" + this._host + ":" + this._port + "?heartbeat=1")];
                                    case 1:
                                        _a._connection = _c.sent();
                                        _b = this;
                                        return [4 /*yield*/, this._connection.createConfirmChannel()];
                                    case 2:
                                        _b._channel = _c.sent();
                                        this._connection.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                this._connection = null;
                                                try {
                                                    if (this._channel) {
                                                        this._channel.close();
                                                    }
                                                }
                                                catch (err) {
                                                    // channel already closed
                                                }
                                                finally {
                                                    this._channel = null;
                                                }
                                                pubsub_js_1.default.publish('system.bus.close');
                                                return [2 /*return*/];
                                            });
                                        }); });
                                        this._channel.on('error', function () {
                                            _this._connection = null;
                                            _this._channel = null;
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BusWrapper.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this._connection) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this._connection.close()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BusWrapper.prototype.getSendChannel = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.assertQueue(queueName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this._channel];
                }
            });
        });
    };
    BusWrapper.prototype.getConsumeChannel = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.assertQueue(queueName)];
                    case 2:
                        _a.sent();
                        // This tells RabbitMQ not to give more than one message to a worker at a time.  Or, in other words,
                        // don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
                        // Instead, it will dispatch it to the next worker that is not still busy.
                        if (this._channel) {
                            this._channel.prefetch(1);
                        }
                        return [2 /*return*/, this._channel];
                }
            });
        });
    };
    BusWrapper.prototype.assertQueue = function (queueName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (this._channel) {
                                    this._channel.assertQueue(queueName, {
                                        durable: true, // make sure that the queue will survive a RabbitMQ node restart
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BusWrapper.prototype.execute = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._lock) return [3 /*break*/, 2];
                        return [4 /*yield*/, util_1.Util.Delay(500)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        this._lock = true;
                        return [4 /*yield*/, operation()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this._lock = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return BusWrapper;
}());
exports.BusWrapper = BusWrapper;
