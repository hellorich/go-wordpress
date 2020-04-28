# go-wordpress
A starting point and local deveopment environment for Wordpress projects powered by [Lando](https://lando.dev/). 

Lando is 'a free, open source, cross-platform, local development environment and DevOps tool built on Docker container technology' that simplifies using Docker containers for local development.

## Requirements
1. The [latest stable release](https://github.com/lando/lando/releases/latest) of Lando. It’s advisable to at least read [the basics](https://docs.lando.dev/basics/) to familiarise yourself with whats going on under the hood.

## Installation

1. Download the repository and `cd` into the root.
2. Run `lando start` - lando will download the requirments of the development environment based on the configuration in `.lando.yml`.
3. You can browse to your site [here](https://go-wordpress.lndo.site).

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
