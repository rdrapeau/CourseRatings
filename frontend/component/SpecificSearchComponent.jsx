var React = require('react');
var Constants = require('../Constants');
var Select = require('react-select');

var SpecificSearchComponent = React.createClass({

    /**
     * Render the page
     */
    render: function() {
        var self = this;

        return (
            <div>
                <div title="Delete Class" onClick={function() { self.props.removeSearchBar(self.props.searchComponentID); }} className={"glyphicon glyphicon-minus" + (this.props.searchComponentID !== 0 ? "" : " opaque")}></div>

                <Select value={this.props.department ? this.props.department : null} className="departmentField" placeholder="Department" options={this.props.departmentList} onChange={function(department) { self.props.departmentChange(department, self.props.searchComponentID); }} />
                <Select disabled={this.props.department ? false : true} value={this.props.courseCode ? this.props.courseCode : null} className={"courseCodeField" + (this.props.department ? "" : " faded")} placeholder="Course Code" options={this.props.courseList} onChange={function(courseCode) { self.props.courseCodeChange(courseCode, self.props.searchComponentID); }} />

                <div title="Add More Classes" onClick={this.props.addSearchBar} className={"glyphicon glyphicon-plus" + (this.props.searchComponentID === this.props.numSearchBars - 1 ? "" : " opaque")}></div>
            </div>
        );
    }
});

module.exports = SpecificSearchComponent;
