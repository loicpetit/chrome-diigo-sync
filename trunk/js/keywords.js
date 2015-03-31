/**
 *	Add Keywords module
 *	Manage keywords components
 *	Default HTML implementation to use the keywords module :
 *		<div class="keywords-container">
 *			<input type="text" />
 *			<ul class="keywords">
 *			<ul>
 *		<div>
 *
 *	You can link 2 elements by ids to create your own implementation
 * 	For that, use the init(inputId, listId, tag) method.
 *
 *	Trigger "keywordinit" event globally when the default handlers are added
 *
 *	Trigger "keywordadded" event on .keywords and listId elements when a keyword is added
 *	The handler must be like function(event, word), word the key word added
 *
 *	Require :
 *		-	jquery
 *		-	init.js 		to instantiate the namespace
 *		-	log.js  		to have the Log module
 */
(function(namespace){
	/*
	 *	Module
	 */
	var name = "Keywords";
	var module = namespace.Util.getModule(name);
	var logger = namespace.Log;
	
	/*
	 *	Public
	 */
	 
	/**
	 *	Initialise your own implementation of keywords.
	 *	Event used are "keyup" and "change".
	 *	If you set the value programmaticaly, trigger the change event !
	 *	As id are required, the method used the first found element
	 *	Don't forget the keywords class on the listId element to apply the default CSS
	 *
	 *	@param inputId is the id of the element we look at the value,
	 *				can be anything, but if not an input, 
	 *				you have to trigger the change event yourself
	 *	@param listId is the id where add the words, can be anything
	 *	@param tag is the tag surrounding the keywords
	 *			in the default implementation the "li" is used, can be change here
	 */
	module.init = function(inputId, listId, tag){		
		var $input = $("#"+inputId).first();
		var $keywords = $("#"+listId).first();
		if(!listenInput($input, $keywords, tag)){
			logger.debug(name, "init, input["+inputId+"] or keywords["+listId+"] not found");
		}
	};
	
	/**
	 *	Get an array of keywords
	 * @param $list the jQuery element where the keywords are added (by default <ul class="keywords">)
	 * @return a array with keywords or empty
	 */
	module.getKeywords = function($list){
		var words = [];
		var selector = "."+textClass;
		$list.find(selector).each(function(){
			words.push( $(this).text() );
		});
		
		return words;
	};
	
	/**
	 *	Add keywords in the list
	 *	@param $input the jQuery element where keywords are set (by default <input type="text" />)
	 *	@param keywords an array of keywords
	 *	@param setVal true to set the words with val() method, false to set with text() method
	 */
	module.addKeywords = function($input, keywords, setVal){
		//	join values
		var value = keywords.join(" ");
		// 	set values in the input and call the change event
		if(setVal){
			$input.val(value).change();
		}else{			
			$input.text(value).change();
		}
	};
	 
	/*
	 *	Handlers
	 */
	$(document).ready(function(){
		listenContainers(defaultContainerSelector, defaultInputSelector, defaultKeywordsSelector);
		listenClose();
		$.event.trigger("keywordinit");
	});
	 
	/*
	 *	Private
	 */
	
	/**
	 * 	Search default implementation of the keywords and add handler
	 */
	var listenContainers = function(containerSelector, inputSelector, keywordsSelector){
		$(containerSelector).each(function(){
			$container = $(this);
			var $input = $container.find(inputSelector).first();
			var $keywords = $container.find(keywordsSelector).first();
			if(!listenInput($input, $keywords, "li")){
				logger.debug(name, "listenContainers, input or keywords not found");
				logger.debug(name, "listenContainers, container :");
				console.log($container);			
			}
		});
	}
	
	/**
	 *	Add input handlers
	 *
	 *	@return false if the input or keywords list are not found
	 */
	var listenInput = function($input, $keywords, tag){
		var success = true;
		//	check elements exists
		if(($input.length > 0)&&($keywords.length > 0)){
			$input.on("keyup", function(event){
				onInputTextChange(event, $input, $keywords, tag);
			});	
			$input.on("change", function(event){
				onChange(event, $input, $keywords, tag);
			});
		}else{
			success = false;
		}
		
		return success;
	}
	
	/**
	 *	Update the keyword list when the element change
	 */
	var onChange = function(event, $input, $keywords, tag){
		logger.trace(name, "onChange");		
		var words = extractValue($input);
		addWords($keywords, words, tag);
	}
	
	/**
	 *	Update the keyword list when the text change in the input
	 *	Look at space and enter char to add new word
	 */
	var onInputTextChange = function(event, $input, $keywords, tag){
		logger.trace(name, "onContainerChange");
		logger.trace(name, "\t key : "+event.which);
		switch(event.which){
			case SPACE:
			case ENTER:
				var words = extractValue($input);
				addWords($keywords, words, tag);
				break;
		}
	}
	
	/**
	 *	Add words in the keyword list
	 */
	var addWords = function($keywords, words, tag){
		if(words != ""){
			logger.trace(name, "addWords : ["+words+"]");	
			var keywords = words.toLowerCase().split(/\s+/g).filter(function(word){ 
				return word.trim() != "";
			});
			for(var i=0; i<keywords.length; i++){
				addKeyWord($keywords, keywords[i], tag);
			}
		}
	}
	
	/**
	 *	Add a word in the keywords list
	 */
	var addKeyWord = function($keywords, word, tag){
		if(word != ""){
			logger.trace(name, "addKeyWord : ["+word+"]");	
			var html = 
				'<'+tag+' class="'+keywordClass+'">' +
					'<span class="'+textClass+'">'+word+'</span>' +
					'<span class="'+closeClass+'" title="remove"></span>' +
				'</'+tag+'>';
			$keywords.append(html);
			$keywords.trigger("keywordadded", word);
		}
	}
	
	/**
	 *	Extract the value from the source
	 */
	var extractValue = function($input){
		var value = $input.val();
		if(value == ""){
			//	no value, look at text
			value = $input.text();
			if(value != ""){
				$input.text("");
			}
		}else{
			//	value get from val, reset the val
			$input.val("");
		}
		
		value = value.trim();
		
		return value;
	}
	
	/**
	 *	Listen when a keyword must be removed
	 *	Listen on all document due to custom keyword implementation via init method
	 */
	var listenClose = function(){
		var selector = "."+keywordClass+" ."+closeClass;
		$(document).on("click", selector, function(){
			$(this).parent().remove();
		});
	};
	 
	/*
	 *	Variables
	 */
	var defaultContainerSelector = ".keywords-container";
	var defaultInputSelector = "input";
	var defaultKeywordsSelector = ".keywords";
	var keywordClass = "keyword";
	var textClass = "text";
	var closeClass = "close";
	
	//	keys
	var SPACE = 32;
	var ENTER = 13;
	
	/*
	 * 	Init
	 */
	
	logger.trace(name, "loaded");
	
})(ChromeDiigoSync);