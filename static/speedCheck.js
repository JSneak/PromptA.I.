var final_transcript = '';
var recognizing = false;
var ignore_onend;
function speechRec() {
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = function() {
      recognizing = true;
    };
    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        ignore_onend = false;
      }
    };
    recognition.onend = function() {
      if (ignore_onend) {
        recognizing = false;
        return;
      }
      if (!final_transcript) {
        recognizing = false;
        return;
      }
    };
    recognition.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      console.log(final_transcript);
      console.log(interim_transcript);
      
    };
  }
}
var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton() {
  if (recognizing) {
    recognition.stop();
    recognizing = true;
    return;
  }
  final_transcript = '';
  recognition.lang = 'English'
  recognition.start();
  ignore_onend = false;
  console.log("test")
}
