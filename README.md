[![Book session on Codementor](https://cdn.codementor.io/badges/book_session_github.svg)](https://www.codementor.io/aaronksaunders)

#Starter Ionic Application Template with Parse Integration
---
## Update July 26th
Added the whitelist plugin to project to address issues running on device. You can use the `ionic state restore` command to get the project in the right state or manually install the plugin.

```
ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git
```

then update the `confix.xml` file

```
<allow-navigation href="*" />
```

## Ionic Video Series - Subscribe on YouTube Channel
[![http://www.clearlyinnovative.com/wp-content/uploads/2015/07/blog-cover-post-2.jpg](http://www.clearlyinnovative.com/wp-content/uploads/2015/07/blog-cover-post-2.jpg)](https://www.youtube.com/channel/UCMCcqbJpyL3LAv3PJeYz2bg?sub_confirmation=1)

## Overiew
This sample application is provided as a starter to get your [Ionic Framework](http://ionicframework.com/getting-started/) and [Parse Application](https://parse.com/products/core) up and running easily. Most of the fuss in these applications is figuring out login and account creation... This template solves that for you with a pattern that then can be utilized for a full-blown application; this is not a throw-away tutorial.

We have seperated out the templates, controllers, and services into a format that will be sustainable for your final solution.

## Setting Up Parse Configuration in the Starter App
See the Parse.com website for [Getting Started](https://www.parse.com/apps/quickstart#parse_data/web/existing).

The critical information needed after configuring your application is the `applicationId` and the `javascriptKey` which are needed for the configuration section of the ionic application

<h4>Parse Configuration Screen for Application</h4>
![https://raw.githubusercontent.com/aaronksaunders/parse-starter-ionic/master/screenshots/Screenshot%202015-07-17%2021.18.41.png](https://raw.githubusercontent.com/aaronksaunders/parse-starter-ionic/master/screenshots/Screenshot%202015-07-17%2021.18.41.png)

Using the values from the Parse Console, set the properties in the app.js file section shown below

```javascript,linenums=true
    .value('ParseConfiguration', {
        applicationId: "SET-THIS-USING-PARSE-APPLICATION-ID",
        javascriptKey: "SET-THIS-USING-PARSE-JAVASCRIPT-KEY"
    })
}
```
## Starter App Project Structure
The starter app is a Two-Tab based app with a Login Screen and an Account Creation Screen. The application will create Parse Users for you after it is configured properly.

The first Tab is setup as a list view that when a used clicks on an item in the list a detail screen is rendered. The ui-router routes are already configured for this application behavior.

<h4>List View</h4>
![https://s3.amazonaws.com/f.cl.ly/items/2O3N3c1W1O3m1O3n2Z0R/Image%202015-03-22%20at%2010.26.29%20PM.png](https://s3.amazonaws.com/f.cl.ly/items/2O3N3c1W1O3m1O3n2Z0R/Image%202015-03-22%20at%2010.26.29%20PM.png)
<h4>Detail View</h4>
![https://s3.amazonaws.com/f.cl.ly/items/0l3E2j2q3w1G0v2y3E2y/Image%202015-03-22%20at%2010.26.37%20PM.png](https://s3.amazonaws.com/f.cl.ly/items/0l3E2j2q3w1G0v2y3E2y/Image%202015-03-22%20at%2010.26.37%20PM.png)

The second Tab in this setup as a "Settings Screen" that will pass in the User Object from Parse when the user selects the Tab.
<h4>Application Settings View</h4>
![https://s3.amazonaws.com/f.cl.ly/items/3D081H1416050g0d352e/Image%202015-03-22%20at%2010.30.08%20PM.png](https://s3.amazonaws.com/f.cl.ly/items/3D081H1416050g0d352e/Image%202015-03-22%20at%2010.30.08%20PM.png)

The file structure is such that all of the user specific functionality is `www/js/user/controllers.js` for controllers and `www/js/user/services.js` for services & factories. The associated views are in `www/templates/user/login.html ` and  `www/templates/user/signup.html `.

## UI-Router and Resolve
The simple way that we ensure the user is logged into the application is by using the abstract state `tab`, this state uses `resolve`functionality from `ui-router` to determine if the Parse User Object is available by calling `UserService.init()`. If the promise is resolved successfully, then we have a User object and the application can move forward.

[**_Click here for More information on ui-router, resolve and abstract states_**](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views)

```javascript,linenums=true
// setup an abstract state for the tabs directive, check for a user
// object here is the resolve, if there is no user then redirect the
// user back to login state on the changeStateError
.state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    resolve: {
        user: function (UserService) {
            var value = UserService.init();
            return value;
        }
    }
})
```
If the `UserService.init()` function cannot resolve successfully, it returns the error `noUser`. Whenever the `ui-router` fails to route properly, an error is generated `noUser`.

We listen for the `$stateChangeError` and if it is in fact the `noUser` error then we route to the Login Screen using the `app-login` state of the `ui-router`.

Since the `tab` state is  `abstract` all child states of must also have successfully resolved the parent state, this ensures the user in logged in before executing any state of the application

```javascript,linenums=true
$rootScope.$on('$stateChangeError',
   function (event, toState, toParams, fromState, fromParams, error) {

     var errorMsg = error && (error.debug || error.message || error);
     console.log('$stateChangeError ' + errorMsg);

     // if the error is "noUser" the go to login state
     if (error && error.error === "noUser") {
        $state.go('app-login', {});
     }
});
```
## Parse Service in Ionic Framework
It was important to me to not include the Parse functionality directly in the controller like so many of the other tutorials out there since in is not a best practice. But once you get into the service, you will see that the service is simply a wrapper around the specific [Parse Javascript API](https://parse.com/docs/js_guide#users) calls.
```javascript,linenums=true
/**
 * www/js/user/services.js
 *
 * Create a user in Parse, returns Promise
 *
 * @param _userParams
 * @returns {Promise}
 */
createUser: function (_userParams) {
    var user = new Parse.User();
    user.set("username", _userParams.email);
    user.set("password", _userParams.password);
    user.set("email", _userParams.email);
    user.set("first_name", _userParams.first_name);
    user.set("last_name", _userParams.last_name);

    // should return a promise
    return user.signUp(null, {});
},
```

Logging in a user is even more straight forward
```javascript,linenums=true
/**
 * www/js/user/services.js
 * 
 * @param _user
 * @param _password
 * @returns {Promise}
 */
login: function (_user, _password) {
    return Parse.User.logIn(_user, _password);
},
```
## Using Parse Service in Ionic Framework to Query Data
``` Javascript
var TutorSession = Parse.Object.extend("TutorSession");
var query = new Parse.Query(TutorSession);
// get all related objects
query.include(["user","place","tutor"]);
query.find({
  	success: function(_response) {
    	//console.log("myTutorSession.query: " + JSON.stringify(_response,null,2));
    	for (var i = 0; i < _response.length; i++) {
    	  var session = _response[i];
    	  console.log("user name: " + session.get("user").get("first_name"));
    	  console.log("location name: " + session.get("place").get("Location"));    
    	  console.log("tutor name: " + session.get("tutor").get("first_name"));      
	    }
  	}
});
```

based off of the Parse objects created here:

Screenshot of Users Objects
![Appcelerator Alloy](https://raw.githubusercontent.com/aaronksaunders/parse-starter-appC/master/images/parse_users.png)

Screenshot of Places Objects
![Appcelerator Alloy](https://raw.githubusercontent.com/aaronksaunders/parse-starter-appC/master/images/parse_places.png)

Screenshot of Tutor Sessions Objects
![Appcelerator Alloy](https://raw.githubusercontent.com/aaronksaunders/parse-starter-appC/master/images/parse_tutor_sessions.png)

## Links
* [Complete Source Code For Downloading](https://github.com/aaronksaunders/parse-starter-ionic)
* [Parse Getting Started](https://parse.com/apps/quickstart#parse_data/web/new)
* [Ionic Framework Getting Started](http://ionicframework.com/getting-started)



