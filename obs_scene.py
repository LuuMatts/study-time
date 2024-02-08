import obspython as obs
import websocket
import threading
import ssl

# Replace with your Replit WebSocket server URL
url = "ws://app.studywithluca.com"

# Lists of scene names for each state
study_scenes = [
    "Study",
]  # Add all your study-related scene names here
break_scenes = [
    "Break",
]  # Add all your break-related scene names here


# Function to send message to WebSocket server
def send_message(message):
    def run():
        # Create a WebSocket connection with SSL context
        ws = websocket.create_connection(url, sslopt={"cert_reqs": ssl.CERT_NONE})
        ws.send(message)
        ws.close()

    threading.Thread(target=run).start()


# Callback for scene change
def on_scene_change(event):
    if event == obs.OBS_FRONTEND_EVENT_SCENE_CHANGED:
        current_scene = obs.obs_frontend_get_current_scene()
        scene_name = obs.obs_source_get_name(current_scene)
        obs.obs_source_release(current_scene)

        # Check if the current scene is in the list of study scenes
        if scene_name in study_scenes:
            send_message("start-study")
        # Check if the current scene is in the list of break scenes
        elif scene_name in break_scenes:
            send_message("start-break")


# Register callback
def script_load(settings):
    obs.obs_frontend_add_event_callback(on_scene_change)
