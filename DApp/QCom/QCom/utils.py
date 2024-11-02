import os
import json
from eth_typing import abi
import requests
from web3.middleware import geth_poa_middleware
from web3 import Web3
from dotenv import load_dotenv
import uuid

load_dotenv()

quick_node_url = os.getenv("QUICKNODE_URL")

web = Web3(Web3.HTTPProvider("http://localhost:8449"))
web.middleware_onion.inject(geth_poa_middleware, layer=0)

web.eth.default_account = web.eth.account.privateKeyToAccount(os.getenv("PRIVATE_KEY")).address

# Operations
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

operations_abi = requests.get("http://localhost/api?module=contract&action=getabi&address=0x2E3446094f131055C761B0336aBFFa4Bbf85e10E", headers=headers).json()['result']

operations_address = "0x2E3446094f131055C761B0336aBFFa4Bbf85e10E"

operations_contract = web.eth.contract(abi=operations_abi, address=operations_address)

# Token
token_address = "0x012Ae238241930A0278cd9A1b9DeF221856B60f0"


def upload_to_ipfs(_image):
    ipfs_url = "https://api.quicknode.com/ipfs/rest/v1/s3/put-object"
    random_hash = uuid.uuid4().hex

    image_name = f"{random_hash}_{_image.name}"

    payload = {'Key': image_name, 'ContentType': _image.content_type}
    
    files=[
    ('Body',(image_name,_image.read(),_image.content_type))
    ]
    headers = {
    'x-api-key': os.getenv("QUICKNODE_API_KEY")
    }

    response = requests.request("POST", ipfs_url, headers=headers, data=payload, files=files)

    ipfs_hash = response.json()["pin"]["cid"]
    image_uri = "https://function-news-mixture.quicknode-ipfs.com/ipfs/" + ipfs_hash
    print(image_uri)
    return image_uri


def final_is_delivered(order_id):
    is_already_payed = operations_contract.functions.id_to_order(order_id).call()[-1]
    if not is_already_payed:
        nonce = web.eth.get_transaction_count(web.toChecksumAddress(web.eth.default_account))
        deliver_tx = operations_contract.functions.idDelivered(order_id).buildTransaction({
                'chainId': 13331717,
                'gas': 700000,
                'maxFeePerGas': web.toHex((10**11)),
                'maxPriorityFeePerGas': web.toHex((10**11)),
                'nonce': nonce,
                })
        signed_tx = web.eth.account.sign_transaction(deliver_tx, private_key=os.getenv("PRIVATE_KEY"))
        receipt = web.eth.send_raw_transaction(signed_tx.rawTransaction)
        web.eth.wait_for_transaction_receipt(receipt)
    print("Order marked as delivered!")
