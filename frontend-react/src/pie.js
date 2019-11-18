import React from 'react';
import {Doughnut} from 'react-chartjs-2';

export default function QualityPie(props){
    return (
        <Doughnut data={props.data} />
    )
}
// import React, { Component } from "react";
// import { render } from "react-dom";
// import { VictoryPie } from "victory";

// export default function QUalityPie(props){
//     return (
//         <VictoryPie colorScale={["blue", "red"]} data={props.data} height="200"/>
//     )
// }