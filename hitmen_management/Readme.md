# Steps to run backend server

  1. Run in console: `pip3 install -r requirements.txt && python3 manage.py migrate`
  2. Populate the database with the next commands:
    
    $ python3 manage.py loaddata --database default hitmen_management/fixtures/users.yaml
    $ python3 manage.py loaddata --database default users/fixtures/seed_managers.yaml
    
  3. Start ther server with: `python3 manage.py runserver` and go to the front end repo to start the web.

