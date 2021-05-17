/**
 * Gets a specific project data from the DB, the entity used here is: res.locals.project
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
    const ProjectModel = requireOption(objectrepository, 'ProjectModel');

    return function(req, res, next) {
        ProjectModel.findOne({ _id: req.params.projectname }, (err, project) => {
            if (err || !project) {
                return next(err);
            }

            res.locals.project = project;
            return next();
        });
    };
 };