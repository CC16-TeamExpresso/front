import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Post.css';
require('dotenv').config();

const WEBSOCKET_PATH = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:1338';

type Message = {
	user: string;
	postId: string;
	message: string;
	intent: 'chat';
	//add date
};

function processMessage(payload: string) {
	// move it utility
	try {
		return JSON.parse(payload);
	} catch (error) {
		return null; //unreadble data received
	}
}

function Post(props: any) {
	const [showComment, setShowComment] = useState(false);
	const [chatMessage, setChatMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [wsRef, setWSRef] = useState<null | WebSocket>(null);
	const [commentLikes, setCommentLikes] = useState(0);

	function increaseLikes() {
		setCommentLikes(commentLikes + 1);
	}

	const history = useHistory();

	function sendMessage() {
		if (wsRef?.readyState !== WebSocket.OPEN) {
			return;
		}
		//websocket connected
		wsRef.send(JSON.stringify({ message: chatMessage, intent: 'chat', postId: props.id })); //this is sent to wsfunctions as "new message"
		setChatMessage(''); //no repeated messages
	}

	useEffect(() => {
		const ws = new WebSocket(`${WEBSOCKET_PATH}/` + localStorage.getItem('token')); //token is added for authentication as url so it can be extracted
		// ws.addEventListener(
		// 	'open',
		// 	() => {
		// 		ws.send(JSON.stringify({ status: 'okkk' }));
		// 	},
		// 	{ once: true }
		// );

		ws.addEventListener(
			'open',
			() => {
				ws.send(
					JSON.stringify({
						postId: props.id,
						intent: 'old-messages',
						count: 5, //for now 5 comments
					})
				);
			},
			{ once: true }
		); //when the user opens the comments its starts with no comments

		ws.addEventListener('error', () => {
			//handle the error if the person isnt logged or has no token
			//you can check this by clering local storage after login and you will get this alert
			alert('you are not logged in, log in first to comment');
			history.replace('/login');
		});

		ws.addEventListener('message', (event) => {
			//getting message from the server
			const data = event.data; //message arrives here
			const message: any = processMessage(data);
			if (!message) return; //apending old messages so they wont be lost
			if (message.postId !== props.id) return;
			if (message.intent === 'chat') {
				//keeping all comments or messages
				setChatMessages((oldMessages) => {
					//this is meant to keep all old comments in chat messages here
					return [...oldMessages, message as Message]; //appending heppen here
				});
			} else if ((message.intent = 'old-messages')) {
				// once page is refreshed the intent is always "old messages" by default and code will jumb here from after "event listner" for opn
				console.log(message.data, 'older comments'); //please check older comments
				setChatMessages(
					message.data
						.map((item: any) => {
							return { user: item.email, message: item.message };
						})
						.reverse()
				);
			}
		});

		setWSRef(ws);
		return () => {
			ws.close();
		};
	}, []);

	function handleShowComments() {
		setShowComment(!showComment);
	}

	return (
		<div className="post-box">
			<div>
				<div className="profile-name">{props.username}</div>
				<div>
					<iframe
						src={`https://open.spotify.com/embed/${props.uri}`}
						width="300"
						height="80"
						frameBorder="0"
						allowTransparency={true}
						allow="encrypted-media"
					></iframe>
				</div>
			</div>
			<div>
				{!props.isHistory ? (
					<textarea
						className="post-input"
						onChange={(e) => setChatMessage(e.target.value)}
						value={chatMessage}
					/>
				) : (
					<p></p>
				)}
				<div className="button-container">
					{!props.isHistory ? (
						<button className="comment-send-button" onClick={sendMessage}>
							comment
						</button>
					) : (
						<p></p>
					)}
					<button className="like-button" onClick={increaseLikes}>
						likes {commentLikes}
					</button>

					<div></div>
				</div>
			</div>
			<div className="comment-message" onClick={handleShowComments}>
				<button className="display-comments-button">display comments</button>
				<div>
					{showComment ? (
						<p>
							{' '}
							{chatMessages.map((message, index) => {
								//index is the key
								return (
									<div key={index}>
										<div className="comment-author">{message.user}</div>
										<div className="comment-text">{message.message}</div>
									</div>
								);
							})}
						</p>
					) : (
						<p></p>
					)}
				</div>
			</div>
		</div>
	);
}
export default Post;
