var Application;
(function (Application) {
    var Infrastructure;
    (function (Infrastructure) {
        var CommandConsole;
        (function (CommandConsole) {
            var Console = (function () {
                function Console(eventSystem) {
                    this.commands = new Array();
                    this.eventSystem = eventSystem;
                    this.queue = new Array();
                    var self = this;
                    this.commands.push(new CommandConsole.Command("create_entity", [new CommandConsole.CommandParameter('tag', CommandConsole.CommandParameterType.STRING)], function (args) {
                        var parsedParameters = this.parseParameters(args, this.parameters, this.parameters.length);
                        if (parsedParameters != null)
                            self.eventSystem.fire('shouldCreateEntity', parsedParameters[0]);
                    }));
                    Application.Systems.eventSystem.on('commandQueued', function (args) {
                        if (self.shouldKickstart())
                            self.executeNextCommand();
                    });
                    Application.Systems.eventSystem.on('commandExecuted', function () {
                        Application.Systems.console.cleanUpAfterExecution();
                        if (self.hasCommandsQueued())
                            self.executeNextCommand();
                    });
                }
                Console.prototype.hasCommandsQueued = function () {
                    var retVal = (this.queue.length != 0);
                    return retVal;
                };
                Console.prototype.shouldKickstart = function () {
                    var retVal = (this.queue.length === 1);
                    return retVal;
                };
                Console.prototype.executeNextCommand = function () {
                    var commandData = this.queue[0];
                    this.executeCommand(commandData.command, commandData.doNotPropagate);
                };
                Console.prototype.cleanUpAfterExecution = function () {
                    this.queue = this.queue.slice(1);
                };
                Console.prototype.executeCommand = function (commandString, noPropagation) {
                    if (noPropagation === void 0) { noPropagation = true; }
                    var tokens = commandString.split(' ');
                    if (tokens.length > 0) {
                        var commandName = tokens[0];
                        var commandIndex = -1;
                        var command = null;
                        for (var currCommandIndex = 0; currCommandIndex < this.commands.length; currCommandIndex++) {
                            var currCommand = this.commands[currCommandIndex];
                            if (currCommand.name === commandName) {
                                commandIndex = currCommandIndex;
                                command = currCommand;
                            }
                        }
                        if (commandIndex != -1) {
                            if (isValidReference(command))
                                command.execute(tokens.slice(1));
                            if (!noPropagation)
                                this.eventSystem.fire('commandExecutedOnHost', commandString);
                        }
                        this.eventSystem.fire('commandExecuted');
                    }
                };
                Console.prototype.parseCommand = function (commandString, noPropagation) {
                    if (noPropagation === void 0) { noPropagation = true; }
                    commandString = commandString.trim();
                    var commandData = new CommandConsole.CommandData(commandString, noPropagation);
                    this.queue.push(commandData);
                    this.eventSystem.fire('commandQueued');
                };
                return Console;
            }());
            CommandConsole.Console = Console;
        })(CommandConsole = Infrastructure.CommandConsole || (Infrastructure.CommandConsole = {}));
    })(Infrastructure = Application.Infrastructure || (Application.Infrastructure = {}));
})(Application || (Application = {}));
