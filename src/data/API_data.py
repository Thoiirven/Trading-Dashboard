import pandas as pd
import os
import sys

sys.path.insert(0, "..")
from config import CRYPTO_ARRAY
from config import DICT_NAME
from utils.get_data import *

from datetime import date


def fill_first_time_wallet(crypto_array, user_ID, value_begin_usdt):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, "wallets")

    if not os.path.exists(file_path + "/wallet" + str(user_ID) + ".csv"):
        df = pd.DataFrame(
            columns=[
                "Crypto",
                "Symbol",
                "Quantity",
                "Current_Price",
                "Price_Buy",
                "Quantity_USDT",
                "Stop_Loss",
            ]
        )
        df.to_csv(file_path + "/wallet" + str(user_ID) + ".csv", sep=";", index=False)
        df = pd.read_csv(file_path + "/wallet" + str(user_ID) + ".csv", sep=";")
        new_data = {
            "Crypto": "USDT",
            "Symbol": "USDT",
            "Quantity": value_begin_usdt,
            "Price_Buy": 0,
            "Quantity_USDT": value_begin_usdt,
            "Stop_Loss":0,
        }
        df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)
        print(df)
        for crypto in crypto_array:
            new_data = {
                "Crypto": DICT_NAME[crypto],
                "Symbol": crypto,
                "Quantity": 0,
                "Price_Buy": 0,
                "Quantity_USDT": int(value_begin_usdt) / len(CRYPTO_ARRAY),
                "Stop_Loss":0,
            }
            df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)

        df.to_csv(file_path + "/wallet" + str(user_ID) + ".csv", sep=";", index=False)


def update_price_symbol_wallet(array_users):
    current_directory = os.path.dirname(__file__)

    for user in array_users:
        file_path = os.path.join(
            current_directory,
            "..",
            "data",
            "./wallets/wallet" + str(user.id_user) + ".csv",
        )

        df = pd.read_csv(file_path, sep=";")

        for crypto in CRYPTO_ARRAY:
            df.loc[df["Symbol"] == crypto, "Current_Price"] = float(
                get_current_price(crypto)
            )

        df.to_csv(file_path, sep=";", index=False)


def update_quantity_wallet(symbol, user_ID, quantity):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")
    df.loc[df["Symbol"] == symbol, "Quantity"] += quantity

    df.to_csv(file_path, sep=";", index=False)

def set_stop_loss_wallet(symbol, user_ID, Stop_Loss):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")
    df.loc[df["Symbol"] == symbol, "Stop_Loss"] = Stop_Loss

    df.to_csv(file_path, sep=";", index=False)

def set_quantity_wallet(symbol, user_ID, quantity):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")
    df.loc[df["Symbol"] == symbol, "Quantity"] = quantity

    df.to_csv(file_path, sep=";", index=False)

def update_price_wallet(symbol, user_ID, price):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")

    df.loc[df["Symbol"] == symbol, "Price_Buy"] = price

    df.to_csv(file_path, sep=";", index=False)

def add_quantity_usdt_wallet(symbol, user_ID, quantity):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")
    df.loc[df["Symbol"] == symbol, "Quantity_USDT"] = round(
        df.loc[df["Symbol"] == symbol, "Quantity_USDT"].values[0] + quantity, 2
    )
    df.to_csv(file_path, sep=";", index=False)


def get_quantity_symbol_wallet(symbol, user_ID):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")
    quantity = df.loc[df["Symbol"] == symbol]["Quantity"].values[0]

    return quantity


def get_quantity_usdt_symbol_wallet(symbol, user_ID):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory, "..", "data", "./wallets/wallet" + str(user_ID) + ".csv"
    )
    df = pd.read_csv(file_path, sep=";")
    quantity = df.loc[df["Symbol"] == symbol]["Quantity_USDT"].values[0]

    return quantity

def init_transaction(client_id):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, "..", "data", "transactions")
    if not os.path.exists(file_path + "/transactions" + str(client_id) + ".csv"):
        df = pd.DataFrame(
            columns=[
                "Symbol",
                "OrderId",
                "ClientId",
                "ClientOrderId",
                "Status",
                "Type",
                "Side",
                "Price",
                "Gain",
                "Quantity",
                "Commission",
                "tradeId",
                "transactDate",
                "transactTime",
                "Timestamp",
            ]
        )

        df.to_csv(
            file_path + "/transactions" + str(client_id) + ".csv", sep=";", index=False
        )
        
