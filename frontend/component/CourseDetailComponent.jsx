var React = require('react');
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
                    ).order('professor,time').limit(Constants.SEARCH_RESULT_LIMIT).get();
        }

        if (courses.length > 0) {
            this.setState({current_course_name : courses[0].course_title});
            this.setState({current_course_description : courses[0].course_description});
        }

        return courses;
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

        return (
            <div className="table-container">
                <h2><span className="courseDetailName">{this.props.course + (this.state.current_course_name ? ': ' + this.state.current_course_name : '')}</span><span className="courseDetailScore">Score: <span className={"scoreRating" + rating}>{runningSum}</span></span></h2>
                {this.state.current_course_description != 0 &&
                    <p className="course-description">{this.state.current_course_description}</p>
                }

                <OverviewComponent onClickCourse={this.onClickCourse} onClickInstructor={this.props.onClickInstructor} currentData={this.state.current_courses} headers={headers}/>
            </div>
        );
    }
});

module.exports = CourseDetailComponent;
