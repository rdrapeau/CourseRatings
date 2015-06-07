var React = require('react');
var JQuery = require('jquery');
var Constants = require('../Constants');
var OnScroll = require("react-window-mixins").OnScroll;

var OverviewHeaderComponent = require('./OverviewHeaderComponent.jsx');
var OverviewCourseRowComponent = require('./OverviewCourseRowComponent.jsx');
var TopKComponent = require('./TopKComponent.jsx');

/**
 * Encapsulates the overview table of the application
 */
var OverviewComponent = React.createClass({
    mixins: [ OnScroll ],

    /**
     * Initalize the state
     */
    getInitialState : function() {
        return {
            current_courses : this.props.currentData,
            current_sort_key : null,
            current_sort_multiplier : 1,
            activeHeader : null,
            scrolledPast : false,
            barWidth : 0,
            allCourses : this.collapse(this.props.currentData),
            active : null
        };
    },

    componentWillReceiveProps : function(next) {
        this.setState({current_courses : next.currentData});
        this.setState({allCourses : this.collapse(next.currentData)});

    	var elem = React.findDOMNode(this.refs.headerComp);
    	var header = elem.querySelector('th');

    	var headerTxt = header.innerHTML
    					.replace(' ↓', '')
    					.replace(' ↑', '');
    	var key = Constants.HEADER_TO_KEY[headerTxt];

    	this.setState({current_sort_key : key});

    	var elem = React.findDOMNode(this.refs.headerComp);

        this.addArrowToHeader(header, 1);

        if (this.state.active != next.active) {
            this.setState({active : next.active});
            this.onScroll();
        }
    },

    comparison : function(a, b) {
        var comparison = 0;
        // Else sort on Course Code
        if (comparison === 0) {
            if (a['course_whole_code'] < b['course_whole_code']) {
                comparison = -1;
            } else if (a['course_whole_code'] > b['course_whole_code']) {
                comparison = 1;
            }
        }

        // TODO: Else sort on Time

        // Else sort on Professor
        if (comparison === 0) {
            if (a['professor'] < b['professor']) {
                comparison = -1;
            } else if (a['professor'] > b['professor']) {
                comparison = 1;
            }
        }

        return comparison;
    },

    addArrowToHeader : function(domElement, multiplier) {
        if (this.state.activeHeader) {
            // Remove class
            var html = this.state.activeHeader.innerHTML;
            this.state.activeHeader.innerHTML = html.substring(0, html.length - 2);
        }

        // Add class to the new dom element
        domElement.innerHTML += multiplier === 1 ? ' ↓' : ' ↑' ;
        this.setState({activeHeader : domElement});
    },

    sortData : function(header, domElement) {
        // Sort on the header.
        var key = Constants.HEADER_TO_KEY[header];

        // Same key as last time
        var multiplier = this.state.current_sort_multiplier;
        if (this.state.current_sort_key === key) {
            // Flip the sort
            multiplier *= -1;
        } else {
            // Reset to normal Ascending sort
            multiplier = 1;
        }

        if (domElement) {
            this.addArrowToHeader(domElement, multiplier);
        } else {
            multiplier = 1;
        }

        // Remember states
        this.setState({current_sort_key : key});
        this.setState({current_sort_multiplier : multiplier});
        var self = this;

        var toSort = [];
        var previousHighLevel;
        for (var i = 0; i < this.state.allCourses.length; i++) {
            var course = this.state.allCourses[i];
            if (course.highLevel) {
                previousHighLevel = {highLevelCourse : course, innerCourses : []};
                toSort.push(previousHighLevel);
            } else {
                previousHighLevel.innerCourses.push(course);
            }
        }

        toSort.sort(function(a, b) {
            var comparison = 0;
            if (a.highLevelCourse[key] < b.highLevelCourse[key]) {
                comparison = -1;
            } else if (a.highLevelCourse[key] > b.highLevelCourse[key]) {
                comparison = 1;
            }

            if (comparison === 0) {
                comparison = self.comparison(a.highLevelCourse, b.highLevelCourse);
            }

            // Equal
            return comparison * multiplier;
        });

        var result = [];
        for (var i = 0; i < toSort.length; i++) {
            result.push(toSort[i].highLevelCourse);

            for (var j = 0; j < toSort[i].innerCourses.length; j++) {
                result.push(toSort[i].innerCourses[j]);
            }
        }

        // Force an update to the listeners
        this.setState({allCourses : result});
    },

    onScroll: function() {
        var element = this.getDOMNode();
        for (var i = 0; i < element.children.length; i++) {
            if (element.children[i].className === "table table-curved") {
                element = element.children[i];
                break;
            }
        }

        var rect = element.getBoundingClientRect();
        var windowPos = window.scrollY;

        if (windowPos - element.offsetTop > 50 && !this.state.scrolledPast) {
            this.setState({scrolledPast : true});
        } else if (windowPos - element.offsetTop < 50 && this.state.scrolledPast) {
            this.setState({scrolledPast : false});
        }

        if (this.state.barWidth !== rect.width) {
            this.setState({barWidth : rect.width});
        }
    },

    copyObject: function(course) {
        var result = {};
        for (var key in course) {
            result[key] = course[key];
        }

        return result;
    },

    collapse: function(current_courses) {
        var collapse = {};
        for (var i = 0; i < current_courses.length; i++) {
            var course = current_courses[i];
            var key = course[this.props.collapseKey];

            if (key in collapse) {
                collapse[key].push(this.copyObject(course));
            } else {
                collapse[key] = [this.copyObject(course)];
            }
        }

        var allCourses = [];
        for (var key in collapse) {
            var courses = collapse[key];
            if (courses.length === 1) {
                courses[0].hidden = false;
                courses[0].existing = true;
                courses[0].colorThis = false;
                courses[0].highLevel = true;
                allCourses.push(courses[0]);
                continue;
            }

            var averageCourse = {
                the_course_as_a_whole : 0.0,
                the_course_content : 0.0,
                amount_learned : 0.0,
                instructors_effectiveness : 0.0,
                grading_techniques : 0.0,
                percent_enrolled : 0.0
            };

            for (var i = 0; i < courses.length; i++) {
                var course = courses[i];

                for (var attribute in averageCourse) {
                    averageCourse[attribute] += course[attribute] / courses.length;
                }
            }

            for (var attribute in averageCourse) {
                if (attribute === 'percent_enrolled') {
                    averageCourse[attribute] = Math.round(10 * averageCourse[attribute]) / 10.0;
                } else {
                    averageCourse[attribute] = Math.round(100 * averageCourse[attribute]) / 100.0;
                }
            }

            averageCourse['course_department'] = courses[0].course_department;
            averageCourse[this.props.collapseKey] = key;
            if (this.props.collapseKey === 'course_whole_code') {
                averageCourse.professor = '...';
            } else {
                averageCourse.course_whole_code = '...';
            }

            averageCourse.hidden = false;
            averageCourse.existing = false;
            averageCourse.showing = false;
            averageCourse.colorThis = false;
            averageCourse.highLevel = true;
            allCourses.push(averageCourse);
            for (var i = 0; i < courses.length; i++) {
                courses[i].hidden = true;
                courses[i].existing = true;
                courses[i].colorThis = true;
                courses[i].highLevel = false;
                allCourses.push(courses[i]);
            }
        }

        return allCourses;
    },

    onClickMany: function(value) {
        for (var i = 0; i < this.state.allCourses.length; i++) {
            var course = this.state.allCourses[i];
            if (course[this.props.collapseKey] === value) {
                if (!course.existing) {
                    course.showing = !course.showing;
                } else {
                    course.hidden = !course.hidden;
                }
            }
        }

        this.setState({allCourses : this.state.allCourses});
    },

	/**
	 * Render
	 */
    render: function() {
    	var self = this;

        return (
            <div>
                {this.props.displayTop && this.props.departmentName && (
                    <div>
                        <div className="left">
                            <h3>Top Courses in {this.props.departmentName}</h3>
                            <TopKComponent k={5} data={this.state.current_courses} featureKey="course_whole_code" additionalLabel="course_title" onClickLabel={self.props.onClickCourse} />
                        </div>

                        <div className="right">
                            <h3>Top Instructors in {this.props.departmentName}</h3>
                            <TopKComponent k={5} data={this.state.current_courses} featureKey="professor" onClickLabel={self.props.onClickInstructor} />
                        </div>
                    </div>
                )}

                {this.state.current_courses && (
        	        <table className="table table-curved" >
                        <tbody>
                        <OverviewHeaderComponent headers={this.props.headers} onClickHeader={this.sortData} fixedHeader={true} scrollState={this.state.scrolledPast} width={this.state.barWidth} />
                        <OverviewHeaderComponent ref="headerComp" headers={this.props.headers} onClickHeader={this.sortData} fixedHeader={false} />

        	        	{this.state.allCourses.map(function(course) {
        	        		return (
                                <OverviewCourseRowComponent headers={self.props.headers} onClickCourse={self.props.onClickCourse} onClickInstructor={self.props.onClickInstructor} data={course} onClickMany={self.onClickMany} collapseKey={self.props.collapseKey} average={self.props.depAverages[course.course_department]} />
        	        		);
        	        	})}

                        </tbody>
        	        </table>
                )}
            </div>
        );
	}
});

module.exports = OverviewComponent;
