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
                createModal(coins);
                coins.forEach((coin) => cryptoCoins.push(coin));
            })
    } catch (err) {
        throw new Error('Cannot Fetch')    }
}


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
const createModal = (arrOfCoins) => {
    arrOfCoins.forEach((coin, index) => {
        const {id, symbol, name, image, ath} = coin
        if (index < 100) {
            const homeModal = $(`
                <div class="home-modal modal fade" id="homeModal${id}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog">
                <div class="modal-content">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <!-- Crypto details-->
                                    <h2 class="text-uppercase">${name}</h2>
                                    <p class="item-intro text-muted">${symbol}</p>
                                    <img class="img-fluid d-block mx-auto img-responsive" src=${image} alt="..." />
                                    <p class="currentValue">Current Value ${ath}$</p>
                                    <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
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
    })
}

//showing the modal when clicking "more info"
$(document).ready ( function () {
    $(document).on ("click", '.home-hover', function (event) {
        $(`#homeModal${event.target.id}`).modal('show')
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

























     
    // <div class="home-item">
    //     <a class="home-link" data-bs-toggle="modal" href="#homeModal1">
    //         <div class="home-hover">
    //             <div class="home-hover-content"><i class="fas fa-plus fa-3x"></i></div>
    //         </div>
    //         <img class="img-fluid" src="" alt="..." />
    //     </a>
    //     <div class="home-caption">
    //         <div class="home-caption-heading">helooooooooooo</div>
    //         <div class="home-caption-subheading text-muted">Illustration</div>
    //     </div>
    // </div>

//             <!-- home Modals-->
//         <!-- home item 1 modal popup-->
//         <div class="home-modal modal fade" id="homeModal1" tabindex="-1" role="dialog" aria-hidden="true">
//         <div class="modal-dialog">
//         <div class="modal-content">
//             <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
//             <div class="container">
//                 <div class="row justify-content-center">
//                     <div class="col-lg-8">
//                         <div class="modal-body">
//                             <!-- Crypto details-->
//                             <!-- <h2 class="text-uppercase">Project Name</h2>
//                             <p class="item-intro text-muted">Lorem ipsum dolor sit amet consectetur.</p>
//                             <img class="img-fluid d-block mx-auto" src="assets/img/home/1.jpg" alt="..." />
//                             <p>Use this area to describe your project. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!</p>
//                             <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
//                                 <i class="fas fa-times me-1"></i>
//                                 Close Project
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div> 
