# 🐍 Guide d'Utilisation - Scripts Python

> **Scripts Python multi-plateforme pour gérer la stack Audiomancy**
> Compatible Windows, Linux et macOS

---

## 🎯 Pourquoi Python au lieu de Shell (.sh) ?

### ✅ Avantages de Python

| Problème Shell | Solution Python |
|----------------|-----------------|
| ❌ Problèmes de droits Windows/Linux | ✅ Fonctionne partout pareil |
| ❌ Incompatibilité Windows | ✅ Native sur Windows, Linux, macOS |
| ❌ Fins de ligne CRLF/LF | ✅ Python gère automatiquement |
| ❌ Syntaxe complexe | ✅ Code clair et lisible |
| ❌ Gestion d'erreurs limitée | ✅ Try/except robuste |
| ❌ Pas de portabilité Docker | ✅ Même code partout |

### 🎁 Bonus du Script Python

- ✅ **Messages colorés** (vert/rouge/bleu)
- ✅ **Vérifications automatiques** (Docker installé, fichiers présents)
- ✅ **Gestion d'erreurs propre**
- ✅ **Mode interactif** avec statut en temps réel
- ✅ **Commandes multiples** (start, stop, status, logs)

---

## 🚀 Installation et Prérequis

### 1. Python (déjà installé sur la plupart des systèmes)

**Vérifier la version :**
```bash
python --version
# ou
python3 --version
```

**Requis :** Python 3.7+

**Si non installé :**
- **Windows :** https://www.python.org/downloads/
- **Linux :** `sudo apt install python3` (Ubuntu/Debian)
- **macOS :** Préinstallé, ou via Homebrew `brew install python3`

### 2. Dépendances Python (optionnelles)

Pour les couleurs sur Windows < 10 :
```bash
pip install colorama
```

**Note :** Le script fonctionne sans dépendance, mais les couleurs seront désactivées.

---

## 📋 Utilisation du Script

### Commandes Principales

```bash
# Démarrer tout (application + monitoring)
python start_monitoring.py

# Démarrer uniquement l'application
python start_monitoring.py app

# Démarrer uniquement le monitoring
python start_monitoring.py monitoring

# Arrêter tout
python start_monitoring.py stop

# Voir le statut des services
python start_monitoring.py status

# Voir les logs en temps réel
python start_monitoring.py logs

# Afficher l'aide
python start_monitoring.py help
```

### Exemples Concrets

#### **Scénario 1 : Premier Démarrage**

```bash
# 1. Se placer dans le dossier
cd /mnt/Data/Dev/projet_python_ia_v1/Audiomancy

# 2. Démarrer tout
python start_monitoring.py

# Le script fait automatiquement :
# ✅ Vérifie Docker
# ✅ Vérifie les fichiers
# ✅ Crée .env depuis .env.monitoring
# ✅ Crée le réseau Docker
# ✅ Valide la configuration
# ✅ Démarre tous les services
# ✅ Affiche les URLs d'accès

# 3. Ouvrir Grafana
# http://localhost:19091 (admin/admin)
```

#### **Scénario 2 : Développement Backend Seul**

```bash
# Démarrer uniquement MongoDB + Backend + Frontend
python start_monitoring.py app

# Travailler sur le code...

# Arrêter
python start_monitoring.py stop
```

#### **Scénario 3 : Tests de Monitoring**

```bash
# Démarrer uniquement le monitoring
python start_monitoring.py monitoring

# Tester Prometheus, Grafana, etc.

# Voir les logs
python start_monitoring.py logs
```

#### **Scénario 4 : Debug**

```bash
# Démarrer tout
python start_monitoring.py

# Voir le statut en temps réel
python start_monitoring.py status

# Si problème, voir les logs
python start_monitoring.py logs

# Arrêter et redémarrer
python start_monitoring.py stop
python start_monitoring.py
```

---

## 🎨 Ce que Vous Verrez à l'Écran

### Démarrage Réussi

