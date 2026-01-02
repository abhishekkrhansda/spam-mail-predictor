import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer

print("🚀 Training spam model locally...")

# Load data
data = pd.read_csv('spam_ham_dataset.csv')
data.drop('label', axis=1, inplace=True)
x = data.text
y = data.label_num

# Split
X_train, X_test, Y_train, Y_test = train_test_split(x, y, test_size=0.2, random_state=3)

# Vectorizer & Model
print("Fitting vectorizer...")
vectorizer = TfidfVectorizer(min_df=1, stop_words='english', lowercase=True)
X_train_features = vectorizer.fit_transform(X_train)
X_test_features = vectorizer.transform(X_test)

print("Training model...")
model = LogisticRegression()
model.fit(X_train_features, Y_train)

# Test accuracy
train_acc = model.score(X_train_features, Y_train)
test_acc = model.score(X_test_features, Y_test)
print(f"✅ Train Accuracy: {train_acc:.3f}")
print(f"✅ Test Accuracy: {test_acc:.3f}")

# Save
joblib.dump(model, 'spam_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
print("💾 Model saved locally - Compatible with your scikit-learn version!")
print("🎉 Training complete!")