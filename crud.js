/**
 * [CRUD description]
 */
function CRUD(url) {
	'use strict';
	var self = this;
	self.url = url;
}

CRUD.prototype.get = function(userHasFiltered) {
	'use strict';
	var self = this, post;
	post = self.ajax('get', self.url);
	return (userHasFiltered) ? self.search(post, userHasFiltered) : post;
};

CRUD.prototype.update = function(updateId) {
	'use strict';
	var self = this, post, updateItem;
	post = self.ajax('get', self.url);

	post.done(function (update) {
		updateItem = _.filter(JSON.parse(update), function (data) {
			var key;
			if(data.id === updateId.id) {
				for(key in updateId.update) {
					data[key] = updateId.update[key];
				}
			}
			return data;
		});
		
		self.post(updateItem);
	});
};

CRUD.prototype.post = function(insertUserData) {
	'use strict';
	var self = this;
	return self.ajax('post', {url: self.url, data: JSON.stringify(insertUserData)});
};

CRUD.prototype.remove = function(uniqueId) {
	'use strict';
	var self = this, post;
	post = self.ajax('get', self.url);

	post.done(function (removeItem) {
		removeItem = _.filter(JSON.parse(removeItem), function (data) {
			return data.id !== uniqueId.id;
		});
		self.post(removeItem);
	});
};


/**
 * HELPER METHODS
 */
CRUD.prototype.removeItem = function (json, deleteUserData) {
	'use strict';
	return json.pipe(function (data) {
		return data;
	});
};

CRUD.prototype.unique = function () {
	'use strict';
	return Math.random(1).toString().split('.')[1];
};

CRUD.prototype.ajax = function(backendMethodCall, userData) {
	'use strict';
	return $.ajax({
		method: 'POST',
		url: 'filesystem.php',
		data: {method: backendMethodCall, data: userData}
	});
};

CRUD.prototype.search = function (json, userFilter) {
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
	
};