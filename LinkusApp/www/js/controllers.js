angular.module('starter.controllers', [])

.controller('DailyCtrl', function($scope, $http) {
 $http.get('https://cors-test.appspot.com/test').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  });
})

.controller('NavCtrl', function($scope, $ionicPopup, $http, $state, $IonicStorage){

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
                   var groupArray = ($IonicStorage.getObject('groups.list') || '[]');

                   groupArray.push(resp.data);

                   console.log(groupArray);
                   $IonicStorage.setObject('groups.list', groupArray);

                   $state.go('tab.groups', {}, {reload: false});
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

.controller('GroupsCtrl', ['$scope', 'Chats' , '$IonicStorage', '$rootScope', function($scope, Chats, $IonicStorage, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $rootScope.groups = $IonicStorage.getObject('groups.list');
  console.log($rootScope.groups);
  $scope.remove = function(groupID){
    console.log("Removing : " + groupID);

    var arr = $IonicStorage.getObject('groups.list');
    console.log(arr);
    var index;
    //**for(index = 0; index < arr.length; index++){
    //  console.log(arr[index].groupID);
  //    if(arr[index].groupID === groupID){
    //    console.log(groupID + " : " + arr[index].groupID);
      //  break;
    //  }
    //  else{
  //      continue;
  //    }
//    }

  //  console.log(index);

//    if(index === arr.length){
    //  console.log("No Index detected");
    //  return;
  //  }


  var filt = false;
  $IonicStorage.setObject('groups.list', arr.filter(function(i){
    console.log(filt);
    if(filt == true){
      return i;
    }
    if(i.groupID != groupID)
    {
      return i;
    }
    else{
      console.log("Found filt");
      filt = true;
    }
  }));

  //if(arr.length == 1)
  //  $IonicStorage.setObject('groups.list', []);
  //else
  //  $IonicStorage.setObject('groups.list', (arr).splice(index, arr.length));

    //$state.go('tab.groups', {}, {reload: true});
  }

  $scope.$on('$ionicView.enter', function() {
    console.log("View enter");
    $scope.$apply();
  });

  $scope.$on('$ionicView.leave', function() {
    console.log("View exit");
  });
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.factory('$IonicStorage', ['$window', '$rootScope', function($window, $rootScope) {

  angular.element($window).on('storage', function(event) {
    console.log("Storage Update");
    console.log(event);
    if (event.key === 'groups.list') {
      console.log("groups.list");
    }
  });

  console.log("Creating Service $IonicStorage");
  return {set: function(key, value) {
      $window.localStorage[key] = value;
    },
    setRoot: function(scope) {
        root = scope;
      },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
      $rootScope.groups = JSON.parse($window.localStorage[key] || '[]');
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}]);
