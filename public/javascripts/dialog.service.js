angular
    .module('dialog', ['ui.bootstrap', 'uib/template/modal/window.html'])
    .service('dialog', function ($uibModal) {

        var selectedDialog;

        this.showAlert = function (type, msg) {

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

        this.showAddDialog = function (url, trigger, excepted, title) {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: `<dialog-add-box title="${title}" excepted="excepted" url="${url}" trigger="trigger(records)"></dialog-add-box>`,
                windowClass: 'app-modal-window',
                controller: function ($scope, $uibModalInstance) {

                    $scope.excepted = excepted;
                    $scope.trigger = function(records){
                     
                        if (records)
                            trigger(records);
                            
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