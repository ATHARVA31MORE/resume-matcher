from transformers import pipeline

# Load your fine-tuned local model
classifier = pipeline("text-classification", model="./resume-classifier")

# Test it on sample text
result = classifier("Sample resume content here")
print(result)
