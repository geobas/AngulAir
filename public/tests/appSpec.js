describe('AngulAir', function () {

	describe('Testing Routes', function() {

  		var route, rootScope, location, httpBackend;

		beforeEach(function(){
			module('airline');

		    inject(
		    	function($route, $rootScope, $location, $httpBackend) {
			        route = $route;
			        rootScope = $rootScope;
			        location = $location;
			        httpBackend = $httpBackend;
		    	}
		    );

		});

		it('should navigate to /', function() {
			httpBackend.when('GET', 'partials/destinations.html').respond('/');

			// navigate using $apply
			rootScope.$apply(function() {
				location.path('/');
			});

			expect(route.current.templateUrl).toBe('partials/destinations.html');
			expect(route.current.controller).toBe('DestinationsCtrl');
			expect(location.path()).toBe('/');
		});

		it('should navigate to /flights', function() {
			httpBackend.when('GET', 'partials/flights.html').respond('/flights');

			// navigate using $apply
			rootScope.$apply(function() {
				location.path('/flights');
			});

			expect(route.current.templateUrl).toBe('partials/flights.html');
			expect(route.current.controller).toBe('FlightsCtrl');
			expect(location.path()).toBe('/flights');
		});		

/*		it('should navigate to /airports/ATL', function() {
			httpBackend.when('GET', 'partials/airport.html').respond('/airports/:airportCode');

			// navigate using $apply
			rootScope.$apply(function() {
				location.path('/airport/ATL');
			});

			expect(route.current.templateUrl).toBe('partials/airport.html');
			expect(route.current.controller).toBe('AirportCtrl');
			expect(location.path()).toBe('/airport/ATL');
		});		*/	

	});

	describe('Testing Filters', function() {

		var filter1, filter2;

		beforeEach(function(){
			module('airlineFilters');

		    inject(function($injector){
		    	filter1 = $injector.get('$filter')('originTitle');
		    	filter2 = $injector.get('$filter')('destinationTitle');
		    });
		});		

		it('should return airport\'s name origin', function() {
			expect(filter1({"number":112,"origin":"ATL","destination":"LAX","price":232,"originFullName":"Hartsfield Jackson Atlanta International Airport","destinationFullName":"Los Angeles International Airport"})).toEqual("ATL - Hartsfield Jackson Atlanta International Airport");
		});

		it('should return destination\'s name origin', function() {
			expect(filter2({"number":812,"origin":"ATL","destination":"JFK","price":192,"originFullName":"Hartsfield Jackson Atlanta International Airport","destinationFullName":"John F. Kennedy International Airport"})).toEqual("JFK - John F. Kennedy International Airport");
		});

	});	

	describe('Testing Services', function () {

		var Airport, httpBackend;

		beforeEach(function () {
		    module('airlineServices');

		    // $httpBackend will be a mock.
		    inject(
		    	function ($httpBackend, _Airport_, _Flights_, _Reservations_) {
			        Airport = _Airport_;
			        Flights = _Flights_;
			        Reservations = _Reservations_;
			        httpBackend = $httpBackend;
		    	}
		    );
		});

	    afterEach(function () {
	        httpBackend.verifyNoOutstandingExpectation();
	        httpBackend.verifyNoOutstandingRequest();
	    });	

	    it('should return data for a specific airport', function () {

	        var mockData = {
							  "code": "ATL",
							  "name": "Hartsfield Jackson Atlanta International Airport",
							  "city": "Atlanta",
							  "destinations": [
							    "LAX",
							    "JFK",
							    "IAH"
							  ]
							};
	 
	        httpBackend.expectGET("/airports/ATL").respond(mockData);		 
	        
	        var result = Airport.get({airportCode: 'ATL'});

	        httpBackend.flush();	         
	        expect(result.code).toEqual(mockData.code);
	        expect(result.name).toEqual(mockData.name);
	        expect(result.city).toEqual(mockData.city);
	        expect(result.destinations).toEqual(mockData.destinations);
	    });

	    it('should return data for flights', function () {

	        var mockData = [{
							    "number": 840,
							    "origin": "ORD",
							    "destination": "JFK",
							    "price": 292,
							    "originFullName": "O'Hare International Airport",
							    "destinationFullName": "John F. Kennedy International Airport"
							 },
							 {
							    "number": 321,
							    "origin": "ORD",
							    "destination": "IAH",
							    "price": 246,
							    "originFullName": "O'Hare International Airport",
							    "destinationFullName": "George Bush Intercontinental Airport"
							 }];
	 
	        httpBackend.expectGET("/flights").respond(mockData);		 
	        
	        var result = Flights.query();

	        console.log(result);

	        httpBackend.flush();	         
	        expect(result[0].number).toEqual(840);
	        expect(result[0].origin).toEqual("ORD");
	        expect(result[0].destination).toEqual("JFK");
	        expect(result[0].price).toEqual(292);
	        expect(result[0].originFullName).toEqual("O'Hare International Airport");
	        expect(result[0].destinationFullName).toEqual("John F. Kennedy International Airport");
	        expect(result.length).toBe(2);
	    });	    
		
	});

	describe('Testing Directives', function () {
		
		var rootScope, compile, element, scope;

		beforeEach(function(){
			module('airline');

		    inject(
		    	function($rootScope, $compile) {
			        rootScope = $rootScope;
			        compile = $compile;
			        element = angular.element('<input type="text" class="input-small" placeholder="Destination" ng-model="search" capitalize />');
			        scope = $rootScope.$new();
			        scope.search = "lax";
					compile(element)(scope);
		    	}
		    );

		});

		it('should transform to uppercase', function() {
			expect(element.val()).toEqual('LAX');
		});

	});

});
