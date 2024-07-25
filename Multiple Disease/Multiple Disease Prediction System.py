import streamlit as st
import pickle
import os

# Set page configuration
st.set_page_config(page_title="Health Assistant", layout="wide", page_icon="🧑‍⚕️")

# Getting the working directory of the main.py
working_dir = os.path.dirname(os.path.abspath(__file__))

# Loading the saved models
diabetes_model = pickle.load(open(f'{working_dir}/saved_models/diabetes_model.sav', 'rb'))
heart_disease_model = pickle.load(open(f'{working_dir}/saved_models/heart_disease_model.sav', 'rb'))

# Function to predict diabetes based on input values
def predict_diabetes(pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age):
    try:
        user_input = [float(pregnancies), float(glucose), float(blood_pressure), float(skin_thickness),
                      float(insulin), float(bmi), float(diabetes_pedigree_function), float(age)]
        
        st.write(f"User input for diabetes prediction: {user_input}")  # Debugging statement

        # Logical conditions for diabetes prediction
        prediction_text = ''

        if float(insulin) == 0:
            prediction_text += 'High risk due to 0 insulin level. '

        if float(glucose) >= 140:
            prediction_text += 'High glucose level. '

        if float(bmi) >= 30:
            prediction_text += 'High BMI. '

        if float(age) >= 45:
            prediction_text += 'Age over 45. '

        # Normal prediction
        diab_prediction = diabetes_model.predict([user_input])

        if diab_prediction[0] == 1:
            return f'The person is diabetic. {prediction_text}'
        else:
            return f'The person is not diabetic. {prediction_text}'

    except ValueError as e:
        st.warning(f'Error: {e}')
        return 'Please fill all details correctly.'

# Function to predict heart disease based on input values
def predict_heart_disease(age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal):
    try:
        user_input = [float(age), float(sex), float(cp), float(trestbps), float(chol),
                      float(fbs), float(restecg), float(thalach), float(exang),
                      float(oldpeak), float(slope), float(ca), float(thal)]

        st.write(f"User input for heart disease prediction: {user_input}")  # Debugging statement

        # Logical conditions for heart disease prediction
        prediction_text = ''

        if float(age) >= 50:
            prediction_text += 'Age over 50. '

        if float(chol) >= 240:
            prediction_text += 'High cholesterol. '

        if float(trestbps) >= 140:
            prediction_text += 'High resting blood pressure. '

        if float(thalach) <= 100:
            prediction_text += 'Low maximum heart rate. '

        # Normal prediction
        heart_prediction = heart_disease_model.predict([user_input])

        if heart_prediction[0] == 1:
            return f'The person is having heart disease. {prediction_text}'
        else:
            return f'The person does not have any heart disease. {prediction_text}'

    except ValueError as e:
        st.warning(f'Error: {e}')
        return 'Please fill all details correctly.'

# Main Streamlit web app
def main():
    st.title('Healthcare Prediction System')
    st.sidebar.title('Select Prediction Model')
    selected = st.sidebar.selectbox('Choose the model', ['Diabetes Prediction', 'Heart Disease Prediction'])

    if selected == 'Diabetes Prediction':
        st.subheader('Diabetes Prediction')
        pregnancies = st.text_input('Number of Pregnancies')
        glucose = st.text_input('Glucose Level')
        blood_pressure = st.text_input('Blood Pressure value')
        skin_thickness = st.text_input('Skin Thickness value')
        insulin = st.text_input('Insulin Level')
        bmi = st.text_input('BMI value')
        diabetes_pedigree_function = st.text_input('Diabetes Pedigree Function value')
        age = st.text_input('Age')

        if st.button('Predict Diabetes'):
            result = predict_diabetes(pregnancies, glucose, blood_pressure, skin_thickness,
                                      insulin, bmi, diabetes_pedigree_function, age)
            st.success(result)

    elif selected == 'Heart Disease Prediction':
        st.subheader('Heart Disease Prediction')
        age = st.text_input('Age')
        sex = st.selectbox('Sex', ['0 (Female)', '1 (Male)'])
        cp = st.selectbox('Chest Pain types', ['1', '2', '3', '4'])
        trestbps = st.text_input('Resting Blood Pressure')
        chol = st.text_input('Serum Cholestoral in mg/dl')
        fbs = st.selectbox('Fasting Blood Sugar > 120 mg/dl', ['0', '1'])
        restecg = st.selectbox('Resting Electrocardiographic results', ['0', '1', '2'])
        thalach = st.text_input('Maximum Heart Rate achieved')
        exang = st.selectbox('Exercise Induced Angina', ['0', '1'])
        oldpeak = st.text_input('ST depression induced by exercise')
        slope = st.selectbox('Slope of the peak exercise ST segment', ['1', '2', '3'])
        ca = st.text_input('Major vessels colored by flourosopy')
        thal = st.selectbox('Thalium Stress Test result', ['1', '2', '3'])

        if st.button('Predict Heart Disease'):
            result = predict_heart_disease(age, sex, cp, trestbps, chol, fbs, restecg,
                                           thalach, exang, oldpeak, slope, ca, thal)
            st.success(result)

if __name__ == '__main__':
    main()
