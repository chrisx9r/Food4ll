from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, EmailField
from wtforms.validators import InputRequired, Length, EqualTo

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to something unique
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'


# User model for SQLite database
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(10), nullable=True)
    role = db.Column(db.String(50), nullable=False)  # "donor" or "recipient"


# Create the database
with app.app_context():
    db.create_all()


# WTForms for handling the user sign-up and login forms
class SignUpForm(FlaskForm):
    username = StringField('Organization Name', validators=[InputRequired(), Length(min=4, max=100)])
    email = EmailField('Email', validators=[InputRequired(), Length(min=6, max=100)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=100)])
    confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password')])
    phone_number = StringField('Phone Number', validators=[InputRequired(), Length(min=10, max=15)])
    country = StringField('Country', validators=[InputRequired(), Length(min=2, max=100)])
    postal_code = StringField('Postal Code', validators=[InputRequired(), Length(min=5, max=10)])
    role = StringField('Role', validators=[InputRequired()])
    submit = SubmitField('Sign Up')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    submit = SubmitField('Login')


# Route to load the user from the session
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Home route (main page)
@app.route('/')
def home():
    return render_template('home.html')


# Sign-up route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignUpForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = User(
            username=form.username.data,
            password=hashed_password,
            email=form.email.data,
            phone_number=form.phone_number.data,
            country=form.country.data,
            postal_code=form.postal_code.data,
            role=form.role.data
        )
        db.session.add(new_user)
        db.session.commit()
        flash('Your account has been created!', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html', form=form)


# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('profile'))
        else:
            flash('Login failed. Check your username and/or password.', 'danger')
    return render_template('login.html', form=form)


# Profile route (display info after login)
@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user)


# Logout route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)
