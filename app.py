import os
import sqlite3
from flask import Flask, request, redirect, url_for, render_template_string, send_from_directory

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def init_db():
    conn = sqlite3.connect(os.path.join(BASE_DIR, 'database.db'))
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT)')
    c.execute('CREATE TABLE IF NOT EXISTS logins (id INTEGER PRIMARY KEY, identifier TEXT, password TEXT)')
    c.execute('CREATE TABLE IF NOT EXISTS memberships (id INTEGER PRIMARY KEY, name TEXT, service_no TEXT, rank TEXT, email TEXT)')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def home():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/style.css')
def style():
    return send_from_directory(BASE_DIR, 'style.css')

@app.route('/pages/<path:filename>')
def serve_page(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'pages'), filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'assets'), filename)

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')
    
    conn = sqlite3.connect(os.path.join(BASE_DIR, 'database.db'))
    c = conn.cursor()
    c.execute('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', (name, email, message))
    conn.commit()
    conn.close()
    
    return "<script>alert('Message sent successfully!'); window.location.href='/';</script>"

@app.route('/submit_login', methods=['POST'])
def submit_login():
    identifier = request.form.get('identifier')
    password = request.form.get('password')
    
    conn = sqlite3.connect(os.path.join(BASE_DIR, 'database.db'))
    c = conn.cursor()
    c.execute('INSERT INTO logins (identifier, password) VALUES (?, ?)', (identifier, password))
    conn.commit()
    conn.close()
    
    return "<script>alert('Login attempt recorded!'); window.location.href='/';</script>"

@app.route('/submit_membership', methods=['POST'])
def submit_membership():
    name = request.form.get('name')
    service_no = request.form.get('service_no')
    rank = request.form.get('rank')
    email = request.form.get('email')
    
    conn = sqlite3.connect(os.path.join(BASE_DIR, 'database.db'))
    c = conn.cursor()
    c.execute('INSERT INTO memberships (name, service_no, rank, email) VALUES (?, ?, ?, ?)', (name, service_no, rank, email))
    conn.commit()
    conn.close()
    
    return "<script>alert('Membership submitted successfully!'); window.location.href='/';</script>"

@app.route('/admin')
def admin():
    conn = sqlite3.connect(os.path.join(BASE_DIR, 'database.db'))
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute('SELECT * FROM contacts')
    contacts = c.fetchall()
    
    c.execute('SELECT * FROM logins')
    logins = c.fetchall()
    
    c.execute('SELECT * FROM memberships')
    memberships = c.fetchall()
    
    conn.close()
    
    with open(os.path.join(BASE_DIR, 'admin.html'), 'r') as f:
        html = f.read()
    
    return render_template_string(html, contacts=contacts, logins=logins, memberships=memberships)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
