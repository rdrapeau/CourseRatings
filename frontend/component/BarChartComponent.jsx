var React = require('react');
var JQuery = require('jquery');
var d3 = require('d3');
var Constants = require('../Constants');

var BarChartComponent = React.createClass({

    /**
     * Render the page
     */
    render: function() {

        // var courses = this.props.courses;
        // var compareKeys = this.props.compareKeys;
        // var depAverages = this.props.depAverages;

        return (
            <div id={this.props.divId} className="barCharBody"></div>
        );
    }
});

module.exports = BarChartComponent;
