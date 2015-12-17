angular.module('starter.controllers', [])

.controller('DailyCtrl', function($scope, $http) {
 $http.get('https://cors-test.appspot.com/test').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  });
})

.controller('NavCtrl', function($scope, $ionicPopup, $http, $state){

  $scope.testLog = function(){
    $scope.data = {}

    var groupIDPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.groupID">',
      title: 'Enter a Group ID',
      subTitle: 'Enter a Group ID',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add</b>',
          type: 'button-positive',
          onTap: function(e) {
            console.log($scope.data.groupID);
            if (!$scope.data.groupID) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
              } else {
                //TODO: Error checking make sure no duplicates
                //Here we begin fetching the group information, recording the groupd about
                //rather than the group events
                console.log("Adding group");
                $http.get('https://goo.gl/' + $scope.data.groupID).then(function(resp) {
                   var groupArray = JSON.parse(window.localStorage['groups.list'] || '[]');

                   groupArray.push(resp.data);

                   console.log(groupArray);
                   window.localStorage['groups.list'] = JSON.stringify(groupArray);
                   console.log($state);

                   $state.go('tab.groups', {}, {reload: true});
                 }, function(err) {
                   console.error('ERR', err);
                });
            }
          }
        }
      ]
    });
  }

})

.controller('GroupsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.$on('$ionicView.enter', function() {
    console.log("View enter");
    $scope.groups = JSON.parse(window.localStorage['groups.list']);
    $scope.groupsList = window.localStorage['groups.list'];
    $scope.remove = function(group){
      var arr = JSON.parse(window.localStorage['groups.list']);

      var index = arr.indexOf(group);
      window.localStorage['groups.list'] = JSON.stringify(JSON.parse(window.localStorage['groups.list']).splice(index + 1, 1));

      $state.go('tab.groups', {}, {reload: true});
    }
  });

  $scope.$on('$ionicView.leave', function() {
    console.log("View exit");
    $scope.groups = [];
  });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
