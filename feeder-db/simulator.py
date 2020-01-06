import json
from random import random
from kafka import KafkaProducer
from pony.orm import *
from datetime import datetime
import time

TOPIC = 'myapp'
KEY = 'score'


def publish_message(producer_instance, topic_name, key, value):
    try:
        print(value)
        key_bytes = bytes(key, encoding='utf-8')
        value_bytes = bytes(value, encoding='utf-8')
        producer_instance.send(topic_name, key=key_bytes, value=value_bytes)
        producer_instance.flush()
        print('Message published successfully.')
    except Exception as ex:
        print('Exception in publishing message')
        print(ex)


def connect_kafka_producer():
    _producer = None
    try:
        # host.docker.internal is how a docker container connects to the local
        # machine.
        # Don't use in production, this only works with Docker for Mac in
        # development
        _producer = KafkaProducer(
            bootstrap_servers=['master.cluster2:9092'],
            api_version=(0, 10))
    except Exception as ex:
        print('Exception while connecting Kafka')
        print(ex)

    return _producer

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
    kafka_producer = connect_kafka_producer()
    machines = select(m.id for m in Machine).order_by(Machine.id)

    data = {}
    max_length = 0
    for machine in machines:
        logs = select(
            s for s in State
            # there are bad data that have negative value
            if (s.total > 0 and s.good >= 0 and s.reject >= 0)
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
            for j in range(30):
                for machine, log in stocks.items():
                    if log:
                        if log.good or log.reject:
                            good = secrets.randbelow(log.good // (30 - j) + 1)
                            reject = secrets.randbelow(log.reject  // (30 - j) + 1)

                            stocks[machine].good -= good
                            stock[machine].reject -= reject
                            stock[machine].total -= (good + reject)
                        elif log.total:
                            good = secrets.randbelow(log.total // (30 - j) // 2 + 1)
                            reject = secrets.randbelow((log.total - good)  // (30 - j) // 2 + 1)
                            stock[machine].total -= (good + reject)

                        payload = {'good': good, 'reject': reject, 'total': good + total, 'id': machine}
                        payload = json.dumps(payload)
                        publish_message(kafka_producer, TOPIC, KEY, data)
                time.sleep(0.25)
    except Exception as ex:
        print(ex)
        pass

    # conn = create_connection('ws://master.cluster2:9000')
    # states = select(s for s in State).order_by(State.sent_at)
    # kafka_producer = connect_kafka_producer()
    # for i, state in enumerate(states):
    #     if state.total <= 0:
    #         continue
    #     data = {'good': state.good, 'reject': state.reject, 'total': state.total, 'id': state.machine_id}
    #     data = json.dumps(data)
    #     publish_message(kafka_producer, TOPIC, KEY, data)
    #     time.sleep(0.5)
    # if kafka_producer is not None:
    #     kafka_producer.close()


