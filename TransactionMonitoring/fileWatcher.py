import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import os
import requests

transactions = {}

submitted_pattern = re.compile(r'Submitted transaction\s+hash=([0-9a-fx]+)')
finalized_pattern = re.compile(r'Data included in Avail\'s finalised block\" blockHash=([0-9a-fx]+) extrinsicIndex=(\d+)')

class LogHandler(FileSystemEventHandler):
    def __init__(self, log_file):
        self.log_file = log_file

        self.file_position = os.path.getsize(self.log_file)

    def on_modified(self, event):
        if event.src_path.endswith("nitro.log"):
            with open(self.log_file, "r") as file:

                file.seek(self.file_position)
                lines = file.readlines()
                
                self.file_position = file.tell()

                for line in lines:
                    submitted_match = submitted_pattern.search(line)
                    finalized_match = finalized_pattern.search(line)

                    if submitted_match:
                        tx_hash = submitted_match.group(1)
                        print(f"Detected submitted transaction hash: {tx_hash}")
                        transactions[tx_hash] = {"finalizations": [], "completed": False}

                    elif finalized_match:
                        block_hash = finalized_match.group(1)
                        extrinsic_index = finalized_match.group(2)

                        for tx_hash, details in transactions.items():
                            if not details["completed"] and len(details["finalizations"]) < 2:
                                details["finalizations"].append({
                                    "blockHash": block_hash,
                                    "extrinsicIndex": extrinsic_index
                                })
                                print(f"Transaction {tx_hash} finalized in block {block_hash} with extrinsic index {extrinsic_index}")

                                if len(details["finalizations"]) == 2:
                                    details["completed"] = True
                                    url = "http://127.0.0.1:8000/savetransaction/"
                                    data = {"txn_hash":tx_hash, "block_hashes": details["finalizations"]}
                                    requests.post(url, json=data, headers = {"Content-Type": "application/json"})
                                    print(f"Transaction {tx_hash} is now fully finalized with two block entries.")
                                break

if __name__ == "__main__":
    log_file_path = "./nitro.log"
    event_handler = LogHandler(log_file_path)
    observer = Observer()
    observer.schedule(event_handler, os.path.dirname(log_file_path), recursive=False)
    observer.start()
    print("Watching log file for transaction updates...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
