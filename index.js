const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const baseDirectory = __dirname
const port = 7000;

http.createServer(function (request, response) {
    try {
        let requestUrl = url.parse(request.url)

        //Use path.normalize so people can't access directories underneath baseDirectory
        let fsPath = baseDirectory+path.normalize(requestUrl.pathname)

        let fileStream = fs.createReadStream(fsPath)
        fileStream.pipe(response)
        fileStream.on('open', function() {
             response.writeHead(200)
        })
        fileStream.on('error',function(e) {
             response.writeHead(404)// assume the file doesn't exist
             response.end()
        })
   } catch(e) {
        response.writeHead(500)
        response.end()
        console.log(e.stack)
   }
}).listen(port)