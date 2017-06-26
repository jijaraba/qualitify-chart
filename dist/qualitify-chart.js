/**
 * qualitify-cahrt - https://github.com/jijaraba/qualitify-chart
 * Copyright (c) 2017 José Jaraba
 * Dual licensed with the Apache-2.0 or MIT license.
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['angular', 'chart.js'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'), require('chart.js'));
  } else {
    root.qualitifyChart = factory(root.angular, root.Chart);
  }
}(this, function(angular, Chart) {

QualitifyChart.$inject = ["QualitifyChartFactory"];
QualitifyChartLine.$inject = ["QualitifyChartFactory"];
QualitifyChartBar.$inject = ["QualitifyChartFactory"];
QualitifyChartHorizontalBar.$inject = ["QualitifyChartFactory"];
QualitifyChartRadar.$inject = ["QualitifyChartFactory"];
QualitifyChartPolararea.$inject = ["QualitifyChartFactory"];
QualitifyChartPie.$inject = ["QualitifyChartFactory"];
QualitifyChartDoughnut.$inject = ["QualitifyChartFactory"];
QualitifyChartBubble.$inject = ["QualitifyChartFactory"];angular
  .module('qualitify.chart', [])
  .directive('qualitifyChart', QualitifyChart)
  .directive('qualitifyChartLine', QualitifyChartLine)
  .directive('qualitifyChartBar', QualitifyChartBar)
  .directive('qualitifyChartHorizontalbar', QualitifyChartHorizontalBar)
  .directive('qualitifyChartRadar', QualitifyChartRadar)
  .directive('qualitifyChartPolararea', QualitifyChartPolararea)
  .directive('qualitifyChartPie', QualitifyChartPie)
  .directive('qualitifyChartDoughnut', QualitifyChartDoughnut)
  .directive('qualitifyChartBubble', QualitifyChartBubble)
  .directive('qualitifyChartLegend', QualitifyChartLegend)
  .factory('QualitifyChartFactory', QualitifyChartFactory);

function QualitifyChart(QualitifyChartFactory) {
  return new QualitifyChartFactory();
}

function QualitifyChartLine(QualitifyChartFactory) {
  return new QualitifyChartFactory('line');
}

function QualitifyChartBar(QualitifyChartFactory) {
  return new QualitifyChartFactory('bar');
}

function QualitifyChartHorizontalBar(QualitifyChartFactory) {
  return new QualitifyChartFactory('horizontalbar');
}

function QualitifyChartRadar(QualitifyChartFactory) {
  return new QualitifyChartFactory('radar');
}

function QualitifyChartPolararea(QualitifyChartFactory) {
  return new QualitifyChartFactory('polararea');
}

function QualitifyChartPie(QualitifyChartFactory) {
  return new QualitifyChartFactory('pie');
}

function QualitifyChartDoughnut(QualitifyChartFactory) {
  return new QualitifyChartFactory('doughnut');
}

function QualitifyChartBubble(QualitifyChartFactory) {
  return new QualitifyChartFactory('bubble');
}

function QualitifyChartFactory() {

  return function (chartType) {

    return {
      restrict: 'A',
      scope: {
        data: '=chartData',
        options: '=chartOptions',
        type: '@chartType',
        legend: '=?chartLegend',
        chart: '=?chart',
        click: '&chartClick'
      },
      link: link
    };

    function link($scope, $elem, $attrs) {
      var ctx = $elem[0].getContext('2d');
      var chartObj;
      var showLegend = false;
      var autoLegend = false;
      var exposeChart = false;
      var legendElem = null;

      for (var attr in $attrs) {
        if (attr === 'chartLegend') {
          showLegend = true;
        } else if (attr === 'chart') {
          exposeChart = true;
        } else if (attr === 'autoLegend') {
          autoLegend = true;
        }
      }

      $scope.$on('$destroy', function() {
        if (chartObj && typeof chartObj.destroy === 'function') {
          chartObj.destroy();
        }
      });

      if ($scope.click) {
        $elem[0].onclick = function(evt) {
          var out = {
            chartEvent: evt,
            element: chartObj.getElementAtEvent(evt),
            elements: chartObj.getElementsAtEvent(evt),
            dataset: chartObj.getDatasetAtEvent(evt)
          };

          $scope.click({event: out});
        };
      }

      $scope.$watch('[data, options]', function (value) {
        if (value && $scope.data) {
          if (chartObj && typeof chartObj.destroy === 'function') {
            chartObj.destroy();
          }

          var type = chartType || $scope.type;
          if (!type) {
            throw 'Error creating chart: Chart type required.';
          }
          type = cleanChartName(type);

          chartObj = new Chart(ctx, {
            type: type,
            data: angular.copy($scope.data),
            options: $scope.options
          });
          
          if (showLegend) {
            $scope.legend = chartObj.generateLegend();
          }

          if (autoLegend) {
            if (legendElem) {
              legendElem.remove();
            }
            angular.element($elem[0]).after(chartObj.generateLegend());
            legendElem = angular.element($elem[0] ).next();
          }

          if (exposeChart) {
            $scope.chart = chartObj;
          }
          chartObj.resize();
        }
      }, true);
    }

    function cleanChartName(type) {
      var typeLowerCase = type.toLowerCase();
      switch (typeLowerCase) {
        case 'polararea':
          return 'polarArea';
        case 'horizontalbar':
          return 'horizontalBar';
        default:
          return type;
      }
    }

  };
}

function QualitifyChartLegend() {
  return {
    restrict: 'A',
    scope: {
      legend: '=?chartLegend'
    },
    link: link
  };

  function link($scope, $elem) {
    $scope.$watch('legend', function (value) {
      if (value) {
        $elem.html(value);
      }
    }, true);
  }
}

return QualitifyChartFactory;
}));