```
============================================================
🚀 Démarrage de la stack Audiomancy - Mode: ALL
============================================================

ℹ️  Vérification de Docker...
✅ Docker trouvé: Docker version 24.0.7
✅ Docker Compose trouvé: Docker Compose version v2.23.0

ℹ️  Vérification des fichiers de configuration...
✅ Trouvé: docker-compose.yml
✅ Trouvé: docker-compose.monitoring.yml

ℹ️  Vérification du fichier .env...
✅ Fichier .env trouvé

ℹ️  Vérification du réseau Docker...
✅ Réseau audiomancy_audiomancy-network existe déjà

ℹ️  Validation de la configuration Docker Compose...
✅ Configuration valide ✓

ℹ️  Démarrage des services...

[+] Running 12/12
 ✔ Container audiomancy-mongodb                    Started
 ✔ Container audiomancy-backend                    Started
 ✔ Container audiomancy-frontend                   Started
 ✔ Container audiomancy-monitoring-prometheus      Started
 ✔ Container audiomancy-monitoring-grafana         Started
 ✔ Container audiomancy-monitoring-loki            Started
 ✔ Container audiomancy-monitoring-promtail        Started
 ✔ Container audiomancy-monitoring-alertmanager    Started
 ✔ Container audiomancy-monitoring-pushgateway     Started
 ✔ Container audiomancy-monitoring-chaosd          Started
 ✔ Container audiomancy-monitoring-chaosd-ui       Started

✅ Services démarrés avec succès!

============================================================
🌐 Services disponibles
============================================================

📦 Application:
  • Frontend:     http://localhost:3000
  • Backend API:  http://localhost:8000
  • Backend Docs: http://localhost:8000/docs

📊 Monitoring:
  • Grafana:       http://localhost:19091  (admin/admin)
  • Prometheus:    http://localhost:19090
  • AlertManager:  http://localhost:19093
  • Loki:          http://localhost:19100
  • Chaosd UI:     http://localhost:19096

🔍 Commandes utiles:
  • Voir les logs:     python start_monitoring.py logs
  • Voir le statut:    python start_monitoring.py status
  • Arrêter tout:      python start_monitoring.py stop
```

### En Cas d'Erreur

```
============================================================
🚀 Démarrage de la stack Audiomancy - Mode: ALL
============================================================

ℹ️  Vérification de Docker...
❌ Docker ou Docker Compose n'est pas installé ou n'est pas dans le PATH
ℹ️  Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop
```

---

## 🔧 Compatibilité Windows

### Sur Windows, 3 façons d'exécuter :

#### **1. PowerShell / CMD (Recommandé)**

```powershell
# PowerShell ou CMD
python start_monitoring.py

# Ou spécifier python3
python3 start_monitoring.py
```

#### **2. Git Bash**

```bash
python start_monitoring.py
```

#### **3. WSL (Windows Subsystem for Linux)**

```bash
python3 start_monitoring.py
```

### Problème de Couleurs sur Windows ?

Si les couleurs ne s'affichent pas :

```bash
# Installer colorama
pip install colorama

# Ou utiliser sans couleurs (le script les désactive automatiquement)
```

---

## 🆚 Comparaison Shell vs Python

### **Script Shell (.sh)**

```bash
#!/bin/bash

# Vérifie Docker
if ! command -v docker &> /dev/null; then
    echo "Docker non trouvé"
    exit 1
fi

# Démarre les services
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

**Problèmes :**
- ❌ Ne fonctionne pas sur Windows natif
- ❌ Problèmes de fins de ligne (CRLF vs LF)
- ❌ Gestion d'erreurs basique
- ❌ Pas de vérifications avancées

### **Script Python (.py)**

```python
#!/usr/bin/env python3

import subprocess
import sys

def check_docker():
    try:
        subprocess.run(["docker", "--version"], check=True)
        return True
    except:
        print("❌ Docker non trouvé")
        return False

def start_services():
    cmd = ["docker", "compose", "-f", "docker-compose.yml",
           "-f", "docker-compose.monitoring.yml", "up", "-d"]
    subprocess.run(cmd, check=True)

if __name__ == "__main__":
    if check_docker():
        start_services()
    else:
        sys.exit(1)
```

**Avantages :**
- ✅ Fonctionne sur Windows, Linux, macOS
- ✅ Gestion d'erreurs robuste (try/except)
- ✅ Code lisible et maintenable
- ✅ Extensible facilement

---

## 🎯 Fonctionnalités Avancées du Script

### 1. Vérifications Automatiques

Le script vérifie automatiquement :
- ✅ Docker installé et fonctionnel
- ✅ Docker Compose disponible
- ✅ Fichiers de configuration présents
- ✅ Réseau Docker créé
- ✅ Configuration Docker Compose valide

### 2. Modes de Démarrage

```python
# Mode ALL (défaut) : Application + Monitoring
python start_monitoring.py

# Mode APP : Uniquement l'application
python start_monitoring.py app

# Mode MONITORING : Uniquement le monitoring
python start_monitoring.py monitoring
```

### 3. Gestion des Erreurs

```python
# Si Docker n'est pas installé
❌ Docker ou Docker Compose n'est pas installé
ℹ️  Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop

# Si fichiers manquants
❌ Fichiers manquants: docker-compose.yml

