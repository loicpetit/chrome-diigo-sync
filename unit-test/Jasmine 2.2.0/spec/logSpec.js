describe("log.js", function(){
	
	var namespace = ChromeDiigoSync;
	var log = {
		name: "Log",
		parent: namespace,
		module: namespace.Log
	};
	var name = "logSpec";
	
	//	Validate module
	JasmineUtil.validateModule(log);
	
	//	spy output to test the msg generated
	beforeEach(function(){
		//	spy the console.log function
		spyOn(console, "log");
	});
	
	//	compute the log output
	var getExpectedMsg = function(namespaceName, moduleName, level, msg){
		return "%c[" + namespace.name + "][" + name + "][" + level + "] " + msg;
	};
	
	describe("Trace level", function(){
		
		beforeEach(function(){
			//	set the debug level
			log.module.CurrentLevel = log.module.Level.Trace;
		});
	
		it("should write trace message", function(){
			var level = "TRACE";
			var style = log.module.Style.Trace;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.trace(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
		
		it("should write debug message", function(){
			var level = "DEBUG";
			var style = log.module.Style.Debug;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.debug(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
		
		it("should write info message", function(){
			var level = "INFO";
			var style = log.module.Style.Info;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.info(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
		
		it("should write warn message", function(){
			var level = "WARN";
			var style = log.module.Style.Warn;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.warn(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
		
		it("should write error message", function(){
			var level = "ERROR";
			var style = log.module.Style.Error;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.error(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
	});
	
	describe("Debug level", function(){
		beforeEach(function(){
			//	set the debug level
			log.module.CurrentLevel = log.module.Level.Debug;
		});
		
		it("should not write trace message", function(){
			var level = "TRACE";
			var style = log.module.Style.Trace;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.trace(name, msg);
			expect(console.log).not.toHaveBeenCalled();			
		});
		
		it("should write debug message", function(){
			var level = "DEBUG";
			var style = log.module.Style.Debug;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.debug(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
		it("should write info message", function(){
			var level = "INFO";
			var style = log.module.Style.Info;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.info(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
		it("should write warn message", function(){
			var level = "WARN";
			var style = log.module.Style.Warn;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.warn(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
		it("should write error message", function(){
			var level = "ERROR";
			var style = log.module.Style.Error;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.error(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	});
	
	describe("Info level", function(){
		beforeEach(function(){
			//	set the debug level
			log.module.CurrentLevel = log.module.Level.Info;
		});
		
		it("should not write trace message", function(){
			var level = "TRACE";
			var style = log.module.Style.Trace;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.trace(name, msg);
			expect(console.log).not.toHaveBeenCalled();			
		});
		
		it("should not write debug message", function(){
			var level = "DEBUG";
			var style = log.module.Style.Debug;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.debug(name, msg);
			expect(console.log).not.toHaveBeenCalled();		
		});
	
		it("should write info message", function(){
			var level = "INFO";
			var style = log.module.Style.Info;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.info(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
		it("should write warn message", function(){
			var level = "WARN";
			var style = log.module.Style.Warn;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.warn(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
		it("should write error message", function(){
			var level = "ERROR";
			var style = log.module.Style.Error;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.error(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	});
	
	describe("Warn level", function(){
		beforeEach(function(){
			//	set the debug level
			log.module.CurrentLevel = log.module.Level.Warn;
		});
		
		it("should not write trace message", function(){
			var level = "TRACE";
			var style = log.module.Style.Trace;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.trace(name, msg);
			expect(console.log).not.toHaveBeenCalled();			
		});
		
		it("should not write debug message", function(){
			var level = "DEBUG";
			var style = log.module.Style.Debug;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.debug(name, msg);
			expect(console.log).not.toHaveBeenCalled();		
		});
	
		it("should not write info message", function(){
			var level = "INFO";
			var style = log.module.Style.Info;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.info(name, msg);
			expect(console.log).not.toHaveBeenCalled();		
		});
	
		it("should write warn message", function(){
			var level = "WARN";
			var style = log.module.Style.Warn;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.warn(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	
		it("should write error message", function(){
			var level = "ERROR";
			var style = log.module.Style.Error;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.error(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	});
	
	describe("Error level", function(){
		beforeEach(function(){
			//	set the debug level
			log.module.CurrentLevel = log.module.Level.Error;
		});
		
		it("should not write trace message", function(){
			var level = "TRACE";
			var style = log.module.Style.Trace;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.trace(name, msg);
			expect(console.log).not.toHaveBeenCalled();			
		});
		
		it("should not write debug message", function(){
			var level = "DEBUG";
			var style = log.module.Style.Debug;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.debug(name, msg);
			expect(console.log).not.toHaveBeenCalled();		
		});
	
		it("should not write info message", function(){
			var level = "INFO";
			var style = log.module.Style.Info;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.info(name, msg);
			expect(console.log).not.toHaveBeenCalled();		
		});
	
		it("should not write warn message", function(){
			var level = "WARN";
			var style = log.module.Style.Warn;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.warn(name, msg);
			expect(console.log).not.toHaveBeenCalled();	
		});
	
		it("should write error message", function(){
			var level = "ERROR";
			var style = log.module.Style.Error;
			var msg = "msg";
			var expectedMsg = getExpectedMsg(namespace.name, name, level, msg);
			log.module.error(name, msg);
			expect(console.log).toHaveBeenCalledWith(expectedMsg, style);
		});
	});
});