from flask import Flask, request, jsonify
from geopy.distance import geodesic
import datetime

app = Flask(__name__)

# Sample donor and recipient data
donors = [
    {"id": 1, "name": "John's Bakery", "food_type": "Bread", "expiration_date": "2025-01-25", "location": (44.2312, -76.4950)},
    {"id": 2, "name": "Fresh Fruits", "food_type": "Apple", "expiration_date": "2025-01-26", "location": (44.2450, -76.4840)},
]

recipients = [
    {"id": 1, "name": "Kingston Food Bank", "food_type_needed": "Bread", "location": (44.2345, -76.5000)},
    {"id": 2, "name": "Homeless Shelter", "food_type_needed": "Apple", "location": (44.2400, -76.4850)},
]

# Helper function to calculate proximity based on geodesic distance
def calculate_distance(donor_location, recipient_location):
    return geodesic(donor_location, recipient_location).kilometers

# Helper function to check if food is still good
def is_food_still_good(expiration_date):
    current_date = datetime.date.today()
    expiration_date_obj = datetime.datetime.strptime(expiration_date, "%Y-%m-%d").date()
    return expiration_date_obj >= current_date

# Matching function
def match_donors_to_recipients():
    matches = []

    for donor in donors:
        for recipient in recipients:
            if donor["food_type"] == recipient["food_type_needed"] and is_food_still_good(donor["expiration_date"]):
                distance = calculate_distance(donor["location"], recipient["location"])

                # Let's say we prioritize matching donors and recipients within 10 km
                if distance <= 10:
                    match = {
                        "donor": donor["name"],
                        "recipient": recipient["name"],
                        "food_type": donor["food_type"],
                        "expiration_date": donor["expiration_date"],
                        "distance_km": distance
                    }
                    matches.append(match)

    return matches

@app.route('/')
def home():
    return "Welcome to the Food4ll app!"

@app.route('/match', methods=['GET'])
def get_matches():
    matches = match_donors_to_recipients()
    if matches:
        return jsonify({"matches": matches})
    else:
        return jsonify({"message": "No matches found."})

if __name__ == '__main__':
    app.run(debug=True)
