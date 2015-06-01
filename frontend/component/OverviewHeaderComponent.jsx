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
        var className = 'table-top';
        var divStyle = {}
        if (this.props.fixedHeader) {
            className += ' topHeader'

            if (this.props.width) {
                divStyle = { width: this.props.width };
            }

            if (this.props.scrollState) {
                className += ' topHeaderLoaded'
            } else {
                className += ' topHeaderHidden';
            }
        }

        return (
            <tr className={className} style={divStyle}>
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
