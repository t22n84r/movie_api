const http = require('http'),
      url = require('url'),
      fs = require('fs');

http.createServer((request, response) => {
  let addr = request.url,
  parsed_url = url.parse(addr, true),
  filePath = '';

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('URL & timestamp added to log.');
    }
  });

  if (parsed_url.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
  } else {
      filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });

}).listen(8080);

console.log('HTTP server is running on Port 8080.');