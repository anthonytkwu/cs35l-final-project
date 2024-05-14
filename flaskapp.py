from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import re
import pathlib

app = Flask(__name__)

# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    x = re.search(r'.*\.svg$', file.filename)

    if not x:
        file_extension = pathlib.Path(file.filename).suffix
        return jsonify({'error': f'Incorrect file type: {file_extension}'}), 400

    # Save the file
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    return jsonify({'message': 'File uploaded successfully', 'filename': filename})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
