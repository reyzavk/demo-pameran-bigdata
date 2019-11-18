from websocket import create_connection
import faust
from models import State
import json


app = faust.App('scores', broker='kafka://master.cluster2:9092')
app_topic = app.topic('myapp', value_type=State)

@app.agent(app_topic)
async def consume(states):
        async for state in states:
            conn = create_connection('ws://localhost:5123')
            message = {'id': state.id, 'good': state.good, 'reject': state.reject, 'total': state.reject}
            conn.send(json.dumps(message))
