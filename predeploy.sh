set -o errexit
yarn
yarn build
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py loaddata fixtures.json