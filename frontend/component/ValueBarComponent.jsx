var React = require('react');
var Constants = require('../Constants');
var JQuery = require('jquery');

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

        var averageStyle = null;
        if (this.props.average) {
            hoverTitle = this.props.average.department + " Average: " + this.props.average.value;
            var marginPercent = this.props.average.value / this.props.max * 100;

            averageStyle = {
                'width': '4px',
                'height': '100%',
                'backgroundColor': 'black',
                'marginLeft': marginPercent + '%',
                'position' : 'relative',
                'zIndex' : 100,
                'opacity' : 0.7
            };
        }

        return (
            <div className="value-bar" title={hoverTitle}>
                {averageStyle && (
                    <div className='averages' style={averageStyle}></div>
                )}
                <div className={"vb-bg " + level} style={{width : width}}></div>
                <p>{this.props.value ? this.props.value : "N/A"}</p>
            </div>
        );
    }
});

module.exports = ValueBarComponent;
