angular
    .module('app', ['ngRoute',
        'ngStorage',
        'app-component', //for jtable and filter box
        'account', //for account authentication
        'employee', //for employee list and details
        'customer', //for customer list and details
        'consultancy', //for consultancy list and details
        'study', //for study list and details
        'seminar', //for seminar list and details
        'uploader', //for file upload
        'dialog', //for dialog methods
        'helper' //for helper service
    ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.interceptors.push(['$q', '$state', '$localStorage', '$rootScope', function ($q, $state, $localStorage, $rootScope) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.auth) {
                        config.headers.token = $localStorage.auth.token;
                    } else if (config.headers.token)
                        delete config.headers.token;
                    return config;
                },
                'responseError': function (response) {

                    if (response.status > 500)
                        $rootScope.showAlert('error', 'Mất kết nối đến server');
                    return $q.reject(response);
                }
            };
        }]);


        $stateProvider
            .state('dashboard', {

                url: '/dashboard',
                templateUrl: '/views/dashboard.html',
                onEnter: function ($rootScope) {

                    $rootScope.option = '';

                },
                controller: 'dashboardCtrl'

            });

        $urlRouterProvider
            .otherwise('/dashboard');

    })
    .run(function ($transitions, $rootScope, $localStorage, $window, $state, loading, auth) {

        $rootScope.auth = auth;

        $transitions.onStart({}, function (trans) {

            console.log('On start');
            if (trans._targetState._identifier === '500')
                return true;

            loading.start();
            var substate = trans.to().defaultSubstate;
            if (substate)
                return trans.router.stateService.target(substate);
            return true;

        })

        $transitions.onBefore({

            to: function (state) {
                return state.name !== 'login' && state.name !== '500';
            }

        }, function (trans) {

            // sidebar.addClass('small');
            if ($localStorage.auth)
                return true;
            return trans.router.stateService.target('login');

        });



        $transitions.onBefore({
            to: 'login'
        }, function (trans) {

            console.log('On before');

            if ($localStorage.auth)
                return trans.router.stateService.target('dashboard');
            return true;


        })

        $transitions.onSuccess({}, function (trans) {

            console.log('On success');
            $window.scrollTo(0, 0);
            loading.stop();
            return true;

        })

        $transitions.onError({}, function (trans) {

            console.log('On error');
            console.log(trans);
            if (trans._error.type === 5) {
                $state.reload();
                /*$rootScope.showConfirm('Back to login page - Continue?', function(isContinue){
            
                            if (isContinue)
                                $rootScope.logout();
                            else
                                $state.reload();
            
                        })*/

            } else if (!trans._error.redirected) {

                console.log(trans);
                loading.start();

            }

            return true;

        })

    })
    .controller('dashboardCtrl',function($scope){
        
        $scope.createForbidden = true;
        $scope.updateForbidden = true;
        $scope.deleteForbidden = true;
        $scope.filterList = {

            recent: true

        };

        $scope.mode = 'intro';
        $scope.switchMode = function(mode){

            $scope.mode = mode;
            
        }
        $scope.$watch('mode', function(newValue, oldValue){

            console.log(newValue);
            
        })
        
    });