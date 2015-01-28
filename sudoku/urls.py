from django.conf.urls import patterns, url

from sudoku import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^puzzle/(?P<hard>\d{1,2})/$', views.puzzle, name='puzzle'),
    url(r'^solve/(?P<puzzle>.*)/$',views.solve, name='solve'),
)