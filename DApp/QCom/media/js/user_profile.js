const web = new Web3("http://localhost:8449")
token_contract_details = JSON.parse(localStorage.getItem("token_contract"))
operations_contract_details = JSON.parse(localStorage.getItem("operations_contract"))
var token_contract = new web.eth.Contract(token_contract_details[0], token_contract_details[1])
var operations_contract = new web.eth.Contract(operations_contract_details[0], operations_contract_details[1])
var current_user_account = ""

window.addEventListener('load', async () => {

    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            current_user_account = accounts[0]
            $("#current_account").text(current_user_account)
            refresh_balance()
        } catch (error) {
            if (error.code === 4001) {
                // User rejected request
            }
        }
        window.ethereum.on('accountsChanged', (accounts) => {
            current_user_account = accounts[0]
            refresh_balance()
            $("#current_account").text(current_user_account)
        });

    } else {
        window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
    }
})

async function refresh_balance(){
    curr_balance = await token_contract.methods.balanceOf($(".user_account").text()).call()
    available_withdrawal = await operations_contract.methods.seller_to_amount_payable($(".user_account").text()).call()
    $(".balance-amount").html((Number(curr_balance) / (10 ** 18)).toFixed(2))
    $("#amount_withdrawal").html((Number(available_withdrawal) / (10 ** 18)).toFixed(2))
}


async function send(transaction, val = 0) {
    const params = [{
        from: current_user_account,
        to: "0x012Ae238241930A0278cd9A1b9DeF221856B60f0",
        chainId: 13331717,
        data: transaction.encodeABI(),
        gas: web.utils.toHex(1000000),
        gasPrice: web.utils.toHex(10e10),
    },]

    sending_tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params,
    })

    return await sending_tx
}


function getTokens() {
    token_count_rs = parseInt($("#token_num").val().trim()) * 10e18
    token_count_rs = token_count_rs / 10
    tx = send(token_contract.methods.payUser(token_count_rs))
}


async function VerifyOrder(order_id){
    get_order = await operations_contract.methods.id_to_order(order_id).call()
    seller_address = document.getElementById("seller_address")
    buyer_address = document.getElementById("buyer_address")
    order_total = document.getElementById("order_total")

    if(get_order["seller_address"] == seller_address.innerText.trim() && get_order["buyer_address"] == buyer_address.innerText.trim() && get_order["total_bill"] == (order_total.innerText.trim() * (10**18))){
        alert("The order details are verified from Blockchain!")
    }
    else{
        seller_address.innerText = get_order["seller_address"]
        buyer_address.innerText = get_order["buyer_address"]
        order_total.innerText = get_order["total_bill"] / (10**18)
        alert("There were some manupulations! But now the data is legit!")
    }
}