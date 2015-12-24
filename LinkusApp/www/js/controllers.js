angular.module('starter.controllers', [])

.controller('DailyCtrl', function($scope, $http, $IonicStorage) {
 $http.get('https://cors-test.appspot.com/test').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  });
})

.controller('MonthlyCtrl', function($scope) {

})

.controller('SettingsCtrl', function($scope, $http, $IonicStorage, $ionicPopup, $state, $window) {

  $scope.BuildString = "in-dev version";

  console.log("Reading Settings");

  $scope.showResetConfirm = function() {
  var confirmPopup = $ionicPopup.confirm({
    title: 'Reset to Factory Settings',
    template: 'Are you sure you want to reset everything? This will erase all groups and events.'
  });

  confirmPopup.then(function(res) {
    if(res) {
      $IonicStorage.setObject('groups.list', []);
      $IonicStorage.setObject('linkus-settings', {
              enablePush: true,
              updateInt: 30,
              nickname: "",
              birthday: null});
      $scope.placeholderBirthday = "Set Birthday";
      $scope.settings = $IonicStorage.getObject('linkus-settings');
      console.log('Wiped!');
      $state.go('tab.daily', {}, {reload: false});
    } else {
      console.log('The reset was canceled');
    }
  });
};

  $scope.settings = $IonicStorage.getObject('linkus-settings');
  console.log("SS: " + $scope.settings);

  if($scope.settings === null || typeof $scope.settings === "undefined"){
      $scope.settings = {
        enablePush: true,
        updateInt: 30,
        nickname: "",
        birthday: null
      };
  }

  console.log("B-Day : " + $scope.settings.birthday);

  if($scope.settings.birthday === null || typeof $scope.settings.birthday === "undefined"){
    $scope.placeholderBirthday = "Set Birthday";
  }
  else{
    $scope.placeholderBirthday = $scope.settings.birthday;
  }

  console.log($scope.settings);

  $scope.$on('$ionicView.leave', function() {
    console.log("Writting Settings to storage");
    window.localStorage['linkus-settings'] = $scope.settings;
  });

  $scope.datepickerObject = {
    titleLabel: 'Set Birthday',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    showTodayButton: false, //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    callback: function (val) {  //Mandatory
      if(typeof val === "undefined"){
        return;
      }
      $scope.settings.birthday = String(val).substring(4, 10);
      $scope.placeholderBirthday = $scope.settings.birthday;
      console.log("Birthday set @ " + $scope.settings.birthday);
    },
    dateFormat: 'MM-dd-yyyy', //Optional
    closeOnSelect: true //Optional
  };
})

.controller('NavCtrl', function($scope, $ionicPopup, $http, $state, $IonicStorage){

  if(typeof window.localStorage['groups.list'] === "undefined"){
    console.log("Creating new first group");
    $IonicStorage.setObject('groups.list', []);
  }

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
                   var groupArray = ($IonicStorage.getObject('groups.list') || []);

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

  $scope.remove = function(groupID){
    console.log("Removing : " + groupID);

    var arr = $IonicStorage.getObject('groups.list');

    for(var i = 0; i < arr.length; i++){
      if(arr[i].groupID === groupID){
        break;
      }
      else if(i === arr.length - 1){
        i = -1;
        break;
      }
    }

    if(i === -1){
      console.log("Group not found");
      return;
    }
    else{
      //Split the array @ the middle into 2 parts
      var tempLast = arr.splice(i + 1, arr.length);
      console.log(tempLast);
      var tempFirst = arr.splice(0, i);
      console.log(tempFirst);
      //Then append them together
      var fin = tempFirst.concat(tempLast);
    }


    $IonicStorage.setObject('groups.list', fin);

  }

  //$rootScope.groups = ;

  $scope.$on('$ionicView.enter', function() {
    console.log("View enter");
    //$scope.$apply();
    $rootScope.groups = $IonicStorage.getObject('groups.list');
    console.log("gList : " + $rootScope.groups);
    //console.log("Groups root : " + $rootScope.groups.length);
  });

  $scope.$on('$ionicView.leave', function() {
    console.log("View exit");
  });
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.factory('$IonicStorage', ['$window', '$rootScope', function($window, $rootScope) {

  console.log("Creating Service $IonicStorage");
  return {set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key) {
      return $window.localStorage[key];
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
      $rootScope.groups = value || [];
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || null);
    }
  }
}]);
