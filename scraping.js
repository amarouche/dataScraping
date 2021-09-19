const puppeteer = require('puppeteer')
const fs = require('fs');
const db = require("./db.config.js");
const Sequelize = require("sequelize");
require('dotenv').config()



module.exports = class ScrapingCompanies{
   findTableHeaders(){
   const thList = (async () => {
      const browser =  await puppeteer.launch()
      const page =  await browser.newPage()
      await page.goto(process.env.SCRAPING_URL)
      const trList =  await page.evaluate(()=> {
        let thText = ['airlineCode']
        for(ele of document.querySelectorAll('tr td font > b,tr td font > span > b')){
          thText.push(ele.innerText)
        }
        return thText
      })
      await browser.close()
      return trList
    })()
    return thList
  }

  async findAllCompanies(options){
    return (async () => {
      const thList =  await this.findTableHeaders()
      const browser =  await puppeteer.launch()
      const page =  await browser.newPage()
      await page.goto(process.env.SCRAPING_URL)
      const companies =  await page.evaluate((thList)=> {
        let tdList =  Array.from(document.querySelectorAll('tr td font:not(b font)'))
        let companies = []
        let companyInfo= {}
        for(let i = 7; i <tdList.length; i=i+7){
          element = tdList[i]
          for(let y= 0; y < tdList.slice(i, i+7).length; y++){
            companyInfo[thList[y]] = tdList.slice(i, i+7)[y].innerText
          } 
          companies.push(companyInfo)
          companyInfo = {}
        };
        return companies
      },thList)
      console.log(companies)
      await browser.close()
      if(Object.keys(companies).length > 0){
        if(options.json){
          fs.writeFileSync('data/companies_'+Date.now()+'.json', JSON.stringify(companies));
        }
        if(options.addToDB){
          companies.forEach(company => {
             this.createOrUpdateInAirline(company)
          });
        }
      }
      return companies
    })()
  }

  async findCompanyByAirlineCode(id, options){
    return (async () => {
      const thList =  await this.findTableHeaders()
      const browser =  await puppeteer.launch()
      const page =  await browser.newPage()
      await page.goto(process.env.SCRAPING_URL)
      const company =  await page.evaluate((id,thList) => {
        let tdList =  Array.from(document.querySelectorAll('tr td font:not(b font)'))
        let companyInfo= {}
        for(let i = 7; i <tdList.length; i=i+7){
          element = tdList[i]
          if(element.innerText == id){
            for(let y= 0; y < tdList.slice(i, i+7).length; y++){
              companyInfo[thList[y]] = tdList.slice(i, i+7)[y].innerText
            } 
          }
        };
        return companyInfo
      },id,thList)
      console.log(company)
      await browser.close()
      if(Object.keys(company).length > 0){
        if(options.json){
          fs.writeFileSync('data/company_'+Date.now()+'.json', JSON.stringify([company]));
        }
        if(options.addToDB){
          await this.createOrUpdateInAirline(company)
        }
      }
      else
        return {
          error: 404,
          message: "airline code not found !"
        }
      return company
    })()
  }

  async createOrUpdateInAirline(company){
    db.sequelize.sync();
    const Airline = db.airlines;
    const companyValues = Object.values(company)
    const newData = {
      airline_code: companyValues[0],
      name: companyValues[1],
      iata_code: companyValues[2],
      oaci_code: companyValues[3],
      country: companyValues[4],
      website:companyValues[5],
      remarks:companyValues[6],
    }
    return await Airline.findOne({ where: {airline_code: companyValues[0]}})
        .then(function(obj) {
            if(obj){
              console.log(newData)
              return obj.update(newData)
            }
            return Airline.create(newData)
                  .then(data => {
                    console.log(data.dataValues);
                  })
                  .catch(err => {
                    console.log({
                      message:[
                        err.message,
                        "Some error occurred while creating the Airline."
                      ]
                    });
                  });
        }).catch(err => {
          console.log({
            message:[
              err.message,
              "Some error occurred while updating the Airline."
            ]
          });
        });
}
}
