/**
 * [CRUD description]
 */
function CRUD(url) {
	'use strict';
	var self = this;
	self.url = url;
	self.php = null;
}

CRUD.prototype = {
	get: function(userHasFiltered) {
		'use strict';
		var self = this, post;
		post = self.ajax('get', self.url);
		return (userHasFiltered) ? self.search(post, userHasFiltered) : post;
	},

	update: function(updateId) {
		'use strict';
		var self = this, post, updateItem;
		post = self.ajax('get', self.url);

		return post.done(function (update) {
			updateItem = _.filter(JSON.parse(update), function (data) {
				var key;
				if(data[_.first(Object.keys(updateId))] === updateId[_.first(Object.keys(updateId))]) {
					for(key in updateId.update) {
						data[key] = updateId.update[key];
					}
				}
				return data;
			});
			
			return self.post(updateItem);
		});
	},

	post: function(insertUserData) {
		'use strict';
		var self = this;
		return self.ajax('post', {url: self.url, data: JSON.stringify(insertUserData)});
	},

	insert: function(insertUserData) {
		'use strict';

		if (!(insertUserData)) throw new Error("method require data to insert");

		var self = this,
		insert = {
			id: new Date().getTime()
		};

		_.extend(insert, insertUserData);
		
		return self.ajax('get', self.url).done(function (data) {
			var inject
			if(data){
				inject = JSON.parse(data);
				inject.push(insert);
			} else inject = [insert];
			return self.ajax('post', {url: self.url, data: JSON.stringify(inject)});
		});
	},

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

	ajax: function(backendMethodCall, userData) {
		'use strict';
		self.php = (self.php) ? self.php : 'filesystem.php';
		return $.ajax({
			method: 'POST',
			url: self.php,
			data: {method: backendMethodCall, data: userData}
		});
	},

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
	 * [auth user authentication]
	 * @return {[type]} [description]
	 */
	auth: function () {
		
	}
};