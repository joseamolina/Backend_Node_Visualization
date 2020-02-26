/*
    @Author: Jose Angel Molina
    @Date: January 2018
    @Company: 720tec SLL
 */
jwt = require('jsonwebtoken');
keycload = require('../keys_cload');

function give_a_token(res, user_id, user_name, password) {
        res.json({

            id_: user_id,
            username: user_name,
            password: password,
           //  keycload: keycload

        });
    return res;
}

module.exports = give_a_token;