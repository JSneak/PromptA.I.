const socket = io();
let sentences = [];
let index = 0;
let timer = null;

const perSentenceTime = (time, sentences) => {
    return time / sentences.length;
};

$(() => {
    // check for cookie. if nonexistent, prompt for input
    if(!Cookies.get("hasInput")) {
        $("#main").hide();
    }
    const emotion = $("body").attr("emotion") === "pos";
    $("body").attr("emotion", emotion ? "neg" : "pos");
    socket.on("paragraph processed", res => {
        sentences = res.sentences;
        console.log(sentences);
        let allowedTime = perSentenceTime(parseInt($("#duration").val()), sentences);
        console.log(allowedTime);
        // initial render
        $("#sentence").html(sentences[0].text.content);
        // index 1+
        timer = setInterval(() => {
            $("#sentence").html(sentences[index].text.content);
            index++;
            if(index >= sentences.length) {
                clearInterval(timer);
            }
        }, allowedTime * 1000);
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