# Si configuration invalide
❌ Configuration invalide:
[détails de l'erreur]
```

### 4. Statut en Temps Réel

```bash
python start_monitoring.py status

# Affiche :
NAME                                  STATUS
audiomancy-backend                    Up 10 seconds
audiomancy-frontend                   Up 10 seconds
audiomancy-mongodb                    Up 10 seconds (healthy)
...
```

### 5. Logs Interactifs

```bash
python start_monitoring.py logs

# Affiche les logs en temps réel (Ctrl+C pour arrêter)
audiomancy-backend     | INFO: Started server process
audiomancy-frontend    | ready - started server on 0.0.0.0:3000
...
```

---

## 🛠️ Dépannage

### Problème : "Python n'est pas reconnu"

**Windows :**
```powershell
# Vérifier si Python est installé
py --version

# Si oui, utiliser 'py' au lieu de 'python'
py start_monitoring.py

# Ou ajouter Python au PATH
```

**Linux/macOS :**
```bash
# Utiliser python3
python3 start_monitoring.py

# Ou créer un alias
alias python=python3
```

### Problème : "Permission denied"

**Linux/macOS :**
```bash
# Rendre le script exécutable (optionnel)
chmod +x start_monitoring.py

# Puis exécuter directement
./start_monitoring.py
```

### Problème : "Docker not found"

```bash
# Vérifier que Docker est installé
docker --version

# Vérifier que Docker est démarré (Windows/macOS)
# Ouvrir Docker Desktop

# Linux : démarrer le service
sudo systemctl start docker
```

### Problème : Pas de couleurs

```bash
# Installer colorama
pip install colorama

# Ou ignorer (le script fonctionne sans)
```

---

## 📦 Intégration avec IDE

### VS Code

**1. Créer des tâches dans `.vscode/tasks.json` :**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Monitoring",
      "type": "shell",
      "command": "python start_monitoring.py",
      "problemMatcher": []
    },
    {
      "label": "Stop Monitoring",
      "type": "shell",
      "command": "python start_monitoring.py stop",
      "problemMatcher": []
    },
    {
      "label": "View Status",
      "type": "shell",
      "command": "python start_monitoring.py status",
      "problemMatcher": []
    }
  ]
}
```

**2. Utiliser avec `Ctrl+Shift+P` > "Run Task"**

### PyCharm

**1. Clic droit sur `start_monitoring.py` > Run**

**2. Ou configurer des "Run Configurations" pour chaque commande**

---

## 🎓 Personnalisation du Script

### Ajouter une Nouvelle Commande

```python
# Dans start_monitoring.py, ajouter dans main() :

elif command == "restart":
    manager.stop_services()
    time.sleep(2)
    success = manager.start_services("all")
    sys.exit(0 if success else 1)
```

### Changer les Couleurs

```python
# Dans la classe Colors :

class Colors:
    OKGREEN = '\033[92m'  # Vert
    # Changer en :
    OKGREEN = '\033[95m'  # Magenta
```

### Ajouter des Vérifications

```python
# Dans check_files() :

def check_files(self):
    # ... code existant ...

    # Ajouter une vérification
    if not (self.project_root / "monitoring").exists():
        self.print_error("Dossier monitoring/ manquant")
        return False
```

---

## ✅ Checklist d'Utilisation

### Premier Démarrage
- [ ] Python 3.7+ installé (`python --version`)
- [ ] Docker Desktop installé et démarré
- [ ] Se placer dans le dossier Audiomancy
- [ ] Exécuter `python start_monitoring.py`
- [ ] Ouvrir http://localhost:19091 (Grafana)

### Utilisation Quotidienne
- [ ] Démarrer : `python start_monitoring.py`
- [ ] Vérifier : `python start_monitoring.py status`
- [ ] Debug : `python start_monitoring.py logs`
- [ ] Arrêter : `python start_monitoring.py stop`

---

## 🆘 Support

**Problème avec le script Python ?**

1. Vérifier Python : `python --version`
2. Vérifier Docker : `docker --version`
3. Lire les messages d'erreur colorés
4. Consulter la section Dépannage ci-dessus

**Problème avec Docker ?**

1. Consulter [MONITORING_SETUP.md](MONITORING_SETUP.md#troubleshooting)
2. Vérifier les logs : `python start_monitoring.py logs`

---

## 🎉 Résumé

| Action | Commande Shell | Commande Python |
|--------|---------------|-----------------|
| Démarrer tout | `./start-monitoring.sh` | `python start_monitoring.py` |
| Démarrer app | `./start-monitoring.sh app` | `python start_monitoring.py app` |
| Arrêter | N/A | `python start_monitoring.py stop` |
| Statut | N/A | `python start_monitoring.py status` |
| Logs | N/A | `python start_monitoring.py logs` |

**🐍 Python = Plus de fonctionnalités + Meilleure compatibilité Windows !**

---

**Version :** 1.0
**Compatibilité :** Windows 10+, Linux, macOS
**Python requis :** 3.7+
**Dépendances :** Aucune (colorama optionnel)
