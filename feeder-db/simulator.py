import json
from random import random
from kafka import KafkaProducer
from pony.orm import *
from datetime import datetime
from websocket import create_connection
import time

TOPIC = 'myapp'
KEY = 'score'


def publish_message(producer_instance, topic_name, key, value):
    try:
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
    states = select(s for s in State).order_by(State.sent_at)
    kafka_producer = connect_kafka_producer()
    for i, state in enumerate(states):
        if state.total <= 0:
            continue
        data = {'good': state.good, 'reject': state.reject, 'total': state.total, 'id': state.machine_id}
        data = json.dumps(data)
        publish_message(kafka_producer, TOPIC, KEY, data)
        time.sleep(2)
    if kafka_producer is not None:
        kafka_producer.close()


