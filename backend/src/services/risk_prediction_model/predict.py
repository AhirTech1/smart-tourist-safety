import sys
import json
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def train_and_predict(lat, lon):
    # This is a simplified example. You should use a real crime dataset.
    # For a real implementation, you would load a pre-trained model.
    data = {
        'latitude': [21.1702, 23.0225, 22.3072, lat],
        'longitude': [72.8311, 72.5714, 73.1812, lon],
        'crime_type': ['theft', 'assault', 'robbery', 'unknown'],
        'risk_level': [1, 2, 3, 0] # 1: low, 2: medium, 3: high
    }
    df = pd.DataFrame(data)

    # A real model would have many more features
    features = ['latitude', 'longitude']
    X = df[features]
    y = df['risk_level']

    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.25, random_state=42)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    prediction = model.predict([[lat, lon]])

    # For demonstration, we'll return a sample high-risk zone.
    # A real implementation would generate zones based on the prediction.
    return [{
        "latitude": lat,
        "longitude": lon,
        "radius": 500,
        "riskLevel": int(prediction[0])
    }]


if __name__ == "__main__":
    latitude = float(sys.argv[1])
    longitude = float(sys.argv[2])
    predicted_zones = train_and_predict(latitude, longitude)
    print(json.dumps(predicted_zones))