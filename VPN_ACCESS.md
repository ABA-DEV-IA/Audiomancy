# Accès Rapide via VPN - Audiomancy

Guide de référence rapide pour accéder aux services Audiomancy sur le VPS OVH via WireGuard VPN.

## Connexion au VPN

### Configuration WireGuard

1. **Interface Web WireGuard** : `http://152.228.129.204:51821`
2. Téléchargez votre configuration client
3. Connectez-vous avec votre client WireGuard

### Réseau VPN

- **Réseau** : `10.8.0.0/24`
- **Gateway VPS** : `10.8.0.1`
- **Votre IP** : `10.8.0.2+` (attribuée automatiquement)

## Services Disponibles

Une fois connecté au VPN, accédez aux services via `10.8.0.1` :

### Frontend

```
http://10.8.0.1:3000
```

Interface utilisateur Next.js de l'application Audiomancy.

### Backend API

```
http://10.8.0.1:8000
```

API REST FastAPI avec les endpoints suivants :

- **Documentation interactive** : `http://10.8.0.1:8000/docs`
- **Schéma OpenAPI** : `http://10.8.0.1:8000/openapi.json`
- **Health check** : `http://10.8.0.1:8000/health`

### MongoDB

```
mongodb://10.8.0.1:27017
```

Base de données MongoDB (utilisée par le backend, accessible pour des outils comme MongoDB Compass).

## Conteneurs Docker

| Service | Conteneur | Port | Adresse VPN |
|---------|-----------|------|-------------|
| Frontend | `audiomancy-frontend` | 3000 | `10.8.0.1:3000` |
| Backend | `audiomancy-backend` | 8000 | `10.8.0.1:8000` |
| MongoDB | `audiomancy-mongodb` | 27017 | `10.8.0.1:27017` |

## Tests de Connectivité

```bash
# Ping le VPS
ping 10.8.0.1

# Tester le backend
curl http://10.8.0.1:8000/health

# Tester le frontend (obtenir le status HTTP)
curl -I http://10.8.0.1:3000

# Tester MongoDB
mongosh "mongodb://10.8.0.1:27017" --eval "db.adminCommand('ping')"
```

## Commandes SSH Utiles

Connectez-vous au VPS via SSH (depuis le VPN ou directement) :

```bash
ssh {username}@152.228.129.204
# ou via VPN
ssh {username}@10.8.0.1
```

### Gérer les Conteneurs

```bash
cd ~/audiomancy

# Voir le statut
docker-compose -f docker-compose.prod.yml ps

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend

# Redémarrer un service
docker-compose -f docker-compose.prod.yml restart backend

# Redémarrer tous les services
docker-compose -f docker-compose.prod.yml restart
```

### Mettre à Jour Manuellement

```bash
cd ~/audiomancy

# Télécharger les nouvelles images
docker-compose -f docker-compose.prod.yml pull

# Redémarrer avec les nouvelles images
docker-compose -f docker-compose.prod.yml up -d
```

## Sécurité

### Ports Accessibles depuis Internet

- **51820/udp** : WireGuard VPN (tunnel chiffré)
- **51821/tcp** : Interface Web WireGuard (protégée par mot de passe)

### Ports Protégés (Accessible UNIQUEMENT via VPN)

- **3000** : Frontend Next.js
- **8000** : Backend FastAPI
- **27017** : MongoDB

Le firewall bloque tous les accès directs depuis Internet. Vous **devez** être connecté au VPN pour accéder aux services.

## Troubleshooting

### Impossible de se connecter au VPN

1. Vérifiez que WireGuard est en cours d'exécution sur votre machine
2. Vérifiez votre configuration (fichier `.conf`)
3. Assurez-vous que le port UDP 51820 n'est pas bloqué par votre firewall local

### Impossible d'accéder aux services

1. Vérifiez que vous êtes bien connecté au VPN :
   ```bash
   ping 10.8.0.1
   ```

2. Vérifiez que les conteneurs sont en cours d'exécution :
   ```bash
   ssh {username}@10.8.0.1
   docker ps
   ```

3. Consultez les logs des conteneurs :
   ```bash
   docker-compose -f ~/audiomancy/docker-compose.prod.yml logs
   ```

### Les services ne répondent pas

```bash
# Redémarrer tous les services
cd ~/audiomancy
docker-compose -f docker-compose.prod.yml restart

# Ou redémarrer complètement
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## Architecture Réseau (Rappel)

```
Internet
   │
   ├─── Port 51820 (WireGuard) ──→ VPN Gateway (10.8.0.1)
   │                                     │
   │                                     ├─ Frontend :3000
   │                                     ├─ Backend :8000
   │                                     └─ MongoDB :27017
   │
   └─── Port 51821 (WireGuard UI) ──→ Interface Web
```

---

**Note** : Gardez ce fichier accessible pour une référence rapide lors de vos connexions au VPS.
