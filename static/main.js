$(() => {
    const socket = io();
    let sentences = [];
    // check for cookie. if nonexistent, prompt for input
    if(!Cookies.get("hasInput")) {
        $("#main").hide();
    }
    const emotion = $("body").attr("emotion") === "pos";
    $("body").attr("emotion", emotion ? "neg" : "pos");
    socket.on("paragraph processed", res => {
        sentences = res.sentences;
        console.log(sentences);
    });
    $("#toggle").on("click", () => {
        $("#nav").toggleClass("hidden");
    });
    $("#ready").on("click", e => {
        if($("#input").val().trim().length === 0) {
            e.preventDefault();
            alert("can't be empty")
            return;
        }
        Cookies.set("hasInput", true);
        Cookies.set("paragraph", $("#input").val());
        socket.emit("new paragraph", decodeURI(Cookies.get("paragraph")));
        $("#main").show();
    });
});