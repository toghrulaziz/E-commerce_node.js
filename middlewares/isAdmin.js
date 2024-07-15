const User = require('../models/user');

async function isAdmin(req, res, next) {
    try {
        const user = await User.findById(req.user);

        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).send({ error: 'Access denied: Admins only' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { isAdmin };