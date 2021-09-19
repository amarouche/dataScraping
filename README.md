# DATA SCRAPIN


## Install package

Run `npm install`

## RUN MYSQL DATABASE

Run `docker-compose up`

## Script doc

Usage: index [command] [argument] [options]

Commands:
  findById [options] [id]  Find company by airline code
  findAll [options]        Find all campanies

#### findById command
Usage: index findById [options] [id]

Find company by airline code

Arguments:
  id                ID of airline.

Options:
  -json, --json     Save in JSON file
  -sync, --addToDB  Add to database
  -h, --help        display help for command

#### findAll command
Usage: index findAll [options]

Find all campanies

Options:
  -json, --json     Save in JSON file
  -sync, --addToDB  Add to database
  -h, --help        display help for command

## Run script examples

Run `node index.js findById -json 3286`

Run `node index.js findById -json -sync 3286`

Run `node index.js findALL -json -sync`