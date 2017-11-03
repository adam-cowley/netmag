const app = require("express")()
const neo4j = require("neo4j-driver").v1

// Create Bolt Driver with Neo4j connection string and credentials
const driver = new neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo"))

app.get('/api/movies/:director_id', (req, res) => {
    // Create a new DB session
    const session = driver.session()

    // Cypher query to find all movies with a DIRECTED_BY relationship to the director
    const query = "MATCH (m:Movie)-[:DIRECTED_BY]->(d:Director {id: {director_id}}) RETURN m"

    // Parameters are wrapped in braces in the query for security reasons
    // Once query plans are generated they are cached, so providing parameters rather
    // than raw values will mean this is treated as the same query regardless of
    const params = {director_id: req.params.director_id}

    // Run the query inside the session
    session.run(query, params)
        .then(result => {
            // Map the result set and send as a JSON object
            res.send(result.records.map(record => {
                return record.get("m").properties
            }))
        }, e => {
            // If anything has gone wrong, send a
            res.status(500).send(e);
        })
        // Finally, close the session
        .finally(() => {
            return session.close()
        })
})

// Listen on port 8080
app.listen(8080, () => {
    console.log("Listening on port :8080");
});
