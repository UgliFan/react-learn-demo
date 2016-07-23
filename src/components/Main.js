require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = (function genImgURL(imageDatasArr){
	imageDatasArr.forEach((single,i)=>{
		single.imageURL = require('../images/'+single.name);
		imageDatasArr[i] = single;
	});
	return imageDatasArr;
})(require('../data/imageUrls.json'));

var ImageFigure = React.createClass({
	handleClick:function(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();			
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},
	render:function(){
		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		if(this.props.arrange.rotate && this.props.arrange.rotate!==0){
			['MozTransform','msTransform','WebkitTransform','transform'].forEach((value)=>{
				styleObj[value] = `rotate(${this.props.arrange.rotate}deg)`;
			},this);
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "img-figure";
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse':'';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}/>
				<figcation>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcation>
			</figure>
		);
	}
});

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imgsArrangeArr:[]};
    this.Constant={
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	};

	this.getRangeRandom = (low,hight)=>{
		return Math.ceil(Math.random() * (hight-low) + low);
	};
	this.get30DegRandom = ()=>{
		return (Math.random()>0.5?'':'-') +Math.ceil(Math.random() * 30);
	};

	this.inverse = (index)=>{
		return function (){
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this);
	};
	this.center = (index)=>{
		return function(){
			this.rearrange(index);
		}.bind(this);
	};

	this.rearrange = function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

		imgsArrangeCenterArr[0] = {
			pos:centerPos,
			rotate:0,
			isCenter:true
		};

		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		imgsArrangeTopArr.forEach((value,index)=>{
			imgsArrangeTopArr[index] = {
				pos:{
					top:this.getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left:this.getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate:this.get30DegRandom(),
				isCenter:false
			}
		},this);

		const k = imgsArrangeArr.length / 2;
		imgsArrangeArr.forEach((imgsArrage,i,arr)=>{
			var hPosRangeLORX = null;
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imgsArrangeArr[i] = {
				pos:{
					top:this.getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left:this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate:this.get30DegRandom(),
				isCenter:false
			};
		},this);

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr:imgsArrangeArr
		});
	};
  }
  componentDidMount(){
  	var StageDOM = ReactDOM.findDOMNode(this.refs.stage),
  		stageW = StageDOM.scrollWidth,
  		stageH = StageDOM.scrollHeight,
  		halfStageW = Math.ceil(stageW / 2),
  		halfStageH = Math.ceil(stageH / 2);

  	var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
  		imgW = imgFigureDOM.scrollWidth,
  		imgH = imgFigureDOM.scrollHeight,
  		halfImgW = Math.ceil(imgW / 2),
  		halfImgH = Math.ceil(imgH / 2);

  	this.Constant.centerPos = {
  		left:halfStageW - halfImgW,
  		top:halfStageH - halfImgH
  	};

  	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
  	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  	this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  	this.Constant.hPosRange.y[0] = -halfImgH;
  	this.Constant.hPosRange.y[1] = stageH - halfImgH;

  	this.Constant.vPosRange.topY[0] = -halfImgH;
  	this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
  	this.Constant.vPosRange.x[0] = halfStageW - imgW;
  	this.Constant.vPosRange.x[1] = halfStageW;

  	this.rearrange(0);
  }
  render() {
  	var controllerUnits = [],
  		imgFigures = [];

  	imageDatas.forEach((value,i)=>{
  		console.log(this.state);
  		if(!this.state.imgsArrangeArr[i]){
  			this.state.imgsArrangeArr[i] = {
  				pos:{
  					left:0,
  					top:0
  				},
  				rotate:0,
  				isInverse:false, //正反面
  				isCenter:false
  			};
  		}
		imgFigures.push(<ImageFigure key={'imgFigure'+i} ref={'imgFigure'+i} data={value} arrange={this.state.imgsArrangeArr[i]} inverse={this.inverse(i)} center={this.center(i)}/>);
  	},this);

    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps={
};

export default AppComponent;
