angular
    .module('study', ['ui.router'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('study', {

                url: '/study',
                defaultSubstate: 'study.list',
                onEnter: function ($rootScope) {

                    $rootScope.option = 'study';

                }


            })
            .state('study.list', {

                url: '/list',
                templateUrl: 'views/study/list.html',
                controller: 'studyListCtrl'

            })
            .state('study.details', {

                url: '/details/:id',
                templateUrl: 'views/study/details.html',
                controller: 'studyDetailsCtrl',
                resolve: {

                    info: function ($http, $stateParams) {

                        var id = $stateParams.id;
                        return $http.get('api/studies/' + id).then(function (response) {

                            return response.data;

                        })


                    },

                    seminars: function ($http) {

                        return $http.post('api/seminars/options?selected=SeminarID%20Name').then(function (response) {

                            return response.data;

                        })

                    }

                }


            })

    })
    .directive('studyTable', function () {

        return {

            restrict: 'EA',
            scope: true,
            template: '<custom-table></custom-table>',
            controller: function ($scope) {

                $scope.id = 'study-table';
                $scope.url = '/api/studies';
                $scope.title = 'Danh sách nghiên cứu';
                $scope.recordState = 'study.details';
                $scope.keyName = 'StudyID';
                $scope.fields = {

                    StudyID: {

                        key: true,
                        title: 'Mã NC',
                        edit: false,
                        create: true,
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('StudyID') : true

                    },

                    Name: {

                        title: 'Tên nghiên cứu',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Name') : true

                    },

                    Content: {

                        title: 'Nội dung nghiên cứu',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Content') : true

                    },

                    Seminar: {

                        title: 'Hội thảo liên quan',
                        options: 'api/seminars/options?selected=SeminarID%20Name',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Seminar') : true

                    },

                    // StudyEmpl: {

                    //     title: 'Nhân viên nghiên cứu',
                    //     list: false,
                    //     options: '/employee/options?selected=EmplID%20Name'

                    // },

                    // Instructor: {

                    //     title: 'Người hướng dẫn',
                    //     list: false,
                    //     options: '/employee/options?selected=EmplID%20Name'

                    // },

                    Time: {

                        title: 'Thời gian',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Time') : true

                    }


                };



            }

        }

    })
    .controller('studyListCtrl', function ($scope) {




    })
    .controller('studyDetailsCtrl', function ($scope, info, seminars, $http, dialog, $http, $rootScope) {

        $scope.uploadUrl = '/api/studies/files/' + info.StudyID;
        $scope.mainInfo = info;
        $scope.mode = 'info';
        $scope.info = {};
        $scope.semList = seminars.Options;
        Object.keys($scope.mainInfo).map(function (key) {

            if (key !== '_id' && key !== 'StudyID')
                $scope.info[key] = $scope.mainInfo[key];
            if (key === 'Seminar')
                $scope.info[key] = $scope.info[key].toString();

        })

        $scope.update = function () {

            $scope.isLoading = true;
            var url = '/api/studies/' + $scope.mainInfo.StudyID;
            $http.put(url, $scope.info).then(function (response) {

                $scope.isLoading = false;
                var res = response.data;
                if (res.Result === 'ERROR')
                    dialog.showAlert('error', res.Message);
                else {
                    dialog.showAlert('success', 'Cập nhật dữ liệu thành công');
                    $scope.mainInfo = res.Record;
                }


            }, function (err) {

                console.log(err.status);
                $scope.isLoading = false;

            })


        }


        console.log($scope.mainInfo);

        $scope.createForbidden = true;
        $scope.updateForbidden = true;
        $scope.deleteForbidden = false;
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

        $scope.switchMode = function (mode) {

            switch (mode) {

                case 'study-empl':

                    $scope.loadEmployees();
                    $scope.filterList = {

                        EmplList: $scope.mainInfo.StudyEmpl.length > 0 ? $scope.mainInfo.StudyEmpl : 'empty'

                    }

                    $scope.deleteAction = function (postData) {

                        return $.Deferred(function ($dfd) {
                            $http.put('/api/studies/' + $scope.mainInfo.StudyID, {

                                $pop: {
                                    StudyEmpl: postData.EmplID
                                }

                            }).then(function (response) {

                                var res = response.data;
                                console.log(res);
                                if (res.Result === 'ERROR') {
                                    dialog.showAlert('error', res.Message);
                                    $dfd.reject(res);

                                } else {

                                    $scope.mainInfo = res.Record;
                                    $scope.filterList = {

                                        EmplList: res.Record.StudyEmpl.length > 0 ? res.Record.StudyEmpl : 'empty'

                                    }
                                    $dfd.resolve(res);

                                }



                            });
                        });

                    }

                    break;

                case 'instruct-empl':

                    $scope.loadEmployees();
                    $scope.deleteAction = function (postData) {

                        return $.Deferred(function ($dfd) {
                            $http.put('/api/studies/' + $scope.mainInfo.StudyID, {

                                $pop: {
                                    Instructor: postData.EmplID
                                }

                            }).then(function (response) {

                                var res = response.data;
                                console.log(res);
                                if (res.Result === 'ERROR') {
                                    dialog.showAlert('error', res.Message);
                                    $dfd.reject(res);

                                } else {

                                    $scope.mainInfo = res.Record;
                                    $scope.filterList = {

                                        EmplList: res.Record.Instructor.length > 0 ? res.Record.Instructor : 'empty'

                                    }
                                    $dfd.resolve(res);

                                }



                            });
                        });

                    }

                    $scope.filterList = {

                        EmplList: $scope.mainInfo.Instructor.length > 0 ? $scope.mainInfo.Instructor : 'empty'

                    }
                    break;

            }

            $scope.mode = mode;

        }

        $scope.loadEmployees = function () {

            $http.post('/api/employees/options?selected=EmplID%20Name').then(function (response) {

                $scope.employeeList = response.data.Options;

            })

        }


        $scope.addEmployee = function (emplType) {

            var obj = {};
            obj[emplType] = this.employee;
            $http.put('/api/studies/' + $scope.mainInfo.StudyID, {

                $push: obj

            }).then(function (response) {

                var res = response.data;
                console.log(res);
                if (res.Result === 'ERROR')
                    dialog.showAlert('error', res.Message);
                else {

                    $scope.mainInfo = res.Record;
                    $scope.filterList = {

                        EmplList: res.Record[emplType].length > 0 ? res.Record[emplType] : 'empty'


                    }
                    $rootScope.$emit('reload');

                }



            });

        }


    })