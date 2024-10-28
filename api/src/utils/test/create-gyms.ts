import { FastifyInstance } from 'fastify';
import request from 'supertest';

export const createGyms = async (app: FastifyInstance, token: string) => {
  await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
    title: 'Gym Title 1',
    description: 'Gym Description',
    phone: '123456789',
    latitude: -6.8862844,
    longitude: -38.5485094,
  });

  await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
    title: 'Gym Title 2',
    description: 'Gym Description',
    phone: '987654321',
    latitude: -6.8265987,
    longitude: -38.7074973,
  });
};
