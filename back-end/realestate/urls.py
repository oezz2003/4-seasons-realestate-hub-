from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    image_upload_view,
    DeveloperViewSet,
    LocationViewSet,
    AmenityViewSet,
    CompoundViewSet,
    PropertyViewSet,
    PropertyImageViewSet,
    AuthorViewSet,
    BlogPostViewSet,
    PartnerViewSet,
admin_router = DefaultRouter()
admin_router.register(r'developers', DeveloperViewSet)
admin_router.register(r'locations', LocationViewSet)
admin_router.register(r'amenities', AmenityViewSet)
admin_router.register(r'compounds', CompoundViewSet)
admin_router.register(r'properties', PropertyViewSet)
admin_router.register(r'property-images', PropertyImageViewSet)
admin_router.register(r'authors', AuthorViewSet)
admin_router.register(r'blog-posts', BlogPostViewSet)
admin_router.register(r'partners', PartnerViewSet)
admin_router.register(r'testimonials', TestimonialViewSet)
admin_router.register(r'contact-submissions', ContactFormSubmissionViewSet)
admin_router.register(r'users', UserViewSet)

# Public API router
public_router = DefaultRouter()
public_router.register(r'properties', PublicPropertyViewSet)
public_router.register(r'compounds', PublicCompoundViewSet)
public_router.register(r'developers', PublicDeveloperViewSet)
public_router.register(r'blog-posts', PublicBlogPostViewSet)
public_router.register(r'contact-submissions', PublicContactFormSubmissionViewSet)

urlpatterns = [
    # Admin API endpoints
    path('admin/', include(admin_router.urls)),
    
    # Public API endpoints
    path('public/', include(public_router.urls)),
    
    # Authentication endpoints
    path('auth/login/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    
    # Image upload endpoint
    path('admin/upload/image/', image_upload_view, name='image-upload'),
    
    # Legacy endpoints for backward compatibility
    path('', include(admin_router.urls)),
]