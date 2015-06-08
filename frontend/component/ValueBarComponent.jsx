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

        var hoverTitle = "";

        if (this.props.total && this.props.completed) {
            hoverTitle = this.props.completed + ' / ' + this.props.total + ' Students';
        }

        if (this.props.average) {
            hoverTitle = this.props.average.department + " Average: " + this.props.average.value;
        }

        return (
            <div className="value-bar" title={hoverTitle}>
                <div className={"vb-bg " + level} style={{width : width}}>
                </div>
                <p>{this.props.value ? this.props.value : "N/A"}</p>
            </div>
        );
    }
});

module.exports = ValueBarComponent;
