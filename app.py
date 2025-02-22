from flask import flask, request, jsonify, render_template

app = flask(__name__)

@app.route('/')

def form():
    return render_template('input-page.html')

@app.route('/submit', methods['POST'])

def submit():
    data = request.json
    print("Testing: ", data)

if __name__ == '__main__':
    app.run(debug = True)
