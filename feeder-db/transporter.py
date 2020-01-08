from websocket import create_connection
import faust
from models import State
import json


app = faust.App('scores', broker='kafka://master.cluster2:9092')
app_topic = app.topic('myapp', value_type=State)
good_total = app.Table('good_total', default=int)
reject_total = app.Table('reject_total', default=int)


@app.agent(app_topic)
async def consume(states):
        async for state in states.group_by(State.id):
            conn = create_connection('ws://localhost:5123')
            good_total[state.id] += state.good
            reject_total[state.id] += state.reject
            # message = {'id': state.id, 'good': state.good, 'reject': state.reject, 'total': state.reject}
            message = {'id': int(state.id), 'good': good_total[state.id], 'reject': reject_total[state.id]}
            conn.send(json.dumps(message))
