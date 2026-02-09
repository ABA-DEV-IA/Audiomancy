#!/usr/bin/env python3
"""
Audiomancy Monitoring Stack Startup Script
Cross-platform compatible (Windows, Linux, macOS)

Usage:
    python start_monitoring.py              # Start everything (app + monitoring)
    python start_monitoring.py app          # Start application only
    python start_monitoring.py monitoring   # Start monitoring only
    python start_monitoring.py stop         # Stop all services
    python start_monitoring.py status       # Show services status
    python start_monitoring.py logs         # Show logs

Version: 1.0
Date: 2025-02-09
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path
from typing import List, Optional, Tuple


class Colors:
    """ANSI color codes for terminal output (Windows 10+ compatible)"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

    @staticmethod
    def disable():
        """Disable colors (for Windows < 10 or output redirection)"""
        Colors.HEADER = ''
        Colors.OKBLUE = ''
        Colors.OKCYAN = ''
        Colors.OKGREEN = ''
        Colors.WARNING = ''
        Colors.FAIL = ''
        Colors.ENDC = ''
        Colors.BOLD = ''
        Colors.UNDERLINE = ''


# Disable colors on Windows if not supported
if os.name == 'nt' and not os.environ.get('ANSICON'):
    try:
        import colorama
        colorama.init()
    except ImportError:
        Colors.disable()


