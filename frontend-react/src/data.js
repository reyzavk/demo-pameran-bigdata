var nodes_data =  [
    {'name': 'start', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 0},
    {'name': 'a1', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 1},
    {'name': 'a2', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 2},
    {'name': 'b1', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 3},
    {'name': 'b2', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 4},
    {'name': 'c1', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 5},
    {'name': 'c2', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 6},
    {'name': 'd1', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 7},
    {'name': 'd2', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 8},
    {'name': 'd3', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 9},
    {'name': 'd4', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 10},
]
    

//Sample links data 
//type: A for Ally, E for Enemy
var links_data = [
    {'source': 0, 'target': 1},
    {'source': 1, 'target': 2},
    {'source': 0, 'target': 3},
    {'source': 3, 'target': 4},
    {'source': 0, 'target': 5},
    {'source': 5, 'target': 6},
    {'source': 2, 'target': 7},
    {'source': 4, 'target': 7},
    {'source': 6, 'target': 7},
    {'source': 7, 'target': 8},
    {'source': 8, 'target': 9},
    {'source': 9, 'target': 10}
]

export {nodes_data, links_data}