var React = require('react');
var Constants = require('../Constants');

var BarChartComponent = require('./BarChartComponent.jsx');

var ComparisonComponent = React.createClass({

    /**
     * Render the page
     */
    render: function() {
        return (
            <div>
                Comparison Component

                <BarChartComponent divId="compareBarChart" />
            </div>
        );
    }
});

module.exports = ComparisonComponent;
