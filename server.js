const app = require('express')();

const PORT = process.env.port || 9000;



app.get("/", (req, res) => {
    res.send("express server is working")
})

app.listen(PORT, () => {
    console.log(`Server is up at port ${PORT}`)
})