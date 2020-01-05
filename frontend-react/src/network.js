import React from 'react';
import * as d3 from 'd3';
import Modal from '@material-ui/core/Modal';
import FullScreenDialog from './modal';
import {nodes_data, links_data} from './data';

export default function Network(props){

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
    const [open, setOpen] = React.useState(false);
    const [chosen, setChosen] = React.useState(nodes_data[0]);

    function handleClose(){
        setOpen(false)
    }

    React.useEffect(() => {
        let BASE_RADIUS = 15;
        let AVERAGE_JAM = 393.979; // avg(total - good - reject)
        let MAX_JAM = 65536;
        let STD_JAM = 372.615 // stddev(total - good - reject)
        let AVERAGE_QUALITY = 0.907;
        let STD_QUALITY = 0.283;
        let AVERAGE_SPEED = 514.498


        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");


        // //set up the simulation and add forces  
        var simulation = d3.forceSimulation()
                            .nodes(nodes_data);
                                    
        var link_force =  d3.forceLink(links_data)
                                .distance(function(d, i) {
                                    if ((d.source.id == 1 && d.target.id == 2) ||
                                        (d.source.id == 0 && d.target.id == 1) || 
                                        (d.source.id == 2 && d.target.id == 7)
                                    ){
                                        return 60;
                                    }else if (d.source.id <= 6){
                                        return 140;
                                    }else{
                                        return 40;
                                    }
                                })
                                .id(function(d) { return d.id; });            
                
        var charge_force = d3.forceManyBody()
            .strength(-400); 
            
        var center_force = d3.forceCenter(width / 3, height / 3);  

        var collide_force = d3.forceCollide(function(d) {return radius(d) * 1.5});
                            
        simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            .force("collide", collide_force)
            .force("links",link_force);

                
        //add tick instructions: 
        simulation.on("tick", tickActions );

        //add encompassing group for the zoom 
        var g = svg.append("g")
            .attr("class", "everything");

        //draw lines for the links 
        var links = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links_data)
            .enter().append("line")
            .attr("stroke-width", 2)
            .style("stroke", linkColour);        

        var nodes = g.append("g")
                            .attr("class", "containers")
                            .selectAll("g")
                            .data(nodes_data)
                            .enter()
                            .append("g")

        var circles = nodes.append("circle")
                        .attr("r", radius)
                        .attr("fill", circleColour)
                        .on("click", function(d){
                            setOpen(true)
                            setChosen(d);
                        })
        
        var labels = nodes.append("text")
                        .text(function(d){
                            return "Machine " + d.name
                        })
                        .attr("font-size", "20px")
                        .attr("font-family", "sans-serif")
        
        // //add drag capabilities  
        var drag_handler = d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end);	
            
        drag_handler(nodes);


        //add zoom capabilities 
        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(svg);     

        // /** Functions **/

        function radius(d){
            var jam = d.total - d.nGoods - d.nRejects;
            jam = Math.abs(jam);
            var c = jam <= 0 ? 1: (Math.abs(jam - AVERAGE_JAM) / STD_JAM) + 1
            c = c > 3? 3: c
            // var c = jam <= 0 ? 1: (Math.abs(jam - AVERAGE_JAM) / STD_JAM) + 1;
            // console.log(c)
            return BASE_RADIUS * c;
        }

        //Function to choose what color circle we have
        //Let's return blue for males and red for females
        function circleColour(d){
            var quality = d.total <= 0? 1: d.nGoods / d.total;
            if (quality >= AVERAGE_QUALITY){
                return "blue";
            } else if (quality >= AVERAGE_QUALITY -  2 * STD_QUALITY){
                return "yellow";
            } else{
                return "red";
            }
        }

        //Function to choose the line colour and thickness 
        //If the link type is "A" return green 
        //If the link type is "E" return red 
        function linkColour(d){
            return "green";
        }

        //Drag functions 
        //d is the node 
        function drag_start(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        //make sure you can't drag the circle outside the box
        function drag_drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        }

        function drag_end(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        }

        //Zoom functions 
        function zoom_actions(){
            g.attr("transform", d3.event.transform)
        }

        function tickActions() {
            // nodes
            circles
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            labels
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
                
            //update link positions 
            links
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        } 

        function redrawNodes(){
            circles
                .attr("r", radius)
                .attr("fill", circleColour)
        }

        function redrawLinks(){
            links
                .style("stroke", linkColour);        
        }

        function redraw(){
            redrawLinks();
            redrawNodes();

            simulation
                .alpha(0.5)
                .alphaTarget(0.3)
                .restart();
            simulation.force('collide').initialize(nodes_data);
        }

        // UIkit.modal('#my-id').show();

        var webSocket = new WebSocket('ws://10.252.175.121:5123')

        webSocket.onmessage = function(event){
            var data = JSON.parse(event.data)
            var arr = nodes_data.reduce(function(arr, e, i){
                if (e.id == data.id) arr.push(i);
                return arr;
            }, [])

            arr.forEach(element => {
                var target = {
                    'nGoods': data.good,
                    'nRejects': data.reject,
                    'total': data.total
                }

                // nodes_data[element].nGoods = data.good;
                // nodes_data[element].nRejects = data.reject;
                // nodes_data[element].total = data.total;

                // nodes
                circles
                    .filter(function(d, i) {return d.id == element })
                    .transition(1000)
                    .tween('radius', function(d){
                        var that = d3.select(this);
                        var g = d3.interpolate(d.nGoods, target.nGoods);
                        var r = d3.interpolate(d.nRejects, target.nRejects);
                        var tot = d3.interpolate(d.total, target.total);
                        var rad = d3.interpolate(radius(d), radius(target))
                        return function(t){
                            that.attr('r', function(d) {
                                d.nGoods = g(t);
                                d.nRejects = r(t);
                                d.total = tot(t);
                                // if (d.id == 8){
                                //     console.log('---------------');
                                //     console.log(radius(d));
                                //     console.log(d);
                                // }
                                return rad(t);
                                });
                        }
                    })
                    .attr('fill', circleColour)
            });


            nodes_data = nodes.data()
            // console.log(nodes_data)
            // var chosens = nodes_data.reduce(function(arr, e, i){
            //     if (e.id == chosen.id) arr.push(e);
            //     return arr;
            // }, [])

            // chosens.forEach(element => {
            //     setChosen(element)
            //     // console.log(element)
            // })

            redraw();
        }

    }, [])
    return (
        <div>
            <svg width="1080" height="720">
            </svg>
            <FullScreenDialog
                open={open}
                onClose={handleClose}
                chosen={chosen}
            >
            </FullScreenDialog>
        </div>
    )

}
