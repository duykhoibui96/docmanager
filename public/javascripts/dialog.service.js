angular
    .module('dialog', ['ui.bootstrap','uib/template/modal/window.html'])
    .service('dialog', function ($uibModal) {

        var selectedDialog;

        this.showAlert = function (type, msg) {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/views/components/notify-dialog.component.html',
                controller: function ($scope, $uibModalInstance) {

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


    });