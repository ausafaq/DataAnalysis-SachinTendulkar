app.controller('data_ctrl', ['$scope', '$timeout','data', function ($scope, $timeout, data) {

// ----------------------------------------------------------------

//Chart for Strike-rate and Average analysis

FusionCharts.ready(function () {
    var strike_average = new FusionCharts({
        type: 'scrollcombi2d',
        renderAt: 'chart-container',
        width: '960',
        height: '400',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "xAxisname": "Batsman",
                "yAxisName": "Performance",
                "numVisiblePlot" : "12",
                
                //Chart Styling
                "paletteColors" : "#ffe242,#1aaf5d,#f2c500",
                "baseFontColor" : "#333333",
                "baseFont" : "Helvetica Neue,Arial",
                "captionFontSize" : "14",
                "subcaptionFontSize" : "14",
                "subcaptionFontBold" : "0",
                "showBorder" : "0",
                "bgColor" : "#ffffff",
                "showShadow" : "0",
                "canvasBgColor" : "#ffffff",
                "canvasBorderAlpha" : "0",
                "showValues" : "0",
                "divlineAlpha" : "100",
                "divlineColor" : "#999999",
                "divlineThickness" : "1",
                "divLineIsDashed" : "1",
                "divLineDashLen" : "1",
                "divLineGapLen" : "1",
                "usePlotGradientColor" : "0",
                "showplotborder" : "0",
                "showXAxisLine" : "1",
                "xAxisLineThickness" : "1",
                "xAxisLineColor" : "#999999",
                "showAlternateHGridColor" : "0",
                "showAlternateVGridColor" : "0",
                "legendBgAlpha" : "0",
                "legendBorderAlpha" : "0",
                "legendShadow" : "0",
                "legendItemFontSize" : "10",
                "legendItemFontColor" : "#666666",
                "scrollheight" : "10",
                "flatScrollBars" : "1",
                "scrollShowButtons" : "0",
                "scrollColor" : "#cccccc",
                "showHoverEffect" : "1",
            },
            "categories": [
                {
                    "category": [
                        { "label": "Viv Richard" },
                        { "label": "Sachin Tendulkar" },
                        { "label": "Herchelle Gibbs" },
                        { "label": "Sourav Ganguly" },
                        { "label": "Mark Waugh" },
                        { "label": "Ricky Pointing" },
                        { "label": "Javed Miandad" },
                        { "label": "Brian Lara" }
                    ]
                }
            ],
            "dataset": [
                {
                    "seriesName": "Strike-Rate",
                    "data": [
                        { "value": "85.05" }, 
                        { "value": "88.21" }, 
                        { "value": "87.38" }, 
                        { "value": "77.50" }, 
                        { "value": "83.73" }, 
                        { "value": "81.06" }, 
                        { "value": "68.02" }, 
                        { "value": "86.26" }
                    ]
                }, 
                {
                    "seriesName": "Average",
                    "renderAs": "area",
                    "showValues": "0",
                    "data": [
                        { "value": "63.31" }, 
                        { "value": "57.93" }, 
                        { "value": "56.15" }, 
                        { "value": "55.88" }, 
                        { "value": "52.84" }, 
                        { "value": "48.03" }, 
                        { "value": "43.32" }, 
                        { "value": "42.24" }
                    ]
                }
            ]
        }
    });
    strike_average.render();
});


	//loading the data from JSON file
	data.success(function (data) {
		$scope.alldata = data;
		


		var filter_runs = function (data) {

			for (var i = 0; i < data.length; i++) {

				var a = "";
				if (isNaN(data[i].batting_score)) {

					for (var j = 0; j < data[i].batting_score.length; j++) {

						if (isNaN(data[i].batting_score[j]) == false) {
							a = a + data[i].batting_score[j];
						} else if (isNaN(data[i].batting_score[0])) {
							a = '0'
						}
					}
					data[i].batting_score = parseInt(a);

				}
			}

		}

		//Total matches played
		$scope.total_matches = function (data) {

			return data.length;
		}


		//Total runs
		$scope.total_runs = function (data) {
			var t_runs = 0;

			for (var i = 0; i < data.length; i++) {

				filter_runs(data);
				if (isNaN(data[i].batting_score) == false) {
					t_runs = t_runs + data[i].batting_score;
				}
			}

			return t_runs;
		}

		//	Total wickets
		$scope.total_wickets = function (data) {
			var t_wick = 0;
			for (var i = 0; i < data.length; i++) {
				if (isNaN(data[i].wickets) == false) {
					t_wick = t_wick + data[i].wickets;
				}

			}

			return t_wick;
		}

		// Total wins
		$scope.total_wins = function (data) {
			var t_wins = 0;
			for (var i = 0; i < data.length; i++) {
				if (data[i].match_result == "won") {
					t_wins++;
				}
			}

			return t_wins;
		}

		// Calculate Centuries
		$scope.centuries = function (data) {
			var t_cen = 0;
			filter_runs(data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].batting_score >= 100) {
					t_cen++;
				}
			}

			return t_cen;
		}








//		count number of matches
		$scope.count_matches = function (data, country) {
			var c = 0;
			for (i in data) {
				if (data[i].opposition == country)
					c++;

			}
			return c;
		}

		//	making run made against a particular team
		var versus = function (data, country) {
			var sum = 0;
			filter_runs(data);
			for (var i = 0; i < data.length; i++) {
				filter_runs(data);
				if (isNaN(data[i].batting_score) == false && data[i].opposition == country) {
					sum = sum + data[i].batting_score;

				}
			}
			return sum;
		}




		//function to find a run against a corresponding team and to store it to new data
		$scope.data_c = [];
		var a = [];

		var prev_team = '0';
		
		for (var i in $scope.alldata) {
			
			var flag = 0;
			for (var j = 0; j <= a.length; j++) {
				if (a[j] == $scope.alldata[i].opposition) {
					flag = 1;
					break;
				}
			}

			if (flag == 0) {
				a[j] = $scope.alldata[i].opposition;
				$scope.data_c.push({
					"batting_score": versus($scope.alldata, $scope.alldata[i].opposition),
					"opposition": $scope.alldata[i].opposition.slice(2)

				});
				
			}
		}
	


	// ----------------------------------------------------------------

	// chart 1

		// data-genearted as data_c here

		$scope.$watch("data_c", function (newvalue, oldvalue) {

			$timeout(function () {
				$scope.margin = {
						top: 20,
						right: 30,
						bottom: 30,
						left: 60
					},
					$scope.width = 960 - $scope.margin.left - $scope.margin.right,
					$scope.height = 500 - $scope.margin.top - $scope.margin.bottom;

				// scale to ordinal because x axis is not numerical
				$scope.x = d3.scale.ordinal().rangeRoundBands([0, $scope.width], .2);

				//scale to numerical value by height
				$scope.y = d3.scale.linear().range([$scope.height, 10]);

				$scope.chart = d3.select("#chart")
					.append("svg") //append svg element inside #chart
					.attr("width", $scope.width + (2 * $scope.margin.left) + $scope.margin.right) //set width
					.attr("height", $scope.height + $scope.margin.top + $scope.margin.bottom); //set height
				$scope.xAxis = d3.svg.axis()
					.scale($scope.x)
					.orient("bottom"); //orient bottom because x-axis will appear below the bars

				$scope.yAxis = d3.svg.axis()
					.scale($scope.y)
					.orient("left");


				$scope.x.domain($scope.data_c.map(function (d) {
					return d.opposition
				}));
				$scope.y.domain([0, d3.max($scope.data_c, function (d) {
					return d.batting_score
				})]);

				$scope.bar = $scope.chart.selectAll("g")
					.data($scope.data_c)
					.enter()
					.append("g")
					.attr("transform", function (d, i) {
						return "translate(" + $scope.x(d.opposition) + ", 0)";
					});

				$scope.bar.append("rect")
					.attr("y", function (d) {

						return $scope.y(d.batting_score);
					})
					.attr("x", function (d, i) {
						return $scope.x.rangeBand() + ($scope.margin.left / 4);
					})
					.attr("height", function (d) {
						return $scope.height - $scope.y(d.batting_score);
					})
					.attr("width", $scope.x.rangeBand()); //set width base on range on ordinal data

				$scope.bar.append("text")
					.attr("x", $scope.x.rangeBand() + $scope.margin.left - 12)
					.attr("y", function (d) {
						return $scope.y(d.batting_score) - 10;
					})
					.attr("dy", ".75em")
					.text(function (d) {
						return d.batting_score;
					});

				$scope.chart.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(" + $scope.margin.left + "," + $scope.height + ")")
					.call($scope.xAxis);

				$scope.chart.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + $scope.margin.left + ",0)")
					.call($scope.yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", -55)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Runs Scored");
			}, 0);
		});
	// ------------------------------------------

	})

}]);