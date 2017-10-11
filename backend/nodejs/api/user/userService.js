const User = require('./userModel');

// POST /api/user
function login(req, res){

    // TODO: birth
    var user = new User({
        faceId: req.body.faceId,
        name: req.body.name,
        sexo: req.body.sexo,
        photo: req.body.photo,
        birth: req.body.birth,
        position: req.body.position,
        level: req.body.level
    });

    user.save().then(() => {
        res.status(200).end(JSON.stringify({user}));
    }).catch(err => {
        console.error('save', err);

        var errors = {};
        for (var error in err.errors) {
            errors[error] = (err.errors[error]['message']);
        };

        res.status(400).end(JSON.stringify({errors}));
    })

}

// GET /api/user/:faceId
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
function editUser(req, res){

    // TODO: Alterar para faceId como ID do usuario?
    if(req.body.hasOwnProperty('faceId')) {
        
        User.findById(req.body.faceId).exec()
        .then(user => {
            
            if(!user) {
                res.status(400).end();
                return;
            }

            user.faceId = req.body.faceId;
            user.name = req.body.name;
            user.email = req.body.email;
            user.sexo = req.body.sexo;
            user.photo = req.body.photo;
            user.typeUser = req.body.typeUser;

            user.save().then(() => {
                res.status(200).end(JSON.stringify({id: user._id}));
            }).catch(err => {
                var errors = {};
                for (var error in err.errors) {
                    errors[error] = (err.errors[error]['message']);
                };
        
                res.status(400).end(JSON.stringify({errors}));
            })
            
        }).catch(err => {
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

module.exports = { login, getUser, editUser }