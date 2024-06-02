import sys
import os
sys.path.append('/home/ubuntu/cs35l-final-project')  # Adjust this to the root of your Django project
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoAPI.settings')

from djangoAPI.wsgi import application

if __name__ == '__main__':
    from waitress import serve
    serve(application, host='0.0.0.0', port=80)