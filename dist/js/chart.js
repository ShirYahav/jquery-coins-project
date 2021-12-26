import { listOfChosenCoins } from './main';

function getPrice(ajaxurl) {
    return $.ajax({
        url: ajaxurl,
        type: 'GET',
    });
};

async function chart() {
    try {
        await getPrice('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR')
        .then(resp => console.log(resp))
        console.log(listOfChosenCoins)
    } catch (err) {
        throw new Error('Cannot Fetch') 
    }
}






// let LINEDATA = [];
// let data = [];
// let labels = [];

// const graph = () => {
//     axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')}&end=${moment(new Date()).format('YYYY-MM-DD')}`)
//     .then((response) => {
//     LINEDATA = { ...response.data.bpi };
//     data = Object.keys(LINEDATA).map(key => LINEDATA[key]);
//     labels = Object.keys(LINEDATA);
//       console.log(data);
//       console.log(labels);
//     new Chart($("#chart"), {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Bitcoin',
//             data: data,
//             borderColor: "#3e95cd",
//           }
//         ]
//       }
//     });
//   });
// }

// graph()
// new Chart($("#chart"), {
//     type: 'line',
//     data: {
//       labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
//       datasets: [{ 
//           data: [86,114,106,106,107,111,133,221,783,2478],
//           label: "Africa",
//           borderColor: "#3e95cd",
//           fill: false
//         }, { 
//           data: [282,350,411,502,635,809,947,1402,3700,5267],
//           label: "Asia",
//           borderColor: "#8e5ea2",
//           fill: false
//         }, { 
//           data: [168,170,178,190,203,276,408,547,675,734],
//           label: "Europe",
//           borderColor: "#3cba9f",
//           fill: false
//         }, { 
//           data: [40,20,10,16,24,38,74,167,508,784],
//           label: "Latin America",
//           borderColor: "#e8c3b9",
//           fill: false
//         }, { 
//           data: [6,3,2,2,7,26,82,172,312,433],
//           label: "North America",
//           borderColor: "#c45850",
//           fill: false
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'World population per region (in millions)'
//       }
//     }
//   });