# Steps to run backend server

  1. Run in console: `pip install -r requirements.txt && python manage.py migrate`
  2. Populate the database with the next commands:
    
    $ python manage.py loaddata --database default hitmen_management/fixtures/users.yaml
    $ python manage.py loaddata --database default users/fixtures/seed_managers.yaml
    
  3. Start ther server with: `python manage.py runserver` and go to the front end repo to start the web.

