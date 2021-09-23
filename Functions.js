const {MessageEmbed} = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const url = "https://api.twinword.com/api/word/"

module.exports = {
    async pagify(items, limitPerPage = 5, number = false) {
        let curPage = 0, pages = [];
        for (let i = 0; i < items.length; i++) {
            i % limitPerPage == 0 ? pages.push([]) : pages;
            if (number) {
                pages[curPage].push((i+1) + ". " +items[i]);
            } else {
                pages[curPage].push(items[i]);
            }
            i % limitPerPage ==  limitPerPage -1 ? curPage++ : curPage; 
        }
        if (pages[pages.length-1].length < 1) pages.pop();
        return pages;
    },
    //requires the other properties of each embed to be set however
    async listify(title, desc, items, number = false) {
        const em = new MessageEmbed()
            .setTitle(title)
            .setDescription(desc);
        items.forEach((v, i) => {
            let x = "";
            if (number) {
                x = (i+1) + ". ";
            }
            em.addField(x + v, "—");
        })
        return em;
    },
    async getWord(attribute, word) {
        let config = require("./config.json");
        return fetch(url +attribute + "/latest/?entry=" + word, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Host": "api.twinword.com",
                "X-Twaip-Key": "cCvTrmPNr1dGXK2u6/jFzlCjKey/axFf2Ensxa5Al0AUzxg2E/9NaqVU/mwAsp7CmjdeGFHEhJP4KXVJomB0dw=="
            }
        }).then(res => {
            config.usage ++;
            fs.writeFile("config.json", JSON.stringify(config,null,2), (e) => {
                if (e) {
                    throw e;
                }
                if (config.usage % 25 == 0) {
                    console.log(`${config.usage} api calls used`);
                }
            })
            return res.json();
        }).then(data => {
            return data;
        })
    }
}