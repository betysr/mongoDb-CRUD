const {MongoClient} = require('mongodb');

async function main(){

    const uri = ""; // you should write here uri information from your mongodb cluster
    const client = new MongoClient(uri); // create client with uri info

    try{
        await client.connect();

        await createMultipleListing(client, [
            {
                name: "Lovely Loft",
                summary: "A Charming Loft in Paris",
                bedrooms: 1,
                bathrooms: 1
            },
            {
                name: "Lovely Loft2",
                summary: "A Charming Loft in Paris2",
                bedrooms: 5,
                bathrooms: 5,
                last_review: new Date()
            },
            {
                name: "Lovely Loft3",
                summary: "A Charming Loft in Paris3",
                bedrooms: 2,
                last_review: new Date()
            }
        ])
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function listDatabases(client){ // lists all databases name in mongoDb
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}

async function createListing(client, newListing){ // insertOne only for one info
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function createMultipleListing(client, newListing){ //insertMany for more than one info
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListing);
    console.log(`${result.insertedCount} new listings created with the following id(s):`);
    console.log(result.insertedIds);
}

main();