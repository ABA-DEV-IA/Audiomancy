"""
Gestionnaires d'erreurs globaux pour l'application FastAPI.

Fournit des réponses d'erreur structurées et lisibles pour le frontend,
en remplaçant les messages techniques par défaut de Pydantic / FastAPI.
"""

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Transforme les erreurs de validation Pydantic (422) en messages utilisateur.

    Examine le premier champ en erreur et retourne un message localisé
    (email invalide, mot de passe invalide, etc.) au lieu du détail brut.

    Args:
        request: Requête FastAPI ayant déclenché l'erreur.
        exc: Exception de validation contenant la liste des erreurs.

    Returns:
        JSONResponse avec status 422 et un champ ``detail`` lisible.
    """
    errors = exc.errors()
    first_error = errors[0] if errors else None

    if first_error and "email" in first_error["loc"]:
        message = "L'adresse email n'est pas valide."
    elif first_error and "password" in first_error["loc"]:
        message = "Le mot de passe est invalide."
    else:
        message = first_error["msg"] if first_error else "Erreur de validation."

    return JSONResponse(
        status_code=422,
        content={"detail": message}
    )
