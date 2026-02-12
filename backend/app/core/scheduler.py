"""APScheduler for daily background tasks like category refresh."""

import logging
from datetime import datetime, timezone
from typing import Optional
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.events import (
    EVENT_JOB_EXECUTED,
    EVENT_JOB_ERROR,
    EVENT_JOB_MISSED,
    JobExecutionEvent
)
from app.core.config import settings

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def update_daily_categories(run_date: Optional[datetime] = None) -> None:
    """Refresh daily music categories via frontend API (runs at midnight UTC)."""
    now = datetime.now(timezone.utc)
    if run_date:
        delay = (now - run_date).total_seconds()
        if delay > 60:
            logger.warning(
                "Job running late — scheduled: %s, actual: %s (delay: %.0fs)",
                run_date, now, delay
            )

    frontend_url = settings.frontend_url or "http://localhost:3000"
    url = f"{frontend_url}/api/dailycategories"

    api_key = settings.api_key
    headers = {"x-api-key": api_key} if api_key else {}

    try:
        logger.info("Calling %s to update daily categories...", url)
        response = requests.get(url, headers=headers, timeout=30)

        if response.status_code == 200:
            logger.info("Daily categories updated: %s", response.json())
        else:
            logger.error("Category update failed — HTTP %d: %s", response.status_code, response.text)
    except requests.exceptions.Timeout:
        logger.error("Category update timed out (30s)")
    except requests.exceptions.RequestException as e:
        logger.error("Category update request failed: %s", str(e))
    except Exception as e:  # pylint: disable=broad-except
        logger.error("Unexpected error during category update: %s", str(e))


def job_listener(event: JobExecutionEvent) -> None:
    """Log scheduler job events."""
    if event.exception:
        logger.error("Job %s failed: %s", event.job_id, event.exception)
    elif event.code == EVENT_JOB_MISSED:
        logger.warning("Job %s was missed!", event.job_id)


def start_scheduler() -> None:
    """Start scheduler with daily category update job."""
    if scheduler.running:
        logger.warning("Scheduler already running")
        return

    scheduler.add_listener(
        job_listener,
        EVENT_JOB_EXECUTED | EVENT_JOB_ERROR | EVENT_JOB_MISSED
    )

    scheduler.add_job(
        update_daily_categories,
        trigger=CronTrigger(hour=0, minute=0),
        id='daily_categories_update',
        name='Update daily categories',
        replace_existing=True,
        misfire_grace_time=3600,
        coalesce=True,
        max_instances=1
    )

    scheduler.start()
    logger.info("APScheduler started with jobs:")
    for job in scheduler.get_jobs():
        logger.info("  - %s (ID: %s) — next run: %s", job.name, job.id, job.next_run_time)


def stop_scheduler() -> None:
    """Stop scheduler and wait for running jobs to complete."""
    if scheduler.running:
        scheduler.shutdown(wait=True)
        logger.info("APScheduler stopped")
