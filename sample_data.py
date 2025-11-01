import random
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("firebase_service.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

symbols = ["AAPL","TSLA","MSFT","NVDA","GOOG","AMZN"]
sides = ["buy","sell"]

for i in range(30):
    s = random.choice(symbols)
    side = random.choice(sides)
    qty = round(random.uniform(1, 50), 2)
    price = round(random.uniform(50, 2000), 2)
    doc = {
        "symbol": s,
        "side": side,
        "quantity": qty,
        "price": price,
        "account": "demo",
        "status": "filled",
        "notes": "",
        "timestamp": datetime.utcnow() - timedelta(minutes=30-i)
    }
    db.collection("trades").add(doc)

print("seeded")
