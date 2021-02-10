const formidable = require('formidable')
const PlayerSchema = require('../database/models/players')

module.exports = (app) => {

    app.post('/register', (req, res) => {

        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields) => {
            console.log(fields)

            let user = {
                nickname: fields.nickname,
                email: fields.email,
                password: fields.password,
                passwordConfirm: fields.passwordConfirm
            }

            let userValid = validateUser(user)

            if (userValid === true) {

                PlayerSchema.find({

                    email: user.email

                }, (err, result) => {
                    if (err) {
                        res.status(500).send('An error has ocurred during the user data insertion')
                    } else {
                        if (result.length === 0) {
                            PlayerSchema.create({
                                nickname: user.nickname,
                                email: user.email,
                                password: user.password
                            }, (err, result) => {
                                console.log(result)
                                console.log(err)
                                if (err) {

                                    if (err.code === 11000) {
                                        res.status(500).send('This Nickname is already used, please choose another one')
                                    } else {
                                        res.status(500).send('An error has ocurred during the user data insertion')
                                    }
                                } else {
                                    res.status(200).send('The user has been added successfully')
                                }
                            })
                        } else {
                            res.status(500).send('This email is already used, please choose another one')
                        }
                    }
                })
            } else {
                res.status(500).send(nicknameValid)
            }
        })
    })

    app.post('/login', (req, res) => {

        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields) => {
            console.log(fields)

            let user = {
                nickname: fields.nickname,
                email: fields.email,
                password: fields.password,
                passwordConfirm: fields.passwordConfirm
            }

            let userValid = validateUser(user)

            if (userValid === true) {

                PlayerSchema.find({
                    $or: [
                        { email: user.email },
                        { nickname: user.nickname }

                    ]

                }, (err, results) => {
                    if (err) {
                        res.status(500).send('Error logging in')
                    } else {
                        if (results.length === 0) {
                            res.status(500).send('The user doesn\'t exist')
                        } else {

                            if (user.password === results[0].password) {
                                res.status(200).send(results)
                            } else {
                                res.status(500).send('Incorrect Password')
                            }
                        }
                    }
                })
            } else {
                res.status(500).send(userValid)
            }
        })
    })

    app.post('/update', (req, res) => {

        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields) => {
            console.log(fields)

            let user = {
                nickname: fields.nickname,
                email: fields.email,
                password: fields.password
            }

            let userValid = validateUser(user)

            if (userValid === true) {

                PlayerSchema.updateOne({
                        $or: [
                            { email: user.email },
                            { nickname: user.nickname }

                        ]
                    }, {
                        password: user.password
                    },
                    (err, result) => {
                        if (err) {
                            res.status(500).send('An error has ocurred during the update')
                        } else {
                            console.log("update");

                            console.log(result);
                            res.status(200).send("The new password is: " + user.password)
                        }
                    })
            } else {
                res.status(500).send(nicknameValid)
            }
        })
    })

    //reset password
    //update gamedata
}

//differentiate register and login
function validateUser(user) {
    console.log(user.nickname)
    console.log('validation')

    if (user.nickname === '') return 'Nickname is empty'
    if (user.nickname.length < 6) return 'Nickname must be longer than 6 characters'

    //validar password, nickname i email - definir longitud, complexitat, etc 

    return true
}