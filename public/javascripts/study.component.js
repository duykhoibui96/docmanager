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
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('StudyID') : true,
                        width: '10%'

                    },

                    Name: {

                        title: 'Tên',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Name') : true

                    },

                    Content: {

                        title: 'Nội dung',
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
    .controller('studyDetailsCtrl', function ($scope, info, seminars, $http, dialog, $http, $rootScope, auth) {

        $scope.auth = auth;
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
            if ($scope.info.Seminar && isNaN($scope.info.Seminar))
                $scope.info.Seminar = $scope.info.Seminar.Value;
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

        $scope.for = 'employee';
        $scope.switchMode = function (mode) {

            if (mode == $scope.mode)
                return;

            switch (mode) {

                case 'study-empl':

                    $scope.emplType = 'StudyEmpl';
                    $scope.loadEmployees();
                    $scope.filterList = {

                        EmplList: $scope.mainInfo.StudyEmpl.length > 0 ? $scope.mainInfo.StudyEmpl : 'empty'

                    }
                    $scope.deleteForbidden = !auth.isPermitted('study-studyempl-edit');

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
                    $scope.emplType = 'Instructor';
                    $scope.deleteForbidden = !auth.isPermitted('study-instructor-edit');
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

        $scope.showAddDialog = function () {

            var exceptedList = $scope.mainInfo[$scope.emplType];
            var title = $scope.emplType === 'StudyEmpl' ? 'NHÂN VIÊN NGHIÊN CỨU' : 'NHÂN VIÊN HƯỚNG DẪN';
            dialog.showAddDialog('/api/employees/options', $scope.addEmployees, exceptedList, title);

        }


        $scope.addEmployees = function (records) {

            var array = records.map(function (item) {

                return item.Value;

            });
            var emplType = $scope.emplType;
            var obj = {};
            obj[emplType] = array;
            $http.put('/api/studies/' + $scope.mainInfo.StudyID, {

                $pushAll: obj

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
                    $rootScope.$emit('reload', {
                        id: 'employee-table'
                    });

                }



            });

        }


    })