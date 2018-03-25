const socket = io();
let sentences = [];
let index = 0;
let timer = null;

const perSentenceTime = (time, sentences) => {
    return time / sentences.length;
};

$(() => {
    $("#form").hide().fadeIn();
    const emotion = $("body").attr("emotion") === "pos";
    $("body").attr("emotion", emotion ? "neg" : "pos");
    socket.on("paragraph processed", res => {
        sentences = res.sentences;
        console.log(sentences);
        let allowedTime = perSentenceTime(parseInt($("#duration").val()), sentences);
        console.log(allowedTime);
        // initial render
        $("#sentence").html(sentences[0].text.content);
        $("body").attr("emotion", sentences[0].sentiment.score > 0 ? "pos" : "neg");
        // index 1+
        timer = setInterval(() => {
            if(++index > sentences.length) {
                clearInterval(timer);
                $("#main").hide();
                // show and set to flex
                $("#done").show().css("display", "flex");
                return;
            }
            const currSentence = sentences[index];
            $("#sentence").html(currSentence.text.content);
            $("body").attr("emotion", currSentence.sentiment.score > 0 ? "pos" : "neg");
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
        socket.emit("new paragraph", $("#input").val());
        $("#form").fadeOut();
    });
});