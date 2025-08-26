import azure.functions as func
import datetime
import json
import logging
import requests
import os

app = func.FunctionApp()

# "*/5 * * * * *" pour tester toutes les 5 secondes / "0 0 0 * * *" pour tous les jours à minuit
@app.timer_trigger(schedule="0 0 0 * * *", arg_name="myTimer", run_on_startup=False,
              use_monitor=False) 
def RandomPlaylist(myTimer: func.TimerRequest) -> None:
    
    if myTimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function executed.')

    url = "https://audiomancy.azurewebsites.net/api/dailycategories"

    #lien test local
    #url = "http://localhost:3000/api/dailycategories"

    secret = os.getenv("CRON_SECRET_KEY")
    headers = {"x-api-key": secret} if secret else {}


    try:
        response = requests.get(url)
        if response.status_code == 200:
            logging.info("Mise à jour réussie : %s", response.json())
        else:
            logging.error("Erreur %s : %s", response.status_code, response.text)
    except Exception as e:
        logging.error("Erreur lors de l’appel à la route: %s", str(e))