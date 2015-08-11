node-jwt-intro
=====


Using
	-angular-formly
	-ui router abstract states

	-password hashing with [node.bcrypt](https://github.com/ncb000gt/node.bcrypt.js)
	-jwt storage


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

