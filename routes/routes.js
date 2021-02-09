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
                password: fields.password
            }

            let userValid = validateUser(user)


            if (userValid === true) {

                PlayerSchema.create({
                    nickname: nickname,
                    email: email,
                    password: password
                }, (err, result) => {
                    console.log(result)
                    console.log(err)
                    if (err) {
                        res.status(500).send('An error has ocurred during the user data insertion')
                    } else {
                        res.status(200).send('The user has been added successfully')
                    }
                })

                // PlayerSchema.find(
                // {
                //     $or: [
                //         {
                //             nickname: nickname
                //         },
                //         {
                //             email: email
                //         }
                //     ]
                // }, (err, result) => {
                //     if(err) {
                //         res.status(500).send('An error has ocurred during the user data insertion')
                //     } else {
                //         if(result.length === 0)
                //         {
                //             PlayerSchema.create(
                //             {
                //                 nickname: nickname
                //             }, (err, result) => {
                //                 console.log(result)
                //                 if(err) {
                //                     res.status(500).send('An error has ocurred during the user data insertion')
                //                 } else {
                //                     res.status(200).send('The user has been added successfully')
                //                 }
                //             })
                //         } else {
                //             res.status(500).send('This nickname is already used, please choose another one')
                //         }

                //     }
                // })

            } else {
                res.status(500).send(nicknameValid)
            }

        })

    })

}

function validateUser(user) {
    console.log(user.nickname)
    console.log('validation')

    if (user.nickname === '') return 'Nickname is empty'
    if (user.nickname.length < 6) return 'Nickname must be longer than 6 characters'

    return true
}

function validatePassword(password) {
    if (nickname === '') return 'Nickname is empty'
    if (nickname.length < 6) return 'Nickname must be longer than 6 characters'
    return true
}