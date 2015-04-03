(function () {
	/*
	 *	Namespace
	 */
	var name = "ChromeDiigoSync";
	window[name] = window[name] || {};
	var namespace = window[name];
	
	/*
	 *	Properties
	 */
	namespace.name = name;
	
	/*
	 *	Util
	 */
	namespace.Util = namespace.Util || {};
	
	//	test if a variable has a value
	namespace.Util.isEmpty = function(value){
		if(value == undefined)
			return true;
		if(value == null)
			return true;
		if(value == "")
			return true;
			
		return false;
	}
	
	//	add or get a module
	namespace.Util.getModule = function(moduleName){
		namespace[moduleName] = namespace[moduleName] || {};
		namespace[moduleName].name = moduleName;
		
		return namespace[moduleName];
	};
	
})();