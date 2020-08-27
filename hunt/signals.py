from django.contrib.auth import user_logged_in, user_logged_out
from django.dispatch import receiver
from accounts.models import LoggedInUser

@receiver(user_logged_in)
def on_user_logged_in(sender, request, **kwargs):
    print("Login fired")
    LoggedInUser.objects.get_or_create(user=kwargs.get('user')) 


@receiver(user_logged_out)
def on_user_logged_out(sender, **kwargs):
    print("Logout Fired")
    LoggedInUser.objects.filter(user=kwargs.get('user')).delete()