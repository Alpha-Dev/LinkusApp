angular.module('starter.controllers', [])

.controller('DailyCtrl', function($scope, $http, $IonicStorage) {
 $http.get('https://cors-test.appspot.com/test').then(function(resp) {

    console.log('Success', resp);
    // For JSON responses, resp.data contains the result

    date = new Date();
    actual_data = [];
    var monthnum;
    if(date.getMonth()>9)
      monthnum = date.getMonth()+1;
    else
      monthnum = "0"+(date.getMonth()+1);
    document.getElementById('date_picker').value = date.getFullYear() + "-"+(monthnum)+"-"+date.getDate();

    //$scope.Date_picker = date;

    actual_data[2015] = []
    actual_data[2015][11] = []
    actual_data[2015][11][15] = {
      events: [{
        name: "School Thing 1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu lorem tortor. Vestibulum ac nisl nisi. Aenean dignissim sit amet nunc eget congue. Aliquam ac neque ornare, aliquam enim nec, hendrerit tortor. Suspendisse ex dui, dapibus a orci sit amet, ultricies ultrices ex. In ultricies est quis dui consequat, a eleifend ex faucibus. Fusce eget ipsum non leo interdum sagittis et vel urna. Suspendisse viverra sapien vitae porttitor euismod. Nullam a enim elit. Proin maximus posuere maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sit amet elit mi. Suspendisse potenti. Curabitur nec lacus sem.",
        time_start: 1412,
        time_end: 1432
      }, {
        name: "School Thing 2",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu lorem tortor. Vestibulum ac nisl nisi. Aenean dignissim sit amet nunc eget congue. Aliquam ac neque ornare, aliquam enim nec, hendrerit tortor. Suspendisse ex dui, dapibus a orci sit amet, ultricies ultrices ex. In ultricies est quis dui consequat, a eleifend ex faucibus. Fusce eget ipsum non leo interdum sagittis et vel urna. Suspendisse viverra sapien vitae porttitor euismod. Nullam a enim elit. Proin maximus posuere maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sit amet elit mi. Suspendisse potenti. Curabitur nec lacus sem.",
        time_start: 1435,
        time_end: 1455
      }, {
        name: "School Thing 3",
        desc: "Eat the ooo33o",
        time_start: 1515,
        time_end: 1652
      }]
    }
    actual_data[2015][11][24] = {
      events: [{
        name: "School Thing 1",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu lorem tortor. Vestibulum ac nisl nisi. Aenean dignissim sit amet nunc eget congue. Aliquam ac neque ornare, aliquam enim nec, hendrerit tortor. Suspendisse ex dui, dapibus a orci sit amet, ultricies ultrices ex. In ultricies est quis dui consequat, a eleifend ex faucibus. Fusce eget ipsum non leo interdum sagittis et vel urna. Suspendisse viverra sapien vitae porttitor euismod. Nullam a enim elit. Proin maximus posuere maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sit amet elit mi. Suspendisse potenti. Curabitur nec lacus sem.",
        time_start: 1412,
        time_end: 1432
      }, {
        name: "School Thing 2",
        desc: "Eat the ooo33o",
        time_start: 1430,
        time_end: 1545
      }]
    }
    $IonicStorage.setObject("event_data",actual_data);
    console.log($IonicStorage.getObject("event_data"))
    $scope.day_changed = function(){
      day_to_render = new Date(document.getElementById('date_picker').value);
      GenerateDataToRender(day_to_render)
    }
    $scope.hide_event = function(index){
      console.log(index)
      date_value = new Date(document.getElementById('date_picker').value);
      actual_data[date_value.getFullYear()][date_value.getMonth()][date_value.getDate()].events[index].hide = true;
    }
    //Both month and date are 0-based, 0 being the start of the month/1st month
    GenerateDataToRender = function(date){
      if(actual_data[date.getFullYear()] != undefined){
        if(actual_data[date.getFullYear()][date.getMonth()] != undefined){
          if(actual_data[date.getFullYear()][date.getMonth()][date.getDate()] != undefined){
            $scope.working_data = actual_data[date.getFullYear()][date.getMonth()][date.getDate()]
          }
          else{
            $scope.working_data = undefined;
          }
        }
        else{
          $scope.working_data = undefined;
        }
      }
      else{
        $scope.working_data = undefined;
      }
    }
    IdentifyConflicts = function (data) {
      for (var a = 0; a < data.length; a++) {
        if (data[a] != undefined) {
          data[a].conflicts = 0;
          for (var b = 0; b < data[a].events.length; b++) {
            var check_start = data[a].events[b].time_start;
            var check_end = data[a].events[b].time_end;
            for (var q = 1; q < data[a].events.length; q++) {
              var compare_start = data[a].events[q].time_start;
              var compare_end = data[a].events[q].time_end;
              if ((check_start < compare_start && compare_start < check_end) || (check_start < compare_end && compare_end < check_end)) {
                data[a].events[b].conflict = q;
                data[a].events[q].conflict = b;
                data[a].conflicts++;
              }
            }
          }
        }
      }
    }
    for(var a = 0;a<actual_data.length;a++){
      if(actual_data[a]!=undefined){
        for(var b = 0;b<actual_data[a].length;b++){
          if(actual_data[a][b]!=undefined){
            IdentifyConflicts(actual_data[a][b])
          }
        }
      }
    }
    //$scope.working_data = actual_data[$scope.Date_picker.getFullYear()][$scope.Date_picker.getMonth()][$scope.Date_picker.getDate()];
  }, function(err) {
    console.error('ERR', err);
  });
})

