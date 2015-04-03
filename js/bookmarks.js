/**
 *	Add Bookmarks module
 *	Listen bookmark events and prepare data for Diigo sync
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
	var name = "Bookmarks";
	var module = namespace.Util.getModule(name);
	 
	/*
	 *	Public
	 */
	 
	//	Add an on created listener
	//		the callback must be like : callback(bookmark, tags)
	//			bookmark is a BookmarkTreeNode
	//			tags is an array of string at least empty
	module.onCreated = module.onCreated || {};
	module.onCreated.addListener = function(callback){
		onCreateCallbacks.push(callback);
	}
	//	Add an on updated listener
	//		the callback must be like : callback(bookmark, tags)
	//			bookmark is a BookmarkTreeNode
	//			tags is an array of string at least empty
	module.onUpdated = module.onUpdated || {};
	module.onUpdated.addListener = function(callback){
		onUpdateCallbacks.push(callback);
	}
	//	Add an on deleted listener
	//		the callback must be like : callback(bookmark, tags)
	//			bookmark is a BookmarkTreeNode
	module.onDeleted = module.onDeleted || {};
	module.onDeleted.addListener = function(callback){
		onDeleteCallbacks.push(callback);
	}
	
	/*
	 *	Listeners
	 */ 
	 
	//	On created
	//		bookmark is a BookmarkTreeNode
	chrome.bookmarks.onCreated.addListener(function(id, bookmark){
		namespace.Log.trace(name, "onCreated");
		namespace.Log.trace(name, "\t id 	: "+id);
		namespace.Log.trace(name, "\t title 	: "+bookmark.title);
		namespace.Log.trace(name, "\t url 	: "+bookmark.url);
		if(!isFolder(bookmark)){
			raiseCreate(bookmark);
		}		
	});
	
	//	On changed
	//		changeInfo : {title, url(optional)}
	chrome.bookmarks.onChanged.addListener(function(id, changeInfo){
		namespace.Log.trace(name, "onChanged");
		namespace.Log.trace(name, "\t id 	: "+id);
		namespace.Log.trace(name, "\t title 	: "+changeInfo.title);
		namespace.Log.trace(name, "\t url 	: "+changeInfo.url);
		update(id);
	});	
	
	//	On moved
	//		moveInfo : {parentid, index, oldParentId, oldIndex}
	chrome.bookmarks.onMoved.addListener(function(id, moveInfo){
		namespace.Log.trace(name, "onMoved");
		namespace.Log.trace(name, "\t id 			: "+id);
		namespace.Log.trace(name, "\t parentid 		: "+moveInfo.parentId);
		namespace.Log.trace(name, "\t index 			: "+moveInfo.index);		
		namespace.Log.trace(name, "\t oldParentId 	: "+moveInfo.oldParentId);
		namespace.Log.trace(name, "\t oldIndex 		: "+moveInfo.oldIndex);	
		update(id);
	});	
	
	//	On removed
	//		removeInfo : {parentid, index}
	chrome.bookmarks.onRemoved.addListener(function(id, removeInfo){
		namespace.Log.trace(name, "onRemoved");
		namespace.Log.trace(name, "\t id 			: "+id);
		namespace.Log.trace(name, "\t parentid 		: "+removeInfo.parentId);
		namespace.Log.trace(name, "\t index 		: "+removeInfo.index);
		
		var bookmarkDelete = getBookmarkInCache(id);
		if(bookmarkDelete != null){
			namespace.Log.trace(name, "onRemoved, bookmark :"+bookmarkDelete.title);
			deleteBookmark(bookmarkDelete);
			//	update the cache after all delete
			updateCache()
		}else{
			namespace.Log.warn(name, "onRemoved, "+id+" not in cache");
		}
	});	
	
	/*
	 *	Events
	 */
	var onCreateCallbacks = new Array();
	var onUpdateCallbacks = new Array();
	var onDeleteCallbacks = new Array();
	
	//	Execute on create callbacks
	//		bookmark is a BookmarkTreeNode
	//		tags is an array of string
	var onCreate = function(bookmark, tags){
		namespace.Log.trace(name, "onCreate : "+bookmark.title);
		for(var i=0; i<onCreateCallbacks.length; i++){
			onCreateCallbacks[i](bookmark, tags);
		}
	}
	
	//	Execute on update callbacks
	//		bookmark is a BookmarkTreeNode
	//		tags is an array of string
	var onUpdate = function(bookmark, tags){
		namespace.Log.trace(name, "onUpdate : "+bookmark.title);
		for(var i=0; i<onUpdateCallbacks.length; i++){
			onUpdateCallbacks[i](bookmark, tags);
		}
	}
	
	//	Execute on delete callbacks
	//		bookmark is a BookmarkTreeNode
	var onDelete = function(bookmark){
		namespace.Log.trace(name, "onDelete : "+bookmark.title);
		for(var i=0; i<onDeleteCallbacks.length; i++){
			onDeleteCallbacks[i](bookmark);
		}
	}
	
	/*
	 *	Private
	 */
	
	//	Constants
	var ROOT_BOOKMARK_ID 	= "0";
	var BOOKMARK_BAR_ID 	= "1";
	var OTHER_BOOKMARK_ID 	= "2";
	var MOBILE_BOOKMARK_ID 	= "3";
	
	//	Variables
	//	Keep in cache the bookmarks to retrieve the removed items
	var bookmarksCache = null;
	
	//	Get the bookmark or null
	//		callback must be a function like : callback(bookmark), where bookmark is a BookmarkTreeNode or null
	var getBookmark = function(id, callback){
		namespace.Log.trace(name, "getBookmark " + id);
		chrome.bookmarks.get(id, function(bookmarks){
			var found = false;
			
			if(chrome.runtime.lastError){
				namespace.Log.error(name, "getBookmark, "+chrome.runtime.lastError.message);
			}
			//	bookmarks is an array of BookmarkTreeNode
			else if(bookmarks){
				if(bookmarks.length > 0){
					if(bookmarks.length > 1)
						namespace.Log.debug(name, "getBookmark, "+bookmarks.length+" bookmarks found");
					var bookmark = bookmarks[0];
					if(bookmark != null){
						callback(bookmark);
						found = true;
					}else{
						namespace.Log.debug(name, "getBookmark, bookmark null");
					}
				}
			}
			if(!found){
				callback(null);
			}
		});
	}
	
	//	Check if a bookmark is a folder
	//		bookmark is a BookmarkTreeNode
	var isFolder = function(bookmark){
		return (bookmark.url == undefined);
	}
	
	// Update the bookmark with that id : update title, url and tags
	var update = function(id){
		namespace.Log.trace(name, "onUpdate " + id);
		getBookmark(id, function(bookmark){
			updateBookmark(bookmark);
		});
	}
	
	//	Update bookmark after have been moved or changed
	//		bookmark is a BookmarkTreeNode
	var updateBookmark = function(bookmark){
		if(bookmark == null){
			namespace.Log.debug(name, "updateBookmark, bookmark is not found");
			return;
		}
		namespace.Log.trace(name, "updateBookmark, bookmark");
		namespace.Log.trace(name, "\t title 	: "+bookmark.title);
		if(isFolder(bookmark)){
			namespace.Log.trace(name, "\t is a folder");
			//	when a folder is updated, that mean that the tags is updated for every children
			updateSubTree(bookmark);
		}else{
			namespace.Log.trace(name, "\t url 	: "+bookmark.url);
			raiseUpdate(bookmark);
		}
	}
	
	//	Update every children of the bookmark, call it recursively on sub folders
	//		bookmark is a BookmarkTreeNode
	var updateSubTree = function(bookmark){
		namespace.Log.trace(name, "updateSubTree of "+bookmark.id);
		chrome.bookmarks.getSubTree(bookmark.id, function(bookmarks){
			//	bookmarks is an array of BookmarkTreeNode
			for(var i=0; i<+bookmarks.length; i++){
				updateChildren(bookmarks[i]);
			}
			//	update the cache after all updates
			updateCache()
		});
	}
	
	//	Update children, required than the bookmark was load from a tree or sub tree
	//		bookmark is a BookmarkTreeNode
	var updateChildren = function(bookmark){
		namespace.Log.trace(name, "updateChildren of "+bookmark.title);
		if(!isFolder(bookmark)){
			raiseUpdate(bookmark);
		}else{
			for(var i=0; i<bookmark.children.length; i++){
				updateChildren(bookmark.children[i]);
			}
		}
	}
	
	//	Delete the bookmark and the children
	//		bookmark is a BookmarkTreeNode
	var deleteBookmark = function(bookmark){
		namespace.Log.trace(name, "deleteBookmark of "+bookmark.title);
		if(!isFolder(bookmark)){
			raiseDelete(bookmark);
		}else{
			for(var i=0; i<bookmark.children.length; i++){
				deleteBookmark(bookmark.children[i]);
			}
		}
	}
	
	//	Raise the update event
	//		bookmark is a BookmarkTreeNode
	var raiseUpdate = function(bookmark){
		namespace.Log.trace(name, "raiseUpdate of "+bookmark.title);
		getTags(bookmark, function(tags){
			onUpdate(bookmark, tags);
		});
	}
	
	//	Raise the create event
	var raiseCreate = function(bookmark){
		namespace.Log.trace(name, "raiseCreate of "+bookmark.title);
		getTags(bookmark, function(tags){
			onCreate(bookmark, tags);
			//	update cache after the create
			updateCache()
		});
		
	}
	
	//	Raise the create event
	var raiseDelete = function(bookmark){
		namespace.Log.trace(name, "raiseDelete of "+bookmark.title);
		onDelete(bookmark);		
	}
	
	//	Get tags from the bookmark, tags are user parent folders
	//		bookmark is a BookmarkTreeNode
	//		callback is function like callback(tags), where tags is an array of string
	var getTags = function(bookmark, callback){
		namespace.Log.trace(name, "getTags of "+bookmark.title);
		var tags = new Array();
		//	recursive function
		var addParentToTags = function(parentId){
			namespace.Log.trace(name, "addParentToTags : "+parentId);
			getBookmark(parentId, function(parentBookmark){
				if(parentBookmark == null){
					callback(tags);
					return;				
				}
				if(isDefaultFolder(parentBookmark)){
					callback(tags);
					return;
				}
				//	split the words in the folder title
				var splitTitle = parentBookmark.title.toLowerCase().split(/\s+/);
				for(var i=0; i<splitTitle.length; i++){
					tags.push(splitTitle[i]);
				}
				addParentToTags(parentBookmark.parentId);
			});
		}
		//	
		addParentToTags(bookmark.parentId);
	}
	
	//	Check if a bookmark is a default folder 
	//		bookmark bar
	//		other bookmark
	//		Mobile bookmark
	//		root folder
	//	bookmark is a BookmarkTreeNode
	var isDefaultFolder = function(bookmark){
		namespace.Log.trace(name, "isDefaultFolder");
		if(bookmark == null){
			namespace.Log.trace(name, "\t bookmark null");
			return false;
		}
		namespace.Log.trace(name, "\t title : "+bookmark.title);
		namespace.Log.trace(name, "\t id    : "+bookmark.id);
		switch(bookmark.id){
			case ROOT_BOOKMARK_ID:
				namespace.Log.trace(name, "\t return ROOT_BOOKMARK_ID");
				return true;
				break;
			case BOOKMARK_BAR_ID:	
				namespace.Log.trace(name, "\t return BOOKMARK_BAR_ID");
				return true;
				break;
			case OTHER_BOOKMARK_ID: 	
				namespace.Log.trace(name, "\t return OTHER_BOOKMARK_ID");
				return true;
				break;
			case MOBILE_BOOKMARK_ID: 
				namespace.Log.trace(name, "\t return MOBILE_BOOKMARK_ID");
				return true;
				break;
			default:
				namespace.Log.trace(name, "\t return false");
				return false;
		}
	}
	
	//	Update the bookmarks in cache
	//		Reload the tree
	//		callback is called after update, no args
	var updateCache = function(callback){
		namespace.Log.trace(name, "updateCache");
		chrome.bookmarks.getTree(function(bookmarks){
			bookmarksCache = bookmarks;
			if(callback){
				callback();
			}
		});
		
	}
	
	//	Retrieve a bookmark kept in cache
	var getBookmarkInCache = function(id){
		namespace.Log.trace(name, "getBookmarkInCache of id : "+id);
		var cache = bookmarksCache;
		for(var i=0; i<cache.length; i++){
			var bookmark = searchBookmarkId(id, cache[i]);
			if(bookmark != null){
				return bookmark;
			}
		}
		
		return null;
	}
	
	//	search the id in the bookmark and its children
	//		bookmark is a BookmarkTreeNode
	var searchBookmarkId = function(id, bookmark){
		namespace.Log.trace(name, "searchBookmarkId : "+id);		
		namespace.Log.trace(name, "bookmark");
		namespace.Log.trace(name, "\t id          : "+bookmark.id);
		namespace.Log.trace(name, "\t title       : "+bookmark.title);
		if(bookmark.id == id){
			namespace.Log.trace(name, "searchBookmarkId, found");
			return bookmark;
		}
		if(isFolder(bookmark)){
			for(var i=0; i<bookmark.children.length; i++){
				var subbookmark = searchBookmarkId(id, bookmark.children[i]);
				if(subbookmark != null){
					namespace.Log.trace(name, "searchBookmarkId, is sub bookmark");
					return subbookmark;
				}
			}
		}
		
		namespace.Log.trace(name, "searchBookmarkId, not found");
		
		return null;
	}	
	
	var logBookmarks = function(bookmarkArray){
		namespace.Log.debug(name, "log bookmarks");
		for(var i=0; i<bookmarkArray.length; i++){
			logBookmark(bookmarkArray[i]);
		}
	}
	
	var logBookmark = function(bookmark){
		namespace.Log.debug(name, "log bookmark");
		namespace.Log.debug(name, "\t id          : "+bookmark.id);
		namespace.Log.debug(name, "\t title       : "+bookmark.title);		
		if(isFolder(bookmark)){
			for(var i=0; i<bookmark.children.length; i++){
				logBookmark(bookmark.children[i]);
			}
		}
	}
	
	
	/*
	 *	Init
	 */ 
	updateCache();
	namespace.Log.trace(name, "loaded");
	
})(ChromeDiigoSync);