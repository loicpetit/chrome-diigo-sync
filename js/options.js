/**
 *	Manage Diigo bookmarks sync options
 *
 *	Require :
 *		-	CryptoJS/aes.js	to encrypt/decrypt
 *		-	jQuery
 *		-	init.js 		to instantiate the namespace
 *		-	log.js  		to have the Log module
 *		-	keywords.js  	to manage keywords for the white list, black list
 */
(function (namespace) {
	/*
	 *	Module
	 */
	var name = "Options";
	var module = namespace.Util.getModule(name);
	namespace.Log.trace(name, "init");
	 
	/*
	 *	Public
	 */
	 
	module.setupOptionsPage = function(){
		addDOMLoadedListener();
		addOnSaveListener();
	}
	
	//	Get the extension options
	//		callback must be like callback(data) where data = {login, ref, pwd, syncDelete}
	module.getOptions = function(callback){
		chrome.storage.sync.get(
		defaultoptions,
		function(data){
			data.ref = decrypt(data.ref);
			data.pwd = decrypt(data.pwd);
			//		if the key hasn't change, the refphrase is equal to the decrypted ref
			//		else reset the pwd field
			if(data.ref != refphrase){
				data.pwd = "";
			}			
			callback(data);
		});
	}
	
	/*
	 *	Constants
	 */
	//	Encrypt ref, used to know if the key has changed
	var refphrase = "The ref phrase is decrypted";
	 
	
	//	IDs
	var loginID = "login";
	var pwdID = "pwd";
	var pwdEncryptedID = "pwdEncrypted";
	var syncDeleteID = "syncdelete";
	var whitelistInputId = "whitelist-input";
	var whitelistKeywordsId = "whitelist-keywords";
	var blacklistInputId = "blacklist-input";
	var blacklistKeywordsId = "blacklist-keywords";
	var addtagsId = "addtags";
	var setpublicId = "public";
	var notifyAddUpdateId = "notify-add-update";
	var notifyDelete = "notify-delete";
	var msgID = "info";
	var errorID = "error";
	var saveID = "save";
	
	//	Default values
	var defaultoptions = {
		login: 				"",
		pwd:				"",
		ref:				"",
		whitelist:			[],
		blacklist:			[],
		addtags:			true,
		setpublic:			true,
		notifyAddUpdate:	false,
		notifyDelete:		true
	}
	
	/*
	 *	Getters - Setters
	 */
	 
	//	get the login in the input field
	var getLogin = function(){
		return document.getElementById(loginID).value;
	}
	
	//	set the login in the input field
	var setLogin = function(value){
		document.getElementById(loginID).value = value;
	}
	
	//	Display a msg
	var setMsg = function(msg){
		document.getElementById(msgID).innerHTML = msg;
	}
	
	//	Display an error msg
	var setErrorMsg = function(msg){
		document.getElementById(errorID).innerHTML = msg;
	}
	
	//	get the pwd in the input field
	var getPwd = function(){
		return document.getElementById(pwdID).value;
	}
	
	//	set the pwd in the input field
	var setPwd = function(value){
		document.getElementById(pwdID).value = value;
	}
	
	//	Get extension ID
	var getExtensionID = function(){
		return chrome.runtime.id;
	}
	
	//	Get the passphrase to encrypt and decrypt
	var getPassPhrase = function(){
		return getExtensionID();
	}
	
	//	Get Sync delete
	var getSyncDelete = function(){
		return document.getElementById(syncDeleteID).checked;		
	}
	
	//	set Sync delete
	//		value: Boolean
	var setSyncDelete = function(value){
		document.getElementById(syncDeleteID).checked = value;
	}
	
	//	Get the white list
	var getWhitelist = function(){
		var $list = $("#"+whitelistKeywordsId);
		return namespace.Keywords.getKeywords($list);
	}
	
	//	Set the white list
	//		keywords : array
	var setWhitelist = function(keywords){
		var $input = $("#"+whitelistInputId);
		namespace.Keywords.addKeywords($input, keywords, true);
	}
	
	//	Get the black list
	var getBlacklist = function(){
		var $list = $("#"+blacklistKeywordsId);
		return namespace.Keywords.getKeywords($list);
	}
	
	//	Set the black list
	//		keywords : array
	var setBlacklist = function(keywords){
		var $input = $("#"+blacklistInputId);
		namespace.Keywords.addKeywords($input, keywords, true);
	}
	
	//	Get add tags
	var getAddTags = function(){
		return document.getElementById(addtagsId).checked;		
	}
	
	//	Set add tags
	//		value: Boolean
	var setAddTags = function(value){
		document.getElementById(addtagsId).checked = value;
	}
	
	//	Get public
	var getPublic = function(){
		return document.getElementById(setpublicId).checked;		
	}
	
	//	Set public
	//		value: Boolean
	var setPublic = function(value){
		document.getElementById(setpublicId).checked = value;
	}
	
	//	Get notify add update
	var getNotifyAddUpdate = function(){
		return document.getElementById(notifyAddUpdateId).checked;		
	}
	
	//	Set notify add update
	//		value: Boolean
	var setNotifyAddUpdate = function(value){
		document.getElementById(notifyAddUpdateId).checked = value;
	}
	
	//	Get notify delete
	var getNotifyDelete = function(){
		return document.getElementById(notifyDelete).checked;		
	}
	
	//	Set notify delete
	//		value: Boolean
	var setNotifyDelete = function(value){
		document.getElementById(notifyDelete).checked = value;
	}
	
	/*
	 * Methods
	 */
	
	//	save fields value
	var save = function(){	
		namespace.Log.trace(name, "save");
		var login = getLogin().trim();
		var key = getPassPhrase();
		var ref = encrypt(refphrase);
		var pwd = getPwd().trim();
		var encryptedPwd = encrypt(pwd);
		var syncDelete = getSyncDelete();
		var whitelist = getWhitelist();
		var blacklist = getBlacklist();
		var addtags = getAddTags();
		var setpublic = getPublic();
		var notifyAddUpdate = getNotifyAddUpdate();
		var notifyDelete = getNotifyDelete();
		namespace.Log.trace(name, "\t login 			: "+login);
		namespace.Log.trace(name, "\t pwd 				: "+pwd);
		namespace.Log.trace(name, "\t encryptedPwd 		: "+encryptedPwd);
		namespace.Log.trace(name, "\t refphrase 		: "+refphrase);
		namespace.Log.trace(name, "\t sync delte		: "+syncDelete);
		namespace.Log.trace(name, "\t white list		: "+whitelist);
		namespace.Log.trace(name, "\t black list		: "+blacklist);
		namespace.Log.trace(name, "\t add tags			: "+addtags);
		namespace.Log.trace(name, "\t set public		: "+setpublic);
		namespace.Log.trace(name, "\t notify add update	: "+notifyAddUpdate);
		namespace.Log.trace(name, "\t notify delete		: "+notifyDelete);
		chrome.storage.sync.set({
			login: 				login,
			ref: 				ref,
			pwd:				encryptedPwd,
			syncDelete:			syncDelete,
			whitelist:			whitelist,
			blacklist:			blacklist,
			addtags:			addtags,
			setpublic:			setpublic,
			notifyAddUpdate:	notifyAddUpdate,
			notifyDelete:		notifyDelete			
		}, function(){
			setMsg("Saved at "+(new Date()).toLocaleTimeString());
		});
	}
	
	//	Remove messages
	var resetMsg = function(){
		setMsg("");
		setErrorMsg("");
	}
	
	//	check value of field and display an error if not valid
	var checkFields = function(){
		var errorMsg = "";
		if(isEmpty(getLogin()))
			errorMsg += "The login is empty<br/>";			
		if(isEmpty(getPwd()))
			errorMsg += "The password is empty<br/>";
		setErrorMsg(errorMsg);
		
		return errorMsg == "";
	}
	
	
	//	test if a variable has a value
	var isEmpty = function(value){
		if(value == undefined)
			return true;
		if(value == null)
			return true;
		if(value == "")
			return true;
			
		return false;
	}
	
	/**
	 *	Decrypt a value
	 */
	var decrypt = function(value){
		return CryptoJS.AES.decrypt(value, getPassPhrase()).toString(CryptoJS.enc.Utf8);
	}
	
	/**
	 *	Encrypt a value
	 */
	var encrypt = function(value){
		return CryptoJS.AES.encrypt(value, getPassPhrase()).toString();
	}
	
	/**
	 *	Send message when options are updated
	 */
	var onUpdate = function(){
		namespace.Log.trace(name, "onUpdate");
		module.getOptions(function(data){
			data.from 	= name;
			data.action = "update";
			chrome.runtime.sendMessage(data);
		});
	}
	
	/**
	 *	Set all option fields
	 */
	var setAllFields = function(data){
		setLogin(data.login);
		setPwd(data.pwd);
		setSyncDelete(data.syncDelete);
		setWhitelist(data.whitelist);
		setBlacklist(data.blacklist);	
		setAddTags(data.addtags);
		setPublic(data.setpublic);
		setNotifyAddUpdate(data.notifyAddUpdate);
		setNotifyDelete(data.notifyDelete);
	}
	
	
	/*
	 * Listeners
	 */
	//		load options after load
	var addDOMLoadedListener = function(){
		document.addEventListener('DOMContentLoaded', function(){
			namespace.Log.trace(name, "Content loaded");
			module.getOptions( function(data){
				namespace.Log.trace(name, "\t name 				: "+data.login);
				namespace.Log.trace(name, "\t pwd 				: "+data.pwd);
				namespace.Log.trace(name, "\t ref 				: "+data.ref);	
				namespace.Log.trace(name, "\t sync delete		: "+data.syncDelete);
				namespace.Log.trace(name, "\t white list		: "+data.whitelist);
				namespace.Log.trace(name, "\t black list		: "+data.blacklist);
				namespace.Log.trace(name, "\t add tags			: "+data.addtags);
				namespace.Log.trace(name, "\t set public		: "+data.setpublic);
				namespace.Log.trace(name, "\t notify add update	: "+data.notifyAddUpdate);
				namespace.Log.trace(name, "\t notify delete		: "+data.notifyDelete);
				//	Set fields
				setAllFields(data);
				//	check fields
				checkFields();
			});
		});
	}
	
	//		save options on click
	var addOnSaveListener = function(){
		document.getElementById(saveID).addEventListener('click', function(){
			namespace.Log.trace(name, "On save");
			resetMsg();
			save();		
			if(checkFields()){
				onUpdate();
			}
			return false;
		});
	}
	
	namespace.Log.trace(name, "loaded");
})(ChromeDiigoSync);