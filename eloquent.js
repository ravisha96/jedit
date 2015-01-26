/**
 * Eloquent class to make various database queries
 */
function Eloquent (field) {
	var self = this;
}

Eloquent.prototype = {

	/**
	 * [select s]
	 * @param {[array]} field properties user want to select from the jsons
	 * @return {[type]} [description]
	 */
	select: function (field) {
		self.field = field;
	},

	/**
	 * [from description]
	 * @param  {[array]} url list of url's
	 * @return {[type]}       [description]
	 */
	from: function (url) {

	}

	/**
	 * [where description]
	 * @param  {[type]} expression [description]
	 * @return {[type]}            [description]
	 */
	where: function (expression) {

	}
};