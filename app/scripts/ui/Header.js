/*jshint unused: false */
'use strict';
var React = require('react');

var Header = React.createClass({
	 /* jshint ignore:start */
	 render: function() {
	 	return(
			<header className='navbar-inverse navbar-fixed-top' >
            	<Title titleLabel='Magic 8 Ball' />
	     	</header>
	 	);
	 }
	 /* jshint ignore:end */
});

var Title = React.createClass({
	 /* jshint ignore:start */
	render: function() {
	 	return(
	 		<div className='center white noDecoration'>
            	<h1>{this.props.titleLabel}</h1>
            </div>
        );
	}
	/* jshint ignore:end */
});
  module.exports = Header;
