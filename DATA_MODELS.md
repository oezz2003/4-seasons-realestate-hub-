# Real Estate Hub - Django Backend Models

This document outlines the data models and their relationships required to build a Django backend for the Four Seasons Real Estate Hub website. This will serve as a blueprint for creating the database schema and the Django admin dashboard for content management.

## Core Models

The application revolves around several core entities: `Property`, `Compound`, `Developer`, `Location`, and `BlogPost`.

---

### 1. Developer Model

Represents a real estate development company.

- **Model Name:** `Developer`
- **Purpose:** Stores information about development companies. Each developer can have multiple compounds (projects).

**Fields:**

| Field Name      | Django Field Type      | Description                                           | Notes                                   |
| --------------- | ---------------------- | ----------------------------------------------------- | --------------------------------------- |
| `name`          | `CharField(max_length=200)` | The name of the development company.                  | Required, Unique.                       |
| `slug`          | `SlugField(unique=True)`   | A unique URL-friendly slug for the developer.         | Auto-generated from the name.           |
| `logo`          | `ImageField`           | The company's logo.                                   | Optional.                               |
| `description`   | `TextField`            | A brief description of the company.                   | Optional, allows rich text.             |
| `projects_count`| (Calculated)             | The number of compounds associated with this developer. | Can be a property on the model.         |

---

### 2. Location Model

Represents a geographical area where properties or compounds are located.

- **Model Name:** `Location`
- **Purpose:** To group properties and compounds by region (e.g., "New Cairo", "North Coast").

**Fields:**

| Field Name | Django Field Type      | Description                               | Notes                         |
| ---------- | ---------------------- | ----------------------------------------- | ----------------------------- |
| `name`     | `CharField(max_length=150)` | The name of the location (e.g., "New Cairo"). | Required, Unique.             |
| `slug`     | `SlugField(unique=True)`   | A unique URL-friendly slug for the location.  | Auto-generated from the name. |
| `map_url`  | `URLField`             | Google Maps embed URL for this location.      | Optional.                     |

---

### 3. Compound Model

Represents a residential compound or project built by a developer.

- **Model Name:** `Compound`
- **Purpose:** A collection of properties in a specific development. It acts as a parent to `Property`.

**Fields:**

| Field Name          | Django Field Type         | Description                                                          | Notes                                            |
| ------------------- | ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| `name`              | `CharField(max_length=200)`     | The name of the compound.                                            | Required, Unique.                                |
| `slug`              | `SlugField(unique=True)`      | A unique URL-friendly slug for the compound.                         | Auto-generated from the name.                    |
| `developer`         | `ForeignKey(Developer)`   | The developer of the compound.                                       | Required. `on_delete=models.CASCADE`.            |
| `location`          | `ForeignKey(Location)`    | The geographical location of the compound.                           | Required. `on_delete=models.SET_NULL`, `null=True`. |
| `main_image`        | `ImageField`              | The primary marketing image for the compound.                        | Required.                                        |
| `description`       | `TextField`               | A detailed description of the compound.                              | Optional.                                        |
| `status`            | `CharField(max_length=50)`    | The current status (e.g., "Ready to Move", "Under Construction").  | Optional.                                        |
| `delivery_date`     | `CharField(max_length=50)`    | The expected delivery date (e.g., "Q4 2025", "Immediate").         | Optional.                                        |
| `amenities`         | `ManyToManyField(Amenity)`    | List of amenities available in the compound.                         | See `Amenity` model below.                       |

---

### 4. Property Model

This is the central model, representing an individual unit for sale.

- **Model Name:** `Property`
- **Purpose:** Stores details for a specific real estate unit (Apartment, Villa, etc.).

**Fields:**

| Field Name         | Django Field Type         | Description                                                            | Notes                                                              |
| ------------------ | ------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `title`            | `CharField(max_length=255)`     | The title of the property listing.                                     | Required.                                                          |
| `slug`             | `SlugField(unique=True)`      | A unique URL-friendly slug for the property.                           | Auto-generated from the title.                                     |
| `compound`         | `ForeignKey(Compound)`    | The compound this property belongs to.                                 | Optional (`null=True`). Allows for standalone properties.        |
| `developer`        | `ForeignKey(Developer)`   | The developer. Can be inherited from `compound` or set directly.     | Optional.                                                          |
| `location`         | `ForeignKey(Location)`    | The location. Can be inherited from `compound` or set directly.      | Optional.                                                          |
| `property_type`    | `CharField(max_length=50)`    | e.g., "Apartment", "Villa", "Chalet".                                  | Required. Can use `choices`.                                       |
| `price`            | `DecimalField`            | The price of the property in EGP.                                      | Required. `max_digits=12`, `decimal_places=2`.                     |
| `area`             | `PositiveIntegerField`    | The area of the property in square meters.                             | Required.                                                          |
| `bedrooms`         | `PositiveIntegerField`    | The number of bedrooms.                                                | Required.                                                          |
| `bathrooms`        | `PositiveIntegerField`    | The number of bathrooms.                                               | Required.                                                          |
| `description`      | `TextField`               | A detailed description of the property.                                | Required.                                                          |
g| `main_image`       | `ImageField`              | The main image for the property card.                                  | Required.                                                          |
| `floor_plan_image` | `ImageField`              | An image of the floor plan.                                            | Optional.                                                          |
| `map_image`        | `ImageField`              | A static image of the map location.                                    | Optional.                                                          |
| `is_new_launch`    | `BooleanField`            | A flag to mark the property as a "New Launch".                         | `default=False`.                                                   |
| `is_featured`      | `BooleanField`            | A flag to feature the property on the homepage.                        | `default=False`.                                                   |
| `amenities`        | `ManyToManyField(Amenity)`    | List of amenities for this specific property.                          | See `Amenity` model below.                                       |

