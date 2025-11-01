from flask import Flask, render_template, request, redirect, url_for
import firebase_admin
from firebase_admin import credentials, firestore
import psutil
from datetime import datetime

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("firebase_service.json")  # your service account key
firebase_admin.initialize_app(cred)
db = firestore.client()

# ---------------------- HOME / DASHBOARD ----------------------
@app.route('/')
def dashboard():
    trades = db.collection('trades').stream()
    trade_list = []
    total_profit = 0
    total_loss = 0

    for t in trades:
        trade = t.to_dict()
        trade['id'] = t.id
        trade_list.append(trade)

        # simple profit/loss summary
        if 'profit' in trade:
            profit = float(trade['profit'])
            if profit > 0:
                total_profit += profit
            else:
                total_loss += profit

    return render_template('dashboard.html', trades=trade_list,
                           total_profit=total_profit,
                           total_loss=abs(total_loss))

# ---------------------- ADD TRADE ----------------------
@app.route('/add', methods=['POST'])
def add_trade():
    profit = request.form.get('profit', 0)
    data = {
        'stock': request.form['stock'],
        'amount': float(request.form['amount']),
        'profit': float(profit),
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    db.collection('trades').add(data)
    return redirect(url_for('dashboard'))


# ---------------------- DELETE TRADE ----------------------
@app.route('/delete/<id>')
def delete_trade(id):
    db.collection('trades').document(id).delete()
    return redirect(url_for('dashboard'))

# ---------------------- CLOUD RESOURCE MONITOR ----------------------
@app.route('/resource_monitor')
def resource_monitor():
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    data = {
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "timestamp": timestamp
    }

    db.collection("resource_usage").add(data)
    return render_template("resource_monitor.html", data=data)

# ---------------------- MAIN ----------------------
if __name__ == '__main__':
    app.run(debug=True)
