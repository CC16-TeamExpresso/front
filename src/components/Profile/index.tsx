import React, { useEffect, useState } from 'react';
import '../App.css';

type Message = {
	user: string;
	message: string;
	intent: 'chat';
};

function processMessage(payload: string) {
	try {
		return JSON.parse(payload);
	} catch (error) {
		return null; //unreadble data received
	}
}

export default function Profile() {
	const [chatMessage, setChatMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [wsRef, setWSRef] = useState<null | WebSocket>(null);

	function sendMessage() {
		if (wsRef?.readyState !== WebSocket.OPEN) {
			return;
		}
		//websocket connected
		wsRef.send(JSON.stringify({ message: chatMessage }));
	}

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:1338');
		ws.addEventListener(
			'open',
			() => {
				ws.send(JSON.stringify({ status: 'okkk' }));
			},
			{ once: true }
		);

		ws.addEventListener('message', (event) => {
			//getting message from the server
			const data = event.data; //message arrives here
			const message: null | Message = processMessage(data);
			if (!message) return; //apending old messages so they wont be lost
			if (message.intent === 'chat') {
				//keeping all comments or messages
				setChatMessages((oldMessages) => {
					return [...oldMessages, message];
				});
			}
		});

		setWSRef(ws);
		return () => {
			ws.close();
		};
	}, []);

	return (
		<div className='post-container'>

			<div>
				{chatMessages.map((message, index) => {
					return (
						<div className="message" key={index}>
							<div className="author">{message.user}</div>
							<div className="text">{message.message}</div>
						</div>
					);
				})}
			</div>
			<input onChange={(e) => setChatMessage(e.target.value)} value={chatMessage} />

			<button onClick={sendMessage}>send</button>
		</div>
	);
}
