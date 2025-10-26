from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q
from .models import (
    Developer,
    Location,
    Amenity,
    Compound,
    Property,
    PropertyImage,
    Author,
    BlogPost,
    Partner,
    Testimonial,
    ContactFormSubmission
)
from .serializers import (
    DeveloperSerializer,
    LocationSerializer,
    AmenitySerializer,
    CompoundSerializer,
    CompoundWriteSerializer,
    PropertySerializer,
    PropertyImageSerializer,
    AuthorSerializer,
    BlogPostSerializer,
    PartnerSerializer,
    TestimonialSerializer,
    ContactFormSubmissionSerializer,
    UserSerializer,
    AuthTokenSerializer,
    # Public serializers
    PublicPropertySerializer,
    PublicCompoundSerializer,
    PublicDeveloperSerializer,
    PublicBlogPostSerializer,
    # List serializers
    CompoundListSerializer,
    PropertyListSerializer,
    BlogPostListSerializer,
)
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import os
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def image_upload_view(request):
    """Handle image uploads for admin interface"""
    uploaded_images = []

    # Check if multiple images or single image
    if 'images' in request.FILES:
        # Bulk upload
        image_files = request.FILES.getlist('images')
        image_type = request.POST.get('type', 'general')

        for image_file in image_files:
            try:
                result = process_image_upload(image_file, image_type)
                uploaded_images.append(result)
            except Exception as e:
                return JsonResponse({'error': f'Failed to upload {image_file.name}: {str(e)}'}, status=400)

    elif 'image' in request.FILES:
        # Single upload
        image_file = request.FILES['image']
        image_type = request.POST.get('type', 'general')

        try:
            result = process_image_upload(image_file, image_type)
            uploaded_images.append(result)
        except Exception as e:
            return JsonResponse({'error': f'Upload failed: {str(e)}'}, status=400)
    else:
        return JsonResponse({'error': 'No image files provided'}, status=400)

    return JsonResponse({
        'message': f'Successfully uploaded {len(uploaded_images)} image(s)',
        'images': uploaded_images
    })


def process_image_upload(image_file, image_type):
    """Helper function to process a single image upload"""
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if image_file.content_type not in allowed_types:
        raise ValueError('Invalid file type. Only JPEG, PNG, and WebP are allowed.')

    # Validate file size (5MB limit)
    if image_file.size > 5 * 1024 * 1024:
        raise ValueError('File size too large. Maximum 5MB allowed.')

    # Generate unique filename
    file_extension = os.path.splitext(image_file.name)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"

    # Create subdirectory based on type
    upload_path = f"uploads/{image_type}/{unique_filename}"

    # Save file
    saved_path = default_storage.save(upload_path, ContentFile(image_file.read()))

    # Get the full URL
    image_url = f"{settings.MEDIA_URL}{saved_path}".replace('//', '/')

    return {
        'id': str(uuid.uuid4()),
        'image': image_url,
        'alt_text': image_file.name,
        'filename': unique_filename,
        'size': image_file.size,
        'type': image_file.content_type
    }

# Admin-only viewsets (require authentication for all operations)
class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'id']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def compounds(self, request, pk=None):
        developer = self.get_object()
        compounds = developer.compound_set.all()
        serializer = CompoundListSerializer(compounds, many=True, context={'request': request})
        return Response(serializer.data)

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']
    ordering = ['name']

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']
    ordering = ['name']

