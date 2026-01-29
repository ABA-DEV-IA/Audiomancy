#!/bin/bash

# Script de déploiement pour le VPS OVH
# Ce script est exécuté automatiquement par GitHub Actions

set -e  # Arrêter en cas d'erreur

echo "=========================================="
echo "🚀 Début du déploiement Audiomancy"
echo "=========================================="

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Se connecter à GitHub Container Registry (si le token est disponible)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Connexion à GitHub Container Registry..."
    echo "$GITHUB_TOKEN" | sudo docker login ghcr.io -u github-actions --password-stdin
fi

# Arrêter les conteneurs existants
echo "⏸️  Arrêt des conteneurs existants..."
sudo docker-compose -f docker-compose.prod.yml down || true

# Supprimer les anciennes images
echo "🗑️  Nettoyage des anciennes images..."
sudo docker image prune -f

# Télécharger les dernières images depuis GitHub Container Registry
echo "📥 Téléchargement des dernières images..."
sudo docker-compose -f docker-compose.prod.yml pull

# Démarrer les nouveaux conteneurs
echo "🎬 Démarrage des nouveaux conteneurs..."
sudo docker-compose -f docker-compose.prod.yml up -d

# Afficher le statut des conteneurs
echo ""
echo "=========================================="
echo "📊 Statut des conteneurs :"
echo "=========================================="
sudo docker-compose -f docker-compose.prod.yml ps

# Vérifier que les conteneurs sont bien démarrés
echo ""
echo "=========================================="
echo "🔍 Vérification de la santé des services..."
echo "=========================================="

# Attendre quelques secondes pour que les services démarrent
sleep 5

# Vérifier MongoDB
if sudo docker ps | grep -q audiomancy-mongodb; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
    exit 1
fi

# Vérifier Backend
if sudo docker ps | grep -q audiomancy-backend; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Vérifier Frontend
if sudo docker ps | grep -q audiomancy-frontend; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Déploiement terminé avec succès !"
echo "=========================================="
echo ""
echo "🌐 Application disponible sur :"
echo "   - Frontend: http://${VPS_HOST}:3000"
echo "   - Backend: http://${VPS_HOST}:8000"
echo ""
echo "📝 Logs disponibles avec :"
echo "   docker-compose -f docker-compose.prod.yml logs -f [service]"
echo ""
