angular.module('dartnews.feed', [])
.controller('FeedController', function ($scope, $window, $location, Feed) {
  $scope.errSrc = "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2011/11/data-farm-537x399.jpg";

  var pickColor = function (score) {
    score = score || 0.5;
    if (score < 0.666) {
      return '#d0cfcc'; // low recommendation
    } else if (score < 0.832) {
      return '#f3dfb4'; // medium recommendation
    } else {
      return '#feba27'; // high recommendation
    }
  };

  var updateData = function (appData){
    console.dir(appData);
    $scope.allCategories = appData.allCats;
    $scope.userCategories = appData.userCats;
    $scope.articles = appData.articles;
    $scope.name = appData.name;
    $scope.picUrl = appData.picUrl;
    for (var i = 0; i < $scope.articles.length; i++) {
      $scope.articles[i].yellowShade = {
        'background-color': pickColor($scope.articles[i].userScores)
      };
    }
  };

  $scope.getArticlesForUser = function (){
    console.log('get arts');
    Feed.getArticlesForUser()
      .then(function (response){
        console.log('got arts');
        updateData(response.data);
      });
  };

  $scope.removeCategory = function (categoryIndex){
    Feed.updateUserCategories($scope.userCategories[categoryIndex], 'POST')
    .then(function(response){
      updateData(response.data);
    });
  };

  $scope.addCategory = function (category){
    Feed.updateUserCategories(category, 'PUT')
    .then(function(response){
      updateData(response.data);
    });
  };

  $scope.likeArticle = function (articleIndex){
    var articleID = $scope.articles[articleIndex]._id;
    Feed.likeArticle(articleID);
  };

  $scope.signOut = function (){
    Feed.signOut();
  };

  $scope.categoryFilter = function (filterInput) {
    for (var i = 0; i < $scope.userCategories.length; i++){
      if(filterInput === $scope.userCategories[i]){
        return false;
      }
    }
    return true;
  };

  $scope.getArticlesForUser();

})
.filter('thirtyWordsMax', function () {
  return function (articleSummary) {
    var shortendSummary = articleSummary.split(' ').slice(0, 29).join(' ');
    var lastChar = shortendSummary[shortendSummary.length - 1];
    if (/[\w]/ig.test(lastChar)) {
      return shortendSummary + '...';
    } else {
      return shortendSummary;
    }
  };
});
