angular
    .module('dialog', ['ui.bootstrap', 'uib/template/modal/window.html', 'ui-notification'])
    .config(function (NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 2000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    })
    .service('dialog', function ($uibModal,Notification) { //methods for dialog

        var selectedDialog;

        this.notify = function(type,msg) {

            if (type === 'success')
                Notification.success(msg);
            else
                Notification.error(msg);

        }

        this.showAlert = function (type, msg) { //Show alert dialog

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: 'sm',
                templateUrl: '/views/components/notify-dialog.component.html',
                controller: function ($scope, $uibModalInstance, $timeout) {

                    $scope.title = angular.uppercase(type === 'error' ? 'lỗi' : 'thông báo');
                    $scope.type = type;
                    $scope.content = msg;
                    $scope.close = function () {

                        $uibModalInstance.close(selectedDialog);

                    }

                }
            });

            modalInstance.result.then(function (selectedItem) {

                selectedDialog = selectedItem

            }, function () {

            });

        }

        this.showAddDialog = function (url, callback, excepted, title) { //show add dialog

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: `<dialog-add-box title="${title}" excepted="excepted" url="${url}" callback="callback(records)"></dialog-add-box>`,
                windowClass: 'app-modal-window',
                controller: function ($scope, $uibModalInstance) {

                    $scope.excepted = excepted;
                    $scope.callback = function (records) {

                        if (records)
                            callback(records);

                        $scope.close();

                    }
                    $scope.close = function () {

                        $uibModalInstance.close(selectedDialog);
                        selectedDialog = undefined;

                    }

                }
            });

            modalInstance.result.then(function (selectedItem) {

                selectedDialog = selectedItem

            }, function () {

            });


        }


    });