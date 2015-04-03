/**
 *	Add Log module
 *
 *	Require :
 *		-	init.js to instantiate the namespace
 */
(function(namespace){

	/*
	 *	Module
	 */
	var name = "Log";
	var module = namespace.Util.getModule(name);

	/*
	 *	Public
	 */
	
	//	Properties
	module.Levels = {
		Trace : 0,
		Debug : 1,
		Info  : 2,
		Warn  : 3,
		Error : 4		
	};
	module.Level = namespace.Log.Levels.Debug;	
	
	//	Methods
	module.trace = function (moduleName, msg) {
		if (module.Level <= module.Levels.Trace) {
			log(moduleName, "TRACE", msg, traceStyle);
		}
	};
	module.debug = function (moduleName, msg) {
		if (module.Level <= module.Levels.Debug) {
			log(moduleName, "DEBUG", msg, debugStyle);
		}
	};
	module.info = function (moduleName, msg) {
		if (module.Level <= module.Levels.Info) {
			log(moduleName, "INFO", msg, infoStyle);
		}
	};
	module.warn = function (moduleName, msg) {
		if (module.Level <= module.Levels.Warn) {
			log(moduleName, "WARN", msg, warnStyle);
		}
	};
	module.error = function (moduleName, msg) {
		if (module.Level <= module.Levels.Error) {
			log(moduleName, "ERROR", msg, errorStyle);
		}
	};
	
	/*
	 *	Private
	 */
	 
	//	define the log function
	var log = function (moduleName, level, msg, style) {
		console.log("%c[" + namespace.name + "][" + moduleName + "][" + level + "] " + msg, style);
	}

	//	log levels
	var levels = {
		trace : 0,
		debug : 1,
		info  : 2,
		warn  : 3,
		error : 4
	};

	//	log styles
	var traceStyle = "color: grey; padding: 0 10px;";
	var debugStyle = "color: black; padding: 0 10px;";
	var infoStyle  = "color: blue; padding: 0 10px;";
	var warnStyle  = "color: orange; font-weight: bold; padding: 0 10px;";
	var errorStyle = "color: red; font-weight: bold; padding: 0 10px;";
	
	module.trace(name, "loaded");
	
})(ChromeDiigoSync);