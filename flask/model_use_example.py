#%%
from transformers import pipeline

pipe = pipeline("audio-classification", model="antonjaragon/emotions_6_classes_small")



# %%
# record audio and predict using the pipe
import sounddevice as sd
from scipy.io.wavfile import write

fs = 16000  # Sample rate
seconds = 3 # Duration of recording

print("Recording...")
myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
sd.wait()  # Wait until recording is finished
print("Finished recording")

# delete previous file
import os
if os.path.exists("output.wav"):
    os.remove("output.wav")

write("output.wav", fs, myrecording)  # Save as WAV file

# plot audio 
import matplotlib.pyplot as plt
import numpy as np
plt.plot(np.linspace(0, seconds, seconds * fs), myrecording)
plt.show()


# predict
pipe("output.wav")



# %%
