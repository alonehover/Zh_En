export default {
    "appenders": {
        "info": {
            "type": "console"
        },
        "success": {
            "type": "dateFile",
            "filename": "log/app/success.log",
            "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": true
        },
        "errorFile": {
            "type": "dateFile",
            "filename": "log/error/errors.log",
            "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": true
        },
        "errors": {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": "errorFile"
        }
    },
    "categories": {
        "default": {
            "appenders": [
                "info"
            ],
            "level": "debug"
        },
        "Success": {
            "appenders": [
                "success",
                "info"
            ],
            "level": "info"
        },
        "Error": {
            "appenders": [
                "errors",
                "info"
            ],
            "level": "error"
        }
    }
};