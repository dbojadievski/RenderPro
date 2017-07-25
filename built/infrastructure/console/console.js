var Application;
(function (Application) {
    var Infrastructure;
    (function (Infrastructure) {
        var CommandConsole;
        (function (CommandConsole) {
            var Console = (function () {
                function Console(eventSystem) {
                    // Application.Debug.assert ( isValidReference ( eventSystem ) );
                    this.commands = new Array();
                    this.eventSystem = eventSystem;
                    this.queue = new Array();
                    /* This is a test command added. */
                    var commandString = "addIntegers";
                    var commparams = new Array();
                    commparams.push(new CommandConsole.CommandParameter("param1", CommandConsole.CommandParameterType.INTEGER));
                    commparams.push(new CommandConsole.CommandParameter("param2", CommandConsole.CommandParameterType.INTEGER));
                    var handler = function (args) {
                        var parsedParameters = this.parseParameters(args, this.parameters, this.parameters.length);
                        var paramA = parsedParameters[0];
                        var paramB = parsedParameters[1];
                        var result = (paramA + paramB);
                        console.log("Executed command addIntegers from new console!");
                    };
                    var command = new CommandConsole.Command(commandString, commparams, handler);
                    this.commands.push(command);
                }
                Console.prototype.hasCommandQueued = function () {
                    var retVal = (this.queue.length != 0);
                    return retVal;
                };
                Console.prototype.shouldKickstart = function () {
                    var retVal = (this.queue.length === 1);
                    return retVal;
                };
                Console.prototype.cleanUpAfterExecution = function () {
                    this.queue = this.queue.slice(1);
                };
                Console.prototype.executeCommand = function (commandString, noPropagation) {
                    // Application.Debug.assert ( isValidReference ( commandString ) );
                    // Application.Debug.assert ( commandString.length != 0 );
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
                            this.eventSystem.fire('commandExecuted');
                        }
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
