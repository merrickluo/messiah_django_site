from django.conf.urls import patterns, url

from sudoku import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
)