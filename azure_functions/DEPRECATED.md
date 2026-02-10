# ⚠️ DEPRECATED - Azure Functions

**Status:** `azure_only_no_longer_usable_in_localhost`

## Raison de la désactivation

Ce dossier contient du code Azure Functions qui n'est **plus utilisable en environnement localhost**.

Le projet Audiomancy a migré vers une architecture 100% locale basée sur :
- Docker Compose
- MongoDB local (au lieu de Cosmos DB)
- FastAPI backend (au lieu d'Azure Functions)

## Fichiers concernés

- `function_app.py` - Azure Functions HTTP triggers
- `requirements.txt` - Dépendances Azure (azure-functions, etc.)
- `host.json` - Configuration Azure Functions runtime
- `.vscode/extensions.json` - Extensions VSCode pour Azure

## Migration

Toutes les fonctionnalités ont été migrées vers le backend FastAPI dans `backend/app/`.

**Ce dossier peut être supprimé si vous n'avez pas besoin de déploiement Azure.**

---

*Dernière mise à jour : 2026-02-09*