def save_transaction(transaction, client_id):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, "..", "data", "transactions")
    quantity = str(sum([float(fill["qty"]) for fill in transaction["fills"]]))
    print(quantity)
    commission = str(sum([float(fill["commission"]) for fill in transaction["fills"]]))

    file_path = os.path.join(
        current_directory,
        "..",
        "data",
        "./transactions/transactions" + str(client_id) + ".csv",
    )
    df = pd.read_csv(file_path, sep=";")

    price = transaction["fills"][0]["price"]
    symbol = transaction["symbol"]

    timestamp = transaction["transactTime"]
    timestamp_to_date = datetime.datetime.fromtimestamp(timestamp / 1000).strftime(
        "%Y-%m-%d"
    )
    timestamp_to_time = datetime.datetime.fromtimestamp(timestamp / 1000).strftime(
        "%H:%M:%S"
    )

    gain = 0

    if transaction["side"] == "SELL":
        df_symbol = df[df["Symbol"] == symbol]
        line_latest_symbol_transaction = df_symbol.loc[df_symbol["Timestamp"].idxmax()]

        buy_price = line_latest_symbol_transaction["Price"]

        gain = (float(price) - float(buy_price)) * float(quantity)

    new_data = {
        "Symbol": symbol,
        "ClientId": client_id,
        "OrderId": transaction["orderId"],
        "ClientOrderId": transaction["clientOrderId"],
        "Status": transaction["status"],
        "Type": transaction["type"],
        "Side": transaction["side"],
        "Price": price,
        "Quantity": quantity,
        "Commission": commission,
        "tradeId": transaction["fills"][0]["tradeId"],
        "Timestamp": timestamp,
        "transactDate": timestamp_to_date,
        "transactTime": timestamp_to_time,
        "Gain": gain,
    }

    df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)

    df.to_csv(file_path, sep=";", index=False)


def add_new_symbol_to_wallet(symbol, user_ID):
    df = pd.read_csv("./wallets/wallet" + str(user_ID) + ".csv", sep=";")

    new_data = {"Crypto": DICT_NAME[symbol], "Symbol": symbol, "Quantity": 0}

    df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)
    df.to_csv("./wallets/wallet" + str(user_ID) + ".csv", sep=";", index=False)


def remove_symbol_to_wallet(symbol, user_ID):
    df = pd.read_csv("./wallets/wallet" + str(user_ID) + ".csv", sep=";")

    df = df.drop(df[df.Crypto == symbol].index)

    df.to_csv("./wallets/wallet" + str(user_ID) + ".csv", sep=";", index=False)

def add_new_quantity_usdt(user_ID, quantity_USDT):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(
        current_directory,
        "..",
        "data",
        "./wallets/wallet" + str(user_ID) + ".csv",
    )

    df = pd.read_csv(file_path, sep=";")

    for crypto in CRYPTO_ARRAY:
        df.loc[df["Symbol"] == crypto, "Quantity_USDT"] = round(
            df.loc[df["Symbol"] == crypto, "Quantity_USDT"].values[0] + (quantity_USDT / len(CRYPTO_ARRAY)) , 2
        )

    df.to_csv(file_path, sep=";", index=False)
def init_solde(user):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, "soldes")

    if not os.path.exists(file_path + "/solde" + str(user.id_user) + ".csv"):
        date2 = date.today().strftime("%Y-%m-%d")
        df = pd.DataFrame(columns=["Date", "Solde"])
        new_data = {"Date": date2, "Solde": user.value_to_trade}
        df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)

        df.to_csv(
            file_path + "/solde" + str(user.id_user) + ".csv", sep=";", index=False
        )


def update_solde(id_user, gain):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, "soldes")
    date2 = date.today().strftime("%Y-%m-%d")
    df = pd.read_csv(file_path + "/solde" + str(id_user) + ".csv", sep=";")

    new_data = {"Date": date2, "Solde": float(df.iloc[-1]["Solde"]) + float(gain)}
    df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)

    df.to_csv(file_path + "/solde" + str(id_user) + ".csv", sep=";", index=False)

if __name__ == "__main__":
    # fill_first_time_wallet(CRYPTO_ARRAY, 1)
    # update_quantity_wallet("BTCUSDT", 0.0003)
    update_solde(1, 23)
    print("Ich Ich")
