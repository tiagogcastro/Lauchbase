const User = require('../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {  
    loginForm(req, res) {
        return res.render('session/login')
    },
    login(req,res) {
        // depois colocar o user no req.session
        req.session.userId = req.user.id
        return res.redirect('/users')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },

    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },

    async forgot(req, res) {
        const user = req.user

        try {
            // Um token para esse usuário
            const token = crypto.randomBytes(20).toString('hex')
            // Criar uma expiração
            let now = new Date()

            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // Enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'tiaguin110@gmail.com',
                subject: 'Recuperação de senha',
                html: `
                    <h2>Perdeu a chave?</h2>
                    <p> Não se preocupe, clique no link abaixo para recuperar sua senha </p>
                    <p>
                        <a href="localhost:3000/users/password-reset?token=${token}" target='_blank'>Recuperar Senha</a>
                    </p>
                `,
            })
            // Avisar o usuário que enviamos o email
            return res.render('session/forgot-password', {
                success: "Verifique seu email para resetar sua senha!"
            })
        } catch(err) {
            console.log(err)
            return res.render('session/forgot-password', {
                sucess: "Erro inesperado, tente novamente!"
            })
        }
    },

    async resetForm(req, res) {
        return res.render('session/password-reset', {
            token: req.query.token
        })
    },

    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            // create new hash of password
            const newPassword = await hash(password, 8)
            // update user
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })
            // alert user about new password
            return res.render('session/login', {
                user: req.body,
                success: "Senha atualizada com Sucesso! Faça o seu login!"
            })
            
        } catch (err) {
            console.log(err)
            return res.render('session/password-reset', {
                user: req.body,
                token,
                sucess: "Erro inesperado, tente novamente!"
            })
        }
    }
}