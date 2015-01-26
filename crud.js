/**
 * Plugin to fetch data from your JSON files similar to DB.
 *
 * 
 * Jedit is a lightweight plugin to help you to do end-to-end testing without any backend schema. 
 * The idea is to use your JSON files as your Model with all kind of service calls. 
 * Here service call will not actually make an database query instead it will use you JSON file to fetch the data. 
 * You can simply call your four magical javascript methods and it will help you to CREATE | READ | UPDATE | DELETE aka CRUD in your JSON file.
 * Create a DB like query using this plugin, make eloquent queries.
 * The core of this plugin uses PHP Filesytem.
 *
 * @author     Ravi Kumar Sha
 * @version    0.2
 * @link       https://github.com/ravisha96/jedit
 * @since      File available since Release 0.1
 */


/**
 * CRUD CREATE | READ | UPDATE | DELETE
 * @class initialize the class to perform CRUD operation in a json file.
 * @param {string} url file url
 */
function CRUD(url) {
	'use strict';
	var self = this;
	self.url = url || '';
	self.php = null;
}

CRUD.prototype = {
	/**
	 * get all data from the JSON file
	 * @param  {object} userHasFiltered key value pair for filteration
	 * @return {object}               deferred object
	 */
	get: function(userHasFiltered) {
		'use strict';
		var self = this, post;
		post = self.ajax('get', self.url);
		_.extend(self, (userHasFiltered) ? self.search(post, userHasFiltered) : post);
		return self;
	},

	/**
	 * update there may be a requirement where existing data in a JSON file needs to be modified.
	 * 	You can update one or more field altogether. You can update values in a single table at a time.
	 *  Update will also insert new properties passed, if not exist in the matched objecy.
	 * @param  {object} updateId description
	 * @param  {boolean} strict true will explicitly update the properties that are matched, any undefiend properties will be truncated.
	 * @return {type}          description
	 */
	update: function(updateId, strict) {
		'use strict';
		var self = this, post, updateItem;
		post = self.ajax('get', self.url);

		return post.done(function (update) {
			updateItem = _.filter(JSON.parse(update), function (data) {
				var key;
				updateId = (strict) ? removeUnmatchedProperties(data, updateId.update) : updateId;
				if(data[_.first(Object.keys(updateId))] === updateId[_.first(Object.keys(updateId))]) {
					for(key in updateId.update) {
						data[key] = updateId.update[key];
					}
				}
				return data;
			});
			
			return self.overwrite(updateItem);
		});
	},

	/**
	 * removeUnmatchedProperties match the properties between two object, all unmatched properties will be truncated from the object.
	 * 	Where parent will held to match object from child, and data will be truncated from child.
	 * @return {object} filtered object
	 */
	removeUnmatchedProperties: function (child, parent) {

	},

	/**
	 * overwrite calls php filesystem internally to overwrite the JSON file.
	 * @param  {object} insertUserData data to be inserted
	 * @return {object}                deferred object
	 */
	overwrite: function(insertUserData) {
		'use strict';
		var self = this;
		return self.ajax('post', {url: self.url, data: JSON.stringify(insertUserData)});
	},

	/**
	 * insert write the object into the json file and inject and primary key with a key name `id`.
	 * @param  {object} insertUserData object that will be inserted
	 * @return {object}                deferred object
	 */
	insert: function(insertUserData) {
		'use strict';

		if (!(insertUserData)) throw new Error("method require data to insert");

		var self = this,
		insert = _.extend({id: new Date().getTime()}, insertUserData);
		
		return self.ajax('get', self.url).done(function (data) {
			var inject
			if(data){
				inject = JSON.parse(data);
				inject.push(insert);
			} else inject = [insert];
			return self.ajax('post', {url: self.url, data: JSON.stringify(inject)});
		});
	},

	/**
	 * remove a record from any JSON file.
	 * You can CHAIN REMOVE command with or without WHERE CLAUSE.
	 * @param  {object} uniqueId remove the matched object
	 * @return {object}          deferred object
	 */
	remove: function(uniqueId) {
		'use strict';
		var self = this, post;
		post = self.ajax('get', self.url);

		return post.done(function (removeItem) {
			removeItem = _.filter(JSON.parse(removeItem), function (data) {
				return data[_.first(Object.keys(uniqueId))] !== uniqueId[_.first(Object.keys(uniqueId))];
			});
			return self.insert(removeItem);
		});
	},

	removeItem: function (json, deleteUserData) {
		'use strict';
		return json.pipe(function (data) {
			return data;
		});
	},

	/**
	 * ajax jquery ajax is used to send data to a server.
	 * @param  {[type]} backendMethodCall [description]
	 * @param  {[type]} userData          [description]
	 * @return {[type]}                   [description]
	 */
	ajax: function(backendMethodCall, userData) {
		'use strict';
		self.php = (self.php) ? self.php : 'filesystem.php';
		return $.ajax({
			method: 'POST',
			url: self.php,
			data: {method: backendMethodCall, data: userData}
		});
	},

	/**
	 * [search description]
	 * @param  {[type]} json       [description]
	 * @param  {[type]} userFilter [description]
	 * @return {[type]}            [description]
	 */
	search: function (json, userFilter) {
		'use strict';
		var filteredJSONData;
		
		return json.pipe(function (data) {
			_.forEach(Object.keys(userFilter), function (keys) {
				filteredJSONData = _.filter(JSON.parse(data), function (item) {
					return item[keys] === userFilter[keys];
				});
			});

			return JSON.stringify(filteredJSONData);
		});
	},

	/**
	 * auth to log a user into your application, you may use the auth method.
	 * 	It requires a USERNAME and PASSWORD fieldname, USERNAME is not a required option, it is merely used for example. 
	 * 	You should use whatever fieldname name corresponds to a "USERNAME" in your JSON file.
	 * 	You also may add extra conditions to the authenticating query: (username: 'val', password: 'val, 'active': 1)
	 * 	Loggedin user data is stored in LocalStorage. Once a user is authenticated, 
	 * 	you may access the User model from localstorage with the key `user`.
	 * @return {[type]} [description]
	 */
	auth: function () {
		
	},

	/**
	 * select command to fetch data from JSON files. 
	 * 	You can fetch one or more fields in a single SELECT command in a comma seperated string.
	 *  You can specify star (*) in field argument.
	 *  In this case, SELECT will return all the fields.
	 * @param {array} field properties user want to select from the jsons.
	 * @return {type} [description]
	 */
	select: function (field) {
		var _self = this;
		self.field = field;

		return this;
	},

	/**
	 * from retrive data from the files.
	 * You can get data from one or more filename by passing comma separated string.
	 * @param  {string} list of file name in a comma seperated string
	 * @return {object}       retrive the object of the files.
	 */
	from: function (url) {
		return this;
	},


	/**
	 * [limit limit the number of result]
	 * @param  {number} int number of results user want
	 * @return {object}     result
	 */
	limit: function (int) {

	},

	/**
	 * where use a conditional clause called WHERE clause to filter out results. 
	 	Using WHERE clause, we can specify a selection criteria to select required records from a table.
	 	The WHERE clause works like an if condition which accepts operators [ =, !=, >, <, >=, <= ], 
	 	You can specify more than one conditions by using `AND` or `OR` operators.
	 * @param  {string} expression [description]
	 * @return {[type]}            [description]
	 */
	where: function (expression) {
		
		return this;
	},

	/**
	 * include method takes all the text/code/markup that exists in the specified file and copies it into the file that uses the include statement.
	 * 	It is possible to insert the content of one JavaScript file into another JavaScript file.
	 *  Include will produce a error and stop the script.
	 * @return {[class]} [description]
	 */
	include: function (path) {
		var filename = _.first(path.match(/\w+(?=[.])/g));
		// File already exists
		if($('#'+filename).length > 0) return;
		$('body').append(
			$('<script>').attr({
				type: 'text/javascript',
				id: filename,
				src: path
			})
		);
	},
};