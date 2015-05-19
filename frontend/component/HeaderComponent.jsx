var React = require('react');
var Constants = require('../Constants');

/**
 * Encapsulates the header of the application
 */
var HeaderComponent = React.createClass({
	/**
	 * For the current screen property, return a text that matches it.
	 * @return {string} Screen display name
	 */
	getScreenText : function () {
		switch (this.props.screen) {
			case Constants.SCREENS.OVERVIEW:
				return "Overview";
        	case Constants.SCREENS.ORG_DETAILS:
        		return "Course Details";
		}
		return "";
	},

	/**
	 * Render the header
	 */
    render: function() {
    	var screenText = this.getScreenText();
        return (
	        <div id="header">
	        	<img src="img/title.png" />
	        </div>
        );
	}
});

module.exports = HeaderComponent;
