# Dockerfile pour le développement React
FROM node:22-alpine AS builder

# Définir les métadonnées
LABEL name="frontend-minader-dev"
LABEL author="Cabrel Nya"

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY package-lock.json* ./

# Installer les dépendances (y compris les devDependencies)
RUN npm install

# Copier le code source
COPY . .

# Exposer le port de développement
EXPOSE 5173

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
