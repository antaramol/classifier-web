from flask import Flask, request, jsonify, render_template, redirect


app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    transcript = ""
    if request.method == "POST":
        print("FORM DATA RECEIVED")

        # if "file" not in request.files:
        #     return redirect(request.url)

        # file = request.files["file"]
        # if file.filename == "":
        #     return redirect(request.url)

        # if file:
        #     recognizer = sr.Recognizer()
        #     audioFile = sr.AudioFile(file)
        #     with audioFile as source:
        #         data = recognizer.record(source)
        #     transcript = recognizer.recognize_google(data, key=None)

    return render_template('index.html', transcript=transcript)


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