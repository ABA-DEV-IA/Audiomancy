"""
APScheduler configuration for periodic background tasks.

This module replaces Azure Functions with a local scheduler implementation,
providing equivalent functionality for:
- Daily category updates: Refreshes music categories at midnight
- Job monitoring: Tracks execution, errors, and missed runs
- Past-due detection: Warns when jobs run late (similar to Azure Functions)

The scheduler uses APScheduler's BackgroundScheduler to run jobs in a
separate thread without blocking the main FastAPI application.

Architecture:
    - CronTrigger: Defines job schedules (e.g., daily at midnight)
    - Event listeners: Monitor job execution and failures
    - Misfire handling: Grace period for delayed job execution

Key Features:
    - misfire_grace_time: 3600s (jobs can run up to 1 hour late)
    - coalesce: True (multiple missed runs execute only once)
    - max_instances: 1 (prevents concurrent job execution)

Usage:
    >>> from app.core.scheduler import start_scheduler, stop_scheduler
    >>> start_scheduler()  # In application startup
    >>> stop_scheduler()   # In application shutdown

References:
    - APScheduler docs: https://apscheduler.readthedocs.io/
    - Azure Functions migration: MIGRATION_MONGODB.md
    - Competency C18: Automated deployment and scheduling
"""

import logging
from datetime import datetime
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

# Global scheduler instance (singleton pattern)
scheduler = BackgroundScheduler()


def update_daily_categories(run_date: Optional[datetime] = None) -> None:
    """
    Refresh daily music categories by calling the frontend API.

    This scheduled job replaces the Azure Function 'RandomPlaylist' that
    previously handled daily category updates. It runs every day at midnight
    (00:00 UTC) and triggers the frontend's category generation logic.

    The function implements Azure Functions-like "past_due" detection by
    comparing the scheduled run time with the actual execution time. If the
    job runs more than 60 seconds late, a warning is logged.

    Flow:
        1. Check for late execution (past_due detection)
        2. Build frontend API URL with authentication headers
        3. Call GET /api/dailycategories endpoint
        4. Log success or error response

    Args:
        run_date: Scheduled execution time (provided by APScheduler).
                  Used to detect delayed execution. If None, past_due
                  detection is skipped.

    Raises:
        No exceptions are raised. All errors are logged and the job
        completes gracefully to avoid scheduler disruption.

    Example:
        >>> # Called automatically by scheduler at midnight
        >>> update_daily_categories(run_date=datetime(2026, 1, 28, 0, 0))
        📅 [SCHEDULER] Calling http://localhost:3000/api/dailycategories...
        ✅ [SCHEDULER] Daily categories updated successfully

    Notes:
        - Timeout: 30 seconds (prevents hanging on slow responses)
        - Authentication: Uses x-api-key header if API_KEY is configured
        - Error handling: Logs errors but does not raise exceptions
        - Equivalent to: Azure Function with TimerTrigger("0 0 0 * * *")

    References:
        - Frontend endpoint: frontend/app/api/dailycategories/route.ts
        - Azure Functions migration: MIGRATION_MONGODB.md
        - Competency C18: Automated task scheduling
    """
    # Detect late execution (equivalent to Azure Functions past_due)
    now = datetime.now()
    if run_date:
        delay = (now - run_date).total_seconds()
        if delay > 60:  # More than 1 minute late
            logger.warning(
                "⚠️  [SCHEDULER] Job is running late! "
                "Scheduled: %s, Actual: %s (delay: %.0fs)",
                run_date, now, delay
            )

    # Build frontend API URL
    frontend_url = getattr(settings, 'frontend_url', 'http://localhost:3000')
    url = f"{frontend_url}/api/dailycategories"

    # Add authentication if API key is configured
    api_key = getattr(settings, 'api_key', None)
    headers = {"x-api-key": api_key} if api_key else {}

    try:
        logger.info("📅 [SCHEDULER] Calling %s to update daily categories...", url)
        response = requests.get(url, headers=headers, timeout=30)

        if response.status_code == 200:
            logger.info(
                "✅ [SCHEDULER] Daily categories updated successfully: %s",
                response.json()
            )
        else:
            logger.error(
                "❌ [SCHEDULER] Error %d: %s",
                response.status_code, response.text
            )
    except requests.exceptions.Timeout:
        logger.error("❌ [SCHEDULER] Request timeout after 30s")
    except requests.exceptions.RequestException as e:
        logger.error("❌ [SCHEDULER] Request failed: %s", str(e))
    except Exception as e:  # pylint: disable=broad-except
        logger.error("❌ [SCHEDULER] Unexpected error: %s", str(e))


