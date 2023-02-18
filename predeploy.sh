yarn
yarn build
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures.json