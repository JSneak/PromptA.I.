const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const translate = require("./translate");

app.set("port", process.env.PORT);
app.use(express.static("static/"));

io.on("connection", socket => {
    socket.on("new sentence", sentence => {
        console.log(sentence);
        translate(sentence).then(res => {
            socket.emit("sentence processed", res);
            console.log(res);
        });
    });
});

http.listen(app.get("port"), () => console.log("Listening..."));