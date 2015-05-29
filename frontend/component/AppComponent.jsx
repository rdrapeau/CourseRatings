var React = require('react');
var Constants = require('../Constants');
var DataAPI = require('../DataAPI');

var HeaderComponent = require('./HeaderComponent.jsx');
var OverviewComponent = require('./OverviewComponent.jsx');
var SearchComponent = require('./SearchComponent.jsx');
var CourseDetailComponent = require('./CourseDetailComponent.jsx');
var InstructorDetailComponent = require('./InstructorDetailComponent.jsx');

/**
 * Encapsulates the entire application
 */
var AppComponent = React.createClass({
	/**
	 * Returns a thunk that when executed will change the screen.
	 */
	setScreenLater : function(screen) {
        var self = this;
		return function() {
			self.setState({active : screen});
		};
	},

    /**
     * Called after this component mounts
     */
    componentDidMount : function() {
        var self = this;

        DataAPI.getTaffy(function(taffy) {
            self.setState({taffy : taffy});
        });
    },

    onClickCourse : function(course) {
        this.setState({activeCourse : course});
        this.setScreenLater(Constants.SCREENS.COURSE_DETAILS)();
    },

    onClickInstructor : function(instructor) {
        this.setState({activeInstructor : instructor});
        this.setScreenLater(Constants.SCREENS.INSTRUCTOR_DETAILS)();
    },

    /**
     * Initalize the application, setting it to the home screen
     */
    getInitialState : function() {
        return {
            active : Constants.SCREENS.OVERVIEW,
            current_courses : [],
            taffy : null,
            activeCourse : null,
            activeInstructor : null,
            currentSearch : ''
        };
    },

    getSearchResult : function(searchValue) {
        this.setState({currentSearch : searchValue});

        var new_courses = [];
        if (searchValue.replace(' ', '') !== '') {
            new_courses = this.state.taffy({the_course_as_a_whole : {isNumber: true}},
                [
                    {'professor' : {likenocase: searchValue}},
                    {'course_whole_code' : {likenocase: searchValue.replace(' ', '')}}
                ]).order('course_whole_code,professor,datetime').limit(Constants.SEARCH_RESULT_LIMIT).get();
        }

        this.refs.overviewComponent.sortData('Course Code', null);
        this.setState({current_courses : new_courses});

        // Skip to the course page or instructor page if it is a unique result
        var differentProfessors = false;
        var differentCourses = false;
        for (var i = 1; i < new_courses.length; i++) {
            if (new_courses[i].course_whole_code !== new_courses[i - 1].course_whole_code) {
                differentCourses = true;
            }

            if (new_courses[i].professor !== new_courses[i - 1].professor) {
                differentProfessors = true;
            }

            if (differentCourses && differentProfessors) {
                break; // Break early
            }
        }

        var containsNumber = searchValue.match(/\d+/g) !== null;
        if (new_courses.length == 0 || (differentCourses && differentProfessors)) {
            this.setScreenLater(Constants.SCREENS.OVERVIEW)();
        } else if (!differentCourses && (differentProfessors || (!differentProfessors && containsNumber))) {
            this.onClickCourse(new_courses[0].course_whole_code);
        } else { // Same professors
            this.onClickInstructor(new_courses[0].professor);
        }
    },

    /**
     * Render the application
     */
    render : function() {
        var isOverview = (this.state.active == Constants.SCREENS.OVERVIEW);
        var isCourseDetails = (this.state.active == Constants.SCREENS.COURSE_DETAILS);
        var isInstructorDetails = (this.state.active == Constants.SCREENS.INSTRUCTOR_DETAILS);

        return (
            <div id="app">
                <div className="loading">
                </div>

                {this.state.taffy != null && (

                <div className="loaded">
                    <HeaderComponent screen={this.state.active} />
                    <SearchComponent searchFunction={this.getSearchResult} />
                    <div className={"screen " + (isOverview ? "active" : "")}>
                        <div className="table-container">
                            <OverviewComponent ref="overviewComponent" onClickCourse={this.onClickCourse} onClickInstructor={this.onClickInstructor} currentData={this.state.current_courses} headers={Constants.OVERVIEW_HEADERS} />
                        </div>
                    </div>
                    <div className={"screen " + (isCourseDetails ? "active" : "")}>
                        <CourseDetailComponent onClickInstructor={this.onClickInstructor} course={this.state.activeCourse} taffy={this.state.taffy} />
                    </div>
                    <div className={"screen " + (isInstructorDetails ? "active" : "")}>
                        <InstructorDetailComponent onClickCourse={this.onClickCourse} instructor={this.state.activeInstructor} taffy={this.state.taffy} />
                    </div>
                </div>

                )}
            </div>
        );
	}
});

module.exports = AppComponent;
