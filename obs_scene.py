import obspython as obs
import websocket
import threading

url = "ws://localhost:8080"


# Function to send message to WebSocket server
def send_message(message):
    def run():
        ws = websocket.create_connection(url)
        ws.send(message)
        ws.close()

    threading.Thread(target=run).start()


# Callback for scene change
def on_scene_change(event):
    if event == obs.OBS_FRONTEND_EVENT_SCENE_CHANGED:
        current_scene = obs.obs_frontend_get_current_scene()
        scene_name = obs.obs_source_get_name(current_scene)
        obs.obs_source_release(current_scene)

        if scene_name == "Study":
            send_message("start-study")
        elif scene_name == "Break":
            send_message("start-break")


# Register callback
def script_load(settings):
    obs.obs_frontend_add_event_callback(on_scene_change)