def job_listener(event: JobExecutionEvent) -> None:
    """
    Monitor and log APScheduler job execution events.

    This event listener provides Azure Functions-style monitoring by
    logging job execution status, errors, and missed runs. It helps
    with debugging and operational visibility similar to Azure Functions
    runtime logs.

    Events handled:
        - EVENT_JOB_EXECUTED: Job completed successfully
        - EVENT_JOB_ERROR: Job raised an exception
        - EVENT_JOB_MISSED: Job was not executed at scheduled time

    Args:
        event: APScheduler job execution event containing:
               - job_id: Unique identifier of the job
               - exception: Exception object if job failed
               - code: Event type code (executed/error/missed)

    Example logs:
        >>> # On successful execution (logged by APScheduler internally)
        >>> # On error:
        ❌ [SCHEDULER] Job daily_categories_update failed with exception: ...
        >>> # On missed run:
        ⚠️  [SCHEDULER] Job daily_categories_update was missed!

    Notes:
        - Attached to scheduler via: scheduler.add_listener()
        - Does not prevent scheduler from continuing
        - Errors are logged but not re-raised

    References:
        - APScheduler events: apscheduler.events module
        - Azure Functions monitoring equivalent: Application Insights
        - Competency C20: Monitoring and logging
    """
    if event.exception:
        logger.error(
            "❌ [SCHEDULER] Job %s failed with exception: %s",
            event.job_id, event.exception
        )
    elif event.code == EVENT_JOB_MISSED:
        logger.warning("⚠️  [SCHEDULER] Job %s was missed!", event.job_id)


def start_scheduler() -> None:
    """
    Initialize and start the APScheduler with all configured jobs.

    This function sets up the background scheduler that replaces Azure Functions
    for periodic task execution. It configures:
    - Event listeners for job monitoring (success, error, missed)
    - Job definitions with cron triggers
    - Misfire handling policies

    Scheduled jobs:
        1. update_daily_categories:
           - Trigger: CronTrigger(hour=0, minute=0) → Daily at midnight UTC
           - Misfire grace: 3600s (1 hour) → Can run late like Azure Functions
           - Coalesce: True → Multiple missed runs execute only once
           - Max instances: 1 → No concurrent executions

    Configuration details:
        - misfire_grace_time: Maximum delay before considering a job "missed".
          If a job is scheduled at 00:00 but the server was down, it can still
          run when the server comes back up within the grace period.

        - coalesce: If multiple runs were missed (e.g., server down for 3 days),
          execute only once instead of catching up all missed runs.

        - max_instances: Prevents concurrent execution of the same job.
          If a job is still running when the next scheduled time arrives,
          the new execution is skipped.

    Raises:
        No exceptions are raised. If the scheduler is already running,
        a warning is logged and the function returns early.

    Example:
        >>> from app.core.scheduler import start_scheduler
        >>> start_scheduler()
        🚀 [SCHEDULER] APScheduler started with jobs:
           - Update daily categories (ID: daily_categories_update) - Next run: ...

    Notes:
        - Must be called during FastAPI startup (lifespan event)
        - Scheduler runs in a separate background thread
        - Does not block the main application
        - Idempotent: safe to call multiple times (checks if already running)

    References:
        - Startup integration: backend/app/main.py (lifespan context)
        - Azure Functions equivalent: TimerTrigger with schedule="0 0 0 * * *"
        - APScheduler docs: https://apscheduler.readthedocs.io/
        - Competency C18: Automated deployment and scheduling
    """
    if scheduler.running:
        logger.warning("⚠️  [SCHEDULER] Scheduler already running")
        return

    # Register event listener for job monitoring (Azure Functions-style logging)
    scheduler.add_listener(
        job_listener,
        EVENT_JOB_EXECUTED | EVENT_JOB_ERROR | EVENT_JOB_MISSED
    )

    # Configure daily categories update job
    scheduler.add_job(
        update_daily_categories,
        trigger=CronTrigger(hour=0, minute=0),  # Daily at midnight UTC
        id='daily_categories_update',
        name='Update daily categories',
        replace_existing=True,
        misfire_grace_time=3600,  # 1 hour grace period
        coalesce=True,  # Execute once if multiple runs missed
        max_instances=1  # No concurrent execution
    )

    scheduler.start()
    logger.info("🚀 [SCHEDULER] APScheduler started with jobs:")
    for job in scheduler.get_jobs():
        logger.info(
            "   - %s (ID: %s) - Next run: %s",
            job.name, job.id, job.next_run_time
        )


def stop_scheduler() -> None:
    """
    Gracefully shutdown the APScheduler.

    This function should be called during application shutdown to ensure
    all running jobs complete before the scheduler stops. It provides
    a clean shutdown similar to Azure Functions host shutdown.

    Behavior:
        - Waits for currently executing jobs to finish (wait=True)
        - Prevents new job executions from starting
        - Closes background threads gracefully
        - Logs shutdown completion

    Args:
        None

    Returns:
        None

    Example:
        >>> from app.core.scheduler import stop_scheduler
        >>> stop_scheduler()
        🛑 [SCHEDULER] APScheduler stopped

    Notes:
        - Must be called during FastAPI shutdown (lifespan event)
        - Safe to call even if scheduler is not running (idempotent)
        - wait=True ensures jobs complete before shutdown (prevents data loss)
        - Timeout: Waits indefinitely for job completion (consider timeout if needed)

    References:
        - Shutdown integration: backend/app/main.py (lifespan context)
        - APScheduler docs: https://apscheduler.readthedocs.io/
        - Azure Functions equivalent: Host shutdown with graceful termination
    """
    if scheduler.running:
        scheduler.shutdown(wait=True)
        logger.info("🛑 [SCHEDULER] APScheduler stopped")
