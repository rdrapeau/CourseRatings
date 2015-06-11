var React = require('react');
var JQuery = require('jquery');
var d3 = require('d3');
var Constants = require('../Constants');

var BarChartComponent = React.createClass({
    getBarChart : function() {
        var courses = this.props.courses;
        var compareKeys = this.props.compareKeys;
        var avgData = this.props.depAverages;

        JQuery("#" + this.props.divId).empty();


        var courseNames = [];
        function modifyData(data, keys) {
            var newData = []
            var existingData = {};
            var coursesToRatings = {};
            var coursesToCounts = {};

            // Merge averages
            for(var i = 0; i < data.length; i++) {
                var dataPoint = data[i];

                var ratings = coursesToRatings[dataPoint.course_whole_code];
                if (ratings == undefined) {
                  ratings = [];
                  for(var j = 0; j < keys.length; j++) {
                    ratings[j] = 0;
                  }
                }
                var counts = coursesToCounts[dataPoint.course_whole_code];
                if (counts == undefined) {
                  counts = [];
                  for(var j = 0; j < keys.length; j++) {
                    counts[j] = 0;
                  }
                }
                for(var j = 0; j < keys.length; j++) {
                  ratings[j] = dataPoint[keys[j]] + ratings[j];
                  counts[j]++;
                }
                coursesToRatings[dataPoint.course_whole_code] = ratings;
                coursesToCounts[dataPoint.course_whole_code] = counts;

                // To use as key
                dataPointString = JSON.stringify({"course_whole_code": dataPoint["course_whole_code"]});

                // Updated stored rating for a class
                existingData[dataPointString] = {};
            }

            // Set to previous format
            for (var attribute in existingData) {
                if( existingData.hasOwnProperty(attribute) ) {
                    var course = JSON.parse(attribute);
                    var rating = existingData[attribute];

                    var ratings = coursesToRatings[course.course_whole_code];
                    var counts = coursesToCounts[course.course_whole_code];

                    for(var i = 0; i < keys.length; i++) {
                      course[keys[i]] = parseFloat((ratings[i] / counts[i]).toFixed(2));
                    }

                    // Get department from course name
                    var courseName = course.course_whole_code;
                    var firstDigitIndex = courseName.search(/\d/);

                    var department = courseName;
                    if (firstDigitIndex >= 0) {
                        department = courseName.slice(0, firstDigitIndex);
                    }
                    course["averages"] = avgData[department];

                    newData.push(course);
                }
            }

            return newData;
        }

        function reorderData(data, keys, isAverage) {
            var ratings = {}
            for(var i = 0; i < keys.length; i++) {
              ratings[i] = {};
            }
            var arr = {}

            for(var i = 0; i < data.length; i++) {
                var dataPoint = data[i];
                var course_whole_code = dataPoint["course_whole_code"];
                courseNames.push(course_whole_code);
                for(var j = 0; j < keys.length; j++) {
                    var val = dataPoint[keys[j]];
                    if (isAverage) {
                        val = dataPoint.averages[keys[j]]
                    }
                    ratings[j][course_whole_code] = val;
                }
            }

            for(var i = 0; i < keys.length; i++) {
              arr[keys[i]] = d3.entries(ratings[i]);
            }
            arr = d3.entries(arr);

            return arr;
        }

        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = (800 - margin.left - margin.right) / 1.8,
            height = 550 - margin.top - margin.bottom;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width - 100], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");
        xAxis.tickFormat(function(d) { return Constants.KEY_TO_HEADER[d]; });

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
        yAxis.tickValues([0, 1, 2, 3, 4, 5]);
        yAxis.tickFormat(d3.format(".0f"));

        var svg = d3.select("#" + this.props.divId).append("svg")
            .attr("class", "chart")
            .attr("id", "bar-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var modifiedData = modifyData(courses, compareKeys);
        data = reorderData(modifiedData, compareKeys, false);
        dataAverage = reorderData(modifiedData, compareKeys, true);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return d.key.concat(": ").concat(d.value);
            });

        courseNames = d3.set(courseNames).values();

        x0.domain(data.map(function (d) { return d.key; }));

        x1.domain(courseNames).rangeRoundBands([0, x0.rangeBand()]);

        y.domain([0, 5]);

        // Creating Y and X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 8 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Rating");

        // Creating rectangles
        var state = svg.selectAll(".state")
            .data(data)
        .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) { return "translate(" + x0(d.key) + ",0)"; });

        state.selectAll("rect")
            .data(function (d) { return d.value; })
        .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) { 
                return x1(d.key); 
            })
            .attr("y", function (d) { 
                return y(d.value); 
            })
            .attr("height", function (d) { 
                return height - y(d.value); 
            })
            .style("fill", function (d) { 
                return color(d.key); 
            });

        if (svg.node() != null) {
            svg.append("g").call(tip);
        }

        // Creating average bars
        svg.selectAll(".avg")
            .data(dataAverage)
            .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) { 
                    return "translate(" + x0(d.key) + ",0)"; 
                })
                .selectAll("rect")
                .data(function(d) {
                    return d.value;
                })
                .enter().append("rect")
                    .attr("class", "avgbar")
                    .attr("x", function(d) { 
                        return x1(d.key); 
                    })
                    .attr("width", x1.rangeBand())
                    .attr("y", function(d) { 
                        return y(d.value); 
                    })
                    .attr("height", function(d) { 
                        return 5; 
                    })
                    .style("fill", function (d) { 
                        return "black"; 
                    })
                    .style("fill-opacity", 0.0);

        // Creating hovering
        svg.selectAll(".hover")
            .data(data)
            .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) { 
                    return "translate(" + x0(d.key) + ",0)"; 
                })
                .selectAll("rect")
                .data(function(d) {
                    return d.value;
                })
                .enter().append("rect")
                    .attr("class", "hover")
                    .attr("x", function(d) { 
                        return x1(d.key); 
                    })
                    .attr("width", x1.rangeBand())
                    .attr("y", function(d) { 
                        return y(5); 
                    })
                    .attr("height", function(d) { 
                        return height - y(5); 
                    })
                    .on('mouseover', function(d){
                        tip.show(d);
                        d3.selectAll(".avgbar").style("fill-opacity", 0.6);
                    })
                    .on('mouseout', function(d) {
                        tip.hide(d);
                        d3.selectAll(".avgbar").style("fill-opacity", 0); 
                    })
                    .style("fill-opacity", 0.0);

        // Creating the legend
        var legend = svg.selectAll(".legend")
            .data(courseNames.slice())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18 - 100 + 15)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width  - 24 + 30 - 100 + 15)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function (d) { return d; });

        var padding = courseNames.length + 1;

        if (padding > 1) {
            var legend2 = svg.selectAll(".legend2")
                .data(["Department Average"])
                .enter().append("g")
                .attr("class", "legend2")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

            legend2.append("rect")
                .attr("x", width  - 18 - 100 + 15)
                .attr("y", padding * 20)
                .attr("width", 18)
                .attr("height", 5)
                .style("fill", "black")
                .style("fill-opacity", 0.6);;

            legend2.append("text")
                .attr("x", width  - 24 + 30 - 100 + 15)
                .attr("y", 20 * padding + 6)
                .style("text-anchor", "start")
                .text(function (d) { return d; });
        }

    },

    /**
     * Render the page
     */
    render: function() {
        this.getBarChart();

        return (
            <div id={this.props.divId} className="d3-chart-body"></div>
        );
    }
});


module.exports = BarChartComponent;
