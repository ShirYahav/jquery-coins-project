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
                renderCoins(coins);
                coins.forEach((coin) => cryptoCoins.push(coin));
                getCurrencies(cryptoCoins);
                console.log(cryptoCoins)
            })
    } catch (err) {
        throw new Error('Cannot Fetch') 
    }
}


const getCurrencies = (id) => {
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
                createModal(coin, value.usd, value.eur, value.ils)
            })
    } catch (err) {
        throw new Error('Cannot Fetch 2')
    }
}

//see local storage for more info 
//z-index wich element will come firs , div inside div 


//rendering coins
const renderCoins = (arrayOfCoins) => {
    arrayOfCoins.forEach((coin , index) => {
        const {id, symbol, name, image} = coin
        if (index < 100) {
            const cryptoCoin = $(`   
                <div class="home-item ${id}">
                <label class="switch"/>
                  <input type="checkbox" class="toggle" id=${id}>
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
        <div class="home-modal modal fade styleModal" id="homeModal${id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content justify-content-center">
            <div class="container justify-content-center">
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="modal-body">
                            <!-- Crypto details-->
                            <h2 class="text-uppercase">${name}</h2>
                            <p class="item-intro text-muted">${symbol}</p>
                            <img class="img-fluid d-block mx-auto img-responsive" src=${image.small} alt="..." />
                            <p class="currentValue">Current Value ${usd}$</p>
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
    $(document).on("click", '.home-hover', function (event) {
        // getCurrencies($(event.target).parent().attr('id')) <--- When you Clicked on the Chiled div of Info Button by accident
        getCurrencies(event.target.id);
        $(`#homeModal${event.target.id}`).modal('show')
    });
    $(document).on("click", '.home-hover-content', function (event) {
        getCurrencies($(event.target).parent().attr('id'))
        // getCurrencies($(event.target).parent().id);
        $(`#homeModal${event.target.parentNode.id}`).modal('show')
    });
});



//toggle functionaliy
const listOfChosenCoins = [];

const onToggle = (coinId, checked) => {
    if((listOfChosenCoins.length < 5) && (checked === true)){
        listOfChosenCoins.push(coinId)

    } else if (checked === false){
        onToggleOff(coinId)

    }else if ((listOfChosenCoins.length === 5) && (checked === true)){
        listOfChosenCoins.push(coinId)
        createCoinsListModal(listOfChosenCoins, checked)
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
                <div class="modal-dialog">
                <div class="modal-content">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <h2 class="text-uppercase">Chosen Crypto</h2>
                                    <p class="item-intro text-muted">please choose which coin to remove from list</p>
                                    <div class="coins">
                                       <ul class="coinList"></ul>
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
        $('.coinList').append(`<li data-bs-dismiss="modal" id=${coin} >${coin}</li>`)
    })
}

//closeCoinList button
$(document).ready ( function () {
    $(document).on ("click", '.closeCoinList', function () {
        const lastCoin = listOfChosenCoins[listOfChosenCoins.length - 1]
        $(`#${lastCoin}`).prop("checked", false);
        $('.coinList').empty()
        listOfChosenCoins.pop()
    });
});

//removing an item from coins list
$(document).ready ( function () {
    $(document).on ("click", 'li', function (e) {
        $('.coinList').empty()
        $(`#${e.currentTarget.id}`).prop("checked", false);
        onToggleOff(e.currentTarget.id)
    });
});


//calling onToggle function
$(document).ready( function () {
    $(document).change('.switch', function (event) {
        onToggle(event.target.id, event.target.checked)

    });
});

//searchBob
$('.searchBox').keyup((e)=>{
    $('.coin').empty()
    const searchCoin = e.target.value
    const filteredCoins = cryptoCoins.filter(coin => {
        return(
            coin.symbol.includes(searchCoin)
        )
    })
    renderCoins(filteredCoins)
})


main();
