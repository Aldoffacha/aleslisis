from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect, HttpResponse

def root_view(request):
    html = """
    <html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#FAF6F0;color:#2C1A1A;">
    <div style="text-align:center;">
      <h1 style="font-family:Cormorant Garamond,serif;font-weight:300;letter-spacing:0.2em;">ALESLI API</h1>
      <p style="color:#7A3535;">Backend funcionando</p>
      <p style="font-size:13px;color:#8A5555;">Frontend en <a href="http://localhost:3000" style="color:#B05C5C;">http://localhost:3000</a></p>
      <p style="font-size:11px;color:#B08080;">API: <code style="background:#F0E0E0;padding:2px 6px;border-radius:2px;">/api/auth/</code></p>
    </div></body></html>
    """
    return HttpResponse(html)

urlpatterns = [
    path('', root_view),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
]
