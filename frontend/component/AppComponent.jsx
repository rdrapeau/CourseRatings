var React = require('react');
var Constants = require('../Constants');
var DataAPI = require('../DataAPI');
var Spinner = require('react-spinkit');

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

        DataAPI.getTaffy(function(taffy, courses) {
            self.setState({allCourses : taffy({the_course_as_a_whole : {isNumber: true}}).get()});
            self.setState({taffy : taffy});
        });
    },

    onClickCourse : function(course) {
        var match_index = course.match(/\d/).index;
        this.setState({activeCourse : course});
        this.setState({activeCourseCode : course.substring(match_index)});
        this.setState({activeDepartment : course.substring(0, match_index)});
        this.setState({activeInstructor : null});
        this.setScreenLater(Constants.SCREENS.COURSE_DETAILS)();
    },

    onClickInstructor : function(instructor) {
        this.setState({activeInstructor : instructor});
        this.setState({activeCourse : null});
        this.setState({activeCourseCode : null});
        this.setState({activeDepartment : null});
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
            allCourses : null,
            activeCourse : null,
            activeInstructor : null,
            activeDepartment : null,
            activeCourseCode : null
        };
    },

    getSearchResult : function(course_department, course_code, professor) {
        var results = [];
        if (course_department && course_code && professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    course_department : {isnocase: course_department},
                                    course_code : {'==' : course_code},
                                    professor : {isnocase : professor}
                                }).order('course_whole_code,professor,datetime').get();
        } else if (course_department && course_code && !professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    course_department : {isnocase: course_department},
                                    course_code : {'==' : course_code}
                                }).order('course_whole_code,professor,datetime').get();
        } else if (course_department && !course_code && professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    course_department : {isnocase: course_department},
                                    professor : {isnocase : professor}
                                }).order('course_whole_code,professor,datetime').get();
        } else if (course_department && !course_code && !professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    course_department : {isnocase: course_department}
                                }).order('course_whole_code,professor,datetime').get();
        } else if (!course_department && course_code && professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    course_code : {'==' : course_code},
                                    professor : {isnocase : professor}
                                }).order('course_whole_code,professor,datetime').get();
        } else if (!course_department && course_code && !professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    course_code : {'==' : course_code}
                                }).order('course_whole_code,professor,datetime').get();
        } else if (!course_department && !course_code && professor) {
            results = this.state.taffy({
                                the_course_as_a_whole : {isNumber: true}},
                                {
                                    professor : {isnocase : professor}
                                }).order('course_whole_code,professor,datetime').get();
        } else {
            results = this.state.allCourses;
        }

        if (!course_department && !course_code && !professor) {
            this.resetPage();
        } else {
            this.setState({current_courses : results});
        }

        this.setState({activeDepartment : course_department});
        this.setState({activeCourseCode : course_code});
        this.setState({activeInstructor : professor});

        if (results.length !== 0) {
            if (course_department && course_code && !professor) {
                this.onClickCourse(results[0].course_whole_code);
            } else if (professor && !course_code && !course_department) {
                this.onClickInstructor(results[0].professor);
            } else {
                this.setScreenLater(Constants.SCREENS.OVERVIEW)();
            }
        } else {
            this.setScreenLater(Constants.SCREENS.OVERVIEW)();
        }

        return results;
    },

    resetPage : function() {
        this.setState({current_courses : []});
        this.setState({activeDepartment : null});
        this.setState({activeInstructor : null});
        this.setState({activeCourse : null});
        this.setState({activeCourseCode : null});
        this.setScreenLater(Constants.SCREENS.OVERVIEW)();
    },

    /**
     * Render the application
     */
    render : function() {
        var isOverview = (this.state.active == Constants.SCREENS.OVERVIEW);
        var isCourseDetails = (this.state.active == Constants.SCREENS.COURSE_DETAILS);
        var isInstructorDetails = (this.state.active == Constants.SCREENS.INSTRUCTOR_DETAILS);
        var isCompare = (this.state.active == Constants.SCREENS.COMPARE);

        var doDisplayTop = this.state.activeDepartment && !this.state.activeCourseCode && !this.state.activeInstructor;

        return (
            <div id="app">
                {this.state.taffy == null && this.state.allCourses == null && (

                <div className="loading">
                    <span id="loadingText">Loading</span>
                    <Spinner id="loadingSpinner" spinnerName='circle' noFadeIn={true} />
                </div>

                )}

                {this.state.taffy != null && this.state.allCourses != null && (

                <div className="loaded">
                    <HeaderComponent screen={this.state.active} onImgClick={this.resetPage} />
                    <SearchComponent searchFunction={this.getSearchResult} resetFunction={this.resetPage} activeDepartment={this.state.activeDepartment} activeCourseCode={this.state.activeCourseCode} activeInstructor={this.state.activeInstructor} />
                    <div className={"screen " + (isOverview ? "active" : "")}>
                        <div className="table-container">
                            <OverviewComponent ref="overviewComponent" onClickCourse={this.onClickCourse} onClickInstructor={this.onClickInstructor} currentData={this.state.current_courses} headers={Constants.OVERVIEW_HEADERS} collapseKey="course_whole_code" departmentName={this.state.activeDepartment} displayTop={doDisplayTop} />
                        </div>
                    </div>
                    <div className={"screen " + (isCourseDetails ? "active" : "")}>
                        <CourseDetailComponent onClickInstructor={this.onClickInstructor} course={this.state.activeCourse} taffy={this.state.taffy} />
                    </div>
                    <div className={"screen " + (isInstructorDetails ? "active" : "")}>
                        <InstructorDetailComponent onClickCourse={this.onClickCourse} instructor={this.state.activeInstructor} taffy={this.state.taffy} />
                    </div>
                    <div className={"screen " + (isCompare ? "active" : "")}>
                        <p>hi</p>
                    </div>
                </div>

                )}
            </div>
        );
	}
});

module.exports = AppComponent;
