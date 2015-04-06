describe("init.js", function() { 
	
	var namespace = {
		name : 		"ChromeDiigoSync",
		parent :	 window
	};
	namespace.module = namespace.parent[namespace.name];
	
	JasmineUtil.validateModule(namespace);
	
	describe("Util module", function(){
		var util = {
			name : 		"Util",
			parent : 	namespace.module
		};
		util.module = util.parent[util.name];
		
		JasmineUtil.validateModule(util);
		
		it("isEmpty test if the value is undefined, null or an empty string", function(){
			expect(util.module.isEmpty(undefined)).toBe(true);
			expect(util.module.isEmpty(null)).toBe(true);
			expect(util.module.isEmpty("")).toBe(true);
			expect(util.module.isEmpty(1)).toBe(false);
			expect(util.module.isEmpty("string")).toBe(false);
			expect(util.module.isEmpty({})).toBe(false);
		});		
		
		describe("getModule", function(){
			var module = {
				name: "Jasmine",
				parent: namespace.module
			};
			util.module.getModule(module.name);
			
			JasmineUtil.validateModule(module);			
		});
	});
	
});