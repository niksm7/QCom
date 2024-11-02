var current_user_account = ""
var token_contract = ""
var operations_contract = ""
const address_token_contract = "0x012Ae238241930A0278cd9A1b9DeF221856B60f0"
const address_qcom_operations = "0x2E3446094f131055C761B0336aBFFa4Bbf85e10E"

const web = new Web3("http://localhost:8449")


$.ajax({
    url: "http://localhost/api?module=contract&action=getabi&address=0x012Ae238241930A0278cd9A1b9DeF221856B60f0",
    dataType: "json",
    success: function (data) {
        token_contract = new web.eth.Contract(JSON.parse(data.result), address_token_contract)
        localStorage.setItem('token_contract', JSON.stringify([JSON.parse(data.result), address_token_contract]))
    }
});

$.ajax({
    url: "http://localhost/api?module=contract&action=getabi&address=0x2E3446094f131055C761B0336aBFFa4Bbf85e10E",
    dataType: "json",
    success: function (data) {
        operations_contract = new web.eth.Contract(JSON.parse(data.result), address_qcom_operations)
        getAllGoods()
        localStorage.setItem('operations_contract', JSON.stringify([JSON.parse(data.result), address_qcom_operations]))
    }
});

getAllGoods()

async function getAllGoods() {
    var $main_div = $("#items_container")
    var $row_item = $('<div class="row"></div>')
    seller_address = $("#seller_address").text()
    all_goods = await operations_contract.methods.getGoodBySeller(seller_address).call()
    for (let index = 0; index < all_goods.length; index++) {
        $row_item.append(`
            <div class="column">
            <div class="card" style="width:250px">
                <img src="${all_goods[index].image_uri}" alt="Mountains" style="width:100%; height:150px;border:1px solid #F0BB62">
                <h3 style="color:#064635">${all_goods[index].name}</h3>
                <p style="color:#519259">${all_goods[index].description}</p>
            </div>
            </div>
        `)

        if (index > 0 && index % 5 == 0 && index != all_goods.length) {
            $main_div.append($row_item)
            $row_item = $('<div class="row"></div>')
        }

    }
    $main_div.append($row_item)
}