var expect = require('chai').expect;
var getOfficeMW = require('../../../../middleware/office/getOfficeDataMW.js');

describe('getOffice middleware ', function () {

  it('should return an office from db', function (done) {
      const mw = getOfficeMW({
          OfficeModel:{
            findOne: (param1,callb)=>{
                expect(param1).to.be.eql({_id: "asd"});
                callb(null,'mockoffice');
            }

          }
        });
        const resMock={
            locals:{}
        };
        mw({
          params:{
              officename: "asd"
          }},
          resMock,
          (err)=>{
              expect(err).to.be.eql(undefined);
            expect(resMock.locals).to.be.eql({office: "mockoffice"});
            done();
      });

  });
  it('should call next with error if there is a db error', function (done) {
    const mw = getOfficeMW({
        OfficeModel:{
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
            officename: "asd"
        }},
        resMock,
        (err)=>{
            expect(err).to.be.eql('gombocartur');
          done();
    });

});
it('should call next when no office is found', function (done) {
    const mw = getOfficeMW({
        OfficeModel:{
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
            officename: "asd"
        }},
        resMock,
        (err)=>{
            expect(err).to.be.eql(undefined);
            expect(err).to.be.eql();
          done();
    });

});

});