/**
 * Removes a project from the DB, the entity used here is: res.locals.project
 * Redirects to /projects after delete
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
    return function(req, res, next) {
        if (typeof res.locals.project === 'undefined') { return next(); }

        res.locals.project.remove(err => {
            if (err) { return next(err); }
            return res.redirect('/projects');
        });
    };
 };