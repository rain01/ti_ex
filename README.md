# TI Example


# Overview

This is a two page application. There is a users page with basic CRUD operations.
Second page shows logs of all CRUD operations made on users page.

# Requirements

* Python (2.7)

# Setup

Install requirements using `pip`...

    pip install -r requirements.txt

Then run the migrations

    python manage.py migrate

Run server

    python manage.py runserver 0.0.0.0:8000

You can now open the app in your browser at `http://127.0.0.1:8000/`.

# Tech used

* [Django 1.10][django]
* [Django Rest Framework][drf]
* [DRF-Tracking][drf-track]
* [Bootstrap][bootstrap]
* [jQuery][jquery]
* Sqlite

[django]: https://docs.djangoproject.com/en/1.10/
[drf]: http://www.django-rest-framework.org/
[drf-track]: http://drf-tracking.readthedocs.io/en/latest/
[bootstrap]: https://getbootstrap.com/
[jquery]: https://jquery.com/
