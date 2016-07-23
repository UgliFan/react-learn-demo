require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

let imageDatas = (function genImgURL(imageDatasArr){
	imageDatasArr.forEach((single,i)=>{
		single.imageURl = require('../images/'+single.name);
		imageDatasArr[i] = single;
	});
	return imageDatasArr;
})(require('../data/imageUrls.json'));

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
