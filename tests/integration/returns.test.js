const request = require("supertest")
 const {Rental} = require("../../models/rental")
let server;
describe("/api/returns", () => {
    beforeEach(() => { server = require("../../index");})
    afterEach(async () => {server.close();
        
    }) 
})