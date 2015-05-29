angular.module('airline', ['ngRoute', 'airlineServices', 'airlineFilters'])
	.config(airlineRouter)
	.controller('AppCtrl', function($scope) {
	  	$scope.setActive = function (type) {
		    $scope.destinationsActive = '';
		    $scope.flightsActive = '';
		    $scope.reservationsActive = '';

		    $scope[type + 'Active'] = 'active';
  		}	
	})
	.controller('DestinationsCtrl', function($scope, Airport) {
	 	$scope.setActive('destinations');

		$scope.sidebarURL = 'partials/airport.html';
		$scope.currentAirport = null;

		$scope.setAirport = function(code) {
			$scope.currentAirport = Airport.get({airportCode: code});
		};

		$scope.airports = Airport.query();
	})
	.controller('FlightsCtrl', function($scope, Flights) {
		$scope.setActive('flights');
		$scope.flights = Flights.query();		
		
		$scope.filteredFlights = [];
		$scope.filteredFlights.length = 1;
	})
	.controller('ReservationsCtrl', function($scope, Reservations, Flights) {
		$scope.setActive('reservations');

		$scope.noresults = false;

		$scope.reservations = Reservations.query();
		$scope.flights = Flights.query();

		if ( $scope.flights == {} )
			$scope.noresults = true;

		$scope.reserveFlight = function() {
			if ( $scope.reserve && $scope.reserve.origin && $scope.reserve.destination ) {
				Reservations.save($scope.reserve, function (data) {
					$scope.reserve.origin = '';
					$scope.reserve.destination = '';

					$scope.reservations.push(data);
				});
			}
		}	
	})
	.controller('AirportCtrl', function($scope, $routeParams, Airport) {
		$scope.currentAirport = Airport.get({
			airportCode: $routeParams.airportCode
		});
	})
	.directive('capitalize', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, modelCtrl) {
				var capitalize = function(inputValue) {
					if (inputValue == undefined) inputValue = '';
					var capitalized = inputValue.toUpperCase();
					if (capitalized !== inputValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}         
					return capitalized;
				}
				modelCtrl.$parsers.push(capitalize);
				capitalize(scope[attrs.ngModel]);  // capitalize initial value
			}
		};
	});


function airlineRouter ($routeProvider, $locationProvider) {

	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});

	$routeProvider
		.when('/', {
			templateUrl: 'partials/destinations.html',
			controller: 'DestinationsCtrl'
		})
		.when('/airports/:airportCode', {
			templateUrl: 'partials/airport.html',
			controller: 'AirportCtrl'
		})
		.when('/flights', {
			templateUrl: 'partials/flights.html',
			controller: 'FlightsCtrl'
		})
		.when('/reservations', {
			templateUrl: 'partials/reservations.html',
			// template: '<h1>Hello world!</h1>',
			controller: 'ReservationsCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}

angular.module('airlineFilters', [])
	.filter('originTitle', function () {
		return function (input) {
			return input.origin + ' - ' + input.originFullName;
		};
	})
	.filter('destinationTitle', function () {
		return function (input) {
			return input.destination + ' - ' + input.destinationFullName;
		};
	});