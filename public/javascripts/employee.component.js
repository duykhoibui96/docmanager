angular
    .module('employee', ['ui.router', 'ngMessages'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('info', {

                url: '/info',
                templateUrl: 'views/employee/details.html',
                onEnter: function ($rootScope) {

                    $rootScope.option = 'info';

                },
                controller: 'employeeDetailsCtrl',
                resolve: {

                    info: function ($http, $localStorage) {

                        var id = $localStorage.auth.EmplID;
                        return $http.get('api/employees/' + id).then(function (response) {

                            return response.data;

                        })


                    }

                }


            })
            .state('employee', {

                url: '/employee',
                defaultSubstate: 'employee.list',
                onEnter: function ($rootScope) {

                    $rootScope.option = 'employee';

                }


            })
            .state('employee.list', {

                url: '/list',
                templateUrl: 'views/employee/list.html',
                controller: 'employeeListCtrl'

            })
            .state('employee.details', {

                url: '/details/:id',
                templateUrl: 'views/employee/details.html',
                controller: 'employeeDetailsCtrl',
                resolve: {

                    info: function ($http, $stateParams) {

                        var id = $stateParams.id;
                        return $http.get('api/employees/' + id).then(function (response) {

                            return response.data;

                        })


                    }

                }


            })

    })
    .directive('employeeTable', function ($state) {

        return {

            restrict: 'EA',
            scope: true,
            template: '<custom-table></custom-table>',
            controller: function ($scope) {

                $scope.id = 'employee-table';
                $scope.url = '/api/employees';
                $scope.title = 'Danh sách nhân viên';
                $scope.keyName = 'EmplID';
                $scope.recordState = 'employee.details';
                $scope.fields = {

                    EmplID: {

                        title: 'Mã NV',
                        key: true,
                        create: true,
                        edit: false,
                        width: '10%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('EmplID') : true

                    },

                    EmplRcd: {

                        title: 'Record',
                        width: '5%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('EmplRcd') : true

                    },

                    Name: {

                        title: 'Tên',
                        width: '20%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Name') : true

                    },

                    ChildDepartment: {

                        title: 'Phòng ban',
                        width: '15%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('ChildDepartment') : true

                    },

                    OfficerCode: {

                        title: 'Chức vụ',
                        width: '15%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('OfficerCode') : true

                    },

                    JobTitle: {

                        title: 'Công việc',
                        width: '15%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('JobTitle') : true

                    },

                    Mail: {

                        title: 'Email',
                        edit: false,
                        width: '20%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Mail') : true

                    }


                };

            }

        }

    })
    .controller('employeeListCtrl', function ($scope) {

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

        $scope.for = 'employee';


    })
    .controller('employeeDetailsCtrl', function ($scope, info, $http, dialog, $state, $rootScope,auth) {

        $scope.auth = auth;
        $scope.list = [];
        $scope.mainInfo = info;
        $scope.mode = 'info';
        $scope.info = {};

        $rootScope.$on('list', function (event, block) {

            var data = block.data;
            var keyName = block.keyname;
            $scope.list = data.map(function (item) {

                return item[keyName];

            })

        });

        Object.keys($scope.mainInfo).map(function (key) {

            if (key !== '_id' && key !== 'EmplID' && key !== 'Mail')
                $scope.info[key] = $scope.mainInfo[key];

        })

        console.log($scope.mainInfo);

        $scope.isCurrentEmployee = function () {

            return $state.current.name === 'info';

        }

        $scope.createForbidden = true;
        $scope.updateForbidden = true;

        $scope.switchMode = function (mode,event) {

            if (mode === $scope.mode)
                return;
            switch (mode) {
                case 'customer':
                    $scope.for = 'customer';
                    $scope.loadCustomers();
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
                    $scope.deleteForbidden = !auth.isPermitted('employee-customer-edit');
                    $scope.filterList = {

                        EmplID: $scope.mainInfo.EmplID

                    }
                    break;

                case 'consulting':
                    $scope.deleteForbidden = true;
                    $scope.hideColumn = 'ConsultingEmplID';
                    $scope.filterList = {

                        ConsultingEmplID: $scope.mainInfo.EmplID

                    }
                    break;

                case 'study':
                    $scope.deleteForbidden = !auth.isPermitted('employee-customer-edit');
                    $scope.deleteAction = function (postData) {

                        return $.Deferred(function ($dfd) {
                            $http.put('/api/studies/' + postData.StudyID, {

                                $pop: {

                                    StudyEmpl: $scope.mainInfo.EmplID

                                }

                            }).then(function (response) {

                                var res = response.data;
                                console.log(res);
                                if (res.Result === 'ERROR') {
                                    dialog.showAlert('error', res.Message);
                                    $dfd.reject();

                                } else {

                                    $dfd.resolve(res);

                                }


                            })

                        });

                    }
                    $scope.hideColumn = 'StudyEmpl';
                    $scope.filterList = {

                        StudyEmpl: $scope.mainInfo.EmplID

                    }
                    break;
                case 'instruct':
                    $scope.deleteForbidden = !auth.isPermitted('employee-customer-edit');
                    $scope.deleteAction = function (postData) {

                        return $.Deferred(function ($dfd) {
                            $http.put('/api/studies/' + postData.StudyID, {

                                $pop: {

                                    Instructor: $scope.mainInfo.EmplID

                                }

                            }).then(function (response) {

                                var res = response.data;
                                console.log(res);
                                if (res.Result === 'ERROR') {
                                    dialog.showAlert('error', res.Message);
                                    $dfd.reject();

                                } else {

                                    $dfd.resolve(res);

                                }


                            })

                        });

                    }
                    $scope.hideColumn = 'Instructor';
                    $scope.filterList = {

                        Instructor: $scope.mainInfo.EmplID

                    }
                    break;

            }

            $scope.mode = mode;

        }


        $scope.updateInformation = function () {

            $scope.isLoading = true;
            var url = '/api/employees/' + $scope.mainInfo.EmplID;
            $http.put(url, $scope.info).then(function (response) {

                $scope.isLoading = false;
                var res = response.data;
                if (res.Result === 'ERROR')
                    dialog.notify('error', res.Message);
                else {
                    dialog.notify('success', 'Cập nhật dữ liệu thành công');
                    $scope.mainInfo = res.Record;
                }


            }, function (err) {

                console.log(err.status);
                $scope.isLoading = false;

            })

        }


        $scope.updatePassword = function () {

            $scope.isLoading = true;
            console.log(this.password);
            $http.put('/api/accounts/', {
                Password: this.password
            }).then(function (response) {

                $scope.isLoading = false;
                dialog.notify('success', 'Cập nhật mật khẩu thành công');
                console.log(response.data);


            }, function (err) {

                console.log(err.status);
                $scope.isLoading = false;

            })


        }


        $scope.loadCustomers = function () {

            $http.post('/api/customers/options?selected=CustomerID%20Name').then(function (response) {

                $scope.customerList = response.data.Options;

            })

        }


        $scope.showAddDialog = function () {

            var url = undefined,
                callback = undefined,
                title = undefined;

            switch ($scope.mode) {
                case 'customer':
                    url = '/api/customers/options';
                    callback = function (records) {

                        var array = records.map(function (item) {

                            return item.Value;

                        });

                        $http.put('/api/customers/', {

                            customerList: array,
                            EmplID: $scope.mainInfo.EmplID

                        }).then(function (response) {


                            $rootScope.$emit('reload', {
                                id: 'customer-table'
                            });


                        });

                    }
                    title = 'KHÁCH HÀNG QUẢN LÝ';
                    break;

                case 'study':
                    url = '/api/studies/options';
                    callback = function (records) {

                        var array = records.map(function (item) {

                            return item.Value;

                        });

                        $http.put('/api/studies/', {

                            studyList: array,
                            StudyEmpl: $scope.mainInfo.EmplID

                        }).then(function (response) {


                            $rootScope.$emit('reload', {
                                id: 'study-table'
                            });


                        });

                    }
                    title = 'NHÂN VIÊN NGHIÊN CỨU';
                    break;
                case 'instruct':
                    url = '/api/studies/options';
                    callback = function (records) {

                        var array = records.map(function (item) {

                            return item.Value;

                        });

                        console.log(array);
                        $http.put('/api/studies/', {

                            studyList: array,
                            Instructor: $scope.mainInfo.EmplID

                        }).then(function (response) {

                            console.log('reload');
                            $rootScope.$emit('reload', {
                                id: 'study-table'
                            });


                        });

                    }
                    title = 'NHÂN VIÊN HƯỚNG DẪN';
            }

            dialog.showAddDialog(url, callback, $scope.list, title);

        }


        $scope.deleteAction = function (postData) {

            return $.Deferred(function ($dfd) {
                $http.put('/api/customers/' + postData.CustomerID, {

                    $pop: {
                        ResponsibleEmpl: $scope.mainInfo.EmplID
                    }

                }).then(function (response) {

                    var res = response.data;
                    console.log(res);
                    if (res.Result === 'ERROR') {
                        dialog.showAlert('error', res.Message);
                        $dfd.reject(res);

                    } else
                        $dfd.resolve(res);


                });
            });



        }


    })