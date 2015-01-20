# JEDIT

> Jedit is a lightweight plugin to help you to do end-to-end testing without any backend schema. The idea is to use your JSON files as your Model with all kind of service calls. Here service call will not actually make an database query instead it will use you JSON file to fetch the data. You can simply call your four magical javascript methods and it will help you to <b> CREATE | READ | UPDATE | DELETE </b> aka <b>CRUD</b>
in your JSON file. The core of this plugin uses PHP Filesytem


### Version
0.0.1

### Tech

JEdit uses a number of open source projects to work properly:

* [Lo-Dash] - Utility tool
* [PHP] - Filesystem
* [Apache] - Server
* [jQuery] - duh

### Usage

Initialize the CRUD class, it accepts a parameter, the URL of the JSON file you want to use. It comes with couple of configuration which we can do, and we will see here.

A simple get call, will return you with a deferred object with all the data in the json file.
```bash
new CRUD('login.json').get() 
```
A get call with filters applied, you can pass multiple filters and retrive the deferred object with the matched value. Matching starts in a sequence from left to right.
```bash
new CRUD('login.json').get({username: 'ravisha96@gmail.com', password: 'password'})
```
Update method accept two property in a parameter, first property will be used to match, use can choose any property for matching for example I have used <b>'id'</b>, second property is <b>'Update'</b> accepts an object to update the matched objects properties values. If the properties are not matched it will insert an new entry for the matched object.
```bash
new CRUD('login.json').update({
    id: 120345,
    update: {
        username: 'ravi_sha96@yahoo.com', 
        password: 'password'
    }
});
```
### WIP
Watch this space for the upcoming changes and add-ons.
> 1. Method Chaining
> 2. Authentications
> 3. Join Multiple Queries similar to <b> SQL JOIN </b>


### Development

Want to contribute? Great!

License
----

MIT


**Free Software, Hell Yeah!**
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[keymaster.js]:https://github.com/madrobby/keymaster
[jQuery]:http://jquery.com
[php]:http://php.net/
[Apache]:http://www.apache.org/
[Lo-Dash]:https://lodash.com/
