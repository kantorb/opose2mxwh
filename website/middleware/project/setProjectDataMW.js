/**
 * Changes the value of the project data in the DB, thent redirects to /projects
 */
 const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
    const ProjectModel = requireOption(objectrepository, 'ProjectModel');
    return function (req, res, next) {
        console.log(req.body);
        if (
           typeof req.body.name === 'undefined' ||
           typeof req.body.folder === 'undefined' ||
           req.body.name == '' ||
           req.body.folder == ''
       ) {
           res.locals.wrongname=1;
           res.locals.wrongnum=1;
           return next();
       }
            if (typeof res.locals.project === 'undefined') {
            res.locals.project = new ProjectModel();
       }

       res.locals.project.name = req.body.name;
       res.locals.project.folder = req.body.folder;
       res.locals.project.save(err => {
           if (err) {
               return next(err);
           }

           return res.redirect('/projects');
       });
    
    };
 };