var expect = require('chai').expect;
var getEmployeeMW = require('../../../../middleware/employee/getEmployeeDataMW.js');

describe('getEmployee middleware ', function () {

  it('should return an employee from db', function (done) {
      const mw = getEmployeeMW({
          EmployeeModel:{
            findOne: (param1,callb)=>{
                expect(param1).to.be.eql({_id: "asd"});
                callb(null,'mockemployee');
            }

          }
        });
        const resMock={
            locals:{}
        };
        mw({
          params:{
              employeeid: "asd"
          }},
          resMock,
          (err)=>{
              expect(err).to.be.eql(undefined);
            expect(resMock.locals).to.be.eql({employee: "mockemployee"});
            done();
      });

  });
  it('should call next with error if there is a db error', function (done) {
    const mw = getEmployeeMW({
        EmployeeModel:{
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
            employeeid: "asd"
        }},
        resMock,
        (err)=>{
            expect(err).to.be.eql('gombocartur');
          done();
    });

});
it('should call next when no employee is found', function (done) {
    const mw = getEmployeeMW({
        EmployeeModel:{
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
            employeeid: "asd"
        }},
        resMock,
        (err)=>{
            expect(err).to.be.eql(undefined);
            expect(err).to.be.eql();
          done();
    });

});

});