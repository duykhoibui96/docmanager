angular
    .module('customer', ['ui.router'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('customer', {

                url: '/customer',
                defaultSubstate: 'customer.list',
                onEnter: function ($rootScope) {

                    $rootScope.option = 'customer';

                }


            })
            .state('customer.list', {

                url: '/list',
                templateUrl: 'views/customer/list.html',
                controller: 'customerListCtrl'

            })
            .state('customer.details', {

                url: '/details/:id',
                templateUrl: 'views/customer/details.html',
                controller: 'customerDetailsCtrl',
                resolve: {

                    info: function ($http, $stateParams) {

                        var id = $stateParams.id;
                        return $http.get('api/customers/' + id).then(function (response) {

                            return response.data;

                        })


                    },

                    employees: function ($http) {

                        return $http.post('api/employees/options?selected=EmplID%20Name').then(function (response) {

                            return response.data;

                        })

                    }

                }


            })

    })
    .directive('customerTable', function () {

        return {

            restrict: 'EA',
            scope: true,
            template: '<custom-table></custom-table>',
            controller: function ($scope) {

                $scope.id = 'customer-table';
                $scope.url = '/api/customers';
                $scope.title = 'Danh sách khách hàng';
                $scope.recordState = 'customer.details';
                $scope.keyName = 'CustomerID';
                $scope.fields = {

                    CustomerID: {

                        key: true,
                        edit: false,
                        create: true,
                        title: 'Mã KH',
                        width: '10%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('CustomerID') : true



                    },

                    Name: {

                        title: 'Tên',
                        width: '20%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Name') : true

                    },

                    Address: {

                        title: 'Địa chỉ',
                        width: '20%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Address') : true

                    },

                    Phone: {

                        title: 'Điện thoại',
                        width: '20%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Phone') : true

                    },

                    Representative: {

                        title: 'Đại diện',
                        width: '30%',
                        options: 'api/employees/options?selected=EmplID%20Name',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Representative') : true

                    }


                };

            }

        }

    })
    .controller('customerListCtrl', function ($scope) {

        $scope.searchCat = [

            {
                name: 'Mã khách hàng',
                value: 'CustomerID'
            },

            {
                name: 'Tên khách hàng',
                value: 'Name'
            }

        ];


    })
    .controller('customerDetailsCtrl', function ($scope, info, employees, $http, $rootScope) {

        $scope.emplList = employees.Options;
        $scope.mainInfo = info;
        $scope.mode = 'info';
        $scope.info = {};
        Object.keys($scope.mainInfo).map(function (key) {

            if (key !== '_id' && key !== 'CustomerID')
                $scope.info[key] = $scope.mainInfo[key];
            if (key === 'Representative')
                $scope.info[key] = $scope.info[key].toString();

        })

        console.log($scope.mainInfo);

        $scope.createForbidden = true;
        $scope.updateForbidden = true;

        $scope.update = function () {

            $scope.isLoading = true;
            var url = '/api/customers/' + $scope.mainInfo.CustomerID;
            $http.put(url, $scope.info).then(function (response) {

                $scope.isLoading = false;
                var res = response.data;
                if (res.Result === 'ERROR')
                    $rootScope.showAlert('error', res.Message);
                else {
                    $rootScope.showAlert('success', 'Cập nhật dữ liệu thành công');
                    $scope.mainInfo = res.Record;
                }


            }, function (err) {

                console.log(err.status);
                $scope.isLoading = false;

            })


        }

        $scope.switchMode = function (mode) {

            switch (mode) {
                case 'employee':

                    $scope.loadEmployees();
                    $scope.searchCat = [

                        {
                            name: 'Mã nhân viên',
                            value: 'EmplID'
                        },

                        {
                            name: 'Tên nhân viên',
                            value: 'Name'
                        }

                    ];
                    $scope.deleteForbidden = false;
                    $scope.deleteAction = function (postData) {

                        return $.Deferred(function ($dfd) {
                            $http.put('/api/customers/' + $scope.mainInfo.CustomerID, {

                                $pop: {
                                    ResponsibleEmpl: postData.EmplID
                                }

                            }).then(function (response) {

                                var res = response.data;
                                console.log(res);
                                if (res.Result === 'ERROR') {
                                    $rootScope.showAlert('error', res.Message);
                                    $dfd.reject(res);

                                } else {

                                    $scope.mainInfo = res.Record;
                                    $scope.filterList = {

                                        EmplList: res.Record.ResponsibleEmpl.length > 0 ? res.Record.ResponsibleEmpl : 'empty'

                                    }
                                    $dfd.resolve(res);

                                }



                            });
                        });



                    }

                    $scope.filterList = {

                        EmplList: $scope.mainInfo.ResponsibleEmpl.length > 0 ? $scope.mainInfo.ResponsibleEmpl : 'empty'

                    }

                    break;

                case 'consultancy':

                    $scope.filterList = {

                        CustomerID: $scope.mainInfo.CustomerID

                    };
                    $scope.deleteForbidden = true;
                    $scope.hideColumn = 'CustomerID';
                    break;

            }

            $scope.mode = mode;

        }

        $scope.loadEmployees = function () {

            $http.post('/api/employees/options?selected=EmplID%20Name').then(function (response) {

                $scope.employeeList = response.data.Options;

            })

        }


        $scope.addEmployee = function () {

            $http.put('/api/customers/' + $scope.mainInfo.CustomerID, {

                $push: {
                    ResponsibleEmpl: this.employee
                }

            }).then(function (response) {

                var res = response.data;
                console.log(res);
                if (res.Result === 'ERROR')
                    $rootScope.showAlert('error', res.Message);
                else {

                    $scope.mainInfo = res.Record;
                    $scope.filterList = {

                        EmplList: res.Record.ResponsibleEmpl.length > 0 ? res.Record.ResponsibleEmpl : 'empty'


                    }
                    $rootScope.$emit('reload');

                }



            });

        }



    })