var React = require('react');
var Constants = require('../Constants');

var TopKComponent = React.createClass({

    topKResults: function() {
        var collapsed = {};

        for (var i = 0; i < this.props.data.length; i++) {
            var key = this.props.data[i][this.props.featureKey];
            if (key in collapsed) {
                collapsed[key].push(this.props.data[i]);
            } else {
                collapsed[key] = [this.props.data[i]];
            }
        }

        var result = [];
        for (var key in collapsed) {
            result.push({key : key, label : (this.props.additionalLabel && collapsed[key][0][this.props.additionalLabel] ? ': ' + collapsed[key][0][this.props.additionalLabel] : '')});

            var sum = 0.0;
            for (var i = 0; i < collapsed[key].length; i++) {
                sum += collapsed[key][i].the_course_as_a_whole;
            }

            collapsed[key] = sum / collapsed[key].length + 20.0 * collapsed[key].length / this.props.data.length;
        }

        result.sort(function(a, b) {
            if (collapsed[a.key] < collapsed[b.key]) {
                return 1;
            } else if (collapsed[b.key] < collapsed[a.key]) {
                return -1;
            }

            return 0;
        });

        result = result.slice(0, this.props.k);
        var labeledResults = [];

        for (var i = 0; i < result.length; i++) {
            labeledResults.push(result[i].key + result[i].label);
        }

        return labeledResults;
    },

    render: function() {
        var self = this;
        var topResults = this.topKResults();
        return (
            <div>
                {topResults.map(function(entry) {
                    return (
                        <div className="topLabels" onClick={function() { entry.indexOf(':') === -1 ? self.props.onClickLabel(entry) : self.props.onClickLabel(entry.substring(0, entry.indexOf(':')))}}>{entry}</div>
                    );
                })}
            </div>
        );
    }
});

module.exports = TopKComponent;
