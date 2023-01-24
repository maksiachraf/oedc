const query = `
SELECT NavName, NavConnUsers, NavMaxUsers
FROM Navigator
`

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    for (let row of res.rows) {
        $("#nav").append(row)
    }
    client.end();
});