var React = require('react');
var Constants = require('../Constants');

/**
 * Encapsulates the header of the application
 */
var HeaderComponent = React.createClass({
	/**
	 * Render the header
	 */
    render: function() {
        return (
	        <div id="header" onClick={this.props.onImgClick}>
	        	<img src="img/title.png" />
	        </div>
        );
	}
});

module.exports = HeaderComponent;
