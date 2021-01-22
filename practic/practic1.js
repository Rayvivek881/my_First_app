const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) =>{
    res.setHeader('Content-type', 'text/html');
    let path = __dirname +'/views/';
    console.log(req.url);
    switch(req.url)
    {
        case '/':
            path += 'Home.html';
            res.statusCode = 200;
            break;
        case '/Login':
            path += 'Login.html';
            res.statusCode = 200;
            break;
        case '/Signup':
            path += 'Sign up.html';
            res.statusCode = 200;
            break;
        default: 
            path += 'error.html';
            console.log('defaulted');
            res.statusCode = 404;
    };
    fs.readFile(path, (err, data)=> {
        if(err) console.log(err);
        else res.end(data);
    });
});
server.listen(3000,'localhost', ()=> {
    console.log('listening on 3000');
})