var React = require('react');
var Constants = require('../Constants');

/**
 * Search bar for the class
 */
var SearchComponent = React.createClass({
    /**
     * Keeps track of the text being typed into the search bar
     */
    getInitialState: function() {
        return {searchValue: ''};
    },

    /**
     * Updates the state of the text being typed into the search bar
     */
    handleChange: function(event) {
        this.setState({searchValue: event.target.value});
    },

    /**
     * Handles the click by performing a search with the current value
     */
    handleClick: function() {
        this.props.searchFunction(this.state.searchValue);
    },

    handleKey: function(event) {
        if (event.which === 13) {
            this.handleClick();
        }
    },

    /**
     * Render the search bar
     */
    render: function() {
        return (
            <div id='search-bar-container'>
                <input id='search-input' className='form-control' placeholder='Course Code or Department or Professor' onChange={this.handleChange} onKeyUp={this.handleKey} />
                <button id="search-button" className="btn btn-default" onClick={this.handleClick} type="button" onKeyUp={this.handleKey}>Search</button>
            </div>
        );
    }
});

module.exports = SearchComponent;
