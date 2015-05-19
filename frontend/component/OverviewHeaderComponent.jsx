var React = require('react');
var Constants = require('../Constants');

/**
 * Encapsulates the header of the table
 */
var OverviewHeaderComponent = React.createClass({
    /**
     * Render the header
     */
    render: function() {
        var self = this;
        return (
            <tr className='table-top'>
                {this.props.headers.map(function(header) {
                    return (
                        <th id={header === 'Course Code' ? 'course_whole_code_header' : ''} onClick={function(event) {
                            self.props.onClickHeader(header, event.currentTarget);
                        }}>
                            {header}
                        </th>
                        );
                })}
            </tr>
        );
    }
});

module.exports = OverviewHeaderComponent;
