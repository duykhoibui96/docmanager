angular
    .module('statistic', ['ngStorage', 'ngRoute', 'ui.router'])
    .directive('searchBox', function($rootScope){

        return {

            restrict: 'EA',
            scope: true,
            templateUrl: 'views/components/search-box.component.html',
            controller: function($scope) {

                $scope.selectedCat = $scope.searchCat[0].value;
                console.log('asdf');
                $scope.search = function() {

                    $rootScope.$emit('reload', {

                        searchText: this.searchText,
                        cat: this.selectedCat

                    })

                }

            }

        }


    })
    .directive('filterBox', function ($rootScope) {

        return {

            restrict: 'EA',
            scope: true,
            templateUrl: 'views/components/filter-box.component.html',
            controller: function ($scope) {

                $scope.filterId = Date.now() + 'filter';
                $scope.mode = 'optional';
                $scope.recentDays = '0';
                $scope.startFiltering = function () {

                    var startDate = new Date($scope.startDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    var endDate = new Date($scope.endDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));

                    console.log($scope.startDate);
                    console.log($scope.endDate);

                    console.log(startDate);

                    if ($scope.mode !== 'optional') {

                        startDate = new Date();
                        endDate = new Date();
                        var recentDays = Number($scope.recentDays);
                        startDate.setDate(endDate.getDate() - recentDays);

                    }

                    startDate = startDate.getTime();
                    endDate = endDate.getTime();


                    $rootScope.$emit('reload', {

                        startDate: startDate,
                        endDate: endDate

                    });

                };

                $(function () {
                    $('.begin-date, .end-date').datepicker({
                        dateFormat: 'dd-mm-yy'
                    });

                    $scope.$watch('recentDays', function (newValue, oldValue) {

                        console.log(newValue === '0');
                        if (newValue === '0')
                            $scope.mode = 'optional';
                        else
                            $scope.mode = 'recent';

                    });

                });

            }



        }


    })
    .directive('customTable', function ($state, $localStorage) {

        return {

            restrict: 'EA',
            scope: true,
            template: '<div id="{{id}}"></div>',
            controller: function ($scope, $rootScope) {

                $(document).ready(function () {

                    var url = $scope.url;
                    var selector = '#' + $scope.id;

                    $(selector).jtable({

                        title: $scope.title,
                        paging: true,
                        jqueryuiTheme: true,
                        recordsLoaded: function (event, data) {
                            $(selector + ' .jtable-data-row').click(function () {
                                var row_id = $(this).attr('data-record-key');
                                console.log(row_id);
                                console.log($scope.recordState);
                                $state.transitionTo($scope.recordState, {

                                    id: row_id

                                })
                            });
                        },
                        actions: {

                            listAction: $scope.listAction ? $scope.listAction : function (postData, params) {

                                var filterList = '';
                                if ($scope.filterList)
                                    Object.keys($scope.filterList).map(function (key) {

                                        filterList += `&${key}=${$scope.filterList[key]}`

                                    });

                                if (postData)
                                    Object.keys(postData).map(function (key) {

                                        filterList += `&${key}=${postData[key]}`

                                    });

                                var listUrl = `${url}?jtStartIndex=${params.jtStartIndex}&jtPageSize=${params.jtPageSize}${filterList}`;

                                return $.Deferred(function ($dfd) {

                                    $.ajax({
                                        url: listUrl,
                                        type: 'GET',
                                        beforeSend: function (request) {
                                            request.setRequestHeader('token', $localStorage.auth.token);
                                        },
                                        success: function (data) {
                                            console.log(data);
                                            $dfd.resolve(data);
                                        },
                                        error: function () {
                                            $dfd.reject();
                                        }
                                    });

                                });

                            },

                            createAction: $scope.createForbidden ? undefined : $scope.createAction ? $scope.createAction : function (postData, params) {

                                var createUrl = `${url}`;

                                return $.Deferred(function ($dfd) {

                                    $.ajax({
                                        url: createUrl,
                                        type: 'POST',
                                        data: postData,
                                        beforeSend: function (request) {
                                            request.setRequestHeader('token', $localStorage.auth.token);
                                        },
                                        success: function (data) {
                                            console.log(data);
                                            $dfd.resolve(data);
                                        },
                                        error: function () {
                                            $dfd.reject();
                                        }
                                    });

                                });

                            },

                            updateAction: $scope.updateForbidden ? undefined : $scope.updateAction ? $scope.updateAction : function (postData, params) {

                                var array = postData.split('&');
                                var updateUrl = `${url}/${array[0].split('=')[1]}`;
                                postData = array.slice(1).join('&');

                                return $.Deferred(function ($dfd) {

                                    $.ajax({
                                        url: updateUrl,
                                        type: 'PUT',
                                        data: postData,
                                        beforeSend: function (request) {
                                            request.setRequestHeader('token', $localStorage.auth.token);
                                        },
                                        success: function (data) {
                                            console.log(data);
                                            $dfd.resolve(data);
                                        },
                                        error: function () {
                                            $dfd.reject();
                                        }
                                    });

                                });

                            },

                            deleteAction: $scope.deleteForbidden ? undefined : $scope.deleteAction ? $scope.deleteAction : function (postData, params) {

                                var deleteUrl = `${url}/${postData[$scope.keyName]}`;
                                console.log(deleteUrl);
                                return $.Deferred(function ($dfd) {
                                    $.ajax({
                                        url: deleteUrl,
                                        type: 'DELETE',
                                        data: postData,
                                        dataType: 'json',
                                        beforeSend: function (request) {
                                            request.setRequestHeader('token', $localStorage.auth.token);
                                        },
                                        success: function (data) {
                                            $dfd.resolve(data);
                                        },
                                        error: function () {
                                            $dfd.reject();
                                        }
                                    });

                                });


                            }

                        },

                        fields: $scope.fields,
                        formCreated: function (event, data) {

                            data.form.find('input, select').addClass('form-control');
                            data.form.find('input[name=Time]').datepicker({
                                dateFormat: 'dd-mm-yy'
                            });
                            if (data.formType === 'create') {
                                data.form.find('input[name=Time]').datepicker({
                                    dateFormat: 'dd-mm-yy'
                                });
                                data.form.find(`input[name=${$scope.keyName}]`).attr('readonly', true);
                                data.form.find(`input[name=${$scope.keyName}]`).val(Date.now());
                            }

                        }


                    })

                    $(selector).jtable('load');

                    $rootScope.$on('reload', function (event, data) {

                        $(selector).jtable('load', data);

                    })

                })


            }


        }

    });