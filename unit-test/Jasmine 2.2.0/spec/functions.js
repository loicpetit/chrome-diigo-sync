/*
 * 	Set util functions in the JasmineUtil namespace
 */

var JasmineUtil = JasmineUtil || {};
 
/**
 *	Test if a module is created and if its name is set. Must be called inside a describe function
 *	@param data an object like {name, parent}
 */
JasmineUtil.validateModule = function(data){
	
	it("should create the module ["+data.name+"]", function(){
		var module = data.parent[data.name];
		expect(module).toBeDefined();
	});
	
	it("should set the module name", function(){
		var module = data.parent[data.name];
		expect(module.name).toEqual(data.name);
	});
};