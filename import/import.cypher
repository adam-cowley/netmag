LOAD CSV WITH HEADERS FROM "file:///movies.csv" AS line
MERGE  (d:Director {id: line.director})
CREATE (m:Movie {id: line.id, title: line.title})
CREATE (m)-[:DIRECTED_BY]->(d)
