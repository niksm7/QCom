// Import dependencies, learn more at: https://www.quicknode.com/docs/functions/runtimes/node-js-20-runtime
const https = require('https');

/**
 * main(params) is invoked when your Function is called from Streams or API.
 * 
 * @param {Object} params - May contain a dataset (params.data), params.metadata, and params.user_data
 * 
 * @returns {Object} - A message that will be logged and returned when a Function is called via API.
 *           Tip: You can chain Functions together by calling them inside each other.
 * Learn more at: https://www.quicknode.com/docs/functions/getting-started#overview
 */

function getAllUnverifiedTxns(resolve, reject) {
    const options = {
        hostname: '5bac-160-238-77-2.ngrok-free.app',
        path: '/getunvtxns/',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const req = https.request(options, res => {
        let responseData = '';
        res.on('data', (d) => {
            responseData += d;
        });
        res.on('end', () => {
            resolve({
                response: JSON.parse(responseData),
            });
        });
    });

    req.on('error', (error) => {
        reject({
            error: error.toString()
        });
    });
    req.end();
}

function updateDatabase(resolve, reject, verfied_transactions, main_txn){

    let payload = {
        "txn_link": `https://sepolia.arbiscan.io/tx/${main_txn}`,
        "verified_txns": verfied_transactions
    }

    payload = JSON.stringify(payload)

    const options = {
        hostname: '5bac-160-238-77-2.ngrok-free.app',
        path: '/updatevrftxns/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options, res => {
        let responseData = '';
        res.on('data', (d) => {
            responseData += d;
        });
        res.on('end', () => {
            resolve({
                response: JSON.parse(responseData),
            });
        });
    });

    req.on('error', (error) => {
        reject({
            error: error.toString()
        });
    });
    req.write(payload)
    req.end();
}


function callVerifyTransactions(resolve, reject, block_hash, extrinsic_index){
    const options = {
        hostname: 'turing-bridge-api.avail.so',
        path: `/eth/proof/${block_hash}?index=${extrinsic_index}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const req = https.request(options, res => {
        let responseData = '';
        res.on('data', (d) => {
            responseData += d;
        });
        res.on('end', () => {
            resolve({
                response: JSON.parse(responseData),
            });
        });
    });

    req.on('error', (error) => {
        reject({
            error: error.toString()
        });
    });
    req.end();
}

async function verifyTransactions(transactions, main_txn){

    let verfied_transactions = []

    for (const txn of transactions) {
        const txnHash = txn.txn_value;
        const blockHashesString = txn.block_hashes;

        const blockHashes = JSON.parse(blockHashesString.replace(/'/g, '"'));

        let verf_count = 0
        
        for (const block of blockHashes) {
            const blockHash = block.blockHash;
            const extrinsicIndex = block.extrinsicIndex;
            
            // Call the function with extracted values
            verification_data = await new Promise((resolve, reject) => {
                callVerifyTransactions(resolve, reject, blockHash, extrinsicIndex)
            })
            if(verification_data["response"]["error"] == null){
                verf_count += 1
            }
        }

        if(verf_count == 2){
            verfied_transactions.push(txnHash)
        }
    }

    // Update the database with transactions state
    let add_verification_database = await new Promise((resolve, reject) => {
        updateDatabase(resolve, reject, verfied_transactions, main_txn)
    })
}

async function main(params) {
    // Get unverified txns
    let all_unverified_txns = await new Promise((resolve, reject) => {
        getAllUnverifiedTxns(resolve, reject)
    })

    data = all_unverified_txns["response"]["all_unverified_txns"]

    //verify transactions
    let all_verified_transactions = await verifyTransactions(data, params.data[0].transactionHash)

    return all_verified_transactions

}