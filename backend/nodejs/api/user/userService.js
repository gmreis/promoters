const User = require('./userModel');

// POST /api/user
/*
    {
        faceId: Number
        name: Text,
        sexo: Text,
        photo: Text
    }
*/
function login(req, res){

    // TODO: Alterar para faceId como ID do usuario?
    if(req.body.hasOwnProperty('faceId')) {
        
        User.findOne({faceId: req.body.faceId}) .exec()
        .then(user => {

            if(!user) {
                
                user = new User({
                    faceId: req.body.faceId,
                    name: req.body.name,
                    sexo: req.body.sexo,
                    photo: req.body.photo,
                    birth: null,
                    position: 0,
                    level: 0
                });
                
                return User.create(user);
            }
            
            return new Promise(resolve => resolve(user));

        }).then(user => {
            res.status(200).end(JSON.stringify(user.getUser));

        })
        .catch(err => {
            console.log(err);
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
    
            res.status(400).end(JSON.stringify({errors}));
        })
        
    } else {
        res.status(400).end(JSON.stringify({errors}));
    }

}

// GET /api/user/:faceId
// PARAMS = faceId: Number
function getUser(req, res){

    User.findOne({faceId: req.params.faceId}).exec()
        .then(user => {
            if(user) {
                res.status(200).end(JSON.stringify({user}));
            } else {
                res.status(400).end();
            }
            
        }).catch(err => {
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
    
            res.status(400).end(JSON.stringify({errors}));
        })
}

// PUT /api/user
/*
    {
        faceId: Number
        name: Text,
        sexo: Text,
        photo: Text,
        birth: Date { YYYY-MM-DD }
    }
*/
function editUser(req, res){

    if(req.body.hasOwnProperty('faceId')) {
        
        let _user;
        
        User.findOne({faceId: req.body.faceId}).exec()
        .then(user => {
            
            if(!user) {
                res.status(400).end();
                return;
            }

            _user = user;

            _user.name = req.body.name;
            _user.sexo = req.body.sexo;
            _user.photo = req.body.photo;

            if(req.body.hasOwnProperty('birth') ) {
                _user.birth = req.body.birth;
            }

            return _user.save();
        }, () => {
            res.status(400).end(JSON.stringify({errors: "Usuário não encontrado!"}));
        })
        .then(() => {
            res.status(200).end(JSON.stringify({_user}));
        })
        .catch(err => {
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
    
            res.status(400).end(JSON.stringify({errors}));
        })
        
    } else {
        res.status(400).end();
    }    
    
}

module.exports = { login, getUser, editUser }