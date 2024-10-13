// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Post } from '../src/posts/post.entity';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get(getRepositoryToken(User));
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await userRepository.save({
      username: 'testuser',
      password: hashedPassword,
    });
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(201);

    jwtToken = response.body.access_token;
    expect(jwtToken).toBeDefined();
  });

  it('/posts (GET) - with valid token', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it('/posts (GET) - without token', () => {
    return request(app.getHttpServer()).get('/posts').expect(401);
  });

  it('/posts (POST) - create a new post', async () => {
    const newPost = { title: 'Test Post', content: 'This is a test post.' };
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newPost)
      .expect(201);

    expect(response.body.title).toBe(newPost.title);
    expect(response.body.content).toBe(newPost.content);
  });

  it('/posts/:id (GET) - get a specific post', async () => {
    const newPost = { title: 'Test Post', content: 'This is a test post.' };
    const createResponse = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newPost);

    const postId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.title).toBe(newPost.title);
    expect(response.body.content).toBe(newPost.content);
  });

  afterAll(async () => {
    // Clean up: remove test data
    const userRepository = app.get(getRepositoryToken(User));
    await userRepository.delete({ username: 'testuser' });

    const postRepository = app.get(getRepositoryToken(Post));
    await postRepository.delete({});

    await app.close();
  });
});
