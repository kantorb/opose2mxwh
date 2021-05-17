const renderMW = require('../middleware/common/renderMW');
const getProjectListMW = require('../middleware/project/getProjectListMW');
const getProjectDataMW = require('../middleware/project/getProjectMW');
const setProjectDataMW = require('../middleware/project/setProjectDataMW');
const setProjectActiveMW = require('../middleware/project/setProjectActiveMW');
const setProjectNotActiveMW = require('../middleware/project/setProjectNotActiveMW');
const delProjectMW = require('../middleware/project/delProjectMW');

const ProjectModel = require('../models/project');

module.exports = function (app) {
    const objRepo = {
        ProjectModel: ProjectModel,
    };

    app.use('/project/edit/:projectname', getProjectDataMW(objRepo), setProjectDataMW(objRepo) , renderMW(objRepo, 'new_project') );

    app.get('/project/del/:projectname', getProjectDataMW(objRepo) ,delProjectMW(objRepo));
    
    app.use('/project/new', setProjectDataMW(objRepo), renderMW(objRepo, 'new_project'));

    app.use('/project/activate/:projectname', getProjectDataMW(objRepo), setProjectActiveMW(objRepo), renderMW(objRepo, 'projects'));

    app.use('/project/deactivate/:projectname', getProjectDataMW(objRepo), setProjectNotActiveMW(objRepo), renderMW(objRepo, 'projects'));

    app.get('/projects', getProjectListMW(objRepo),  renderMW(objRepo, 'projects') );


    app.use('/',renderMW(objRepo, 'index'));
};