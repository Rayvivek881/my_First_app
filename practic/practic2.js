const { fileLoader } = require("ejs");
const express = require("express");
const { result } = require("lodash");
const app = express();
const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const dbu = `mongodb+srv://vivek:vive@123@cluster0.erfla.mongodb.net/nodetuts?retryWrites=true&w=majority`;


mongoose.connect(dbu, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log('got an error'));


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('we are working');
});

app.get('/', (req, res) => {
    // res.sendFile('/views/Home.html', {root: __dirname});
    res.render('index', { name: '', id: '' });
});

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            const obj = {
                id: result._id,
                name: result.name,
                email: result.email,
                username: result.username,
                flag: 0,
                temp: 0
            }
            res.render('edit', obj);
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/profile-update/:id', (req, res) => {
    const _id = req.params.id;
    Blog.findById(_id)
        .then(result => {
            let passward = result['passward'];
            if (req.body['p1'] != '') {
                passward = req.body['p1'];
            }
            if (req.body['passward'] == result['passward']){
                Blog.updateOne({ _id }, {
                    $set: {
                        passward: passward,
                        name: req.body['name'],
                        email: req.body['email']
                    }
                }, { useFindAndModify: false })
                    .then((result1) => {
                        console.log(`profile updated`);
                        const obj = {
                            _id: _id,
                            name: req.body['name'],
                            email: req.body['email'],
                            username: req.body['username']
                        }
                        console.log(obj);
                        res.render('profile', {result: obj})
                    })
                    .catch((err) => {
                        console.log('unabale to update your profile');
                    })
            } else {
                console.log('wrong password');
                const obj = {
                    id: _id,
                    name: result.name,
                    email: result.email,
                    username: result.username,
                    flag: 1,
                    temp: 0
                }
                res.render('edit', obj)
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/Login', (req, res) => {
    // res.sendFile('/views/Login.html', {root: __dirname});
    res.render('Login');
});

app.get('/chats/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
        .then((result) => {
            const obj = {
                id: id,
                chats1: JSON.parse(result['chats1']),
                chats2: JSON.parse(result['chats2']),
                chats3: JSON.parse(result['chats3']),
                fname: result['name']
            }
            res.render('chats', obj);
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/Signup', (req, res) => {
    // res.sendFile('/views/Sign up.html', {root: __dirname});
    res.render('Sign up');
});

app.post('/back-to-home', (req, res) => {
    console.log('back to home');
    res.render('index', req.body)
})

app.get('/massage/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('Massage', { flag: 0, fname: result['name'], idf: id, temp: 0 });
        })
        .catch((err) => {
            console.log('got an err');
        })
});

app.post('/massage-usernsme', (req, res) => {
    Blog.find()
        .then((result) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i]['username'] == req.body['username']) {
                    const obj = {
                        flag: 2,
                        tname: result[i]['name'],
                        fname: req.body['fname'],
                        idt: result[i]['_id'],
                        idf: req.body['idf'],
                        temp: 0
                    }
                    res.render('Massage', obj);
                    break;
                }
            }
            const obj = {
                flag: 1,
                username: req.body['username'],
                idf: req.body['idf'],
                fname: req.body['fname'],
                temp: 0
            }
            if (i == result.length) res.render('Massage', obj);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
});

