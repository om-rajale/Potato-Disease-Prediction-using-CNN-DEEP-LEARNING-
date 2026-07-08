import tensorflow as tf

# Load the .keras model
model = tf.keras.models.load_model(
    r"C:\Users\ACER\Documents\Code\potato-disease\saved_model\1.keras"
)

# Export as TensorFlow SavedModel
model.export(
    r"C:\Users\ACER\Documents\Code\potato-disease\serving_model\1"
)

print("Model converted successfully!")