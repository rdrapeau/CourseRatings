var React = require('react');
var Constants = require('../Constants');

/**
 * Encapsulates the header of the application
 */
var ValueBarComponent = React.createClass({
    /**
     * Render the header
     */
    render: function() {
        var percent = ((this.props.value ? this.props.value : this.props.max) / this.props.max * 100);
        var width = percent + '%';
        var level = this.props.value ?
                    (percent >= 80 ? "green" :
                     percent >= 60 ? "yellow" : "red")
                    : "disabled";

        return (
            <div className="value-bar" title={(this.props.average ? this.props.average.department + " Average: " + this.props.average.value : "")}>
                <div className={"vb-bg " + level} style={{width : width}}>
                </div>
                <p>{this.props.value ? this.props.value : "N/A"}</p>
            </div>
        );
    }
});

module.exports = ValueBarComponent;
