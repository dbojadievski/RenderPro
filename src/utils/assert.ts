namespace Application {
    export namespace Debug { 
        export function assert ( expression : boolean, message : string)
        {
            if ( !expression )
                throw message !== undefined ? message : "ASSERTION INVALID; TERMINATING EXECUTION.";
        }
    }
}
