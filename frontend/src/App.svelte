<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import axios from 'axios';

    let BASE_RADIUS = 15;
    let AVERAGE_JAM = 30.494;
    let AVERAGE_QUALITY = 0.907;
    let STD_QUALITY = 0.283;
    let AVERAGE_SPEED = 514.498

    var nodes_data =  [
        {'name': 'start', 'nGoods': 0, 'nRejects': 0, 'total': 0, 'speed': 0, 'id': 1},
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
        {'source': 'start', 'target': 'a1'},
        {'source': 'a1', 'target': 'a2'},
        {'source': 'a2', 'target': 'd1'} ,
        {'source': 'd1', 'target': 'd2'},
        {'source': 'd2', 'target': 'd3'},
        {'source': 'd3', 'target': 'd4'},
        {'source': 'start', 'target': 'b1'},
        {'source': 'b1', 'target': 'b2'},
        {'source': 'b2', 'target': 'd1'},
        {'source': 'start', 'target': 'c1'},
        {'source': 'c1', 'target': 'c2'},
        {'source': 'c2', 'target': 'd1'},
    ]

    onMount(() => {

        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");


        // //set up the simulation and add forces  
        var simulation = d3.forceSimulation()
                            .nodes(nodes_data);
                                    
        var link_force =  d3.forceLink(links_data)
                                .id(function(d) { return d.name; });            
                
        var charge_force = d3.forceManyBody()
            .strength(-200); 
            
        var center_force = d3.forceCenter(width / 3, height / 3);  
                            
        simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            .force("collide", d3.forceCollide())
            .force("links",link_force);

                
        //add tick instructions: 
        simulation.on("tick", tickActions );
        simulation.force("collide").radius((d) => {return radius(d) * 1.5})

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

        //draw circles for the nodes 
        var nodes = g.append("g")
                .attr("class", "nodes") 
                .selectAll("circle")
                .data(nodes_data)
                .enter()
                .append("circle")
                .attr("r", radius)
                .attr("fill", circleColour)
                .attr("id", (d) => {
                    return d.name
                });
        
        
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
            var c = jam <= 0 ? 1: Math.log(jam / AVERAGE_JAM + 1);
            return BASE_RADIUS * c;
        }

        //Function to choose what color circle we have
        //Let's return blue for males and red for females
        function circleColour(d){
            var quality = d.total <= 0? 1: d.nGoods / d.total;
            if (quality >= AVERAGE_QUALITY){
                return "blue";
            } else if (quality >= AVERAGE_QUALITY - STD_QUALITY){
                return "green";
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
            simulation
                .force("charge_force", charge_force)
                .force("center_force", center_force)
                .force("collide").radius((d) => {return radius(d) * 1.5})
            //update circle positions each tick of the simulation 

            nodes
                .data(nodes_data)
                .attr("r", radius)
                .attr("fill", circleColour)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
                
            //update link positions 
            links
                .data(links_data)
                .style("stroke", linkColour)
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        } 

        function redrawNodes(){
            nodes
                .attr("r", radius)
                .attr("fill", circleColour)
        }

        function redrawLinks(){
            links
                .style("stroke", linkColour);        
        }

        function redraw(){
            redrawNodes();
            redrawLinks();
        }

        async function update(){
            const response = await axios.get('http://localhost:8000/core/api/hourly-states/?ordering=sent_at')
            console.log(response)
            response.data.results.forEach(element => {
                nodes_data[element.machine[element.machine.length - 2]].nGoods = element.good;
                nodes_data[element.machine[element.machine.length - 2]].nRejects = element.reject;
                nodes_data[element.machine[element.machine.length -2]].total = element.total;
                console.log("uwu");
            });
            // var i = 1;
            // var element;
            // function myLoop(){
            //     setTimeout(function (){
            //         element = response.data.results[i];
            //         nodes_data[element.machine[element.machine.length - 2]].nGoods = element.good;
            //         nodes_data[element.machine[element.machine.length - 2]].nRejects = element.reject;
            //         nodes_data[element.machine[element.machine.length -2]].total = element.total;
            //         console.log("uwu " + (element.machine.length - 2) + " " +  nodes_data[element.machine[element.machine.length - 2]].total)
            //         i++;
            //         if (i < response.data.results.length){
            //             myLoop();
            //         }
            //     }, 200)
            // }

            // myLoop();
        }

        update();
    });


</script>

<svg width="1080" height="720">
<g class="everything">
<g class="nodes">
</g>
</g>
</svg>