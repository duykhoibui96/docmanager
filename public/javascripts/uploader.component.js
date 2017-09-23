angular
    .module('uploader', [])
    .directive('uploader', function ($http) {

        return {

            restrict: 'EA',
            scope: true,
            template: '<input id="uploader" type="file" name="uploadObj" multiple/>',
            link: function (scope, element, attrs) {

                $(document).ready(function () {

                    $('#uploader').fileinput({
                        uploadUrl: scope.uploadUrl, // you must set a valid URL here else you will get an error
                        // allowedFileExtensions: ['jpg', 'png', 'gif'],
                        overwriteInitial: false,
                        maxFileSize: 1000,
                        maxFilesNum: 10,
                        //allowedFileTypes: ['image', 'video', 'flash'],
                        slugCallback: function (filename) {
                            return filename.replace('(', '_').replace(']', '_');
                        }
                    });

                    // CATCH RESPONSE


                    $('#uploader').on('fileuploaded', function (event, data, previewId, index) {
                        var records = data.response.Record.Document;
                        scope.reload(records);
                    });

                });

            }



        }


    })