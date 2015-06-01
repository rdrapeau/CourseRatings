var React = require('react');
var d3 = require('d3');
var Constants = require('../Constants');

var OverviewComponent = require('./OverviewComponent.jsx');

/**
 * Encapsulates the course detail screen
 */
var CourseDetailComponent = React.createClass({
    getInitialState : function() {
        return {
            current_course_name : '',
            current_courses : []
        };
    },

    componentDidMount : function() {
        this.setState({current_courses : this.getCoursesByCourseCode(this.props.course)});
    },

    componentWillReceiveProps : function(next) {
        this.setState({current_courses : this.getCoursesByCourseCode(next.course)});
    },

    getCoursesByCourseCode : function(course) {
        var courses = [];
        if (course) {
            courses = this.props.taffy(
                        {the_course_as_a_whole : {isNumber: true}},
                        {'course_whole_code' : {isnocase: course}}
                    ).order('professor,datetime').limit(Constants.SEARCH_RESULT_LIMIT).get();
        }

        if (courses.length > 0) {
            this.setState({current_course_name : courses[0].course_title});
            this.setState({current_course_description : courses[0].course_description});
        }

        return courses;
    },

    getTimeSeriesByCourseCode1 : function() {
        d3.select("svg").remove();
        if (this.state.current_courses.length === 0) {
            return;
        }

var data1 = [
  {
    "the_course_as_a_whole": 4.17,
    "datetime": 131,
    "professor": "Allison Obourn",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.71,
    "datetime": 131,
    "professor": "Stuart Reges",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.3,
    "datetime": 131,
    "professor": "Ilene Shen",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 3,
    "datetime": 132,
    "professor": "Allison Obourn",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 3.8,
    "datetime": 132,
    "professor": "Stuart Reges",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.9,
    "datetime": 132,
    "professor": "Ilene Shen",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.2,
    "datetime": 142,
    "professor": "Allison Obourn",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.9,
    "datetime": 142,
    "professor": "Stuart Reges",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 3.2,
    "datetime": 142,
    "professor": "Ilene Shen",
    "course_whole_code": "Hiiiiii",
  }
];
        var data = d3.nest()
            .key(function(d) {
                return d.professor;
            })
            .entries(data1/*this.state.current_courses*/);
        
        var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = 560 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

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
            //    console.log("x", x(d.datetime), d.datetime);
                console.log("d!", d);
                return x(d.datetime);
            })
            .y(function (d) {
            //    console.log("y", y(d.the_course_as_a_whole), d.the_course_as_a_whole);
                return y(d.the_course_as_a_whole);
        });

        var svg = d3.select("#time-series-body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        color.domain(data.map(function (d) { return d.key; }));

        var timeValues = [];
        data.forEach(function (kv) {
            kv.values.forEach(function (d) {
                d.datetime = d.datetime;
                timeValues.push(d.datetime);
            });
        });

        var cities = data;

        var minX = d3.min(data, function (kv) { return d3.min(kv.values, function (d) { return d.datetime; }) });
        var maxX = d3.max(data, function (kv) { return d3.max(kv.values, function (d) { return d.datetime; }) });

        // Set axis ranges
        x.domain([minX, maxX]);
        y.domain([0, 5]);

        function getPrettyTime(time) {
            var quarterNum = time.substr(time.length - 1);
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
            return quarterStr.concat(time.substring(0, time.length - 1));
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
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
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
            .text("Overall Rating");
        
        var professor = svg.selectAll(".professor")
            .data(cities)
            .enter().append("g")
            .attr("class", "professor");

        professor.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
             line(d.values);
        })
            .style("stroke", function (d) {
            return color(d.key);
        });

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
        return x(d.datetime); 
    })
    .attr("cy", function(d, i) {
        return y(d.the_course_as_a_whole);
    })
    .attr('r', 3)
    .style("fill", "white");

    // Sets color of circles to match line
svg.selectAll('circle')
.style("stroke", function (d) {
    return color(d.professor);
}); 

        professor.append("text")
            .datum(function (d) {
        //    console.log("lastX", x(d.values[d.values.length - 1].datetime), "lastY", y(d.values[d.values.length - 1].the_course_as_a_whole));
            return {
                name: d.key,
                date: d.values[d.values.length - 1].datetime,
                value: d.values[d.values.length - 1].the_course_as_a_whole
            };
        })
            .attr("transform", function (d) {
            return "translate(" + x(d.date) + "," + y(d.value) + ")";
        })
            .attr("x", 10)
            .attr("dy", ".5em")
            .text(function (d) {
        return d.name;
        });

        return data;
    },

    getTimeSeriesByCourseCode : function() {
        d3.select("svg").remove();
        if (this.state.current_courses.length === 0) {
            return;
        }
        var data1 = [
  {
    "the_course_as_a_whole": 4.17,
    "time": 131,
    "professor": "Allison Obourn",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.71,
    "time": 131,
    "professor": "Stuart Reges",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.3,
    "time": 131,
    "professor": "Ilene Shen",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 3,
    "time": 132,
    "professor": "Allison Obourn",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 3.8,
    "time": 132,
    "professor": "Stuart Reges",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.9,
    "time": 132,
    "professor": "Ilene Shen",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.2,
    "time": 142,
    "professor": "Allison Obourn",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 4.9,
    "time": 142,
    "professor": "Stuart Reges",
    "course_whole_code": "Hiiiiii",
  },
  {
    "the_course_as_a_whole": 3.2,
    "time": 142,
    "professor": "Ilene Shen",
    "course_whole_code": "Hiiiiii",
  }
];

var data = d3.nest()
    .key(function(d) {
        return d.professor;
    })
    .entries(this.state.current_courses);

/*var data = [
    {
        "key": "New York",
        "value": [
            {
                "Date": "20111001",
                "Value": "63.4"
            },
            {
                "Date": "20111002",
                "Value": "58.0"
            },
            {
                "Date": "20111003",
                "Value": "53.3"
            }
        ]
    }, ...];*/

var margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
},
width = 660 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//var parseDate = d3.time.format("%Y%m%d").parse;

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
//    .interpolate("linear") // COMMENT OUT FOR STRAIGHT LINES
    .x(function (d) {
        return x(d.datetime);
    })
    .y(function (d) {
    return y(d.the_course_as_a_whole);
});

