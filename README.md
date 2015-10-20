node-jwt-intro
=====

[DEMO](https://node-jwt-intro.herokuapp.com/#/)

[TUTORIAL](https://github.com/cleechtech/cleechtech.github.io/blob/master/posts/use%20express%2C%20angular%20and%20jwt%20to%20make%20a%20secure%20app.md)

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

