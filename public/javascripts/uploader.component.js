angular
    .module('uploader', [])
    .directive('uploader', function ($http, $rootScope) {

        return {

            restrict: 'EA',
            scope: true,
            template: '<input id="uploader" type="file" name="uploadObj" multiple/>',
            controller: function ($scope) {

                $(document).ready(function () {

                    $('#uploader').fileinput({
                        uploadUrl: $scope.uploadUrl, // you must set a valid URL here else you will get an error
                        // allowedFileExtensions: ['jpg', 'png', 'gif'],
                        overwriteInitial: false,
                        maxFileSize: 10000,
                        maxFilesNum: 10,
                        //allowedFileTypes: ['image', 'video', 'flash'],
                        slugCallback: function (filename) {
                            return filename.replace('(', '_').replace(']', '_');
                        }
                    });

                    // CATCH RESPONSE


                    $('#uploader').on('fileuploaded', function (event, data, previewId, index) {
                        var records = data.response.Record.Document;
                        $rootScope.$emit('reload', records);
                    });

                });

            }



        }


    })
    .directive('fileManager', function ($http) {

        return {

            restrict: 'EA',
            scope: {

                document: '=',
                url: '='

            },
            template: '<custom-table></custom-table>',
            controller: function ($scope) {

                var formatSize = function (size) {

                    var unit = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

                    for (var i = 0; i < 4; i++)
                        if (size < 1024)
                            return `${size} ${unit[i]}`;
                        else
                            size = Math.round(size / 1024);

                    return `${size} TB`;
                }

                $scope.id = 'document-table';
                $scope.title = 'Danh sách tập tin';
                console.log($scope.url);
                $scope.fields = {

                    originalname: {

                        title: 'Tên tập tin'


                    },

                    size: {

                        title: 'Kích cỡ',
                        display: function (data) {

                            return formatSize(data.record.size);

                        }

                    },

                    time: {

                        title: 'Thời gian',
                        display: function (data) {

                            return new Date(data.record.time).toLocaleString();

                        }

                    },

                    path: {

                        key: true,
                        list: false

                    },

                    download: {

                        width: '1%',
                        display: function (data) {

                            console.log(data);
                            return `<a href="${data.record.path}" download><i class="fa fa-download" aria-hidden="true"></i></a>`;

                        }

                    }

                }

                $scope.createForbidden = true;
                $scope.updateForbidden = true;

                $scope.listAction = function (postData, params) {

                    var startIndex = params.jtStartIndex;
                    var pageSize = params.jtPageSize;

                    var docs = Object.assign([], $scope.document);

                    if (postData) {
                        if (postData.startDate) {
                            var start = new Date(Number(postData.startDate));
                            var end = new Date(Number(postData.endDate));

                            docs = docs.filter(function (item) {

                                var current = new Date(item.time);
                                return start <= current && current <= end;

                            })
                        }
                        else
                            docs = postData;

                    }

                    return $.Deferred(function ($dfd) {

                        $dfd.resolve({

                            Result: 'OK',
                            TotalRecordCount: docs.length,
                            Records: docs.slice(startIndex, startIndex + pageSize)

                        })


                    });


                }

                $scope.deleteAction = function (postData) {

                    console.log(postData);
                    return $.Deferred(function ($dfd) {

                        $http.put($scope.url, postData).then(function (response) {

                            var data = response.data;
                            $scope.document = data.Record.Document;
                            $dfd.resolve(data);

                        }, function (err) {

                            $dfd.reject();

                        })

                    });

                }


            }

        }


    });