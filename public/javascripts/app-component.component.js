angular
    .module('app-component', ['ngStorage',
        'ngRoute',
        'ui.router',
        'ui.bootstrap',
        'uib/template/typeahead/typeahead-popup.html',
        'uib/template/typeahead/typeahead-match.html',
    ])
    .directive('searchBox', function ($rootScope) { //for search box by ID and Name

        return {

            restrict: 'EA',
            scope: true,
            templateUrl: 'views/components/search-box.component.html',
            controller: function ($scope) {

                var id = $scope.for+'-table';
                $scope.selectedCat = $scope.searchCat[0].value;
                $scope.search = function () {

                    $rootScope.$emit('reload', {

                        id: id,

                        data: {

                            searchText: this.searchText,
                            cat: this.selectedCat

                        }

                    })

                }

            }

        }


    })
    .directive('filterBox', function ($rootScope) { //for time result filter box

        return {

            restrict: 'EA',
            scope: {

                for: '@'

            },
            templateUrl: 'views/components/filter-box.component.html',
            controller: function ($scope) {

                var id = $scope.for+'-table';

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

                        id: id,
                        data: {

                            startDate: startDate,
                            endDate: endDate

                        }

                    });

                };

                $(function () {
                    $('.begin-date, .end-date').datepicker({
                        dateFormat: 'dd-mm-yy'
                    });

                    $('.end-date').datepicker('setDate', 'today');

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
    .directive('customTable', function ($state, $localStorage, $http) { //jtable model
        //this is an abstract table that fields and methods need to be overwritten

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

                                if ($scope.recordState)
                                    $state.transitionTo($scope.recordState, {

                                        id: row_id

                                    })
                                else if ($scope.recordLink) {

                                    var record = data.records.find(function (item) {

                                        return item[$scope.keyName] == row_id;

                                    })

                                    $(this).toggleClass('selected');

                                    $scope.recordLink(record);

                                }

                            });

                        },
                        recordAdded: function (event, data) {
                            if (data.record) {
                                $(selector).jtable('load');
                            }
                        },
                        recordUpdated: function (event, data) {
                            if (data.record) {
                                $(selector).jtable('load');
                            }
                        },
                        recordDeleted: function (event, data) {
                            if (data.record) {
                                $(selector).jtable('load');
                            }
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

                                    $http.get(listUrl).then(function (response) {

                                        $rootScope.$emit('list', {

                                            id: $scope.id,
                                            data: response.data.Records,
                                            keyname: $scope.keyName

                                        });
                                        $dfd.resolve(response.data);

                                    }, function (err) {

                                        $dfd.reject();

                                    })

                                });

                            },

                            createAction: $scope.createForbidden ? undefined : $scope.createAction ? $scope.createAction : function (postData, params) {

                                var createUrl = `${url}`;
                                var data = JSON.parse('{"' + decodeURI(postData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

                                return $.Deferred(function ($dfd) {

                                    $http.post(createUrl, data).then(function (response) {

                                        $rootScope.$emit('refresh');
                                        $dfd.resolve(response.data);

                                    }, function (err) {

                                        $dfd.reject();

                                    })

                                });

                            },

                            updateAction: $scope.updateForbidden ? undefined : $scope.updateAction ? $scope.updateAction : function (postData, params) {

                                var array = postData.split('&');
                                var updateUrl = `${url}/${array[0].split('=')[1]}`;
                                postData = array.slice(1).join('&');
                                var data = JSON.parse('{"' + decodeURI(postData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

                                return $.Deferred(function ($dfd) {

                                    $http.put(updateUrl, data).then(function (response) {

                                        $dfd.resolve(response.data);

                                    }, function (err) {

                                        $dfd.reject();

                                    })

                                });

                            },

                            deleteAction: $scope.deleteForbidden ? undefined : $scope.deleteAction ? $scope.deleteAction : function (postData, params) {

                                var deleteUrl = `${url}/${postData[$scope.keyName]}`;
                                console.log(deleteUrl);
                                return $.Deferred(function ($dfd) {
                                    $http.delete(deleteUrl).then(function (response) {

                                        $dfd.resolve(response.data);

                                    }, function (err) {

                                        $dfd.reject();

                                    })

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
                                data.form.find(`input[name=${$scope.keyName}]`).attr('readonly', true);
                                data.form.find('input[name=Time]').datepicker('setDate', 'today');
                                data.form.find(`input[name=${$scope.keyName}]`).val(Date.now());
                            }

                            if ($scope.customFormCreated)
                                $scope.customFormCreated(event, data);

                        }


                    })



                    $(selector).jtable('load');

                    $rootScope.$on('reload', function (event, block) {

                        console.log(block);
                        if (block.id === $scope.id)
                            $(selector).jtable('load', block.data);

                    })

                })


            }


        }

    })
    .filter('optionFilter', function () { //For filtering in array by ng-repeat
        return function (array, search) {

            if (!search)
                return array;

            var filteredArray = array.filter(function (item) {

                return item.DisplayText.includes(search);

            })

            return filteredArray;


        };
    })
    .directive('autocomplete', function () { //For autocomplete input textbox

        return {

            restrict: 'EA',
            scope: {

                selected: '=',
                list: '=',
                placeholder: '@',
                url: '=',
                name: '@',
                excepted: '='

            },
            templateUrl: '/views/components/autocomplete.component.html',
            controller: function ($scope, $http) {

                $scope.getArray = function (search) {

                    return $http.post($scope.url + '?search=' + search).then(function (response) {

                        var options = response.data.Options;
                        if ($scope.excepted)
                            options = options.filter(function (item) {

                                return $scope.excepted.indexOf(item.Value) == -1;

                            })

                        return options;

                    })

                }

            }

        }


    })
    .directive('dialogAddBox', function (dialog, $http) { //For dialog add box

        return {

            restrict: 'EA',
            scope: {

                callback: '&',
                url: '@',
                excepted: '=',
                title: '@'

            },
            templateUrl: '/views/components/dialog-add-box.component.html',
            controller: function ($scope) {

                // $http.post($scope.url).then(function (response) {

                //     var options = response.data.Options;
                //     if ($scope.excepted)
                //         options = options.filter(function(item){

                //             return $scope.excepted.indexOf(item.Value) == -1;

                //         })

                //     $scope.list = options;

                // });

                var getPlaceholder = function () {

                    if ($scope.url.includes('customers'))
                        return 'Nhập mã hoặc tên khách hàng';
                    else if ($scope.url.includes('employees'))
                        return 'Nhập mã hoặc tên nhân viên';

                    return 'Nhập mã hoặc tên nghiên cứu';

                }

                $scope.placeholder = getPlaceholder();

                $scope.addList = [];
                $scope.add = function () {

                    if ($scope.list.indexOf($scope.selected) == -1)
                        return;

                    if ($scope.addList.indexOf($scope.selected) >= 0) {

                        return;

                    }

                    $scope.addList.push($scope.selected);
                    $scope.selected = undefined;

                }

                $scope.remove = function (index) {

                    $scope.addList.splice(index, 1);

                }

                $scope.submit = function () {


                    $scope.callback({

                        records: $scope.addList

                    });


                    $scope.addList = [];


                }

                $scope.close = function () {


                    $scope.callback();


                }

            }

        }



    })