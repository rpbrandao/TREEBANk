from flask import Flask, request, jsonify, redirect, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db' 
app = Flask(__name__)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
template_folder = os.path.join(APP_ROOT, 'templates')
app.template_folder = template_folder  # Configurando o caminho explicitamente

db = SQLAlchemy(app)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(120), nullable=False)  # Added back

@app.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    data = request.get_json()  # Changed to handle JSON data
    novo_usuario = Usuario(nome=data['nome'], email=data['email'], senha=generate_password_hash(data['senha']))
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({'message': 'Cadastro realizado com sucesso!'})

@app.route('/operator')
def operator():
  return render_template('conta_Bancaria/templates/operator.html')  # Assuming you have a template

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)