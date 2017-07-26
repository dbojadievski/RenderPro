var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Application;
(function (Application) {
    var Infrastructure;
    (function (Infrastructure) {
        var CommandConsole;
        (function (CommandConsole) {
            var CommandParameterType;
            (function (CommandParameterType) {
                CommandParameterType[CommandParameterType["INTEGER"] = 0] = "INTEGER";
                CommandParameterType[CommandParameterType["REAL"] = 1] = "REAL";
                CommandParameterType[CommandParameterType["BOOLEAN"] = 2] = "BOOLEAN";
                CommandParameterType[CommandParameterType["STRING"] = 3] = "STRING";
                CommandParameterType[CommandParameterType["ARRAY"] = 4] = "ARRAY";
            })(CommandParameterType = CommandConsole.CommandParameterType || (CommandConsole.CommandParameterType = {}));
            var CommandData = (function () {
                function CommandData(command, doNotPropagate) {
                    this.command = command;
                    this.doNotPropagate = doNotPropagate;
                }
                return CommandData;
            }());
            CommandConsole.CommandData = CommandData;
            var CommandParameter = (function () {
                function CommandParameter(name, type) {
                    this.name = name;
                    this.type = type;
                }
                return CommandParameter;
            }());
            CommandConsole.CommandParameter = CommandParameter;
            var CommandParameterV = (function (_super) {
                __extends(CommandParameterV, _super);
                function CommandParameterV(name, type, value) {
                    var _this = _super.call(this, name, type) || this;
                    _this.value = value;
                    return _this;
                }
                return CommandParameterV;
            }(CommandParameter));
            CommandConsole.CommandParameterV = CommandParameterV;
            var Command = (function () {
                function Command(name, parameters, handler) {
                    this.name = name;
                    this.parameters = parameters;
                    this.handler = handler;
                }
                Command.prototype.execute = function (args) {
                    this.handler(args);
                };
                Command.prototype.parseParameter = function (proto, string) {
                    var retVal = undefined;
                    var parsedValue = undefined;
                    var isParamValid = true;
                    var isNAN = false;
                    switch (proto.type) {
                        case CommandParameterType.INTEGER:
                            parsedValue = parseInt(string);
                            isNAN = isNaN(parsedValue);
                            if (isNAN)
                                isParamValid = false;
                            break;
                        case CommandParameterType.REAL:
                            parsedValue = parseFloat(string);
                            isNAN = isNaN(parsedValue);
                            if (isNAN)
                                isParamValid = false;
                            break;
                        case CommandParameterType.BOOLEAN:
                            var toLower = string.toLowerCase();
                            parsedValue = (toLower == 'true');
                            break;
                        case CommandParameterType.ARRAY:
                            parsedValue = string.split(',');
                            break;
                        case CommandParameterType.STRING:
                            parsedValue = string;
                            break;
                        default:
                            isParamValid = false;
                            break;
                    }
                    if (isParamValid)
                        retVal = new CommandParameterV(proto.name, proto.type, parsedValue);
                    return retVal;
                };
                Command.prototype.parseParameters = function (parameters, commandParameters, commandParamsLen) {
                    var parsedParameters = null;
                    if (parameters.length == this.parameters.length) {
                        parsedParameters = new Array();
                        for (var currParamIndex = 0; currParamIndex < parameters.length; currParamIndex++) {
                            var proto = this.parameters[currParamIndex];
                            var val = parameters[currParamIndex];
                            var param = this.parseParameter(proto, val);
                            if (!isUndefined(param))
                                parsedParameters[currParamIndex] = param.value;
                            else
                                parsedParameters[currParamIndex] = null;
                        }
                    }
                    return parsedParameters;
                };
                return Command;
            }());
            CommandConsole.Command = Command;
            /* * * * * * * * * * * * * * * * * * * * * * * */
            /*                 T e s t s                   */
            /* * * * * * * * * * * * * * * * * * * * * * * */
            var paramA = new CommandParameter('paramA', CommandParameterType.INTEGER);
            var paramB = new CommandParameter('paramB', CommandParameterType.INTEGER);
            var handler = function (a, b) {
                return (a + b);
            };
        })(CommandConsole = Infrastructure.CommandConsole || (Infrastructure.CommandConsole = {}));
    })(Infrastructure = Application.Infrastructure || (Application.Infrastructure = {}));
})(Application || (Application = {}));
