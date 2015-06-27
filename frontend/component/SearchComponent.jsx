var React = require('react');
var Constants = require('../Constants');
var Select = require('react-select');

/**
 * Search bar for the class
 */
var SearchComponent = React.createClass({
    /**
     * Keeps track of the text being typed into the search bar
     */
    getInitialState: function() {
        var keys = ['course_department', 'course_code', 'professor'];
        var allData = this.props.searchFunction(null, null, null);
        var unique = this.getUnique(keys, allData, null, null);

        localStorage.setItem("course_department", unique.course_department.map(function(item) { return item.value; }).join(';'));
        localStorage.setItem("course_code", unique.course_code.map(function(item) { return item.value; }).join(';'));
        localStorage.setItem("professor", unique.professor.map(function(item) { return item.value; }).join(';'));

        return {
            departments : unique.course_department,
            courseCodes : unique.course_code,
            professors : unique.professor,
            keys : keys,
            currentDepartment : null,
            currentCourseCode : null,
            currentProfessor : null
            };
    },

    componentWillReceiveProps : function(next) {
        var courseCode = next.activeCourseCode;
        if (this.state.currentDepartment != next.activeDepartment
                || this.state.currentCourseCode != next.activeCourseCode
                || this.state.currentProfessor != next.activeInstructor) {
            if (!next.activeDepartment && !next.activeInstructor) {
                courseCode = null;
            }
            this.update(next.activeDepartment, courseCode, next.activeInstructor);
        }
    },

    getUnique : function(keys, results, currentDepartment, currentProfessor) {
        var unique = {};
        var done = {};
        for (var i = 0; i < keys.length; i++) {
            unique[keys[i]] = [];
            done[keys[i]] = [];
        }

        var possible = [];
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < keys.length; j++) {
                var option_value = results[i][keys[j]];

                if (keys[j] === 'course_code') {
                    var character = option_value.charAt(0);
                    if (possible.indexOf(character) === -1 && (currentDepartment || currentProfessor)) {
                        possible.push(character);
                    }
                }

                if (done[keys[j]].indexOf(option_value) === -1) {
                    unique[keys[j]].push({value: option_value, label: option_value})
                    done[keys[j]].push(option_value);
                }
            }
        }

        for (var i = 0; i < possible.length; i++) {
            var option_value = possible[i] + 'XX';
            unique['course_code'].push({value: option_value, label: option_value});
        }

        for (var i = 0; i < keys.length; i++) {
            unique[keys[i]].sort(function(a, b) {
                if (a.value < b.value) {
                    return -1;
                } else if (a.value > b.value) {
                    return 1;
                }

                return 0;
            });
        }

        return unique;
    },

    update: function(course_department, course_code, professor) {
        var unique = {};

        if ((!course_department && !professor) && course_code && course_code.substring(1) == 'XX') {
            course_code = null;
        }

        if (!course_department && !course_code && !professor && localStorage['course_department'] && localStorage['course_code'] && localStorage['professor']) {
            unique = {
                    'course_department' : localStorage['course_department'].split(';').map(function(item) { return {value: item, label: item};}),
                    'course_code' : localStorage['course_code'].split(';').map(function(item) { return {value: item, label: item};}),
                    'professor' : localStorage['professor'].split(';').map(function(item) { return {value: item, label: item};})
                    };
            this.props.resetFunction();
        } else {
            var searchResults = this.props.searchFunction(course_department, course_code, professor);
            unique = this.getUnique(this.state.keys, searchResults, course_department, professor);
        }

        this.setState({departments : unique.course_department});
        this.setState({courseCodes : unique.course_code});
        this.setState({professors : unique.professor});

        this.setState({currentDepartment : course_department});
        this.setState({currentCourseCode : course_code});
        this.setState({currentProfessor : professor});
    },

    departmentChange: function(course_department) {
        this.update(course_department, this.props.activeCourseCode, this.props.activeInstructor);
    },

    courseCodeChange: function(course_code) {
        this.update(this.props.activeDepartment, course_code, this.props.activeInstructor);
    },

    profChange: function(professor) {
        this.update(this.props.activeDepartment, this.props.activeCourseCode, professor);
    },

    /**
     * Render the search bar
     */
    render: function() {
        var isDisable = !this.props.activeDepartment && !this.props.activeInstructor;
        return (
            <div id='search-bar-container'>
                <Select value={this.props.activeDepartment ? this.props.activeDepartment : null} className="departmentField" placeholder="Department" options={this.state.departments} onChange={this.departmentChange} />
                <Select disabled={isDisable} value={this.props.activeCourseCode ? this.props.activeCourseCode : null} className={"courseCodeField" + (isDisable ? " faded" : "")} placeholder="Course Code" options={this.state.courseCodes} onChange={this.courseCodeChange} />
                <Select value={this.props.activeInstructor ? this.props.activeInstructor : null} className="profField" placeholder="Instructor" options={this.state.professors} onChange={this.profChange} />
            </div>
        );
    }
});

module.exports = SearchComponent;
