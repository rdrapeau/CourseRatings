var React = require('react');
var JQuery = require('jquery');
var Constants = require('../Constants');
var OnScroll = require("react-window-mixins").OnScroll;

var OverviewHeaderComponent = require('./OverviewHeaderComponent.jsx');
var OverviewCourseRowComponent = require('./OverviewCourseRowComponent.jsx');

/**
 * Encapsulates the overview table of the application
 */
var OverviewComponent = React.createClass({
    mixins: [ OnScroll ],

    /**
     * Initalize the state
     */
    getInitialState : function() {
        return {
            current_courses : this.props.currentData,
            current_sort_key : null,
            current_sort_multiplier : 1,
            activeHeader : null,
            scrolledPast : false,
            barWidth : 0
        };
    },

    componentWillReceiveProps : function(next) {
    	this.setState({current_courses : next.currentData});
    	var elem = React.findDOMNode(this.refs.headerComp);
    	var header = elem.querySelector('th');

    	var headerTxt = header.innerHTML
    					.replace(' ↓', '')
    					.replace(' ↑', '');
    	var key = Constants.HEADER_TO_KEY[headerTxt];

    	this.setState({current_sort_key : key});

    	var elem = React.findDOMNode(this.refs.headerComp);

        this.addArrowToHeader(header, 1);
    },

    comparison : function(a, b) {
        var comparison = 0;
        // Else sort on Course Code
        if (comparison === 0) {
            if (a['course_whole_code'] < b['course_whole_code']) {
                comparison = -1;
            } else if (a['course_whole_code'] > b['course_whole_code']) {
                comparison = 1;
            }
        }

        // TODO: Else sort on Time

        // Else sort on Professor
        if (comparison === 0) {
            if (a['professor'] < b['professor']) {
                comparison = -1;
            } else if (a['professor'] > b['professor']) {
                comparison = 1;
            }
        }

        return comparison;
    },

    addArrowToHeader : function(domElement, multiplier) {
        if (this.state.activeHeader) {
            // Remove class
            var html = this.state.activeHeader.innerHTML;
            this.state.activeHeader.innerHTML = html.substring(0, html.length - 2);
        }

        // Add class to the new dom element
        domElement.innerHTML += multiplier === 1 ? ' ↓' : ' ↑' ;
        this.setState({activeHeader : domElement});
    },

    sortData : function(header, domElement) {
        // Sort on the header.
        var key = Constants.HEADER_TO_KEY[header];

        // Same key as last time
        var multiplier = this.state.current_sort_multiplier;
        if (this.state.current_sort_key === key) {
            // Flip the sort
            multiplier *= -1;
        } else {
            // Reset to normal Ascending sort
            multiplier = 1;
        }

        if (domElement) {
            this.addArrowToHeader(domElement, multiplier);
        } else {
            multiplier = 1;
        }

        // Remember states
        this.setState({current_sort_key : key});
        this.setState({current_sort_multiplier : multiplier});
        var self = this;
        this.state.current_courses.sort(function(a, b) {
            var comparison = 0;
            if (a[key] < b[key]) {
                comparison = -1;
            } else if (a[key] > b[key]) {
                comparison = 1;
            }

            if (comparison === 0) {
                comparison = self.comparison(a, b);
            }

            // Equal
            return comparison * multiplier;
        });

        // Force an update to the listeners
        this.setState({current_courses : this.state.current_courses});
    },

    onScroll: function() {
        var element = this.getDOMNode();
        var rect = element.getBoundingClientRect();
        var windowPos = window.pageYOffset;

        if (windowPos - element.offsetTop > 50) {
            this.setState({scrolledPast : true});
        } else {
            this.setState({scrolledPast : false});
        }

        this.setState({barWidth : rect.width});
    },

	/**
	 * Render
	 */
    render: function() {
    	var self = this;
        return (
            <div>
                {this.state.current_courses && (
        	        <table className="table table-curved" >
    	        	    <OverviewHeaderComponent headers={this.props.headers} onClickHeader={this.sortData} fixedHeader={true} scrollState={this.state.scrolledPast} width={this.state.barWidth} />
                        <OverviewHeaderComponent ref="headerComp" headers={this.props.headers} onClickHeader={this.sortData} fixedHeader={false} />

        	        	{this.state.current_courses.slice(0, Constants.SEARCH_RESULT_LIMIT).map(function(course) {
        	        		return (
                                <OverviewCourseRowComponent headers={self.props.headers} onClickCourse={self.props.onClickCourse} onClickInstructor={self.props.onClickInstructor} data={course} />
        	        		);
        	        	})}
        	        </table>
                )}
            </div>
        );
	}
});

module.exports = OverviewComponent;
