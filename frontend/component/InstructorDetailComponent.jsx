var React = require('react');
var Constants = require('../Constants');

var OverviewComponent = require('./OverviewComponent.jsx');
var LinePlotComponent = require('./LinePlotComponent.jsx');

/**
 * Encapsulates the instructor detail screen
 */
var InstructorDetailComponent = React.createClass({
    getInitialState : function() {
        return {
            current_courses : []
        };
    },

    componentDidMount : function() {
        this.setState({current_courses : this.getCoursesByInstructor(this.props.instructor)});
    },

    componentWillReceiveProps : function(next) {
        this.setState({current_courses : this.getCoursesByInstructor(next.instructor)});
    },

    getCoursesByInstructor : function(instructor) {
        var courses = [];
        if (instructor) {
            courses = this.props.taffy(
                        {the_course_as_a_whole : {isNumber: true}},
                        {'professor' : {isnocase: instructor}}
                    ).order('course_whole_code,datetime').limit(Constants.SEARCH_RESULT_LIMIT).get();
        }

        return courses;
    },

	/**
	 * Render the page
	 */
    render: function() {
        var headers = Constants.OVERVIEW_HEADERS.slice(0);
        headers.splice(Constants.OVERVIEW_HEADERS.indexOf('Instructor'), 1);

        var runningSum = 0.0;
        for (var i = 0; i < this.state.current_courses.length; i++) {
            runningSum += Math.min(this.state.current_courses[i].the_course_as_a_whole, 5);
        }

        runningSum /= this.state.current_courses.length;
        runningSum = runningSum.toFixed(2);
        rating = Math.floor(runningSum);

        return (
            <div className="table-container">
                <h2><span className="instructorDetailName">{this.props.instructor}</span><span className="instructorDetailScore">Score: <span className={"scoreRating" + rating}>{runningSum}</span></span></h2>
                <LinePlotComponent divId="instructorDetailPlot" detailKey="course_whole_code" current_courses={this.state.current_courses} />
                <OverviewComponent onClickCourse={this.props.onClickCourse} onClickInstructor={function() {}} currentData={this.state.current_courses} headers={headers} collapseKey="course_whole_code" active={this.props.active} depAverages={this.props.depAverages} />
            </div>
        );
	}
});

module.exports = InstructorDetailComponent;
