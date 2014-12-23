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
        function valsToDecimal(values) {
            var intRep = Math.round(valsToFloat(values)*100);
            return intRep%1000 + '.' + intRep%100 + intRep%10;
        }

        $scope.number_line = {
            units: 0,
            tenths: 0,
            hundredths: 0
        };
        $scope.number = valsToDecimal($scope.number_line);

        $scope.change = function(unit, direction) {
            if (direction == '+') {
                $scope.number_line[unit] = $scope.number_line[unit] + 1;
            } else if (direction == '-') {
                $scope.number_line[unit] = $scope.number_line[unit] - 1;
            }
            $scope.number = valsToFloat($scope.number_line);
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