---

### 5. Property Image Gallery

A simple model to handle multiple images for a single property.

- **Model Name:** `PropertyImage`
- **Purpose:** Allows uploading multiple gallery images for a `Property`.

**Fields:**

| Field Name | Django Field Type      | Description                          | Notes                                   |
| ---------- | ---------------------- | ------------------------------------ | --------------------------------------- |
| `property` | `ForeignKey(Property)` | The property this image belongs to.    | Required. `related_name='gallery_images'`. |
| `image`    | `ImageField`           | The gallery image file.              | Required.                               |
| `alt_text` | `CharField`            | Alternative text for the image.      | Optional.                               |

---

### 6. Amenity Model

A simple model to manage a list of reusable amenities.

- **Model Name:** `Amenity`
- **Purpose:** To create a standard list of amenities that can be assigned to `Property` and `Compound`.

**Fields:**

| Field Name | Django Field Type      | Description                         | Notes             |
| ---------- | ---------------------- | ----------------------------------- | ----------------- |
| `name`     | `CharField(max_length=100)` | The name of the amenity (e.g., "Gym"). | Required, Unique. |

---

### 7. Blog & Content Models

Models for the blog and marketing content.

#### Author Model
- **Model Name:** `Author`
- **Fields:**
    - `name`: `CharField(max_length=100)`
    - `picture`: `ImageField` (Optional)

#### BlogPost Model
- **Model Name:** `BlogPost`
- **Fields:**
    - `title`: `CharField(max_length=255)`
    - `slug`: `SlugField(unique=True)`
    - `excerpt`: `TextField` (A short summary)
    - `content`: `TextField` (Full content, allows rich text/Markdown)
    - `publish_date`: `DateTimeField`
    - `author`: `ForeignKey(Author, on_delete=models.SET_NULL, null=True)`
    - `image`: `ImageField` (The main post image)
    - `status`: `CharField` (e.g., "Published", "Draft")

---

### 8. Miscellaneous Models

#### Partner Model
- **Model Name:** `Partner`
- **Purpose:** Manages the "Esteemed Partners" logos on the homepage.
- **Fields:**
    - `name`: `CharField(max_length=100)`
    - `logo`: `ImageField`

#### Testimonial Model
- **Model Name:** `Testimonial`
- **Purpose:** Manages the client testimonials.
- **Fields:**
    - `client_name`: `CharField(max_length=100)`
    - `client_avatar`: `ImageField` (Optional)
    - `rating`: `PositiveIntegerField` (e.g., 1 to 5)
    - `quote`: `TextField`

#### ContactFormSubmission Model
- **Model Name:** `ContactSubmission`
- **Purpose:** To store messages sent via the contact form.
- **Fields:**
    - `name`: `CharField(max_length=100)`
    - `email`: `EmailField`
    - `subject`: `CharField(max_length=200)`
    - `message`: `TextField`
    - `submitted_at`: `DateTimeField(auto_now_add=True)`

---

## Model Relationships Diagram

```
[Developer] 1--* [Compound] 1--* [Property] *--* [Amenity]
    |                               |
    |                               *-- [PropertyImage]
    |
    *---------- [Location] (Implicit through Compound/Property)


[Author] 1--* [BlogPost]

[Partner] - (Standalone for homepage)
[Testimonial] - (Standalone for homepage)
[ContactSubmission] - (Standalone for admin)
```

## Django Admin

All models should be registered with the Django admin.
- Use `admin.TabularInline` or `admin.StackedInline` for `PropertyImage` within the `Property` admin page.
- Use filtering and search fields (`list_filter`, `search_fields`) for easier management of properties, compounds, and developers.
- Customize `list_display` to show key information in the admin list views.
- For rich text fields like `description` and `content`, consider integrating a WYSIWYG editor like `django-ckeditor`.
