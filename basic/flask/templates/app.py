from flask import Flask, request, jsonify, render_template, redirect
import os
import random

from transformers import pipeline

app = Flask(__name__)
pipe = pipeline("audio-classification", model="antonjaragon/emotions_6_classes_small")

@app.route("/", methods=["GET", "POST"])
def index():
    transcript = ""
    if request.method == "POST":
        print("FORM DATA RECEIVED")

        if "file" not in request.files:
            return redirect(request.url)

        file = request.files["file"]
        if file.filename == "":
            return redirect(request.url)

        if file:
            # recognizer = sr.Recognizer()
            # audioFile = sr.AudioFile(file)
            # with audioFile as source:
            #     data = recognizer.record(source)
            # transcript = recognizer.recognize_google(data, key=None)

            transcript = pipe(file.filename)



    return render_template('index.html', transcript=transcript)

@app.route('/save_recording', methods=['POST'])
def upload():
    if request.method == 'POST':
        f = request.files['audio_data']
        # audio folder is static/audios/random int/filename
        audio_folder = 'static/audios/' + str(random.randint(1, 100000000000000000))
        # create folder if not exists audio_folder
        if not os.path.exists(audio_folder):
            os.makedirs(audio_folder)
        f.save(os.path.join(audio_folder, f.filename))
        output = pipe(audio_folder + '/' + f.filename)
        # print(output)

        # delete the audio folder after prediction
        os.remove(audio_folder + '/' + f.filename)
        os.rmdir(audio_folder)

        return output
    

@app.route('/cache-me')
def cache():
	return "nginx will cache this response"

@app.route('/info')
def info():

	resp = {
		'connecting_ip': request.headers['X-Real-IP'],
		'proxy_ip': request.headers['X-Forwarded-For'],
		'host': request.headers['Host'],
		'user-agent': request.headers['User-Agent']
	}

	return jsonify(resp)

@app.route('/flask-health-check')
def flask_health_check():
	return "success"

@app.route('/hello-papa')
def hello_papa():
	return render_template('hello-papa.html')