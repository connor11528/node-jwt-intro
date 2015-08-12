node-jwt-intro
=====

[DEMO](https://node-jwt-intro.herokuapp.com/#/)

[TUTORIAL](http://connorleech.ghost.io/use-express-angular-and-jwt-to-make-a-secure-app/)

Using

-angular-formly
-angular ui router abstract states
-mongodb with mongoose
-password hashing with [node.bcrypt](https://github.com/ncb000gt/node.bcrypt.js)
-jwt token authentication

Relied heavily on the [egghead course](https://egghead.io/series/angularjs-authentication-with-jwt) and the [scotch.io tutorial](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)

#### Getting started
```
$ git clone <this_repo>
$ npm install
$ nodemon server 
```

### Deployment

```sh
heroku create <app_name>
heroku config:set NODE_ENV=production
heroku addons:create mongolab:sandbox 
heroku config | grep MONGOLAB_URI
git push heroku master
heroku ps:scale web=1
```

