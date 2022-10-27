const {MongoClient} = require('mongodb');

async function main(){
    const uri = ""; // write your uri
    const client = new MongoClient(uri); // create client with uri info

    try{
        await client.connect();
        /*
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
        */

        /*
        await findOneListingByName(client, "Lovely Loft");
        */

        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });
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

async function findOneListingByName(client, nameOfListing){ // read information by name
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if(result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}`);
    }
}

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}){
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: {$gte: minimumNumberOfBedrooms},
        bathrooms: {$gte: minimumNumberOfBathrooms}
    }).sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if(results.length>0){
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
        results.forEach((result,i) => {
            console.log();
            console.log(`${i+1}. name: ${result.name}`);
            console.log(`_id: ${result._id}`);
            console.log(`bedrooms: ${result.bedrooms}`);
            console.log(`bathrooms: ${result.bathrooms}`);
            console.log(`Most recent review date: ${new Date(result.last_review).toDateString}`);
        })
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}

main();