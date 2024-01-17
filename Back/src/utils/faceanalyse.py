import sys
from PIL import Image
from deepface import DeepFace
import os
import json 

def analyse_image(image_path):
    try:
        # Ouvrir et vérifier l'intégrité de l'image
        img = Image.open(image_path)
        img.verify()

        # Analyser les émotions sur l'image avec DeepFace
        result = DeepFace.analyze(img_path=image_path, actions=['emotion'], enforce_detection=False)
        analysis = result[0]
        main_emotion = analysis.get("dominant_emotion", "Non disponible")
        if main_emotion == "happy":
            print(json.dumps(True))
            return True
        else:
            print(json.dumps(False))
    except Exception as e:
        print(f"Erreur lors de l'analyse de l'image: {e}")

if __name__ == "__main__":
    if len(sys.argv) >= 1:
        image_path = sys.argv[1]  # Obtenir le chemin de l'image de l'argument
        analyse_image(image_path)
    else:
        print("Chemin de l'image non fourni")
