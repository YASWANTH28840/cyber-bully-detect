import sys
import tensorflow as tf
path = "././ML"
from sklearn.feature_extraction.text import CountVectorizer
import keras
import pickle

file = r"././ML/tokenizer.pkl"

open_file2 = open(file, "rb")
tokenizer = pickle.load(open_file2)
open_file2.close()

DEFAULT_FUNCTION_KEY = "serving_default"
model = tf.keras.models.load_model(path)

msg=[sys.argv[1]]
from keras.preprocessing.text import Tokenizer
msg = tokenizer.texts_to_sequences(msg)
from keras.preprocessing.sequence import pad_sequences
maxlen = 2500
msg = pad_sequences(msg, padding='post', maxlen=maxlen)

result = model.predict(msg)
print(result[0][0])