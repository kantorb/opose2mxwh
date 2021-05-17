var expect = require('chai').expect;
var getProjectMW = require('../../../../middleware/project/getProjectMW.js');

describe('getProject middleware ', function () {

  it('should return a project from db', function (done) {
      const mw = getProjectMW({
          ProjectModel:{
            findOne: (param1,callb)=>{
                expect(param1).to.be.eql({_id: "asd"});
                callb(null,'mockproject');
            }

          }
        });
        const resMock={
            locals:{}
        };
        mw({
          params:{
              projectname: "asd"
          }},
          resMock,
          (err)=>{
              expect(err).to.be.eql(undefined);
            expect(resMock.locals).to.be.eql({project: "mockproject"});
            done();
      });

  });
  it('should call next with error if there is a db error', function (done) {
    const mw = getProjectMW({
        ProjectModel:{
          findOne: (param1,callb)=>{
              expect(param1).to.be.eql({_id: "asd"});
              callb('gombocartur',null);
          }

        }
      });
      const resMock={
          locals:{}
      };
      mw({
        params:{
            projectname: "asd"
        }},
        resMock,
        (err)=>{
            expect(err).to.be.eql('gombocartur');
          done();
    });

});
it('should call next when no project is found', function (done) {
    const mw = getProjectMW({
        ProjectModel:{
          findOne: (param1,callb)=>{
              expect(param1).to.be.eql({_id: "asd"});
              callb(undefined,null);
          }

        }
      });
      const resMock={
          locals:{}
      };
      mw({
        params:{
            projectname: "asd"
        }},
        resMock,
        (err)=>{
            expect(err).to.be.eql(undefined);
            expect(err).to.be.eql();
          done();
    });

});

});