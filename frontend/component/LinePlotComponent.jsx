var React = require('react');
var JQuery = require('jquery');
var d3 = require('d3');
var Constants = require('../Constants');

/**
 * Encapsulates the course detail screen
 */
var LinePlotComponent = React.createClass({

    getTimeSeries : function() {
        /* TODO Vi + Emily
        1) have the values on the x axis be spaced out better
        2) Display only top X professors/courses

        Notes:
        1) The css for the d3 stuff is in fp-vjampala-emilygu-drapeau/frontend/static/css/time-series.css .
        2) The main index.html file is in fp-vjampala-emilygu-drapeau/frontend/static/index.html .
        You probably won't need to edit it.
        3) The json Ryan created uses "datetime" instead of time.
        */

        JQuery("#" + this.props.divId).empty();
        if (this.props.current_courses.length === 0) {
            return;
        }

        var minTime = Number.MAX_VALUE;

        function modifyData(data, key) {
            var newData = [];
            var existingData = {};
            var countDict = {};

            // Merge averages
            for(var i = 0; i < data.length; i++) {
                var dataPoint = data[i];
                var rating = dataPoint.the_course_as_a_whole;
                var prevCount = 0;

                // Keep track of min time
                if (dataPoint["datetime"] < minTime) {
                    minTime = dataPoint["datetime"];
                }

                // To use as key
                dataPointString = JSON.stringify({"datetime": dataPoint["datetime"], 
                                                  "name": dataPoint[key], 
                                                  "course_whole_code": dataPoint["course_whole_code"]});

                // Rating already exists.  So keep track that this is a duplicate
                if (dataPointString in existingData) {
                    var prevRating = existingData[dataPointString];
                    rating = prevRating["sum"] + rating;
                    prevCount = prevRating["count"];
                } else {
                    // Update number of quarters a professor has taught
                    var prevGroupCount = 0;
                    var countKey = dataPoint.professor;
                    if (key == "course_whole_code") {
                        countKey = dataPoint.course_whole_code;
                    }
                    if (countKey in countDict) {
                        prevGroupCount = countDict[countKey];
                    }
                    countDict[countKey] = prevGroupCount + 1;
                }

                // Updated stored rating for a class
                existingData[dataPointString] = {"sum": rating, "count": prevCount + 1};
            }

            // Pick top 5 professors who have taught the most
            var top5 = {};
            var minCount = Number.MAX_VALUE;
            var minKey = null;

            for (var countKey in countDict) {
                if (Object.keys(top5).length < 5) {
                    top5[countKey] = countDict[countKey];
                    if (minCount > countDict[countKey]) {
                        minCount = countDict[countKey];
                        minKey = countKey;
                    }
                } else {
                    if (minCount < countDict[countKey]) {
                        top5[countKey] = countDict[countKey];
                        delete top5[minKey];
                        minCount = countDict[countKey];
                        minKey = countKey;
                    } 
                }
            }

            // Set to previous format and add incrementing ticks
            minTime = Math.floor(minTime / 10) * 10;
            for (var attribute in existingData) {
                if( existingData.hasOwnProperty(attribute) ) {
                    var course = JSON.parse(attribute);
                    var keyName = "name";
                    if (key == "course_whole_code") {
                        keyName = "course_whole_code";
                    } 
                    if (course[keyName] in top5) {
                        var rating = existingData[attribute];
                        course["the_course_as_a_whole"] = parseFloat((rating["sum"] / rating["count"]).toFixed(2));
                        newData.push(course);
                    }
                }
            }

            return newData;
        }

        var incrementedTime = function(time) {
            var newTime = time - minTime;
            return newTime - (Math.floor(newTime / 10) * 6);
        }

        var data = d3.nest()
            .key(function(d) {
                return d.name;
            })
            .entries(modifyData(this.props.current_courses, this.props.detailKey));

        var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width - 100]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                 return x(incrementedTime(d.datetime));
            })
            .y(function (d) {
            return y(d.the_course_as_a_whole);
        });

        var svg = d3.select("#" + this.props.divId).append("svg")
            .attr("class", "plot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // TODO: USES OUTSIDE CODE ------------- DON"T FORGET TO CITE
        // Used for hovering to get rating of professor/course code
        var detailKey = this.props.detailKey;
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return d.name.concat(": ").concat(d.the_course_as_a_whole);
            })

        svg.call(tip);

        color.domain(data.map(function (d) { return d.key; }));

        var timeValues = [];
        data.forEach(function (kv) {
            kv.values.forEach(function (d) {
                timeValues.push(incrementedTime(d.datetime));
            });
        });

        var cities = data;

        var minX = d3.min(data, function (kv) { return d3.min(kv.values, function (d) { return incrementedTime(d.datetime); }) });
        var maxX = d3.max(data, function (kv) { return d3.max(kv.values, function (d) { return incrementedTime(d.datetime); }) });
        var minY = d3.min(data, function (kv) { return d3.min(kv.values, function (d) { return d.the_course_as_a_whole; }) });
        var maxY = d3.max(data, function (kv) { return d3.max(kv.values, function (d) { return d.the_course_as_a_whole; }) });

        // Set axis ranges
        x.domain([minX - 0.5, maxX]);
        y.domain([0, 5]);

        function getPrettyTime(time) {
            time = (Math.floor(time / 4) * 10) + (time % 4) + minTime;
            var sTime = time.toString();
            var quarterNum = sTime.substr(sTime.length - 1);

            var quarterStr = "str";
            if (quarterNum === "0") {
                quarterStr = "Wi";
            } else if (quarterNum === "1") {
                quarterStr = "Sp";
            } else if (quarterNum === "2") {
                quarterStr = "Su";
            } else {
                quarterStr = "Au";
            }
            return quarterStr.concat(sTime.substring(0, sTime.length - 1));
        }

        timeValues = d3.set(timeValues).values();
        xAxis.tickValues(timeValues);
        xAxis.tickFormat(function(d) { return getPrettyTime(d); })

        // Set y-axis tick marks
        yAxis.tickValues([0, 1, 2, 3, 4, 5]);
        yAxis.tickFormat(d3.format(".0f"));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the text label for the x axis
        svg.append("text")
            .attr("transform", "translate(" + ((width - 100)/ 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .attr("y",0)
            .attr("dx", "1em")
            .attr("font-size", "14px")
            .attr("fill", "#7f8c8d")
            .text("Quarter");


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 8 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "#7f8c8d")
            .text("Overall Rating");

        var category = svg.selectAll(".category")
            .data(cities)
            .enter().append("g")
            .attr("class", "category");

        category.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
            return line(d.values);
        })
            .style("stroke", function (d) {
            return color(d.key);
        });

        // Draws circle points on lines
        // Includes hovering
        svg.selectAll('g.dot')
            .data(data)
            .enter().append("g")
            .attr("class", "dot")
            .selectAll("circle")
            .data(function(d) {
                return d.values;
            })
            .enter().append('circle')
            .attr("cx", function(d, i) {
                return x(incrementedTime(d.datetime));
            })
            .attr("cy", function(d, i) {
                return y(d.the_course_as_a_whole);
            })
            .attr('r', 3)
            .style("fill", "white");

        // Add underlying circle for larger hover area
        svg.selectAll('g.largeDot')
            .data(data)
            .enter().append("g")
            .attr("class", "largeDot")
            .selectAll("circle")
            .data(function(d) {
                return d.values;
            })
            .enter().append('circle')
            .attr("cx", function(d, i) {
                return x(incrementedTime(d.datetime));
            })
            .attr("cy", function(d, i) {
                return y(d.the_course_as_a_whole);
            })
            .attr('r', 6)
            .style("opacity", 0)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        // Sets color of circles to match line
        svg.selectAll('circle')
        .style("stroke", function (d) {
            return color(d.name);
        });

        category.append('rect')
            .attr('x', width - 20 + 50 - 100)
            .attr('y', function(d, i){ return i *  20;})
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function(d) {
              return color(d.key);
            });

        category.append('text')
            .attr('x', width - 8 + 50 + 5 - 100)
            .attr('y', function(d, i){ return (i *  20) + 9;})
            .text(function(d){ return d.key; });
    },

    /**
     * Render the page
     */
    render: function() {
        this.getTimeSeries();

        return (
            <div id={this.props.divId} className="time-series-body"></div>
        );
    }
});

module.exports = LinePlotComponent;
