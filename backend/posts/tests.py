from rest_framework import test
from users.models import User
from .models import Post
from rest_framework import status
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile


class PostTests(test.APITestCase):

    def setUp(self) -> None:
        self.user = User.objects.create_user(username='Samir', password='Password123')
        self.other_user = User.objects.create(username='Rayyan', password='Password123')
        self.post = Post.objects.create(title='My First Post', body='Hi...', author=self.user)
        self.posts_url = '/api/posts/'
        self.post_detail_url = f'/api/posts/{self.post.slug}/'

    def generate_photo_file(self, name: str, color: str) -> SimpleUploadedFile:
        """Helper method to generate an in-memory JPEG image file"""
        file = BytesIO()
        image = Image.new('RGB', (100, 100), color)
        image.save(file, 'jpeg')
        file.seek(0)
        return SimpleUploadedFile(
            name=f'{name}.jpeg',
            content=file.read(),
            content_type='image/jpeg'
        )

    def test_list_posts_unauthenticated(self):
        """Anyone should be able to view public blog posts."""

        response = self.client.get(self.posts_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post_authenticated(self) -> None:
        """Logged-in users can create posts."""

        self.client.force_authenticate(user=self.user) # type: ignore
        payload = {'title' : 'My Second Post', 'body' : 'sup...'}
        response = self.client.post(self.posts_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

        post = Post.objects.filter(title='My Second Post').first()
        self.assertIsNotNone(post)
        # So we can shut up the type checker LOL:
        assert post is not None
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.body, 'sup...')

        # Create post with image:
        payload = {
            'title' : 'My Third Post',
            'body' : 'Hey Hello',
            'image' : self.generate_photo_file('hello', 'green'),
        }
        response = self.client.post(self.posts_url, payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 3)
        post = Post.objects.filter(title='My Third Post').first()
        self.assertIsNotNone(post)
        assert post is not None
        assert post.image.name is not None
        self.assertTrue(post.image.name.__contains__('hello'))

    def test_create_post_unauthenticated_fails(self) -> None:
        """Unauthenticated users cannot create posts."""
        payload = {
            'title' : "I haven't made an account yet :)",
            'body' : 'Yup'
        }
        response = self.client.post(self.posts_url, payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_post_unauthenticated(self) -> None:
        """Anyone should be able to view the details of public blog posts."""
        response = self.client.get(self.post_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post_unauthenticated_fails(self) -> None:
        """Unauthenticated users cannot delete posts."""
        response = self.client.delete(self.post_detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Post.objects.count(), 1)

    def test_patch_post_unauthenticated_fails(self) -> None:
        """Unauthenticated users cannot delete posts."""
        response = self.client.patch(self.post_detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_your_post(self) -> None:
        """authenticated users can delete their own posts."""
        self.client.force_authenticate(user=self.user) # type: ignore
        response = self.client.delete(self.post_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_update_your_post(self) -> None:
        """authenticated users can update their own posts."""
        self.client.force_authenticate(user=self.user) # type: ignore

        payload = {'body' : 'Updated body'}
        response = self.client.patch(self.post_detail_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post = Post.objects.get(title='My First Post')
        self.assertEqual(post.body, 'Updated body')

        # Add an image for the first time:
        image_file = self.generate_photo_file('first_image', color='blue')
        payload = {'image' : image_file}
        response = self.client.patch(self.post_detail_url, payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post = Post.objects.get(title='My First Post')
        assert post.image.name is not None
        self.assertTrue(post.image.name.__contains__('first_image'))

        # Change an existing image:
        
        image_file = self.generate_photo_file('second_image' ,color='red')
        payload = {'image' : image_file}
        response = self.client.patch(self.post_detail_url, payload, format='multipart')
        post = Post.objects.get(title='My First Post')
        assert post.image.name is not None
        self.assertTrue(post.image.name.__contains__('second_image'))