var svg = d3.select("#time-series-body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// TODO: USES OUTSIDE CODE ------------- DON"T FORGET TO CITE
// Used for hovering to get rating of professor
/*var tip = d3.tip() 
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d.the_course_as_a_whole;
    })

svg.call(tip);*/

/*var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');*/

color.domain(data.map(function (d) { return d.key; }));

var timeValues = [];
data.forEach(function (kv) {
    kv.values.forEach(function (d) {
        d.datetime = d.datetime;
        timeValues.push(d.datetime);
    });
});

var cities = data;

var minX = d3.min(data, function (kv) { return d3.min(kv.values, function (d) { return d.datetime; }) });
var maxX = d3.max(data, function (kv) { return d3.max(kv.values, function (d) { return d.datetime; }) });
var minY = d3.min(data, function (kv) { return d3.min(kv.values, function (d) { return d.the_course_as_a_whole; }) });
var maxY = d3.max(data, function (kv) { return d3.max(kv.values, function (d) { return d.the_course_as_a_whole; }) });

// Set axis ranges
x.domain([minX, maxX]);
y.domain([0, 5]);

function getPrettyTime(time) {
    var quarterNum = time.substr(time.length - 1);
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
    return quarterStr.concat(time.substring(0, time.length - 1));
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
    .text("Overall Rating");

var professor = svg.selectAll(".professor")
    .data(cities)
    .enter().append("g")
    .attr("class", "professor");

professor.append("path")
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
        return x(d.datetime); 
    })
    .attr("cy", function(d, i) {
        return y(d.the_course_as_a_whole);
    })
    .attr('r', 3)
    .style("fill", "white");

// Sets color of circles to match line
svg.selectAll('circle')
.style("stroke", function (d) {
    return color(d.professor);
}); 

/*professor.append("text")
    .datum(function (d) {
    return {
        name: d.key,
        date: d.values[d.values.length - 1].datetime,
        value: d.values[d.values.length - 1].the_course_as_a_whole
    };
})
    .attr("transform", function (d) {
    return "translate(" + x(d.date) + "," + y(d.value) + ")";
})
    .attr("x", 10)
    .attr("dy", ".5em")
    .text(function (d) {
        return d.name;
});*/

     /*var legend = svg.selectAll('g')
        .data(cities)
        .enter()
      .append('g')
        .attr('class', 'legend');*/

    professor.append('rect')
        .attr('x', width - 20 + 50 - 100)
        .attr('y', function(d, i){ return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.key);
        });

    professor.append('text')
        .attr('x', width - 8 + 50 + 5 - 100)
        .attr('y', function(d, i){ return (i *  20) + 9;})
        .text(function(d){ return d.key; });
    },

    /**
     * Render the page
     */
    render: function() {
        var headers = Constants.OVERVIEW_HEADERS.slice(0);
        headers.splice(Constants.OVERVIEW_HEADERS.indexOf('Course Code'), 1);

        var runningSum = 0.0;
        for (var i = 0; i < this.state.current_courses.length; i++) {
            runningSum += Math.min(this.state.current_courses[i].the_course_as_a_whole, 5);
        }

        runningSum /= this.state.current_courses.length;
        runningSum = runningSum.toFixed(2);
        rating = Math.floor(runningSum);
        
        this.getTimeSeriesByCourseCode();

        return (
            <div className="table-container">
                <h2><span className="courseDetailName">{this.props.course + (this.state.current_course_name ? ': ' + this.state.current_course_name : '')}</span><span className="courseDetailScore">Score: <span className={"scoreRating" + rating}>{runningSum}</span></span></h2>
                {this.state.current_course_description != 0 &&
                    <p className="course-description">{this.state.current_course_description}</p>
                }
                <div id="time-series-body"></div>
                <OverviewComponent onClickCourse={this.onClickCourse} onClickInstructor={this.props.onClickInstructor} currentData={this.state.current_courses} headers={headers}/>
            </div>
        );
    }
});

module.exports = CourseDetailComponent;