class MonitoringManager:
    """Manager for Audiomancy application and monitoring stack"""

    def __init__(self):
        self.project_root = Path(__file__).parent.resolve()
        self.docker_compose_app = self.project_root / "docker-compose.yml"
        self.docker_compose_monitoring = self.project_root / "docker-compose.monitoring.yml"
        self.env_file = self.project_root / ".env"
        self.env_monitoring_file = self.project_root / ".env.monitoring"

    def print_header(self, text: str):
        """Print a colored header"""
        print(f"\n{Colors.BOLD}{Colors.OKBLUE}{'=' * 60}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.OKBLUE}{text}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.OKBLUE}{'=' * 60}{Colors.ENDC}\n")

    def print_success(self, text: str):
        """Print a success message"""
        print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")

    def print_info(self, text: str):
        """Print an information message"""
        print(f"{Colors.OKCYAN}ℹ️  {text}{Colors.ENDC}")

    def print_warning(self, text: str):
        """Print a warning message"""
        print(f"{Colors.WARNING}⚠️  {text}{Colors.ENDC}")

    def print_error(self, text: str):
        """Print an error message"""
        print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")

    def check_docker(self) -> bool:
        """Check if Docker is installed and functional"""
        self.print_info("Vérification de Docker...")

        try:
            result = subprocess.run(
                ["docker", "--version"],
                capture_output=True,
                text=True,
                check=True
            )
            self.print_success(f"Docker trouvé: {result.stdout.strip()}")

            # Vérifier Docker Compose
            result = subprocess.run(
                ["docker", "compose", "version"],
                capture_output=True,
                text=True,
                check=True
            )
            self.print_success(f"Docker Compose trouvé: {result.stdout.strip()}")
            return True

        except subprocess.CalledProcessError:
            self.print_error("Docker ou Docker Compose n'est pas installé ou n'est pas dans le PATH")
            self.print_info("Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop")
            return False
        except FileNotFoundError:
            self.print_error("Docker n'est pas trouvé. Est-il installé ?")
            return False

    def check_files(self) -> bool:
        """Check if required files exist"""
        self.print_info("Vérification des fichiers de configuration...")

        missing_files = []

        if not self.docker_compose_app.exists():
            missing_files.append(str(self.docker_compose_app))
        else:
            self.print_success(f"Trouvé: {self.docker_compose_app.name}")

        if not self.docker_compose_monitoring.exists():
            missing_files.append(str(self.docker_compose_monitoring))
        else:
            self.print_success(f"Trouvé: {self.docker_compose_monitoring.name}")

        if missing_files:
            self.print_error(f"Fichiers manquants: {', '.join(missing_files)}")
            return False

        return True

    def setup_env(self) -> bool:
        """Setup .env file if needed"""
        self.print_info("Vérification du fichier .env...")

        if not self.env_file.exists():
            if self.env_monitoring_file.exists():
                self.print_info("Copie de .env.monitoring vers .env...")
                shutil.copy(self.env_monitoring_file, self.env_file)
                self.print_success("Fichier .env créé depuis .env.monitoring")
            else:
                self.print_warning("Aucun fichier .env trouvé. Les valeurs par défaut seront utilisées.")
        else:
            self.print_success("Fichier .env trouvé")

        return True

    def create_network(self) -> bool:
        """Create Docker network if needed"""
        self.print_info("Vérification du réseau Docker...")

        network_name = "audiomancy_audiomancy-network"

        # Check if network exists
        try:
            result = subprocess.run(
                ["docker", "network", "inspect", network_name],
                capture_output=True,
                text=True,
                check=False
            )

            if result.returncode == 0:
                self.print_success(f"Network {network_name} already exists")
                return True
            else:
                # Create network
                self.print_info(f"Creating network {network_name}...")
                subprocess.run(
                    ["docker", "network", "create", network_name],
                    capture_output=True,
                    check=True
                )
                self.print_success(f"Network {network_name} created")
                return True

        except subprocess.CalledProcessError as e:
            self.print_error(f"Error creating network: {e}")
            return False

    def validate_config(self, compose_files: List[str]) -> bool:
        """Validate Docker Compose configuration"""
        self.print_info("Validation de la configuration Docker Compose...")

        try:
            cmd = ["docker", "compose"]
            for file in compose_files:
                cmd.extend(["-f", file])
            cmd.append("config")

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
                cwd=self.project_root
            )
            self.print_success("Configuration valid ✓")
            return True

        except subprocess.CalledProcessError as e:
            self.print_error("Invalid configuration:")
            print(e.stderr)
            return False

    def run_docker_compose(self, compose_files: List[str], command: List[str]) -> Tuple[bool, str]:
        """Execute a docker compose command"""
        cmd = ["docker", "compose"]
        for file in compose_files:
            cmd.extend(["-f", file])
        cmd.extend(command)

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
                cwd=self.project_root
            )
            return True, result.stdout

        except subprocess.CalledProcessError as e:
            return False, e.stderr

    def start_services(self, mode: str = "all"):
        """Start services according to mode"""
        self.print_header(f"🚀 Starting Audiomancy Stack - Mode: {mode.upper()}")

        # Pre-flight checks
        if not self.check_docker():
            return False

        if not self.check_files():
            return False

        if not self.setup_env():
            return False

        if not self.create_network():
            return False

        # Determine which files to use
        compose_files = []
        if mode in ["all", "app"]:
            compose_files.append(str(self.docker_compose_app))
        if mode in ["all", "monitoring"]:
            compose_files.append(str(self.docker_compose_monitoring))

        # Validate configuration
        if not self.validate_config(compose_files):
            return False

        # Start services
        print()
        self.print_info("Démarrage des services...")
        print()

        success, output = self.run_docker_compose(compose_files, ["up", "-d"])

        if success:
            print(output)
            self.print_success("Services started successfully!")
            self.show_services_info(mode)
            return True
        else:
            self.print_error("Error during startup:")
            print(output)
            return False

    def stop_services(self):
        """Stop all services"""
        self.print_header("🛑 Stopping Audiomancy Stack")

        compose_files = [
            str(self.docker_compose_app),
            str(self.docker_compose_monitoring)
        ]

        self.print_info("Arrêt des services...")
        success, output = self.run_docker_compose(compose_files, ["down"])

        if success:
            print(output)
            self.print_success("Services stopped successfully!")
            return True
        else:
            self.print_error("Error during shutdown:")
            print(output)
            return False

    def show_status(self):
        """Show services status"""
        self.print_header("📊 Audiomancy Stack Status")

        compose_files = [
            str(self.docker_compose_app),
            str(self.docker_compose_monitoring)
        ]

        success, output = self.run_docker_compose(compose_files, ["ps"])

        if success:
            print(output)
        else:
            self.print_error("Error retrieving status:")
            print(output)

    def show_logs(self, follow: bool = True):
        """Show services logs"""
        self.print_header("📋 Audiomancy Stack Logs")

        compose_files = [
            str(self.docker_compose_app),
            str(self.docker_compose_monitoring)
        ]

        cmd = ["logs"]
        if follow:
            cmd.append("-f")

        try:
            # Utiliser subprocess.call pour afficher les logs en temps réel
            cmd_full = ["docker", "compose"]
            for file in compose_files:
                cmd_full.extend(["-f", file])
            cmd_full.extend(cmd)

            subprocess.call(cmd_full, cwd=self.project_root)

        except KeyboardInterrupt:
            self.print_info("\nStopped logs display")

    def show_services_info(self, mode: str):
        """Show services access information"""
        print()
        self.print_header("🌐 Available Services")

        if mode in ["all", "app"]:
            print(f"{Colors.BOLD}📦 Application:{Colors.ENDC}")
            print(f"  • Frontend:     http://localhost:3000")
            print(f"  • Backend API:  http://localhost:8000")
            print(f"  • Backend Docs: http://localhost:8000/docs")
            print()

        if mode in ["all", "monitoring"]:
            print(f"{Colors.BOLD}📊 Monitoring:{Colors.ENDC}")
            print(f"  • Grafana:       http://localhost:19091  {Colors.OKCYAN}(admin/admin){Colors.ENDC}")
            print(f"  • Prometheus:    http://localhost:19090")
            print(f"  • AlertManager:  http://localhost:19093")
            print(f"  • Loki:          http://localhost:19100")
            print(f"  • Chaosd UI:     http://localhost:19096")
            print()

        print(f"{Colors.BOLD}🔍 Useful commands:{Colors.ENDC}")
        print(f"  • Show logs:     python start_monitoring.py logs")
        print(f"  • Show status:   python start_monitoring.py status")
        print(f"  • Stop all:      python start_monitoring.py stop")
        print()

    def show_help(self):
        """Show help"""
        self.print_header("📖 Help - Audiomancy Startup Script")

        print(f"{Colors.BOLD}Usage:{Colors.ENDC}")
        print(f"  python start_monitoring.py [COMMAND]")
        print()

        print(f"{Colors.BOLD}Available commands:{Colors.ENDC}")
        print(f"  {Colors.OKGREEN}(none){Colors.ENDC}     Start everything (application + monitoring)")
        print(f"  {Colors.OKGREEN}all{Colors.ENDC}        Start everything (application + monitoring)")
        print(f"  {Colors.OKGREEN}app{Colors.ENDC}        Start application only")
        print(f"  {Colors.OKGREEN}monitoring{Colors.ENDC} Start monitoring only")
        print(f"  {Colors.OKGREEN}stop{Colors.ENDC}       Stop all services")
        print(f"  {Colors.OKGREEN}status{Colors.ENDC}     Show services status")
        print(f"  {Colors.OKGREEN}logs{Colors.ENDC}       Show real-time logs")
        print(f"  {Colors.OKGREEN}help{Colors.ENDC}       Show this help")
        print()

        print(f"{Colors.BOLD}Examples:{Colors.ENDC}")
        print(f"  # Start everything")
        print(f"  python start_monitoring.py")
        print()
        print(f"  # Start application only")
        print(f"  python start_monitoring.py app")
        print()
        print(f"  # Show status")
        print(f"  python start_monitoring.py status")
        print()
        print(f"  # Stop everything")
        print(f"  python start_monitoring.py stop")
        print()


def main():
    """Main entry point"""
    manager = MonitoringManager()

    # Get command
    command = sys.argv[1] if len(sys.argv) > 1 else "all"

    # Route to appropriate command
    if command in ["all", ""]:
        success = manager.start_services("all")
        sys.exit(0 if success else 1)

    elif command == "app":
        success = manager.start_services("app")
        sys.exit(0 if success else 1)

    elif command == "monitoring":
        success = manager.start_services("monitoring")
        sys.exit(0 if success else 1)

    elif command == "stop":
        success = manager.stop_services()
        sys.exit(0 if success else 1)

    elif command == "status":
        manager.show_status()
        sys.exit(0)

    elif command == "logs":
        manager.show_logs(follow=True)
        sys.exit(0)

    elif command in ["help", "-h", "--help"]:
        manager.show_help()
        sys.exit(0)

    else:
        manager.print_error(f"Unknown command: {command}")
        print()
        manager.show_help()
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
