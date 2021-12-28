const cryptoCoins = []

//fetching data
function getData(ajaxurl) {
    return $.ajax({
        url: ajaxurl,
        type: 'GET',
    });
};

async function main() {
    try {
        await getData('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            .then(coins => {
                progress()
                renderCoins(coins);
                setTimeout(() => {
                    $('.home-item').removeClass('hidden')
                    $('.searchBox').removeClass('hidden')
                    $('.containerBar').addClass('hidden')
                },1000) 
                coins.forEach((coin) => cryptoCoins.push(coin));
            })
    } catch (err) {
        throw new Error('Cannot Fetch') 
    }
}


const getCurrencies = (id) => {
    if(getWithExpiry(id) !== null){
        const getCoin = JSON.parse(localStorage.getItem(id))
        const getCoinValue = getCoin.coin.market_data.current_price
        createModal(getCoin.coin, getCoinValue.usd, getCoinValue.eur, getCoinValue.ils)
    } else {
        try {
            fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(coin => {
                    const value = coin.market_data.current_price
                    setWithExpiry(coin.id, coin, 120000)
                    createModal(coin, value.usd, value.eur, value.ils)
                })
        } catch (err) {
            throw new Error('Cannot Fetch 2')
        }
    }
}

const setWithExpiry = (id, coin, ttl) => { //time to live
    const now = new Date ()
    const item = {
        coin : coin,
        expiry : now.getTime() + ttl
    }
    localStorage.setItem( id , JSON.stringify(item))
}

const getWithExpiry = (id) => {
    const itemStr = localStorage.getItem(id)
    if(!itemStr){
        return null
    }

    const item = JSON.parse(itemStr)
	const now = new Date()

    if(now.getTime() > item.expiry){
        localStorage.removeItem(id)
        return null
    }
    return item.value
}


//progress bar 
const progress = () => { 
    $('.progress-bar').attr('id', 'play-animation')
}

//rendering coins
const renderCoins = (arrayOfCoins) => {
    arrayOfCoins.forEach((coin , index) => {
        const {id, symbol, name, image} = coin
        if (index < 100) {
            const cryptoCoin = $(`   
                <div class="home-item ${id} hidden">
                <label class="switch"/>
                  <input type="checkbox" class="toggle" id=${symbol}>
                  <span class="slider round"></span>
                </label>
                <a class="home-link" data-toggle="modal" href="#homeModal${id}">
                    <div class="home-hover" id="${id}">
                        <div class="home-hover-content">More Info</div>
                    </div>
                    <img class="img-fluid" src=${image} alt="..." />
                </a>
                <div class="home-caption">
                   <div class="home-caption-heading">${symbol}</div>
                   <div class="home-caption-subheading text-muted">${name}</div>
                </div>
                </div>`)
           $('.coin').append(cryptoCoin)  
        }
    })
}


//creating the modal which will be seen when clicking "more info"
const createModal = (coin , usd, eur, ils) => {
    const { id, symbol, name, image = {} } = coin
    const homeModal = $(`
        <div class="home-modal modal fade " id="homeModal${id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content styleModal">
            <div class="container justify-content-center">
                <div class="row justify-content-center">
                    <div>
                        <div class="modal-body">
                            <!-- Crypto details-->
                            <h2 class="text-uppercase">${name}</h2>
                            <p class="item-intro text-muted">${symbol}</p>
                            <img class="img-fluid d-block mx-auto img-responsive" src=${image.small} alt="..." />
                            <p class="currentValue">Current Value</p>
                            <h5>${usd} &#36</h5>
                            <h5>${eur} &#8364</h5>
                            <h5>${ils} &#8362</h5>
                            <button class="btn btn-primary btn-sm text-uppercase" data-bs-dismiss="modal" type="button">
                                <i class="fas fa-times me-1"></i>
                                Close Crypto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
    `)
    $('.homeItemPopup').append(homeModal)
}

//showing the modal when clicking "more info"
$(document).ready(function () {
    $(document).on("click", '.home-hover-content', function (event) {
        getCurrencies($(event.target).parent().attr('id'))
        $(`#homeModal${event.target.parentNode.id}`).modal('show')
    });
});



//toggle functionaliy
const listOfChosenCoins = [];

