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
	module.Level = {
		Trace : 0,
		Debug : 1,
		Info  : 2,
		Warn  : 3,
		Error : 4		
	};
	module.CurrentLevel = namespace.Log.Level.Debug;	

	module.Style = {
		Trace : "color: grey; padding: 0 10px;",
		Debug : "color: black; padding: 0 10px;",
		Info  : "color: blue; padding: 0 10px;",
		Warn  : "color: orange; font-weight: bold; padding: 0 10px;",
		Error : "color: red; font-weight: bold; padding: 0 10px;"		
	};
	
	//	Methods
	module.trace = function (moduleName, msg) {
		if (module.CurrentLevel <= module.Level.Trace) {
			log(moduleName, "TRACE", msg, module.Style.Trace);
		}
	};
	module.debug = function (moduleName, msg) {
		if (module.CurrentLevel <= module.Level.Debug) {
			log(moduleName, "DEBUG", msg, module.Style.Debug);
		}
	};
	module.info = function (moduleName, msg) {
		if (module.CurrentLevel <= module.Level.Info) {
			log(moduleName, "INFO", msg, module.Style.Info);
		}
	};
	module.warn = function (moduleName, msg) {
		if (module.CurrentLevel <= module.Level.Warn) {
			log(moduleName, "WARN", msg, module.Style.Warn);
		}
	};
	module.error = function (moduleName, msg) {
		if (module.CurrentLevel <= module.Level.Error) {
			log(moduleName, "ERROR", msg, module.Style.Error);
		}
	};
	
	/*
	 *	Private
	 */
	 
	//	define the log function
	var log = function (moduleName, level, msg, style) {
		console.log("%c[" + namespace.name + "][" + moduleName + "][" + level + "] " + msg, style);
	}
	
	module.trace(name, "loaded");
	
})(ChromeDiigoSync);