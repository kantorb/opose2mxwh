/**
 * Gets the list of all projects data from the DB, the entity used here is: res.locals.projects
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
    const ProjectModel = requireOption(objectrepository, 'ProjectModel');
        

    return function (req, res, next) {
    ProjectModel.find({}, (err, projects) => {
            if(err){
                return next(err);
            }
            res.locals.projects=projects;
            return next();
        });
    };
 };