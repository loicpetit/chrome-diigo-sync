/**
 *	Add Diigo module
 *	Manage Diigo bookmarks update
 *	Add new event to facilitate sync with Diigo
 *
 *	Require :
 *		-	init.js to instantiate the namespace
 *		-	log.js  to have the Log module
 */
(function(namespace){
	/*
	 *	Module
	 */
	var name = "Diigo";
	var module = namespace.Util.getModule(name);
	var logger = namespace.Log;
	 
	/*
	 *	Public
	 */
	
	/**
	 *	Re init the module
	 *	user: the user used for authentification
	 *	pwd: user pwd used for authentification
	 */
	module.init = function(user, pwd, setPublic){
		//	user
		_user = user.trim();		
		if(_user == "")
			_user = null;
		//	pwd
		_pwd = pwd.trim();		
		if(_pwd == "")
			_pwd = null;
		//	privacy		
		if(setPublic)
			_shared = "yes";
		else
			_shared = "no";
	}
	 
	/**
	 *	Save a bookmark in Diigo
	 *	url: 	url to save, used as id
	 *	title:	title of the bookmark
	 *	tags: array of tags to set with the bookmark
	 */
	module.save = function(url, title, tags){
		var data = {
			url: url,
			title: title,
			tags: tags	
		}
		if(_user!=null && _pwd!=null){
			save(data);
		}else{
			onFailed("No credentials", "Can't save bookmark without Diigo credentials");			
		}
	};	
	
	/**
	 *	Called when a the save succeeds
	 * 	callback: function(url, title, tags), tags is an array
	 */
	module.onSaved = module.onSaved || {};
	module.onSaved.addListener = function(callback){
		onSavedCallbacks.push(callback);
	}
	
	/**
	 *	Called when a operation failed
	 * 	callback: function(status, error)
	 */
	module.onFailed = module.onFailed || {};
	module.onFailed.addListener = function(callback){
		onFailedCallbacks.push(callback);
	}
	
	/*
	 *	Private
	 */
	var _user = null;
	var _pwd = null;
	var _shared = "yes";
	var onSavedCallbacks = new Array();
	var onFailedCallbacks = new Array();
	var diigokey = "9c9aa91d1e5098b4";
	
	/**
	 * 	Raise saved event
	 */
	var onSaved = function(url, title, tags){
		for(var i=0; i<onSavedCallbacks.length; i++){
			onSavedCallbacks[i](url, title, tags);
		}
	}
	
	/**
	 * 	Raise failed event
	 */
	var onFailed = function(status, error){
		for(var i=0; i<onFailedCallbacks.length; i++){
			onFailedCallbacks[i](status, error);
		}
	}
	
	/**
	 *	Save the bookmark in Diigo
	 *	data : {url, title, tags} where url a string, title a string, tags an array of strings (can be empty)
	 *	!!!	_user and _pwd must be set !
	 */
	var save = function(data){
		data.tags.push("ChromeDiigoSync");
		var diigoUrl = data.url;
		var diigoTitle = data.title;
		var diigoTags = data.tags
		logger.trace(name, "save url ["+diigoUrl+"] with title ["+diigoTitle+"] and tags ["+diigoTags.join(", ")+"]");
		$.ajax({
			type: "POST",
			url: "https://secure.diigo.com/api/v2/bookmarks",
			dataType: 'json',
			async: true,
			username: _user,
			password: _pwd,
			data: {
				key: diigokey,
				title: diigoTitle,
				url: diigoUrl,
				tags: diigoTags.join(","),
				shared: _shared
			},
			success: function (data, textStatus, jqXHR){
				onSaved(diigoUrl, diigoTitle, diigoTags);
			},			
			error: function(jqXHR, textStatus, errorThrown){
				onFailed(textStatus, errorThrown);
			}
		});
	};
	
	/*
	 *	Init
	 */ 
	logger.trace(name, "loaded");
	
})(ChromeDiigoSync);