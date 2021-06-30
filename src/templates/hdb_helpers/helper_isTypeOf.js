// usage in handlebars file: {{[../hdb_helpers/helper_isTypeOf] <type> 'info'}}
module.exports = function(type, ref) {
	return type===ref
};