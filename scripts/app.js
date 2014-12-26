'use strict';

angular.module('d3', []);
angular.module('d3Directives', ['d3']);

var App = angular.module('App', ['d3Directives', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
    }]);

App.controller('NumberLineController', ['$scope',
    function($scope) {
        function decimalToVals(number) {
            var units, tenths, hundredths, sign;
            if( number <= 0 ) {
                sign = -1;
            } else if (number > 0) {
                sign = 1;
            }
            number = number*100;
            hundredths = Math.round((number % 10));
            number = Math.round((number - hundredths)/10);
            tenths = Math.round((number % 10));
            number = Math.round((number - tenths)/10);
            units = Math.round(number);
            return {units: units,
                    tenths: tenths,
                    hundredths: hundredths,
                    sign: sign}
        }

        $scope.number_line = {
            units: 0,
            tenths: 0,
            hundredths: 0
        };
        $scope.number = 0;

        $scope.change = function(amount) {
            $scope.number += amount;
            $scope.number_line = decimalToVals($scope.number);
            console.log($scope.number_line);
        }
    }
]);

App.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
                  templateUrl: 'views/number_line.html',
                  controller: 'NumberLineController'
              });
}]);

