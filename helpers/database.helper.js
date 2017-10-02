var Permission = require('../models/Permission');
var Employee = require('../models/Employee');
var data = require('./permissions.json');

module.exports = function () {

    Employee.findByIdAndRemove('59c3cf02bce68810a0e194f0', function (err, doc) {

        Employee.find().exec(function (err, docs) {

            if (err)
                return;


            var array = docs.filter(function (item) {

                console.log(item);
                console.log(item.EmplID + ' ' + item.OfficerCode);
                return !item.OfficerCode.includes('Nhân viên');

            }).map(function (item) {

                return item.EmplID;

            })

            console.log(array);

            if (array.length > 0) {

                data.forEach(function (item) {

                    item.EmplIDList = array;

                })

                Permission.insertMany(data);

            }


        })


    })


}