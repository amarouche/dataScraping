const cli = require('commander')
const companiesScraping = require('./scraping.js')
  
const init = new companiesScraping()
cli.description("AirLines Scraping");

cli.command("findById")
  .argument("[id]", "ID of airline.")
  .option("-json, --json", "Save in JSON file")
  .option("-sync, --addToDB", "Add or sync with database table")
  .description(
    "Find company by airline code"
  )
  .action(async (id,options) => {
    return await init.findCompanyByAirlineCode(id,options)
  });

cli.command("findAll")
  .option("-json, --json", "Save in JSON file")
  .option("-sync, --addToDB", "Add or sync with database table")
  .description(
    "Find all campanies"
  )
  .action(async (options) => {
    return await init.findAllCompanies(options)
  });
cli.parse(process.argv);
