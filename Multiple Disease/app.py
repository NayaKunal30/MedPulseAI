import os
import pickle
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load models
working_dir = os.path.dirname(os.path.abspath(__file__))
diabetes_model_path = os.path.join(working_dir, 'saved_models/diabetes_model.sav')
heart_disease_model_path = os.path.join(working_dir, 'saved_models/heart_disease_model.sav')

with open(diabetes_model_path, 'rb') as file:
    diabetes_model = pickle.load(file)

with open(heart_disease_model_path, 'rb') as file:
    heart_disease_model = pickle.load(file)

# Homepage - Render index.html
@app.route('/')
def index():
    return render_template('index.html')

# Diabetes Prediction Endpoint
@app.route('/predict_diabetes', methods=['POST'])
def predict_diabetes():
    try:
        data = request.get_json()
        pregnancies = float(data['pregnancies'])
        glucose = float(data['glucose'])
        blood_pressure = float(data['bloodPressure'])
        skin_thickness = float(data['skinThickness'])
        insulin = float(data['insulin'])
        bmi = float(data['bmi'])
        diabetes_pedigree_function = float(data['diabetesPedigreeFunction'])
        age = float(data['age'])

        user_input = [pregnancies, glucose, blood_pressure, skin_thickness,
                      insulin, bmi, diabetes_pedigree_function, age]

        # Logical conditions for diabetes prediction
        prediction_text = ''

        if insulin == 0:
            prediction_text += 'High risk due to 0 insulin level. '

        if glucose >= 140:
            prediction_text += 'High glucose level. '

        if bmi >= 30:
            prediction_text += 'High BMI. '

        if age >= 45:
            prediction_text += 'Age over 45. '

        # Normal prediction
        diab_prediction = diabetes_model.predict([user_input])

        if diab_prediction[0] == 1:
            result = {'message': f'The person is diabetic. {prediction_text}'}
        else:
            result = {'message': f'The person is not diabetic. {prediction_text}'}

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})

# Heart Disease Prediction Endpoint
@app.route('/predict_heart_disease', methods=['POST'])
def predict_heart_disease():
    try:
        data = request.get_json()
        age = float(data['age'])
        sex = float(data['sex'])
        cp = float(data['cp'])
        trestbps = float(data['trestbps'])
        chol = float(data['chol'])
        fbs = float(data['fbs'])
        restecg = float(data['restecg'])
        thalach = float(data['thalach'])
        exang = float(data['exang'])
        oldpeak = float(data['oldpeak'])
        slope = float(data['slope'])
        ca = float(data['ca'])
        thal = float(data['thal'])

        user_input = [age, sex, cp, trestbps, chol,
                      fbs, restecg, thalach, exang,
                      oldpeak, slope, ca, thal]

        # Logical conditions for heart disease prediction
        prediction_text = ''

        if age >= 50:
            prediction_text += 'Age over 50. '

        if chol >= 240:
            prediction_text += 'High cholesterol. '

        if trestbps >= 140:
            prediction_text += 'High resting blood pressure. '

        if thalach <= 100:
            prediction_text += 'Low maximum heart rate. '

        # Normal prediction
        heart_prediction = heart_disease_model.predict([user_input])

        if heart_prediction[0] == 1:
            result = {'message': f'The person is having heart disease. {prediction_text}'}
        else:
            result = {'message': f'The person does not have any heart disease. {prediction_text}'}

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000)
