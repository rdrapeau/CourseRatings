var React = require('react');
var Constants = require('../Constants');

var ValueBarComponent = require('./ValueBarComponent.jsx');

/**
 * Encapsulates the header of the table
 */
var OverviewCourseRowComponent = React.createClass({
    onClickCourse : function() {
        this.props.onClickCourse(this.props.data.course_whole_code);
    },

    onClickInstructor : function() {
        this.props.onClickInstructor(this.props.data.professor);
    },

    /**
     * Render the header
     */
    render : function() {
        var data = this.props.data;

        return (
            <tr>
                {this.props.headers.indexOf('Course Code') != -1 &&
                    <td className='course-code' onClick={this.onClickCourse}>{data.course_whole_code}<span className="course_time">{' (' + data.time + ')'}</span></td>
                }
                {this.props.headers.indexOf('Instructor') != -1 &&
                    <td className='prof-name' onClick={this.onClickInstructor}>{data.professor}</td>
                }
                <td className="no-pad"><ValueBarComponent value={data.the_course_as_a_whole} max={5} /></td>
                <td className="no-pad"><ValueBarComponent value={data.the_course_content} max={5} /></td>
                <td className="no-pad"><ValueBarComponent value={data.amount_learned} max={5} /></td>
                <td className="no-pad"><ValueBarComponent value={data.instructors_effectiveness} max={5} /></td>
                <td className="no-pad"><ValueBarComponent value={data.grading_techniques} max={5} /></td>
                <td className="no-pad"><ValueBarComponent value={data.percent_enrolled} max={100} /></td>
            </tr>
        );
    }
});

module.exports = OverviewCourseRowComponent;
