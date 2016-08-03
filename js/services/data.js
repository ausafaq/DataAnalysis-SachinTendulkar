app.factory('data', ['$http', function ($http) {
	return $http.get('/socialcops/js/data/data.json').success(function (dataload) {
			return dataload;
		})
		.error(function (err) {
			return err;
		});
}]);