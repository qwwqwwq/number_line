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
            number = Math.round(number*100);
            if( number < 0 ) {
                sign = "-";
                number = number * -1;
            } else if (number >= 0) {
                sign = "";
            }
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
            vals: {
                units: 0,
                tenths: 0,
                hundredths: 0,
                sign: ""
            },
            number: 0
        };

        $scope.change = function(amount) {
            $scope.number_line.number += amount;
            $scope.number_line.vals = decimalToVals($scope.number_line.number);
            console.log($scope.number_line);
        }
    }
]);

App.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
                  templateUrl: 'app/views/number_line.html',
                  controller: 'NumberLineController'
              });
}]);

