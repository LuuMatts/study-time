import obspython as obs
import websocket
import threading
import ssl

# Replace with your Replit WebSocket URL
# url = "wss://your-replit-username.repl.co"

# Use 'wss' for secure WebSocket connections
url = "wss://b60ffa20-b2bd-4d95-8e36-86ad541db24f-00-1s7px81bj2fw1.spock.replit.dev/"


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

        if scene_name == "Study":
            send_message("start-study")
        elif scene_name == "Break":
            send_message("start-break")


# Register callback
def script_load(settings):
    obs.obs_frontend_add_event_callback(on_scene_change)