app.post('/massage-send/:idt', (req, res) => {
    const idt = req.params.idt;
    const idf = req.body['idf'];
    const fname = req.body['fname'];
    const tname = req.body['tname'];
    console.log(fname);
    console.log(tname);
    Blog.findById(idt)
        .then((result) => {
            let _id = idt;
            let chats1 = JSON.parse(result['chats1']);
            let chats2 = JSON.parse(result['chats2']);
            let chats3 = JSON.parse(result['chats3']);
            chats2.push(req.body['massage']);
            chats1.push([fname, tname]);
            chats3.push(idf);
            Blog.updateOne({ _id }, {
                $set: {
                    chats1: JSON.stringify(chats1),
                    chats2: JSON.stringify(chats2),
                    chats3: JSON.stringify(chats3)
                }
            }, { useFindAndModify: false })
                .then((result) => {
                    Blog.findById(idf)
                        .then((result1) => {
                            _id = idf;
                            chats1 = JSON.parse(result1['chats1']);
                            chats2 = JSON.parse(result1['chats2']);
                            chats3 = JSON.parse(result1['chats3']);
                            chats2.push(req.body['massage']);
                            chats3.push(idt);
                            chats1.push([fname, tname]);
                            Blog.updateOne({ _id }, {
                                $set: {
                                    chats1: JSON.stringify(chats1),
                                    chats2: JSON.stringify(chats2),
                                    chats3: JSON.stringify(chats3)
                                }
                            }, { useFindAndModify: false })
                                .then((result2) => {
                                    console.log('updated');
                                    let obj = {
                                        flag: 2,
                                        tname: tname,
                                        fname: fname,
                                        idt: idt,
                                        idf: idf,
                                        temp: 1
                                    }
                                    res.render('Massage', obj);
                                })
                                .catch((err2) => {
                                    console.log('failed to update');
                                })
                        })
                        .catch((err1) => {
                            console.log(err1);
                        });
                })
                .catch((err3) => {
                    console.log(err3);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post('/delete/:id', (req, res) => {
    const _id = req.params.id;
    const index = req.body['index'];
    Blog.findById(_id)
        .then((result) => {
            let chats1 = JSON.parse(result['chats1']);
            let chats2 = JSON.parse(result['chats2']);
            let chats3 = JSON.parse(result['chats3']);
            let fname = result['name'];
            console.log(req.body);
            if (req.body['massage'] == chats2[index]){
                chats1.splice(index, 1);
                chats2.splice(index, 1);
                chats3.splice(index, 1);
            }
            Blog.updateOne({ _id }, {
                $set: {
                    chats1: JSON.stringify(chats1),
                    chats2: JSON.stringify(chats2),
                    chats3: JSON.stringify(chats3)
                }
            }, { useFindAndModify: false })
                .then((result) => {
                    console.log('chat deleted');
                    const obj = {
                        id: _id,
                        chats1: chats1,
                        chats2: chats2,
                        chats3: chats3,
                        fname: fname
                    }
                    res.render('chats', obj)
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});


app.get('/all-1221', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
        .then((result) => {
            console.log('success');
            result['passward'] = undefined;
            res.render('profile', { result: result });
        })
        .catch((err) => {
            console.log(err);
        });
})

app.post('/replay', (req, res) => {
    const obj = {
        flag: 2,
        fname: req.body['fname'],
        tname: req.body['tname'],
        idf: req.body['idf'],
        idt: req.body['idt'],
        temp: 0
    }
    res.render('Massage', obj);
})

app.post('/Login', (req, res) => {
    if (req.body['nPassward'] != req.body['cp']) {
        console.log(`passward don't match`);
        res.render('Sign up');
    }
    else {
        Blog.find()
            .then((result) => {
                let falge = true;
                for (var i = 0; i < result.length; i++) {
                    if (result[i]['username'] == req.body['username']) {
                        console.log('username already exist');
                        res.render('Sign up');
                        break;
                    }
                    if (result[i]['email'] == req.body['email']) {
                        console.log('email has taken');
                        res.render('Sign up');
                        break;
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
        const blogs = new Blog({
            name: req.body['name'],
            username: req.body['username'],
            email: req.body['email'],
            passward: req.body['nPassward'],
            chats1: JSON.stringify([]),
            chats2: JSON.stringify([]),
            chats3: JSON.stringify([]),
        });
        blogs.save()
            .then((result) => {
                console.log('got saved');
            })
            .catch((err) => {
                console.log(err);
            })
        res.render('Login');
    }
})

app.post('/', (req, res) => {
    Blog.find()
        .then((result) => {
            let flag = true;
            for (var i = 0; i < result.length; i++) {
                if (result[i]['username'] == req.body['username']) {
                    flag = false;
                    if (result[i]['passward'] == req.body['passward']) {
                        console.log('perfect');
                        res.render('index', { name: result[i]['name'], id: result[i]['_id'] });
                    } else {
                        console.log('wrong passward');
                        res.render('Login');
                    }
                    break;
                }
            }
            if (flag) {
                console.log('username does not exist');
                res.render('Login');
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

// 404
app.use((req, res) => {
    // res.sendFile('/views/error.ejs', {root: __dirname});
    res.render('error')
});