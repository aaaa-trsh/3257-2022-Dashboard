from flask import Flask, render_template, Response
from networktables import NetworkTables
from flask_socketio import SocketIO, emit
from camera import VideoCapture
import base64
import cv2
import numpy as np
import time
NetworkTables.addConnectionListener(lambda connected, info: print(info, "connected=", connected), immediateNotify=True)
NetworkTables.initialize(server="10.32.57.2")

app = Flask(__name__)
socketio = SocketIO(app)
# cap = cv2.VideoCapture(0)#'http://raspberrypi.local:8081/')
cap = VideoCapture('libcamerasrc ! video/x-raw,framerate=100/1,width=640,height=480 ! videoscale ! videoconvert ! appsink drop=true sync=false')
# frame = cap.read()
# cv2.imwrite("./saodaohf.png", frame)
@app.route("/")
def index():
    return render_template("index.html")

print("ae")
# def frames():
#     while True:
        # if cap:
        # frame = cap.read()
        # frame = np.zeros((1, 1, 3)).astype(np.uint8)
        # print(_, frame)
        # if not _:
        #     print("GET TF OUTTA HEREEE!!!")
        #     break
            # cv2.imwrite("./saodaohf.png", frame)  
        # frame = cv2.resize(frame, (120, 80))
        # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # _, buffer = cv2.imencode(".jpg", frame)
        # byteFrame = buffer.tobytes()
        # yield(b"")#b"--frame\r\n"
             #b"Content-Type: image/jpeg\r\n\r\n" + byteFrame + b"\r\n")
# @app.route("/video_feed")
@socketio.on("data")
def data(_):
    frame = cap.read() if cap else np.zeros((1, 1, 3), np.uint8)
    frame = cv2.resize(frame, (120, 80))
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    _, buffer = cv2.imencode(".jpg", frame)
    emit("video_feed", {
            "img": base64.b64encode(buffer).decode("utf-8")
        }
    )
@socketio.on("video_feed")
def video_feed(_):
    frame = cap.read() if cap else np.zeros((1, 1, 3), np.uint8)
    frame = cv2.resize(frame, (120, 80))
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    _, buffer = cv2.imencode(".jpg", frame)
    emit("video_feed", {
            "img": base64.b64encode(buffer).decode("utf-8")
        }
    )
    # return Response(frames(), mimetype="multipart/x-mixed-replace; boundary=frame")
    # return ""#Response("", mimetype="multipart/x-mixed-replace; boundary=frame")
    # emit("data", {
    #         "img": base64.b64encode(buffer).decode("utf-8")
    #     }
    # )
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")
    # app.run(debug=True, host="raspberrypi.local")
    # socketio.run(app, host="raspberrypi.local")

# while True:
#     # if cap:
#     time.sleep(0.01)
#     frame = cap.read()
#     print(frame.shape)
#     # print(_, frame)
#     # if not _:
#     #     print("GET TF OUTTA HEREEE!!!")
#     #     break
#         # cv2.imwrite("./saodaohf.png", frame)
#     frame = cv2.resize(frame, (120, 80))
#     frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)