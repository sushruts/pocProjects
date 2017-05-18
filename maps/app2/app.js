// create module for custom directives
var d3DemoApp = angular.module('d3DemoApp', []);

// controller business logic
d3DemoApp.service('D3ChartSizer', function D3ChartSizer() {
    return function () {
      this.setSizes = function (scope, element) {
        if (!scope.height) {
          scope.height = parseInt(element.css('height'));
        }
        if (scope.height === 'auto') {
          scope.height = '100%';
        }
        if ((typeof scope.height === 'string') && scope.height.indexOf('%') > 0) {
          scope.height = element.css('height')*(parseInt(scope.height)/100);
        }
        else {
          scope.height = parseInt(scope.height);
        }
        if (parseInt(element.css('top'))) {
          scope.height = scope.height - parseInt(element.css('top')) - 5;
        }
        if (!scope.width) {
          scope.width = parseInt(element.css('width'));
        }
        if (scope.width === 'auto') {
          scope.width = '100%';
        }
        if ((typeof scope.width === 'string') && scope.width.indexOf('%') > 0) {
          scope.width = element.css('width')*(parseInt(scope.width)/100);
        }
        else {
          scope.width = parseInt(scope.width);
        }
      };
    };
  });
d3DemoApp.controller('AppCtrl', function AppCtrl ($scope,$http, $q) {
   
    $scope.getMapData = function(){
          var deferred = $q.defer();
        $http.get('../app/d3map/countries-top.json').success(function(data){
              deferred.resolve(data)
        });
             
       return deferred.promise;  
   
    }
});