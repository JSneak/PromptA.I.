const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const translate = require("./translate");

app.set("port", process.env.PORT);
app.use(express.static("static/"));

io.on("connection", socket => {
    socket.on("new paragraph", paragraph => {
        console.log(paragraph);
        translate(paragraph).then(res => {
            socket.emit("paragraph processed", res);
            console.log(res);
        });
    });
});

http.listen(process.env.PORT || 3000, function () {
  console.log('Server listening at port 3000');
});
