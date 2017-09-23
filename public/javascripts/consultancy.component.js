angular
    .module('consultancy', ['ui.router'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('consultancy', {

                url: '/consultancy',
                defaultSubstate: 'consultancy.list',
                onEnter: function ($rootScope) {

                    $rootScope.option = 'consultancy';

                }


            })
            .state('consultancy.list', {

                url: '/list',
                templateUrl: 'views/consultancy/list.html',
                controller: 'consultancyListCtrl'

            })
            .state('consultancy.details', {

                url: '/details/:id',
                templateUrl: 'views/consultancy/details.html',
                controller: 'consultancyDetailsCtrl',
                resolve: {

                    info: function ($http, $stateParams) {

                        var id = $stateParams.id;
                        return $http.get('api/consultancies/' + id).then(function (response) {

                            return response.data;

                        })


                    },

                    employees: function ($http) {

                        return $http.post('api/employees/options?selected=EmplID%20Name').then(function (response) {

                            return response.data;

                        })

                    },

                    customers: function ($http) {

                        return $http.post('api/customers/options?selected=CustomerID%20Name').then(function (response) {

                            return response.data;

                        })

                    }



                }


            })

    })
    .directive('consultancyTable', function () {

        return {

            restrict: 'EA',
            scope: true,
            template: '<custom-table></custom-table>',
            controller: function ($scope) {

                $scope.id = 'consultancy-table';
                $scope.url = '/api/consultancies';
                $scope.title = 'Danh sách tư vấn';
                $scope.recordState = 'consultancy.details';
                $scope.keyName = 'ConsID';
                $scope.fields = {

                    ConsID: {

                        title: 'Mã TV',
                        key: true,
                        edit: false,
                        create: true,
                        width: '10%',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('ConsID') : true


                    },

                    ConsultingEmplID: {

                        title: 'Nhân viên tư vấn',
                        width: '20%',
                        options: 'api/employees/options?selected=EmplID%20Name',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('ConsultingEmplID') : true

                    },

                    CustomerID: {

                        title: 'Khách hàng',
                        width: '20%',
                        options: 'api/customers/options?selected=CustomerID%20Name',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('CustomerID') : true

                    },

                    ConsultedEmplID: {

                        title: 'Nhân viên được tư vấn',
                        width: '20%',
                        options: 'api/employees/options?selected=EmplID%20Name',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('ConsultedEmplID') : true

                    },

                    // Document: {

                    //     title: 'Tài liệu liên quan',
                    //     width: '10%'

                    // },

                    Time: {

                        title: 'Thời gian',
                        list: $scope.hideColumn ? !$scope.hideColumn.includes('Time') : true

                    }


                };


            }

        }

    })
    .controller('consultancyListCtrl', function ($scope,$rootScope) {


    })
    .controller('consultancyDetailsCtrl', function ($scope, info, employees, customers, $http, $rootScope) {

        $scope.uploadUrl = '/api/consultancies/files/' + info.ConsID;
        $scope.empList = employees.Options;
        $scope.cusList = customers.Options;
        $scope.mainInfo = info;
        $scope.mode = 'info';
        $scope.info = {};
        Object.keys($scope.mainInfo).map(function (key) {

            if (key !== '_id' && key !== 'ConsID' && key !== 'Document')
                $scope.info[key] = $scope.mainInfo[key];
            if (key === 'ConsultingEmplID' || key === 'CustomerID' || key === 'ConsultedEmplID' )
                $scope.info[key] = $scope.info[key].toString();
        })  

        console.log($scope.mainInfo);
        console.log($scope.info);


        $scope.update = function () {

            $scope.isLoading = true;
            var url = '/api/consultancies/' + $scope.mainInfo.ConsID;
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


    })