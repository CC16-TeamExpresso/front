import React, { useEffect, useState } from 'react';

export default function Profile() {
	const [chatMessage, setChatMessage] = useState('');
	const [wsRef, setWSRef] = useState<null | WebSocket>(null);

	function sendMessage() {
		if (wsRef?.readyState !== WebSocket.OPEN) {
			return;
		}
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
		setWSRef(ws);
		return () => {
			ws.close();
		};
	}, []);

	return (
		<div>
			<h1>testing comments</h1>
			<input onChange={(e) => setChatMessage(e.target.value)} />

			<button onClick={sendMessage}>send</button>
		</div>
	);
}
