# 🚀 Démarrage Ultra-Rapide - Script Python

> **30 secondes pour tout démarrer, compatible Windows/Linux/macOS**

---

## ⚡ 3 Étapes Seulement

### 1️⃣ Vérifier Python (déjà installé normalement)

```bash
python --version
# Ou : python3 --version

# Doit afficher : Python 3.7+
```

**Si pas installé :** https://www.python.org/downloads/

---

### 2️⃣ Démarrer la Stack

```bash
# Se placer dans le dossier
cd /mnt/Data/Dev/projet_python_ia_v1/Audiomancy

# Lancer le script Python
python start_monitoring.py
```

**C'est tout ! ✅**

Le script fait automatiquement :
- ✅ Crée le fichier `.env`
- ✅ Vérifie Docker
- ✅ Crée le réseau
- ✅ Démarre tous les services
- ✅ Affiche les URLs

---

### 3️⃣ Accéder aux Services

| Service | URL | Login |
|---------|-----|-------|
| 🎨 **Grafana** | http://localhost:19091 | admin / admin |
| 📈 **Prometheus** | http://localhost:19090 | - |
| 🎵 **Frontend** | http://localhost:3000 | - |
| 🔧 **Backend** | http://localhost:8000 | - |

---

## 💡 Commandes Utiles

```bash
# Démarrer tout
python start_monitoring.py

# Voir le statut
python start_monitoring.py status

# Voir les logs
python start_monitoring.py logs

# Arrêter tout
python start_monitoring.py stop

# Aide
python start_monitoring.py help
```

---

## 🆚 Pourquoi Python au lieu de Shell ?

| Shell (.sh) | Python (.py) |
|-------------|--------------|
| ❌ Ne fonctionne pas sur Windows | ✅ Fonctionne partout |
| ❌ Problèmes CRLF/LF | ✅ Aucun problème |
| ❌ Besoin de `chmod +x` | ✅ Pas besoin |
| ⚠️ Gestion d'erreurs basique | ✅ Gestion robuste |

**Résultat :** Python = 0 prise de tête ! 🎉

---

## 🔧 Sur Windows

### PowerShell / CMD (Recommandé)

```powershell
python start_monitoring.py
```

### Git Bash

```bash
python start_monitoring.py
```

### WSL

```bash
python3 start_monitoring.py
```

**Tous fonctionnent ! ✅**

---

## 🆘 Dépannage Express

### "python n'est pas reconnu"

**Windows :**
```powershell
# Essayer :
py start_monitoring.py

# Ou installer Python :
# https://www.python.org/downloads/
```

**Linux :**
```bash
# Essayer :
python3 start_monitoring.py

# Ou installer :
sudo apt install python3
```

### "Docker not found"

```bash
# Vérifier que Docker Desktop est démarré
docker --version

# Si pas installé :
# https://www.docker.com/products/docker-desktop
```

### Pas de couleurs sur Windows

```bash
# Installer colorama (optionnel)
pip install colorama

# Ou ignorer (le script fonctionne sans)
```

---

## 📚 Documentation Complète

- 🐍 **Guide Python** : [GUIDE_PYTHON.md](GUIDE_PYTHON.md)
- 🆚 **Shell vs Python** : [SHELL_VS_PYTHON.md](SHELL_VS_PYTHON.md)
- 📊 **Guide Monitoring** : [MONITORING_SETUP.md](MONITORING_SETUP.md)
- 🏗️ **Architecture** : [ARCHITECTURE.md](ARCHITECTURE.md)

---

## ✅ Checklist

- [ ] Python 3.7+ installé
- [ ] Docker Desktop installé et démarré
- [ ] Se placer dans le dossier Audiomancy
- [ ] Exécuter `python start_monitoring.py`
- [ ] Ouvrir http://localhost:19091

**Temps total : 30 secondes** ⏱️

---

## 🎉 C'est Prêt !

Vous avez maintenant :
- ✅ Application Audiomancy fonctionnelle
- ✅ Stack de monitoring complète (Prometheus, Grafana, Loki)
- ✅ Chaos engineering (Chaosd)
- ✅ Alertes configurées
- ✅ Dashboards pré-configurés

**Profitez ! 🚀**

---

**Besoin d'aide ?** Voir [GUIDE_PYTHON.md](GUIDE_PYTHON.md) pour plus de détails.
