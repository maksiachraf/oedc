import React from 'react'
import './Room.css'

import { withRouter } from 'react-router-dom'

class Room extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			room: {},
			value: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onQuit = this.onQuit.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		window.chat(this.state.value, "message")
		this.setState({ value: '' });

		//setTimeout(() => { }, 500)		// Sleep time to give time to catch up when a new room is created
		// Fetch the information for current room
		fetch('http://localhost:9000/browser' + window.location.pathname)
			.then((response) => {
				return response.json()  // Convert the response object to JSON data
			})
			.then((res) => {            // Get the result of JSON response data
				if (res[0] !== undefined)
					this.setState({ room: res[0] })
			})
			.then(() => {
				// PATCH current information to add current user to the document
				const requestOptions = {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: this.state.room.title,
						visibility: this.state.room.visibility,
						maxusers: this.state.room.maxusers,
						connusers: this.state.room.connusers + 1,
						url: this.state.room.url,
						password: (this.state.room.password) ? this.state.room.password : ""
					})
				}

				fetch("http://localhost:9000/browser/" + this.state.room._id, requestOptions)
					.then(async response => {
						const data = await response.json();

						// check for error response
						if (!response.ok) {
							// get error message from body or default to response status
							const error = (data && data.message) || response.status;
							return Promise.reject(error);
						}

						//this.setState({ postId: data.id })
					})
					.catch(error => {
						//this.setState({ errorMessage: error.toString() });
						console.error('There was an error!', error);
					});
			})
	}

	componentDidMount() {
		const script = document.createElement("script");
		script.async = true;
		script.src = "http://localhost:9000/javascripts/chat.js";
		this.div.appendChild(script);
	}

	onQuit() {
		// Adding event listener for removal in DB when user disconnect
		// Fetch the information for current room
		fetch('http://localhost:9000/browser' + window.location.pathname)
			.then((response) => {
				return response.json()  // Convert the response object to JSON data
			})
			.then((res) => {            // Get the result of JSON response data
				if (res[0] !== undefined)
					this.setState({ room: res[0] })
			})
			.then(() => {
				// PATCH current information to remove current user to the document
				const requestOptions = {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: this.state.room.title,
						visibility: this.state.room.visibility,
						maxusers: this.state.room.maxusers,
						connusers: this.state.room.connusers - 1,
						url: this.state.room.url,
						password: (this.state.room.password) ? this.state.room.password : ""
					})
				}

				fetch("http://localhost:9000/browser/" + this.state.room._id, requestOptions)
					.then(async response => {
						const data = await response.json();

						// check for error response
						if (!response.ok) {
							// get error message from body or default to response status
							const error = (data && data.message) || response.status;
							return Promise.reject(error);
						}

						//this.setState({ postId: data.id })
					})
					.catch(error => {
						//this.setState({ errorMessage: error.toString() });
						console.error('There was an error!', error);
					})
					.then(() => {
						window.location.href = "http://localhost:3000"

					})
			})
	}

	render() {
		return (
			<div className='room' ref={el => (this.div = el)}>
				<div className="container" id="chat-box">
					<div className="row text-center" id="top-row">
						<div className="col-md-auto">
							<img className="profile-image" src="https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png">

							</img>
						</div>
						<div className="col-sm" id="Bar-elements">
							{(this.state.room.title) ? this.state.room.title : "Loading..."}
						</div>
						<div className="col-md-auto">
							<a className="btn btn-primary" onClick={this.onQuit} role="button">Quit</a>
						</div>
					</div>
					<div id="chatbox"></div>
					<div className="no-gutters p-3">
						<form onSubmit={this.handleSubmit}>
							<textarea className="form-control" rows="1" value={this.state.value} onChange={this.handleChange}></textarea>
							<div className="text-right">
								<button className="btn btn-primary" type="submit" >Send message</button>
							</div>
						</form>
					</div>
				</div>
				<div className="row">
					<div className="col-sm"></div>
					<div className="col-md-auto" id="qrcode"></div>
					<div className="col-sm"></div>
				</div>
			</div>
		)
	}
}

export default withRouter(Room)
