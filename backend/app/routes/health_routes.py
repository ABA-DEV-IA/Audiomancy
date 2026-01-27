"""
Health check and system status routes.
"""

from fastapi import APIRouter
from app.core.scheduler import scheduler

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy", "service": "audiomancy-backend"}


@router.get("/scheduler")
def scheduler_status():
    """Check APScheduler status"""
    if not scheduler.running:
        return {
            "status": "inactive",
            "message": "Scheduler is not running"
        }

    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": str(job.next_run_time) if job.next_run_time else None,
        })

    return {
        "status": "active",
        "jobs": jobs
    }
