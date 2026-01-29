# Guide de Déploiement - Audiomancy

Ce guide explique comment déployer automatiquement Audiomancy sur DockerHub et votre VPS OVH via GitHub Actions.

## Architecture

- **Backend FastAPI** : Image Docker pushée sur DockerHub
- **Frontend Next.js** : Image Docker pushée sur DockerHub
- **MongoDB** : Image officielle MongoDB 7.0
- **VPS OVH** : Serveur de production avec WireGuard VPN

## Prérequis

### 1. Secrets GitHub Actions

Assurez-vous d'avoir configuré ces secrets dans votre repository GitHub (`Settings > Secrets and variables > Actions`) :

- `DOCKERHUB_USERNAME` : Votre nom d'utilisateur DockerHub
- `DOCKERHUB_PASSWORD` : Votre token d'accès DockerHub
- `VPS_HOST` : L'adresse IP de votre VPS (ex: 152.228.129.204)
- `VPS_PORT` : Le port SSH de votre VPS (généralement 22)
- `VPS_USERNAME` : Votre nom d'utilisateur SSH sur le VPS
- `VPS_SSH_KEY` : Votre clé privée SSH pour se connecter au VPS
- `WG_PASSWORD` : Mot de passe WireGuard (pour référence)

### 2. Configuration du VPS

Sur votre VPS OVH, assurez-vous que :

1. **Docker et Docker Compose sont installés** :
   ```bash
   # Installer Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Installer Docker Compose
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   ```

2. **Le répertoire de déploiement existe** :
   ```bash
   mkdir -p ~/audiomancy
   ```

3. **L'utilisateur peut exécuter Docker sans sudo** :
   ```bash
   sudo usermod -aG docker $USER
   # Déconnectez-vous et reconnectez-vous pour appliquer les changements
   ```

## Workflow de Déploiement

### Déclenchement automatique

Le workflow `.github/workflows/deploy-to-dockerhub-and-vps.yml` se déclenche automatiquement quand :

1. Vous poussez du code sur la branche `main` ou `dev`
2. Les fichiers modifiés concernent :
   - Le dossier `backend/`
   - Le dossier `frontend/`
   - Le fichier `docker-compose.prod.yml`
   - Le workflow lui-même

### Déclenchement manuel

Vous pouvez aussi déclencher le déploiement manuellement :

1. Allez dans l'onglet "Actions" de votre repository GitHub
2. Sélectionnez "Build, Push to DockerHub and Deploy to VPS"
3. Cliquez sur "Run workflow"

## Processus de Déploiement

### Étape 1 : Build et Push sur DockerHub

1. **Build des images** :
   - Backend : `{username}/audiomancy-backend:latest`
   - Frontend : `{username}/audiomancy-frontend:latest`

2. **Push sur DockerHub** :
   - Les images sont taguées avec `:latest` et `:commit-sha`
   - Utilisation du cache GitHub Actions pour accélérer les builds

### Étape 2 : Déploiement sur le VPS

1. **Copie des fichiers** :
   - `docker-compose.prod.yml` → Configuration de production
   - `deploy.sh` → Script de déploiement

2. **Exécution du déploiement** :
   - Arrêt des conteneurs existants
   - Téléchargement des nouvelles images depuis DockerHub
   - Démarrage des nouveaux conteneurs
   - Vérification de la santé des services

## Fichiers Importants

### `docker-compose.prod.yml`

Configuration Docker Compose pour la production sur le VPS :

- Utilise les images DockerHub au lieu de builder localement
- Configure les variables d'environnement de production
- Utilise des volumes persistants pour MongoDB

### `deploy.sh`

Script bash exécuté sur le VPS qui :

1. Se connecte à DockerHub
2. Arrête les anciens conteneurs
3. Télécharge les nouvelles images
4. Démarre les nouveaux conteneurs
5. Vérifie que tout fonctionne

## Services Déployés

### Backend (Port 8000)

- Image : `{username}/audiomancy-backend:latest`
- API FastAPI
- Connexion à MongoDB
- Health checks automatiques

### Frontend (Port 3000)

- Image : `{username}/audiomancy-frontend:latest`
- Next.js en mode production
- Port interne 8080 mappé sur 3000

### MongoDB (Port 27017)

- Image officielle MongoDB 7.0
- Volumes persistants pour les données
- Health checks automatiques

