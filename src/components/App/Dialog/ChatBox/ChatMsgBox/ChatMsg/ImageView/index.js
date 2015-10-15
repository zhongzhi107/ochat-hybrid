import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../../../../utils/dom.js';


class ImageView extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ImageView.less');
		}
	}

	componentDidMount() {

	}

	render () {
		return (
			<div className="imageView" onClick={(e) => this.handleClick(e)}>
				<div className="imageViewMask"></div>
				<div className="imageViewContainer">
					<div className="imageContainer">
						<img ref="image" src={this.props.src} style={{transform: 'rotate(0)'}}
							onWheel={(e) => this.zoomImage(e)}
							onDoubleClick={(e) => this.props.hideImageView(e)} />
					</div>
					<div className="oprContainer">
						<div className="download"><a href={this.props.src} target="_blank"></a></div>
						<div className="rotate"><a onClick={(e) => this.rotateImage(e)}></a></div>
					</div>
				</div>
			</div>
		);
	}

	handleClick(e) {
		let target = $.closest(e.target, 'img') || $.closest(e.target, '.oprContainer');
		if(!target) {
			this.props.hideImageView();
		}
	}

	rotateImage(e) {
		let image = this.refs.image.getDOMNode();
		let transform = image.style.transform;
		let rotate = parseInt(transform.match(/\((\d+)deg/)[1]);
		let newRotate = (rotate + 90)%360;
		image.style.transform = `rotate(${newRotate}deg)`;
	}

	zoomImage(e) {
		//TODO
	}






}

export default ImageView;
