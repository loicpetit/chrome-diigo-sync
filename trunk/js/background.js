/**
 *	Add Bookmarks module
 *	Listen bookmark events and prepare data for Diigo sync
 *	Add new event to facilitate sync with Diigo
 *
 *	Require :
 *		-	init.js 		to instantiate the namespace
 *		-	log.js  		to have the Log module
 *		-	bookmarks.js	to manage bookmark events
 *		-	diigo.js		to manage Diigo bookmarks
 */
(function(namespace){
	/*
	 *	Module
	 */
	var name = "Background";
	var logger = namespace.Log;
	var options = namespace.Options;
	var bookmarks = namespace.Bookmarks;
	var diigo = namespace.Diigo;
	
	/*
	 *	Public
	 */
	 
	/*
	 *	Listeners
	 */
	 
	//	Bookmarks events
	bookmarks.onCreated.addListener(function(bookmark, tags){
		if(!_options.addtags){
			tags = [];
		}
		if(isInBlackList(tags)){
			logger.debug(name, "in black list");
			return;
		}		
		if(!isInWhiteList(tags)){
			logger.debug(name, "NOT in white list");
			return;		
		}
		diigo.save(bookmark.url, bookmark.title, tags);
	});
	bookmarks.onUpdated.addListener(function(bookmark, tags){
		if(!_options.addtags){
			tags = [];
		}
		if(isInBlackList(tags)){
			//	delete
			return;
		}		
		if(!isInWhiteList(tags)){
			//	delete
			return;		
		}
		diigo.save(bookmark.url, bookmark.title, tags);
	});
	bookmarks.onDeleted.addListener(function(bookmark){	
		var msg = "Bookmark ["+bookmark.title+"] deleted";
		logger.info(name, msg);
		notifyDelete(bookmark.title, bookmark.url);
	});
	
	//	Messages
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(sender.id == chrome.runtime.id){
			if(request.from == "Options" && request.action == "update"){	
				onOptionsUpdated(request);
			}else{
				logger.warn(name, "Unmanaged message");
				console.log(request);			
			}		
		}else{
			logger.warn(name, "Message from unknown source");
			console.log(sender);
		}
	});
	
	//	Diigo events
	diigo.onSaved.addListener(function(url, title, tags){
		var msg = "Bookmark ["+title+"] saved in Diigo";
		logger.info(name, msg);
		notify(msg);
	});
	diigo.onFailed.addListener(function(status, error){
		logger.error(name, "onFailed, status ["+status+"], error ["+error+"]");
		notify("Can't save the Diigo bookmark : "+error);
	});
	
	//	Notify events
	chrome.notifications.onClosed.addListener(function(id, byUser){
		openDeleteUrl(id);
	});
	
	chrome.notifications.onClicked.addListener(function(id, byUser){
		openDeleteUrl(id);
	});
	 
	/*
	 *	Private
	 */
	var init = function(options){
		_options = options;
		diigo.init(options.login, options.pwd, options.setpublic);
	}
	
	var onOptionsUpdated = function(request){
		init(request);
		logger.trace(name, "options updated");
	};
	
	var notify = function(msg){
		if(_options.notifyAddUpdate){
			chrome.notifications.create(
				"", 
				{
					type: "basic",
					iconUrl: "../img/notif_icon.png",
					title: namespace.name,
					message: msg
				},
				function(id){
					// clear notification after some time
					setTimeout(function(){
						chrome.notifications.clear(id, function(){});
					},	_notificationTimeout);
				}
			);
		}
	};	
	
	var notifyDelete = function(title, url){
		if(_options.notifyDelete){
			var msg = "The bookmark ["+title+"] was deleted";
			chrome.notifications.create(
				"", 
				{
					type: "basic",
					iconUrl: "../img/notif_icon.png",
					title: namespace.name,
					message: msg,
					contextMessage: url
				},
				function(id){
					//	cache the url
					_deleteMap[id] = url;
					//	clear the url after sometime if the user doesn't click on the notification
					setTimeout(function(){
						if(_deleteMap[id] != undefined){
							//	clear notification and cache
							chrome.notifications.clear(id, function(){});
							delete _deleteMap[id];
						}
					},	_notificationTimeout);
				}
			);
		}
	}
	
	var openDeleteUrl = function(notificationId){
		var url = _deleteMap[notificationId];
		if(url != undefined){
			var diigoUrl = _diigoSearchUrl + encodeURIComponent("@"+url);
			window.open(diigoUrl);
			delete _deleteMap[notificationId];
		}
	}
	
	var isInBlackList = function(tags){
		var result = false;
		if((tags.length > 0)&&(_options.blacklist.length > 0)){
			for(var i=0; i<tags.length; i++){
				var tag = tags[i];
				if(_options.blacklist.indexOf(tag) >= 0){
					result = true;
				}
			}
		}	
		
		return result;
	}
	
	var isInWhiteList = function(tags){
		//	if white list enpty, every thing is valid
		if(_options.whitelist.length == 0){
			return true;
		}
		var result = false;
		if(tags.length > 0){
			for(var i=0; i<tags.length; i++){
				var tag = tags[i];
				if(_options.whitelist.indexOf(tag) >= 0){
					result = true;
				}
			}
		}		
		
		return result;
	}
	
	/*
	 *	Init
	 */	
	var _options = {};
	var _deleteMap = {};
	var _notificationTimeout = 5000;
	var _diigoSearchUrl = "https://www.diigo.com/search?what=";
	/*
	 *	Init
	 */	
	options.getOptions(function(data){
		init(data);
	});
	logger.trace(name, "loaded");
	
})(ChromeDiigoSync); 