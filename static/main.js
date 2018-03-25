$(() => {
    const socket = io();
    socket.emit("new sentence", "i love this hackathons. this is the best fucking hackathon ever. i love the food. this is amazing.");
    const emotion = $("body").attr("emotion") === "pos";
    $("body").attr("emotion", emotion ? "neg" : "pos");
    socket.on("sentence processed", res => {
        console.log(res);
    });
    $("#toggle").on("click", () => {
        $("#nav").toggleClass("hidden");
    })
});