.controller('MonthlyCtrl', function($scope) {
  var getMonthString = function(num){
    switch(num){
      case 0: return "January";
      break;
      case 1: return "February";
      break;
      case 2: return "March";
      break;
      case 3: return "April";
      break;
      case 4: return "May";
      break;
      case 5: return "June";
      break;
      case 6: return "July";
      break;
      case 7: return "August";
      break;
      case 8: return "September";
      break;
      case 9: return "October";
      break;
      case 10: return "November";
      break;
      case 11: return "December";
      break;

    }
  }
  var date = new Date();
  console.log(date);
  $scope.month = getMonthString(date.getMonth());
  $scope.month_data = date;
  $scope.year = date.getFullYear();
  $scope.working_data = undefined;
  IdentifyConflicts = function (data) {
    for (var a = 0; a < data.length; a++) {
      if (data[a] != undefined) {
        data[a].conflicts = 0;
        for (var b = 0; b < data[a].events.length; b++) {
          var check_start = data[a].events[b].time_start;
          var check_end = data[a].events[b].time_end;
          for (var q = 1; q < data[a].events.length; q++) {
            var compare_start = data[a].events[q].time_start;
            var compare_end = data[a].events[q].time_end;
            if ((check_start < compare_start && compare_start < check_end) || (check_start < compare_end && compare_end < check_end)) {
              data[a].events[b].conflict = q;
              data[a].events[q].conflict = b;
              data[a].conflicts++;
            }
          }
        }
      }
    }
  }

  $scope.month_changed = function(){
    var d = new Date(document.getElementById("month_picker").value+"-15")
    var month_number = d.getMonth();
    $scope.year = date.getFullYear();
    $scope.month = getMonthString(month_number);
    if(actual_data[d.getFullYear()] != undefined){
      if(actual_data[d.getFullYear()][d.getMonth()] != undefined){
        IdentifyConflicts(actual_data[d.getFullYear()][d.getMonth()])
        $scope.working_data = actual_data[d.getFullYear()][d.getMonth()];
        console.log($scope.working_data)
        for(var a = 0;a<$scope.working_data.length;a++){
          if($scope.working_data[a] != undefined){
            $scope.working_data[a].date = a;
          }
        }
      }
      else
        $scope.working_data = undefined;
    }
    else {
        $scope.working_data = undefined;
    }
  }
  var actual_data = [];
  actual_data[2015] = []
  actual_data[2015][11] = []
  actual_data[2015][11][15] = {
    events: [{
      name: "School Thing 1",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu lorem tortor. Vestibulum ac nisl nisi. Aenean dignissim sit amet nunc eget congue. Aliquam ac neque ornare, aliquam enim nec, hendrerit tortor. Suspendisse ex dui, dapibus a orci sit amet, ultricies ultrices ex. In ultricies est quis dui consequat, a eleifend ex faucibus. Fusce eget ipsum non leo interdum sagittis et vel urna. Suspendisse viverra sapien vitae porttitor euismod. Nullam a enim elit. Proin maximus posuere maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sit amet elit mi. Suspendisse potenti. Curabitur nec lacus sem.",
      time_start: 1412,
      time_end: 1432
    }, {
      name: "School Thing 2",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu lorem tortor. Vestibulum ac nisl nisi. Aenean dignissim sit amet nunc eget congue. Aliquam ac neque ornare, aliquam enim nec, hendrerit tortor. Suspendisse ex dui, dapibus a orci sit amet, ultricies ultrices ex. In ultricies est quis dui consequat, a eleifend ex faucibus. Fusce eget ipsum non leo interdum sagittis et vel urna. Suspendisse viverra sapien vitae porttitor euismod. Nullam a enim elit. Proin maximus posuere maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sit amet elit mi. Suspendisse potenti. Curabitur nec lacus sem.",
      time_start: 1435,
      time_end: 1455
    }, {
      name: "School Thing 3",
      desc: "Eat the ooo33o",
      time_start: 1515,
      time_end: 1652
    }]
  }
  actual_data[2015][11][24] = {
    events: [{
      name: "School Thing 1",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu lorem tortor. Vestibulum ac nisl nisi. Aenean dignissim sit amet nunc eget congue. Aliquam ac neque ornare, aliquam enim nec, hendrerit tortor. Suspendisse ex dui, dapibus a orci sit amet, ultricies ultrices ex. In ultricies est quis dui consequat, a eleifend ex faucibus. Fusce eget ipsum non leo interdum sagittis et vel urna. Suspendisse viverra sapien vitae porttitor euismod. Nullam a enim elit. Proin maximus posuere maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sit amet elit mi. Suspendisse potenti. Curabitur nec lacus sem.",
      time_start: 1412,
      time_end: 1432
    }, {
      name: "School Thing 2",
      desc: "Eat the ooo33o",
      time_start: 1430,
      time_end: 1545
    }]
  }
  for(var a = 0;a<actual_data.length;a++){
    if(actual_data[a]!=undefined){
      for(var b = 0;b<actual_data[a].length;b++){
        if(actual_data[a][b]!=undefined){
          for(var c = 0;c<actual_data[a][b];c++){
            if(actual_data[a][b][c] != undefined){
              actual_data[a][b][c].date = c;
            }
          }
        }
      }
    }
  }
  if(actual_data[date.getFullYear()] != undefined)
    $scope.month_working_data = actual_data[date.getFullYear()][date.getMonth()];
})

.controller('Credits', function($scope) {
  console.log("Enter Credits");
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    console.log(viewData);
    viewData.enableBack = true;
  });
})

.controller('ChangeLog', function($scope) {
  console.log("Enter changelog");
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    console.log(viewData);
    viewData.enableBack = true;
  });
})

.controller('SettingsCtrl', function($scope, $http, $IonicStorage, $ionicPopup, $state, $window) {

  $scope.gotochangelog = function(){
    $state.go("changeLog");
  }

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
    window.localStorage['linkus-settings'] = JSON.stringify($scope.settings);
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