## Vérification du Déploiement

### Sur GitHub Actions

1. Allez dans l'onglet "Actions"
2. Vérifiez que le workflow s'est terminé avec succès (✅)
3. Consultez les logs pour voir les détails

### Sur le VPS

Connectez-vous à votre VPS via SSH :

```bash
ssh -p {VPS_PORT} {VPS_USERNAME}@{VPS_HOST}
cd ~/audiomancy

# Voir le statut des conteneurs
docker-compose -f docker-compose.prod.yml ps

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f mongodb
```

### Accéder à l'application

- **Frontend** : http://{VPS_HOST}:3000
- **Backend API** : http://{VPS_HOST}:8000
- **Backend Docs** : http://{VPS_HOST}:8000/docs

## Commandes Utiles

### Sur le VPS

```bash
# Redémarrer tous les services
cd ~/audiomancy
docker-compose -f docker-compose.prod.yml restart

# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart backend

# Arrêter tous les services
docker-compose -f docker-compose.prod.yml down

# Démarrer tous les services
docker-compose -f docker-compose.prod.yml up -d

# Mettre à jour manuellement les images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Voir l'utilisation des ressources
docker stats
```

### Nettoyage

```bash
# Supprimer les images non utilisées
docker image prune -a

# Supprimer les volumes non utilisés (ATTENTION : supprime les données)
docker volume prune

# Nettoyage complet (ATTENTION)
docker system prune -a --volumes
```

## Dépannage

### Les images ne se mettent pas à jour

```bash
# Sur le VPS, forcer le téléchargement
cd ~/audiomancy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Erreur de connexion MongoDB

```bash
# Vérifier les logs MongoDB
docker-compose -f docker-compose.prod.yml logs mongodb

# Vérifier la santé du conteneur
docker inspect audiomancy-mongodb | grep -A 10 Health
```

### Port déjà utilisé

```bash
# Voir les ports utilisés
sudo netstat -tulpn | grep LISTEN

# Arrêter le processus sur le port
sudo kill -9 {PID}
```

## Rollback

En cas de problème avec une nouvelle version :

1. **Via GitHub Actions** :
   - Revertez le commit problématique
   - Poussez sur `main` ou `dev`
   - Le workflow redéploiera automatiquement

2. **Manuellement sur le VPS** :
   ```bash
   cd ~/audiomancy

   # Utiliser une version spécifique (remplacer {sha} par le commit)
   export BACKEND_TAG={sha}
   export FRONTEND_TAG={sha}

   # Modifier temporairement docker-compose.prod.yml
   # Ou utiliser docker run avec l'ancienne image
   ```

## Sécurité

### Bonnes Pratiques

1. **Ne commitez jamais** :
   - Les clés SSH
   - Les mots de passe
   - Les tokens d'accès
   - Les fichiers `.env`

2. **Utilisez toujours GitHub Secrets** pour les informations sensibles

3. **Firewall sur le VPS** :
   ```bash
   # Autoriser uniquement les ports nécessaires
   sudo ufw allow 22/tcp      # SSH
   sudo ufw allow 3000/tcp    # Frontend
   sudo ufw allow 8000/tcp    # Backend
   sudo ufw allow 51820/udp   # WireGuard
   sudo ufw enable
   ```

4. **Rotation des secrets** :
   - Changez régulièrement vos tokens DockerHub
   - Utilisez des clés SSH différentes par environnement

## Monitoring

Pour monitorer votre application en production, vous pouvez :

1. **Installer Portainer** (interface web pour Docker) :
   ```bash
   docker volume create portainer_data
   docker run -d -p 9000:9000 --name portainer --restart always \
     -v /var/run/docker.sock:/var/run/docker.sock \
     -v portainer_data:/data \
     portainer/portainer-ce:latest
   ```

2. **Utiliser les logs Docker** :
   ```bash
   # Suivre les logs en temps réel
   docker-compose -f docker-compose.prod.yml logs -f --tail=100
   ```

## Support

En cas de problème :

1. Consultez les logs GitHub Actions
2. Vérifiez les logs Docker sur le VPS
3. Assurez-vous que tous les secrets sont correctement configurés
4. Vérifiez que le VPS a assez d'espace disque et de mémoire

---

**Note** : Ce guide suppose que vous utilisez la configuration standard. Adaptez selon vos besoins spécifiques.
