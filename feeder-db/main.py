from pony.orm import *
from datetime import datetime
from websocket import create_connection
import json
import time

db = Database()
db.bind(provider='postgres', user='postgres', password='', database='test')

class State(db.Entity):
    _table_ = 'core_hourlystate'
    good = Required(float)
    reject = Required(float)
    total = Required(float)
    sent_at = Required(datetime)
    machine_id = Required(int)
    rework = Required(float)

db.generate_mapping()

with db_session:
    conn = create_connection('ws://127.0.0.1:9000')
    states = select(s for s in State).order_by(State.sent_at)
    for i, state in enumerate(states):
        if state.total <= 0:
            continue
        data = {'good': state.good, 'reject': state.reject, 'total': state.total, 'id': state.machine_id}
        data = json.dumps(data)
        conn.send(data)
        time.sleep(0.5)

