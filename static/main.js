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
        let lengthOfString = [];
        for(let i = 0; i < sentences.length; i++) {
          lengthOfString.push(sentences[i].text.content.split(' ').length);
          //["0"].text.content
        }
        console.log(lengthOfString)
        console.log(sentences);
        let allowedTime = perSentenceTime(parseInt($("#duration").val()), sentences);
        console.log(allowedTime);
        // initial render
        $("#sentence").html(sentences[0].text.content);
        $("body").attr("emotion", sentences[0].sentiment.score > 0 ? "pos" : "neg");
        startRecording();
        // index 1+
        var position = 0;
        function timeout(pos) {
          console.log(pos)
          if(pos < sentences.length -1) {
            pos++
            console.log(pos)
            console.log("gets here")
            const currSentence = sentences[pos];
            $("#sentence").html(currSentence.text.content);
            $("body").attr("emotion", currSentence.sentiment.score > 0 ? "pos" : "neg");
            console.log((lengthOfString[pos]/3.33) * 1000)
            setTimeout(timeout,(lengthOfString[pos]/3.33) * 1000, pos)
          }else{
            $("#main").hide();
            // show and set to flex
            $("#done").show().css("display", "flex");
            return;
          }
        }

        timer = setTimeout(timeout, (lengthOfString[position]/3.33) * 1000, position)
        // timer = setInterval(() => {
        //     startButton();
        //     if(++index > sentences.length) { //Ask victor if this increments index
        //         clearInterval(timer);
        //         $("#main").hide();
        //         // show and set to flex
        //         $("#done").show().css("display", "flex");
        //         return;
        //     }
        //     const currSentence = sentences[index];
        //     $("#sentence").html(currSentence.text.content);
        //     $("body").attr("emotion", currSentence.sentiment.score > 0 ? "pos" : "neg");
        // }, (lengthOfString[i]/3.33) * 1000);
    });
    $("#toggle").on("click", () => {
        $("#nav").toggleClass("hidden");
    });
    $("#ready").on("click", e => {
        if($("#input").val().trim().length === 0) {
            e.preventDefault();
            alert("You need to enter a speech!");
            return;
        }
        socket.emit("new paragraph", $("#input").val());
        $("#form").fadeOut();
    });
});
