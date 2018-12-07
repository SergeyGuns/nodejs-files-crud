import http from 'http'
import fs from 'fs'
import URL from 'url'
import qs from 'querystring'
import formidable from 'formidable'
import path from 'path'
import { fileList, createFile, uploadFile } from './index.tmpl.mjs'
const STORE_PATH = './storage'
const toStr = data => JSON.stringify(data, null, ' ')

function getListener(req, res, url) {
  if (url.path === '/') {
  }
  if (~url.path.indexOf('/static')) {
    const filePath = url.path.replace('/static', STORE_PATH)

    var extname = path.extname(filePath)
    var contentType = ''
    switch (extname) {
      case '.js':
        contentType = 'text/javascript'
        break
      case '.css':
        contentType = 'text/css'
        break
      case '.json':
        contentType = 'application/json'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.svg':
        contentType = 'image/svg'
        break
      case '.jpg':
        contentType = 'image/jpg'
        break
      case '.wav':
        contentType = 'audio/wav'
        break
    }

    fs.readFile(filePath, function(error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          fs.readFile('./404.html', function(error, content) {
            res.writeHead(200, {
              'Content-Type': contentType,
            })
            res.end(content, 'utf-8')
          })
        } else {
          res.writeHead(500)
          res.end(
            'Sorry, check with the site admin for error: ' +
              error.code +
              ' ..\n',
          )
          res.end()
        }
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
        })
        res.end(content, 'utf-8')
      }
    })
  }
  if (url.path === '/list') {
    fs.readdir(STORE_PATH, (err, data) => {
      err && res.end(err)
      res.setHeader('content-type', 'text/html')
      res.end(fileList(data))
    })
  }
  if (url.path === '/create') {
    res.setHeader('content-type', 'text/html')
    res.end(createFile())
  }
  if (url.path === '/upload') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    res.write(uploadFile())
    return res.end()
  }
}
//https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp
function postListener(req, res, url) {
  if (url.path === '/upload') {
    const form = new formidable.IncomingForm()
    form.uploadDir = STORE_PATH
    form.parse(req, function(err, fields, files) {
      console.log(files)
      const oldpath = files.filetoupload.path
      const newpath = STORE_PATH + '/' + files.filetoupload.name
      fs.rename(oldpath, newpath, function(err) {
        if (err) throw err
        res.writeHead(302, {
          Location: '/list',
          //add other headers here...
        })
        res.end()
      })
    })
  }
  if (url.path === '/create') {
    let body = ''

    req.on('data', function(data) {
      body += data

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) req.connection.destroy()
    })

    req.on('end', function() {
      let post = qs.parse(body)
      fs.writeFile(
        `${STORE_PATH}/${post.filename}`,
        post.content,
        (err, ok) => {
          if (err) res.end(err)
          res.writeHead(302, {
            Location: '/list',
            //add other headers here...
          })
          res.end()
        },
      )
      // use post['blah'], etc.
    })
  }
}

function deleteListener(req, res, url) {
  console.log(url.path)
  fs.unlink(`${STORE_PATH}/${url.path}`, err => {
    if (err) res.end(err)
    res.end(200)
  })
}

const server = http
  .createServer(function(req, res) {
    const url = URL.parse(req.url)
    req.method === 'GET' && getListener(req, res, url)
    req.method === 'POST' && postListener(req, res, url)
    req.method === 'DELETE' && deleteListener(req, res, url)
    console.log(url.method)
    // res.end('ok')
  })
  .listen(3000)

server.on('error', function(e) {
  // Handle your error here
  console.log(e)
})
