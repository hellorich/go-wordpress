# go-wordpress
A starting point for Wordpress projects.

## Requirements
1. The [latest stable release](https://github.com/lando/lando/releases/latest) of [Lando](https://lando.dev/). It’s advisable to at least read [the basics](https://docs.lando.dev/basics/#what-is-it-good-for) about Lando, and worth running through the documentation as time allows.

## Commands
Some basic commands for working with Lando.

```
lando start             Starts your app
lando stop              Stops your app
lando rebuild           Rebuilds your app from scratch, preserving data
lando logs              Displays logs for your app
lando destroy           Destroys your app
```

## Tools
Lando provides some useful tools to interact with your dev environment. You can also run `lando` from inside your app directory for a complete list of commands.

```
lando composer          Runs composer commands
lando db-export [file]  Exports database from a service into a file
lando db-import <file>  Imports a dump file into database service
lando wp                Runs wordpress commands
lando mysql             Drops into a MySQL shell on a database service
lando php               Runs php commands
lando ssh				   Drops into a shell on a service
```

Usage examples:

```
# Search-replace the domain name
lando wp search-replace 'some.old.domain' 'mysite.lndo.site'

# Run composer install
lando composer install

# Drop into a mysql shell
lando mysql

# Check the app's php info
lando php -i
```
