const PORT = process.env.PORT || 8188;
const http = require('http');
const url = require('url');
const fs = require('fs');

const FILE_NAME = process.env.FILE_NAME || 'received.txt';
const FILE_OPTIONS = { 
	encoding: 'utf8',
	autoclose: true,
	flags: 'a'
};

let log;

function initLog() {
	 log = fs.createWriteStream(FILE_NAME, FILE_OPTIONS);
}

initLog();

const server = http.createServer();

server
	.on('request', (req, res) => {
		console.info(`${new Date()} incoming`);
		/*console.log({
			method: req.method,
			headers: req.headers,
			path: url.parse(req.url).pathname
		});*/

		const buffers = [];
		let buffersLength = 0;
		let data;

		req
			.on('data', chunk => {
				buffers.push(chunk);
				buffersLength += chunk.length;
			})
			.on('end', () => {
				data = Buffer.concat(buffers, buffersLength);
				log.write(data, 'utf8');
				log.write('\n');
			});

		res.end('ok');
	})
	.on('clientError', (err, socket) => {
		socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
	})
	.on('listening', () => {
		console.log(`listening ${PORT}`);
	})
	.listen(PORT);
