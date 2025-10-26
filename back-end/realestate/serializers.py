from rest_framework import serializers
from django.contrib.auth.models import User
from django.conf import settings
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

# Custom image field that accepts uploaded files or existing media paths
class MediaImageField(serializers.ImageField):
    """Image field allowing references to files already stored in MEDIA_ROOT."""

    def to_internal_value(self, data):
        if data in (None, ''):
            return None

        if isinstance(data, str):
            if data.startswith('http://') or data.startswith('https://'):
                raise serializers.ValidationError('External image URLs are not allowed.')

            # Strip MEDIA_URL prefix when present
            media_url = settings.MEDIA_URL or ''
            if media_url and data.startswith(media_url):
                relative_path = data[len(media_url):]
            else:
                relative_path = data.lstrip('/')

            if '..' in relative_path:
                raise serializers.ValidationError('Invalid media path.')

            return relative_path

        return super().to_internal_value(data)

    def to_representation(self, value):
        if not value:
            return None

        if hasattr(value, 'url'):
            return value.url

        media_url = settings.MEDIA_URL.rstrip('/')
        relative = str(value).lstrip('/')
        return f"{media_url}/{relative}" if media_url else relative


# Basic serializers for related objects
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'slug', 'map_url']

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'picture']

# Nested serializers for inline relationships
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'alt_text']

class DeveloperSerializer(serializers.ModelSerializer):
    projects_count = serializers.ReadOnlyField()
    compounds = serializers.SerializerMethodField()
    logo = MediaImageField(required=False, allow_null=True)
    
    class Meta:
        model = Developer
        fields = ['id', 'name', 'slug', 'logo', 'description', 'projects_count', 'compounds']
        read_only_fields = ['slug', 'projects_count']
    
    def get_compounds(self, obj):
        compounds = obj.compound_set.all()[:5]  # Limit to 5 for performance
        return CompoundListSerializer(compounds, many=True, context=self.context).data

class CompoundListSerializer(serializers.ModelSerializer):
    """Simplified compound serializer for lists"""
    amenities = AmenitySerializer(many=True, read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    
    class Meta:
        model = Compound
        fields = ['id', 'name', 'slug', 'main_image', 'status', 'delivery_date', 
                 'amenities', 'developer_name', 'location_name']

class CompoundSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    developer = DeveloperSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    properties = serializers.SerializerMethodField()
    main_image = MediaImageField(required=False, allow_null=True)
    
    class Meta:
        model = Compound
        fields = ['id', 'name', 'slug', 'developer', 'location', 'main_image', 
                 'description', 'status', 'delivery_date', 'amenities', 'properties']
        read_only_fields = ['slug']
    
    def get_properties(self, obj):
        properties = obj.property_set.all()[:10]  # Limit to 10 for performance
        return PropertyListSerializer(properties, many=True, context=self.context).data

class CompoundWriteSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating compounds with writable foreign keys"""
    main_image = MediaImageField(required=False, allow_null=True)
    amenities = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Amenity.objects.all(), 
        required=False
    )
    
    class Meta:
        model = Compound
        fields = ['id', 'name', 'slug', 'developer', 'location', 'main_image', 
                 'description', 'status', 'delivery_date', 'amenities']
        read_only_fields = ['slug']

class PropertyListSerializer(serializers.ModelSerializer):
    """Simplified property serializer for lists"""
    amenities = AmenitySerializer(many=True, read_only=True)
    compound_name = serializers.CharField(source='compound.name', read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    
    class Meta:
        model = Property
        fields = ['id', 'title', 'slug', 'property_type', 'price', 'area', 
                 'bedrooms', 'bathrooms', 'main_image', 'is_new_launch', 
                 'is_featured', 'amenities', 'compound_name', 'developer_name', 
                 'location_name']

class PropertySerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    compound = CompoundListSerializer(read_only=True)
    developer = DeveloperSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    gallery_images = PropertyImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Property
        fields = ['id', 'title', 'slug', 'compound', 'developer', 'location', 
                 'property_type', 'price', 'area', 'bedrooms', 'bathrooms', 
                 'description', 'main_image', 'floor_plan_image', 'map_image', 
                 'is_new_launch', 'is_featured', 'amenities', 'gallery_images']
        read_only_fields = ['slug']

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'property', 'image', 'alt_text']

class BlogPostListSerializer(serializers.ModelSerializer):
    """Simplified blog post serializer for lists"""
    author_name = serializers.CharField(source='author.name', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'publish_date', 'image', 
                 'status', 'author_name']

class BlogPostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        source='author', queryset=Author.objects.all(), write_only=True, required=False
    )
    image = MediaImageField(required=False, allow_null=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'content', 'publish_date', 
                 'author', 'author_id', 'image', 'status']
        read_only_fields = ['slug', 'publish_date']

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'client_avatar', 'rating', 'quote']

class ContactFormSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactFormSubmission
        fields = ['id', 'name', 'email', 'phone', 'message', 'submitted_at']
        read_only_fields = ['submitted_at']

# Authentication serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']
        read_only_fields = ['id', 'is_staff']

class AuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        from django.contrib.auth import authenticate

        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authentication')
        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs

# Public API serializers (read-only for frontend)
class PublicPropertySerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    compound_name = serializers.CharField(source='compound.name', read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    gallery_images = PropertyImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Property
        fields = ['id', 'title', 'slug', 'property_type', 'price', 'area', 
                 'bedrooms', 'bathrooms', 'description', 'main_image', 
                 'floor_plan_image', 'map_image', 'is_new_launch', 'is_featured', 
                 'amenities', 'gallery_images', 'compound_name', 'developer_name', 
                 'location_name']

class PublicCompoundSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    developer_name = serializers.CharField(source='developer.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    
    class Meta:
        model = Compound
        fields = ['id', 'name', 'slug', 'main_image', 'description', 'status', 
                 'delivery_date', 'amenities', 'developer_name', 'location_name']

class PublicDeveloperSerializer(serializers.ModelSerializer):
    projects_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Developer
        fields = ['id', 'name', 'slug', 'logo', 'description', 'projects_count']

class PublicBlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_picture = serializers.ImageField(source='author.picture', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'content', 'publish_date', 
                 'image', 'author_name', 'author_picture']