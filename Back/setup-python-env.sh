#!/bin/bash

# Créer un environnement virtuel s'il n'existe pas
if [ ! -d "python-env" ]; then
    python -m venv python-env
fi

# Activer l'environnement virtuel
source python-env/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Désactiver l'environnement virtuel
deactivate
