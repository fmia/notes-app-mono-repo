const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { use } = require("../controllers/users");

module.exports=(request, response, next) => {
    const authorization = request.get('authorization')
    let token = null

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }


    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)


    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId } = decodedToken

    request.userId =  userId
    next()
}