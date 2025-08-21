#!/bin/sh
echo "Génération de config.json à partir de NEXT_PUBLIC_BACKEND_URL..."

# Crée le dossier public s'il n'existe pas
mkdir -p /app/public

cat <<EOF > /app/public/config.json
{
  "NEXT_PUBLIC_BACKEND_URL": "${NEXT_PUBLIC_BACKEND_URL}"
}
EOF

exec "$@"
