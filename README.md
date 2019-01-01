# mongoose-issue

> Project to demonstrate that Feathers is the cause of a Mongoose plugin not working correctly.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Hack

The following line of `node_modules/feathers-mongoose/lib/service.js` need to be replaced:

  ```js
  let modelQuery = model.findOneAndUpdate(_.omit(query, '$populate'), data, options); 
  ``` 

With:

  ```js 
  // HACK --- START
  const hackedData = Object.assign({}, data, { $set: {} });
  console.log('***************************************************************** feathers-mongoose/lib/service.js ');
  console.log('query', _.omit(query, '$populate'));
  console.log('data', hackedData);
  console.log('options', options);
  console.log('***************************************************************************************************');
  let modelQuery = model.findOneAndUpdate(_.omit(query, '$populate'), hackedData, options);
  // HACK --- END
  ``` 

In addition the following connection options need to be passed to Mongoose in `src/mongoose.js`:

  ```js 
  const mongooseOptions = {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
  };
  ``` 

And set on the connection:

  ```js
  mongoose.connect(app.get('mongodb'), mongooseOptions); 
  ``` 

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/mongoose-issue; npm install
    ```

3. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
