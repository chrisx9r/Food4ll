from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import (LoginManager, UserMixin, 
                         login_user, login_required, logout_user, current_user)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, SelectField, IntegerField
from wtforms.validators import InputRequired, Length, EqualTo, NumberRange
import os
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:00000000@localhost/Food4LL'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'


# -----------------------------------
# Database Models
# -----------------------------------
class User(UserMixin, db.Model):
    __tablename__ = 'User'
    
    id = db.Column(db.Integer, primary_key=True)
    org_name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    user_type = db.Column(db.Enum('buyer', 'seller', name='user_type'), nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow, server_default=db.func.current_timestamp())


# Match the "Buyer_requests" table
class BuyerRequest(db.Model):
    __tablename__ = 'Buyer_requests'

    ID = db.Column(db.Integer, primary_key=True)
    organization_name = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow, server_default=db.func.current_timestamp())


# Match the "Food_posts" table
class FoodPost(db.Model):
    __tablename__ = 'Food_posts'

    ID = db.Column(db.Integer, primary_key=True)
    seller_organization_name = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)
    quantity = db.Column(db.Integer, nullable=True)
    quality = db.Column(db.String(50), nullable=True)  # e.g., "Fresh", "Good"
    created = db.Column(db.TIMESTAMP, default=datetime.utcnow, server_default=db.func.current_timestamp())
    active = db.Column(db.Enum('yes', 'no'), default='yes')

# Create the DB tables if not present
with app.app_context():
    db.create_all()


# -----------------------------------
# WTForms
# -----------------------------------
class SignUpForm(FlaskForm):
    organization_name = StringField('Organization Name')
    email = StringField('Email', validators=[InputRequired(), Length(min=4, max=100)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=100)])
    confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password')])
    
    # Only two options: buyer or seller
    user_type = SelectField('User Type', choices=[('buyer', 'Buyer'), ('seller', 'Seller')], validators=[InputRequired()])
    
    phone_number = StringField('Phone Number')
    country = StringField('Country')
    postal_code = StringField('Postal Code')
    submit = SubmitField('Sign Up')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    submit = SubmitField('Login')


# Buyer can create requests
class BuyerRequestForm(FlaskForm):
    organization_name = StringField('Organization Name', validators=[Length(max=255)])
    description = TextAreaField('Description', validators=[InputRequired()])
    submit = SubmitField('Submit Request')


# Seller can create food posts
from flask_wtf.file import FileField, FileAllowed

class FoodPostForm(FlaskForm):
    seller_organization_name = StringField('Organization Name', validators=[InputRequired(), Length(max=255)])
    description = TextAreaField('Description', validators=[InputRequired()])
    category = StringField('Category', validators=[InputRequired(), Length(max=100)])
    quantity = IntegerField('Quantity', validators=[NumberRange(min=0, message="Quantity must be a positive number")])
    quality = SelectField(
        'Quality',
        choices=[
            ('Fresh', 'Fresh'),
            ('Good', 'Good'),
            ('Average', 'Average'),
            ('Below Average', 'Below Average'),
            ('Expired', 'Expired')
        ],
        validators=[InputRequired()]
    )
    image = FileField('Food Image', validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])
    submit = SubmitField('Post Food')

# -----------------------------------
# Flask-Login Loader
# -----------------------------------
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# -----------------------------------
# Routes
# -----------------------------------

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignUpForm()
    if form.validate_on_submit():
        # Check if the email already exists
        existing_user = User.query.filter_by(email=form.email.data).first()
        if existing_user:
            flash('Email already exists. Please log in or use a different email.', 'danger')
            return redirect('/login')
        
        # Hash the password
        hashed_password = generate_password_hash(form.password.data, method='pbkdf2:sha256')

        # Create the new user
        new_user = User(
            org_name=form.organization_name.data,
            email=form.email.data,
            password=hashed_password,
            user_type=form.user_type.data,
            phone_number=form.phone_number.data,
            country=form.country.data,
            postal_code=form.postal_code.data
        )
        db.session.add(new_user)
        db.session.commit()

        # Automatically log in the new user
        login_user(new_user)
        flash('Your account has been created and you are logged in!', 'success')

        # Redirect based on user_type
        if new_user.user_type == 'buyer':
            return redirect('/buyer_dashboard')
        else:
            return redirect('/seller_dashboard')

    return render_template('signup.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            flash('Login successful!', 'success')
            
            # Redirect based on user_type
            if user.user_type == 'buyer':
                return redirect('buyer_dashboard')
            else:
                return redirect('seller_dashboard')
        else:
            flash('Login failed. Check your email/password.', 'danger')
    return render_template('login.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect('/')


# -----------------------------------
# Buyer Dashboard: Create Buyer Request
# -----------------------------------
@app.route('/buyer_dashboard', methods=['GET', 'POST'])
@login_required
def buyer_dashboard():
    if current_user.user_type != 'buyer':
        flash('Access denied: Buyers only.', 'danger')
        return redirect('/home')
    
    form = BuyerRequestForm()
    if form.validate_on_submit():
        new_request = BuyerRequest(
            organization_name=form.organization_name.data,
            description=form.description.data
        )
        db.session.add(new_request)
        db.session.commit()
        flash('Your request has been submitted successfully!', 'success')
        return redirect('/buyer_dashboard')
    
    # Fetch all buyer requests to display
    requests = BuyerRequest.query.all()

    return render_template('buyerDashboard.html', form=form, requests=requests)

# -----------------------------------
# Seller Dashboard: Create Food Post
# -----------------------------------
@app.route('/seller_dashboard', methods=['GET', 'POST'])
@login_required
def seller_dashboard():
    if current_user.user_type != 'seller':
        flash('Access denied: Sellers only.', 'danger')
        return redirect(url_for('home'))
    
    form = FoodPostForm()
    if form.validate_on_submit():
        image_path = None
        if form.image.data:
            image_file = form.image.data
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            try:
                image_file.save(image_path)  # Save the image
                print(f"Image saved at: {image_path}")  # Debugging log
            except Exception as e:
                print(f"Failed to save image: {e}")
                flash(f"Failed to save image: {e}", 'danger')
                return redirect(url_for('seller_dashboard'))

        # Create a new FoodPost entry
        new_post = FoodPost(
            seller_organization_name=form.seller_organization_name.data,
            description=form.description.data,
            category=form.category.data,
            quantity=form.quantity.data,
            quality=form.quality.data,
            active='yes',
            image_path=image_path  # Save the image path in the database
        )
        db.session.add(new_post)
        db.session.commit()
        print(f"New post created: {new_post}")  # Debugging log

        flash('Your food post has been created successfully!', 'success')
        return redirect(url_for('seller_dashboard'))
    
    # Fetch all active posts by the logged-in seller
    active_posts = FoodPost.query.filter_by(seller_organization_name=current_user.org_name, active='yes').all()

    return render_template('sellerDashboard.html', form=form, active_posts=active_posts)

if __name__ == '__main__':
    app.run(debug=True)
