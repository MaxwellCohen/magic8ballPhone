/*jshint unused: false */
'use strict';
var React = require('react');
var shake = require('./shake');

var Magic8ball = React.createClass({
	getInitialState: function() {
    return {
      ans: this.props.ans.getStartingAns(),
      size: 200,
      top: 50,
      left: 50,
      textStyle:{}
    };
  },
	updateAnswer: function(e) {
    navigator.notification.vibrate(200);
    this.fade( -1, function(){
      var partialState = {};
      partialState.ans = this.props.ans.getAns();
      this.setState(partialState, this.fade(1, function(){
        //shake.startWatch(this.updateAnswer, 20 /*, onError */);
        this.handleResize();}));
    }.bind(this));
	},
  fade: function(dir, callback){
      //dir = -1 fade out
      //dir = 1 fade in 
    var partialState = {},
      opacity = (dir ===-1) ? 1:0,
      delta = dir * 0.05,
      endVal = (1 + dir)/2,
      shakeEffect = -1,
      shakeEffect2 = 0,
      x = function(){
        opacity = opacity + delta;
        if (Math.abs(endVal - opacity) >= 0.01 ){
            partialState.textStyle = {opacity:opacity};
            shakeEffect *=-1;
            partialState.top = this.state.top - (shakeEffect* 4);
            shakeEffect = shakeEffect2 % 2 ? shakeEffect : shakeEffect*-1;
            partialState.left = this.state.left - (shakeEffect* 4);
            shakeEffect2++;
            setTimeout(function(){this.setState(partialState, x);}.bind(this), 4);
          }else{
            partialState.textStyle = {opacity:endVal};
            this.setState(partialState, callback);
          }
        }.bind(this);
      x();
  },
  handleResize: function() {
    var sizeRec = this.getDOMNode().getBoundingClientRect(),
    size = Math.min(sizeRec.width, sizeRec.height) * 0.9,
    top = (sizeRec.height - size )/2,
    left = (sizeRec.width - size )/2;
    this.setState({size: size, top: top, left:left});
  },
  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    //wait one second before turning hte shake on 
    setTimeout(function(){
      shake.startWatch(this.updateAnswer, 20 /*, onError */);}.bind(this), 1000);

  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
	render: function() {
    var styleOuterCirle = {
        height : this.state.size,
        width : this.state.size,
        backgroundSize: this.state.size,
        top:this.state.top,
        left:this.state.left
      },
    styleInterCirle = {
      height : this.state.size/2,
      width : this.state.size/2,
    };

		/* jshint ignore:start */
    return (
    <div onClick={this.updateAnswer} className='fullpage'>
      <div className=" outside" style={styleOuterCirle}>
        <div className="circle inside" style={styleInterCirle}>
            <div id="text" className="text" style={this.state.textStyle}>
                  {this.state.ans}
            </div>
        </div>
      </div>
     </div>

    );
    /* jshint ignore:end */
  }
});



  module.exports = Magic8ball;