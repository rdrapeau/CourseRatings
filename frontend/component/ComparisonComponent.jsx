var React = require('react');
var Constants = require('../Constants');

var OverviewComponent = require('./OverviewComponent.jsx');
var BarChartComponent = require('./BarChartComponent.jsx');
var SpecificSearchComponent = require('./SpecificSearchComponent.jsx');

var ComparisonComponent = React.createClass({

    getInitialState : function() {
        var departmentList = [];
        if ('course_department' in localStorage) {
            departmentList = localStorage['course_department'].split(';').map(function(item) { return {value: item, label: item};});
        }

        var depAverages = {};
        for (var i = 0; i < this.props.allCourses.length; i++) {
            var course = this.props.allCourses[i];

            if (!(course.course_department in depAverages)) {
                depAverages[course.course_department] = {};
                for (var j = 0; j < Constants.KEYS.length; j++) {
                    depAverages[course.course_department][Constants.KEYS[j]] = course[Constants.KEYS[j]];
                }

                depAverages[course.course_department]['length'] = 1.0;
            } else {
                for (var j = 0; j < Constants.KEYS.length; j++) {
                    depAverages[course.course_department][Constants.KEYS[j]] += course[Constants.KEYS[j]];
                }

                depAverages[course.course_department]['length'] += 1.0;
            }
        }

        for (var department in depAverages) {
            for (var attribute in depAverages[department]) {
                if (attribute !== 'length') {
                    depAverages[department][attribute] = Math.round(depAverages[department][attribute] / depAverages[department]['length'] * 100) / 100;
                }
            }
        }

        return {
            courses : [],
            numSearchBars : 1,
            departments : [null],
            courseCodes : [null],
            searchResults : [[]],
            departmentList : departmentList,
            courseLists : [[]],
            compareKeys : Constants.KEYS,
            depAverages : depAverages
        };
    },

    addSearchBar: function() {
        this.state.departments.push(null);
        this.state.courseCodes.push(null);
        this.state.searchResults.push([]);
        this.state.courseLists.push([]);
        this.setState({numSearchBars : this.state.numSearchBars + 1});
    },

    removeSearchBar: function(searchBarId) {
        this.state.departments.splice(searchBarId, 1);
        this.state.courseCodes.splice(searchBarId, 1);
        this.state.searchResults.splice(searchBarId, 1);
        this.state.courseLists.splice(searchBarId, 1);
        this.setState({numSearchBars : this.state.numSearchBars - 1});
        this.collapse(this.state.numSearchBars - 1);
    },

    departmentChange: function(department, searchBarId) {
        this.state.departments[searchBarId] = department;
        this.state.courseCodes[searchBarId] = null;

        var courseList = this.props.taffy({the_course_as_a_whole : {isNumber: true}}, {course_department : {isnocase: department}}).distinct("course_code");
        this.state.courseLists[searchBarId] = courseList.map(function(item) { return {value : item, label : item}; });

        this.setState({departments : this.state.departments});
        this.update(searchBarId);
    },

    courseCodeChange: function(courseCode, searchBarId) {
        for (var i = 0; i < this.state.numSearchBars; i++) {
            if (this.state.departments[i] === this.state.departments[searchBarId]
                    && courseCode === this.state.courseCodes[i]) {
                this.state.courseCodes[searchBarId] = null;
                alert('You may not add the same course twice.');
                // TODO: do a better warning system?
                return;
            }
        }

        this.state.courseCodes[searchBarId] = courseCode;
        this.update(searchBarId);
    },

    update: function(searchBarId) {
        var department = this.state.departments[searchBarId];
        var courseCode = this.state.courseCodes[searchBarId];
        var results = [];

        if (department && courseCode) {
            var results = this.props.taffy({
                            the_course_as_a_whole : {isNumber: true}},
                            {
                                course_department : {isnocase: department},
                                course_code : {'==' : courseCode},
                            }).order('course_whole_code,professor,datetime').get();
        }

        this.state.searchResults[searchBarId] = results;
        this.collapse(this.state.numSearchBars);
    },

    collapse: function(numSearchBars) {
        var results = [];

        // Init indices
        for (var i = 0; i < numSearchBars; i++) {
            for (var j = 0; j < this.state.searchResults[i].length; j++) {
                results.push(this.state.searchResults[i][j]);
            }
        }

        this.setState({courses : results});
    },

    /**
     * Render the page
     */
    render: function() {
        var searchBars = [];
        for (var i = 0; i < this.state.numSearchBars; i++) {
            searchBars.push(<SpecificSearchComponent searchComponentID={i} department={this.state.departments[i]} courseCode={this.state.courseCodes[i]} numSearchBars={this.state.numSearchBars} departmentList={this.state.departmentList} departmentChange={this.departmentChange} courseCodeChange={this.courseCodeChange} courseList={this.state.courseLists[i]} addSearchBar={this.addSearchBar} removeSearchBar={this.removeSearchBar} />);
        }

        return (
            <div>
                <div id="comparisonSearchBarsContainer">
                    {searchBars}
                </div>

                <div className={"table-container" + (this.state.courses.length > 0 ? "" : " hidden")}>
                    <OverviewComponent reSort={true} ref="overviewComponent" onClickCourse={this.props.onClickCourse} onClickInstructor={this.props.onClickInstructor} currentData={this.state.courses} headers={Constants.OVERVIEW_HEADERS} collapseKey="course_whole_code" active={Constants.SCREENS.COMPARE} />
                </div>

                <BarChartComponent depAverages={this.state.depAverages} compareKeys={this.state.compareKeys} courses={this.state.courses} divId="compareBarChart" />
            </div>
        );
    }
});

module.exports = ComparisonComponent;
