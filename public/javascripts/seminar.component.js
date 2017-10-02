angular
    .module('seminar', ['ui.router'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('seminar', {

                url: '/seminar',
                defaultSubstate: 'seminar.list',
                onEnter: function ($rootScope) {

                    $rootScope.option = 'seminar';

                }


            })
            .state('seminar.list', {

                url: '/list',
                templateUrl: 'views/seminar/list.html',
                controller: 'seminarListCtrl'

            })
            .state('seminar.details', {

                url: '/details/:id',
                templateUrl: 'views/seminar/details.html',
                controller: 'seminarDetailsCtrl',
                resolve: {

                    info: function ($http, $stateParams) {

                        var id = $stateParams.id;
                        return $http.get('api/seminars/' + id).then(function (response) {

                            return response.data;

                        })


                    },

                    employees: function ($http, $stateParams) {

                        return $http.post('api/employees/options?selected=EmplID%20Name').then(function (response) {

                            return response.data;

                        })


                    }

                }


            })

    })
    .directive('seminarTable', function () {

        return {

            restrict: 'EA',
            scope: true,
            template: '<custom-table></custom-table>',
            controller: function ($scope) {


                $scope.id = 'seminar-table';
                $scope.url = '/api/seminars';
                $scope.title = 'Danh sách hội thảo';
                $scope.recordState = 'seminar.details';
                $scope.keyName = 'SeminarID';
                $scope.fields = {

                    SeminarID: {

                        key: true,
                        title: 'Mã HT',
                        edit: false,
                        create: true,
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('SeminarID') : true

                    },

                    Name: {

                        title: 'Tên hội thảo',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Name') : true

                    },

                    Content: {

                        title: 'Nội dung hội thảo',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Content') : true

                    },

                    SharingEmpl: {

                        title: 'Người chia sẻ',
                        options: 'api/employees/options?selected=EmplID%20Name',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('SharingEmpl') : true

                    },

                    OrganizationalUnit: {

                        title: 'Đơn vị tổ chức',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('OrganizationalUnit') : true

                    },

                    Time: {

                        title: 'Thời gian',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Time') : true

                    }


                };

            }

        }

    })
    .controller('seminarListCtrl', function ($scope) {




    })
    .controller('seminarDetailsCtrl', function ($scope, info, employees, $http, dialog, auth) {

        $scope.auth = auth;
        $scope.mainInfo = info;
        $scope.mode = 'info';
        $scope.info = {};
        $scope.employeeList = employees.Options;
        Object.keys($scope.mainInfo).map(function (key) {

            if (key !== '_id' && key !== 'SeminarID')
                $scope.info[key] = $scope.mainInfo[key];
            if (key === 'SharingEmpl')
                $scope.info[key] = $scope.info[key].toString();

        })

        console.log($scope.mainInfo);
        $scope.update = function () {

            $scope.isLoading = true;
            var url = '/api/seminars/' + $scope.mainInfo.SeminarID;
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


    })