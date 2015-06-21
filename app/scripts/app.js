/*jshint unused: false */
/*global require*/
'use strict';
var React = window.React = require('react'),
    //Timer = require('./ui/Timer'),
    Header = require('./ui/Header'),
    Magic8ballView = require('./ui/Magic8BallView'),
    Magic8ballModel = require('./data/Magic8BallData'),
    Footer = require('./ui/Footer'),

    mountNode = document.getElementById('app');

var App = React.createClass({
   getInitialState: function() {
    return {};
  },
    render: function() {
          /* jshint ignore:start */
    return (
      <div>
        <Header ans={Magic8ballModel()}/>
        <Magic8ballView ans={Magic8ballModel()} />
        <Footer />
      </div>
    );
        /* jshint ignore:end */
  }

});


/* jshint ignore:start */
document.addEventListener('deviceready', function(){
  React.render(<App />, mountNode);
}, false);

/* jshint ignore:end */
