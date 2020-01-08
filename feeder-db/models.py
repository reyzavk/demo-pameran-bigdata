import faust

class State(faust.Record, serializer='json'):
    good: float
    reject: float
    total: float
    id: str
