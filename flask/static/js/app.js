//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us recordº

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function startRecording() {
	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		// the text shoud be seen as:
		// "RECORDING"
		// "Format: 2 channel mp3 @ 44kHz"

		// Change text of element with id="recording_prompt" to "RECORDING"
		// document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"
		document.getElementById("recording_prompt").innerHTML="RECORDING";


		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		
		//disable the encoding selector
		encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "static/js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    __log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    __log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			__log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			downloadAudio(blob);
			encodingTypeSelect.disabled = false;
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

		//start the recording process
		recorder.startRecording();

		 __log("Recording started");

		 // clear li elements from recordingsList
		while (recordingsList.firstChild) {
			recordingsList.removeChild(recordingsList.firstChild);
		}

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	stopButton.disabled = true;
	recordButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	__log('Recording stopped');

	// hide recording_prompt and formats
	document.getElementById("formats").innerHTML="";
	document.getElementById("recording_prompt").innerHTML="";
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	li.appendChild(link);

	// clear the list
	// recordingsList.innerHTML = "";

	

	//add the li element to the ordered list
	recordingsList.appendChild(li);
}

function downloadAudio(blob) {
	audioName = new Date().toISOString() + '.wav';
	// save file in app/static/audio
	var xhr=new XMLHttpRequest();
	xhr.onload=function(e) {
		if (this.readyState === 4) {
			console.log("Server returned: ",e.target.responseText);

			// find element with id="prediction_text_p"
			var prediction_text_p = document.getElementById("prediction_text_p");
			// set innerHTML of element with id="prediction_text_p" to the response text
			prediction_text_p.innerHTML = e.target.responseText;

		}
	};
	var fd=new FormData();
	fd.append("audio_data",blob, audioName);
	xhr.open("POST","/save_recording",true);
	xhr.send(fd);
}



//helper function
function __log(e, data) {
	// log.innerHTML += "\n" + e + " " + (data || '');
	console.log(e + " " + (data || ''));
}