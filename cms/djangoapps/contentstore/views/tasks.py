"""
This file contains celery tasks for contentstore views
"""

from celery.task import task
from django.contrib.auth.models import User
from xmodule.modulestore.django import modulestore
from course_action_state.models import CourseRerunState
from contentstore.utils import initialize_permissions_in_new_course, remove_all_instructors_from_course


@task()
def rerun_course(source_course_key, destination_course_key, user_id, fields=None):
    """
    Reruns a course in a new celery task.
    """
    try:
        modulestore().clone_course(source_course_key, destination_course_key, user_id, fields=fields)
        initialize_permissions_in_new_course(destination_course_key, User.objects.get(id=user_id))
    except Exception as e:
        CourseRerunState.objects.failed(course_key=destination_course_key, exception=e)
        remove_all_instructors_from_course(destination_course_key)
    finally:
        CourseRerunState.objects.succeeded(course_key=destination_course_key)
