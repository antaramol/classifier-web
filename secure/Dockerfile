FROM python:3.9
COPY setup.py /home/
COPY app/ /home/
WORKDIR /home
RUN apt update && apt upgrade -y
RUN apt install -y ffmpeg
RUN pip3 install -e .
ENTRYPOINT FLASK_APP=app.py flask run --host=0.0.0.0
