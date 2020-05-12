const request = require("supertest");
const {Genre} = require("../../models/genre");
let server;


describe("/api/genres", () => {
    beforeEach(() => { server = require("../../index");})
    afterEach(async () => {server.close();
        await Genre.remove({})
    }) 
    describe("GET /" , () => {
        it("shuld return all genres", async () => {
           await Genre.collection.insertMany([
                {name: "genre1"},
                {name: "genre2"},
            ]);

            const res = await request(server).get("/api/genres");
            expect(res.status).toEqual(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(genre => genre.name ==="genre1")).toBeTruthy()
            expect(res.body.some(genre => genre.name ==="genre2")).toBeTruthy()
        });
    });

    // describe('GET /:id', () => {
    //     // it("should return a genre if valid id is passed", async () => {
    //     //     const genre = new Genre({name: "genre1"});
    //     //     await genre.save();
    //     //     const res = await request(server).get("api/genres/" + genre._id);
    //     //     expect(res.status).toEqual(200);
    //     //     expect(res.body).toHaveProperty("name", genre.name)
    //     // });
    //     it("should return a 404 if invalid id is given", async () => {

    //         const res = await request(server).get("api/genres/1");

    //         expect(res.status).toEqual(404);
    //     });
    // });
});