class CompoundViewSet(viewsets.ModelViewSet):
    queryset = Compound.objects.select_related('developer', 'location').prefetch_related('amenities')
    serializer_class = CompoundSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['developer', 'location', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'delivery_date', 'id']
    ordering = ['name']
    
    def get_serializer_class(self):
        """Use different serializers for read vs write operations"""
        if self.action in ['create', 'update', 'partial_update']:
            return CompoundWriteSerializer
        return CompoundSerializer

    @action(detail=True, methods=['get'])
    def properties(self, request, pk=None):
        compound = self.get_object()
        properties = compound.property_set.all()
        serializer = PropertyListSerializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.select_related('compound', 'developer', 'location').prefetch_related('amenities', 'gallery_images')
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['compound', 'developer', 'location', 'property_type', 'is_new_launch', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'price', 'area', 'bedrooms', 'bathrooms', 'id']
    ordering = ['-is_featured', '-is_new_launch', 'title']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by area range
        min_area = self.request.query_params.get('min_area')
        max_area = self.request.query_params.get('max_area')
        if min_area:
            queryset = queryset.filter(area__gte=min_area)
        if max_area:
            queryset = queryset.filter(area__lte=max_area)
        
        # Filter by bedrooms/bathrooms
        bedrooms = self.request.query_params.get('bedrooms')
        bathrooms = self.request.query_params.get('bathrooms')
        if bedrooms:
            queryset = queryset.filter(bedrooms=bedrooms)
        if bathrooms:
            queryset = queryset.filter(bathrooms=bathrooms)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_properties = self.get_queryset().filter(is_featured=True)
        serializer = PropertyListSerializer(featured_properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def new_launches(self, request):
        new_launches = self.get_queryset().filter(is_new_launch=True)
        serializer = PropertyListSerializer(new_launches, many=True, context={'request': request})
        return Response(serializer.data)

class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['property']

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']
    ordering = ['name']

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related('author')
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'status']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['title', 'publish_date', 'id']
    ordering = ['-publish_date']

    def get_queryset(self):
        base_queryset = BlogPost.objects.select_related('author')

        if self.request.user.is_authenticated and self.request.user.is_staff:
            return base_queryset

        return base_queryset.filter(status='Published')

class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']
    ordering = ['name']

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['client_name', 'quote']
    ordering_fields = ['client_name', 'rating', 'id']
    ordering = ['-rating', 'client_name']

class ContactFormSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactFormSubmission.objects.all()
    serializer_class = ContactFormSubmissionSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'message']
    ordering_fields = ['submitted_at', 'name']
    ordering = ['-submitted_at']

# Public API viewsets (read-only for frontend)
class PublicPropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.select_related('compound', 'developer', 'location').prefetch_related('amenities', 'gallery_images')
    serializer_class = PublicPropertySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['compound', 'developer', 'location', 'property_type', 'is_new_launch', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'price', 'area', 'bedrooms', 'bathrooms', 'id']
    ordering = ['-is_featured', '-is_new_launch', 'title']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by area range
        min_area = self.request.query_params.get('min_area')
        max_area = self.request.query_params.get('max_area')
        if min_area:
            queryset = queryset.filter(area__gte=min_area)
        if max_area:
            queryset = queryset.filter(area__lte=max_area)
        
        # Filter by bedrooms/bathrooms
        bedrooms = self.request.query_params.get('bedrooms')
        bathrooms = self.request.query_params.get('bathrooms')
        if bedrooms:
            queryset = queryset.filter(bedrooms=bedrooms)
        if bathrooms:
            queryset = queryset.filter(bathrooms=bathrooms)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_properties = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_properties, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def new_launches(self, request):
        new_launches = self.get_queryset().filter(is_new_launch=True)
        serializer = self.get_serializer(new_launches, many=True)
        return Response(serializer.data)

class PublicCompoundViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Compound.objects.select_related('developer', 'location').prefetch_related('amenities')
    serializer_class = PublicCompoundSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['developer', 'location', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'delivery_date', 'id']
    ordering = ['name']

class PublicDeveloperViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = PublicDeveloperSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'id']
    ordering = ['name']

class PublicBlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.select_related('author').filter(status='Published')
    serializer_class = PublicBlogPostSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['title', 'publish_date', 'id']
    ordering = ['-publish_date']

# Authentication views
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# User management
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined']
    ordering = ['username']