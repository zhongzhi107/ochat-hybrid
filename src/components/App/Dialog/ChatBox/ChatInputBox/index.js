import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
// import Ajax from 'ajax';
import _ from 'lodash';


class ChatInputBox extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ChatInputBox.less');
		}
	}

	render () {
		return (
			<div className="chatInputBox" >
				<textarea className="chatInput" ref="text" defaultValue={this.props.input}
					onChange={(e) => this.handleChange(e)}
					onKeyDown={(e) => this.handleKeyDown(e)}
					onKeyUp={(e) => this.handleKeyUp(e)}
					onPaste={(e) => this.handlePaste(e)}
					onDrop={(e) => this.handleDrop(e)} ></textarea>
				<div className="chatSend">
					<div className="multimedia">
						<div className="sendImage" title="点击发送图片" onClick={(e) => this.chooseImage(e)}>
							<input ref="sendImage" type="file" accept="image/*" className="hide" onChange={(e) => this.sendImageMessage(e)} />
						</div>
					</div>
					<span>最长输入375个字，按下Ctrl+Enter换行</span>
					<a className="btn btn-send" href="javascript:void(0);"
						onClick={(e) => this.sendMessage(e)} >发送(Enter)</a>
				</div>
			</div>
		);
	}

	handleChange(e) {
		e.target.value = e.target.value.substr(0, 375);
	}

	handleKeyDown(e) { // 防止一按回车还没松开就已经换行了
		e = e.nativeEvent;
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	}

	handleKeyUp(e) {
		e = e.nativeEvent;
		if (e.keyCode === 13) {
			e.preventDefault();
			if(e.ctrlKey) { // Ctrl + Enter 换行
				this.refs.text.getDOMNode().value += '\n';
			} else { // Enter 发送
				this.sendMessage();
			}
		}
	}

	handlePaste(e) {
		e = e.nativeEvent;
		if(e.clipboardData) {
			let type = e.clipboardData.types[0];
			let item = e.clipboardData.items[0];
			if(type && type === 'Files' && item && item.kind === 'file' && item.type.match(/^image\//i)) {
				console.log(item);
				let imageFile = item.getAsFile();
				console.log(imageFile);
				this.uploadImage(imageFile);
			}
		}
	}

	handleDrop(e) {
		e.preventDefault();
		e = e.nativeEvent;
		if(e.dataTransfer.files) {
			let file = e.dataTransfer.files[0];
			console.log(file);
			if(file.type.indexOf('image') > -1) {
				this.uploadImage(file);
			}
		}
	}

	sendMessage(e) {
		let ctnt = this.refs.text.getDOMNode().value;
		if(ctnt.trim() === '') return;
    let data = {
      t: 5,
      tp: 1,
      ctnt: ctnt,
      st: new Date().getTime()
    };
    this.refs.text.getDOMNode().value = '';
		this.props.sendMessage(data);
	}

	chooseImage(e) {
		this.refs.sendImage.getDOMNode().click();
	}

	sendImageMessage(e) {
		let imageFile = this.refs.sendImage.getDOMNode().files[0];
		this.uploadImage(imageFile);
	}

	uploadImage(file) {
		let mId = _.random(10000);

		let form = new FormData();
		form.append('file', file);

		let xhr = new XMLHttpRequest();
		xhr.open('post', '/api/upload?mId=' + mId, true);
		xhr.credentials = true;

		// xhr.upload.addEventListener('progress', this.uploadImageProgressHandle, false);
		xhr.upload.onprogress = this.uploadImageProgressHandle;

		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status) {
				let res = JSON.parse(xhr.responseText);
				console.log(`%c${res.bstatus.desc}`, 'color: #e92a4f');
				console.log(res);
				if(res.bstatus.code === 0) { // 上传成功
					this.sendImage(res.data.imgs[0].url, res.data.extinfo.mId);
				}
			}
		}

		xhr.send(form);
	}

	uploadImageProgressHandle(e) {
		let percentComplete = (e.loaded / e.total) * 100;
		console.log(`Image upload progress: ${percentComplete}%`);
	}

	sendImage(url, mId) {
		let data = {
			t: 5,
			tp: 2,
			mId: mId,
			ctnt: url,
			st: new Date().getTime()
		};
		this.props.sendMessage(data);
	}

}

export default ChatInputBox;
