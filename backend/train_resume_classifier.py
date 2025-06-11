import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
import pickle
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def train_resume_classifier():
    try:
        # Load the dataset
        logger.info("Loading dataset...")
        df = pd.read_csv('resume_dataset.csv')
        
        # Check data
        logger.info(f"Dataset shape: {df.shape}")
        logger.info(f"Column names: {df.columns}")
        
        # Assuming 'text_snippet' contains the resume text and 'label' is 0/1
        # Adjust these column names if needed
        X = df['text_snippet']  # Adjust this to your actual text column name
        y = df['label']         # Adjust this to your actual label column name
        
        # Split the dataset
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        logger.info(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}")
        
        # Create a pipeline with TF-IDF and Logistic Regression
        logger.info("Building model pipeline...")
        model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=10000, ngram_range=(1, 2))),
            ('classifier', LogisticRegression(max_iter=1000, C=1.0, class_weight='balanced'))
        ])
        
        # Train the model
        logger.info("Training model...")
        model.fit(X_train, y_train)
        
        # Evaluate the model
        logger.info("Evaluating model...")
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        report = classification_report(y_test, predictions)
        
        logger.info(f"Accuracy: {accuracy:.4f}")
        logger.info(f"Classification Report:\n{report}")
        
        # Save the model
        logger.info("Saving model...")
        with open('resume_classifier_model.pkl', 'wb') as f:
            pickle.dump(model, f)
        
        logger.info("✅ Training completed successfully")
        return model
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

def predict_resume(text, model=None):
    """Function to predict on new resume text"""
    try:
        if model is None:
            # Load the model if not provided
            with open('resume_classifier_model.pkl', 'rb') as f:
                model = pickle.load(f)
        
        # Make prediction
        prediction = model.predict([text])[0]
        probability = model.predict_proba([text])[0]
        
        result = {
            'prediction': int(prediction),
            'confidence': float(probability[1]) if prediction == 1 else float(probability[0])
        }
        return result
        
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise

if __name__ == "__main__":
    # Train the model
    model = train_resume_classifier()
    
    # Optional: Test with sample text
    sample_text = "Example resume text here..."
    result = predict_resume(sample_text, model)
    logger.info(f"Sample prediction: {result}")