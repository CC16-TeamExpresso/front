import React, {useState, useEffect} from 'react'
import './Post.css'


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

function Post() {
    
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
        <div className='post-box'>
            <p className='profile-name'>User Name</p>
            <p className='post-music'>Music being listened</p>
			<input className='post-input' onChange={(e) => setChatMessage(e.target.value)} value={chatMessage} />

			<button className='post-send-button' onClick={sendMessage}>send</button>
			
			<div className="comment-message">
				{chatMessages.map((message, index) => {
					return (
						<div  key={index}>
							<div className="comment-author">{message.user}</div>
							<div className="comment-text">{message.message}</div>
						</div>
					);
				})}
			</div>

            
        </div>
            
            )
}
export default Post;