const onToggle = (coinId, checked) => {
    if ((listOfChosenCoins.length < 5) && (checked === true)) {
        listOfChosenCoins.push(coinId)

    } else if (checked === false) {
        onToggleOff(coinId)

    } else if ((listOfChosenCoins.length === 5) && (checked === true)) {
        listOfChosenCoins.push(coinId)
        createCoinsListModal(listOfChosenCoins, checked)
        $('#coinModal').modal({ backdrop: 'static', keyboard: false });
        $('#coinModal').modal('show');
    }
}

const onToggleOff = (coinId) => {
    const index = listOfChosenCoins.indexOf(coinId);
    if (index > -1) {
        listOfChosenCoins.splice(index, 1);
    }
}

const createCoinsListModal = (listOfChosenCoins) => {
    const chosenCoinsModal = $(`
                <div class="home-modal modal fade" id="coinModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modalDialogList">
                <div class="modal-content modalContentList">
                    <div class="container">
                        <div class="row ">
                            <div class="col-lg-12">
                                <div class="modal-body">
                                    <h2 class="text-uppercase">Chosen Crypto</h2>
                                    <p class="item-intro text-muted">please choose which coin to remove from list</p>
                                    <div class="coins">
                                       <ul class="ulCoins"></ul>
                                    </div>
                                    <button class="btn btn-primary btn-sm text-uppercase closeCoinList" data-bs-dismiss="modal" type="button">
                                        <i class="fas fa-times me-1"></i>
                                        Close 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            `)
    $('.homeItemPopup').append(chosenCoinsModal)

    listOfChosenCoins.forEach((coin) => {
        $('.ulCoins').append(`<li data-bs-dismiss="modal" id=${coin} class="LiCoin">${coin}</li>`)
    })
}

//closeCoinList button
$(document).ready ( function () {
    $(document).on ("click", '.closeCoinList', function () {
        const lastCoin = listOfChosenCoins[listOfChosenCoins.length - 1]
        $(`#${lastCoin}`).prop("checked", false);
        $('.ulCoins').empty()
        listOfChosenCoins.pop()
        startChart()
    });
});

//removing an item from coins list
$(document).ready ( function () {
    $(document).on ("click", 'li', function (e) {
        $('.ulCoins').empty()
        $(`#${e.currentTarget.id}`).prop("checked", false);
        onToggleOff(e.currentTarget.id)
        startChart()
    });
});


//calling onToggle function
$(document).ready( function () {
    $(document).change('.switch', function (event) {
        onToggle(event.target.id, event.target.checked)
        startChart()
    });
});

//searchBox
$('.searchBox').keyup((e)=>{
    $('.coin').empty()
    const searchCoin = e.target.value
    const filteredCoins = cryptoCoins.filter(coin => {
        return(
            coin.symbol.includes(searchCoin)
        )
    })
    renderCoins(filteredCoins)
    $('.home-item').removeClass('hidden');
})



//charts
const coinChart = new Chart($("#chart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                label: listOfChosenCoins[0],
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: [],
                label: listOfChosenCoins[1],
                borderColor: "#8e5ea2",
                fill: false
            }, {
                data: [],
                label: listOfChosenCoins[2],
                borderColor: "#3cba9f",
                fill: false
            }, {
                data: [],
                label: listOfChosenCoins[3],
                borderColor: "#e8c3b9",
                fill: false
            }, {
                data: [],
                label: listOfChosenCoins[4],
                borderColor: "#c45850",
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
         },
         hover: {
            mode: 'nearest',
            intersect: true
          },
        plugins: {
            streaming: {
                duration: 30000,
            }
        },
        scales: {
            xAxes: [{
                display: true,
                type: 'realtime' 
            }]
        }
    }
});

async function price() {
    try {
        await getData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${listOfChosenCoins}&tsyms=USD,EUR`)
            .then(price => {
                const coinsPricesArray = Object.entries(price).map(key => ({ ...key[1]}));
                coinsPricesArray.forEach((coin, i)=>{
                    coinChart.data.datasets[i].data.push(coin.USD)
                    coinChart.data.datasets[i].label = listOfChosenCoins[i]
                })
                const millies = Date.now()
                coinChart.data.labels.push(`${Math.floor(millies/1000) % 60}`)
                coinChart.update()
            })
    } catch (err) {
        throw new Error('Cannot Fetch')
    }
}

const startChart = () => {
    if (listOfChosenCoins.length === 5) {
        $("#chartDiv").removeClass('hidden')
        $('.chooseCrypto').addClass('hidden')
        setInterval(() => {
            price()
        }, 2000)
    } else {
        $("#chartDiv").addClass('hidden')
        $('.chooseCrypto').removeClass('hidden')
    }
} 


main();

