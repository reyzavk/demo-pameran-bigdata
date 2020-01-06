from pony.orm import *
from datetime import datetime
from websocket import create_connection
import json
import time
import secret

db = Database()
db.bind(provider='postgres', user='cloudera', password='', database='test')

class State(db.Entity):
    _table_ = 'core_hourlystate'
    good = Required(float)
    reject = Required(float)
    total = Required(float)
    sent_at = Required(datetime)
    machine_id = Required(int)
    rework = Required(float)


class Machine(db.Entity):
    _table_ = 'core_machine'
    name = Required(str)
    group_id = Required(int)
    n_operators = Required(int)
    image = Required(str)

db.generate_mapping()

with db_session:
    conn = create_connection('ws://127.0.0.1:9000')
    machines = select(m.id for m in Machine).order_by(Machine.id)

    data = {}
    max_length = 0
    for machine in machines:
        logs = select(
            s for s in State
            # there are bad data that have negative value
            if (s.total > 0 and s.good >= 0 and s.reject >= 0))
            ).order_by(State.sent_at)

        data[machine] = logs

        if len(logs) > max_length:
            max_length = len(logs)
    try:
        # we emulate how each sensor 
        for i in range(max_length):
            stocks = {}
            for machine, logs in data.items():
                if len(logs) > idx:
                    stocks[machine] = logs[idx]
                else:
                    stocks[machine] = None

            # stochastic for more natural looks
            # for i in range(30):
            #     for 
                
    # states = select(
    #     s for s in State
    #     if (s.good > 0 and s.reject > 0 and s.total > 0)
    #     ).order_by(State.sent_at)
    # for i, state in enumerate(states):
    #     data = {'good': state.good, 'reject': state.reject, 'total': state.total, 'id': state.machine_id}
    #     data = json.dumps(data)
    #     conn.send(data)
    #     time.sleep(2)

