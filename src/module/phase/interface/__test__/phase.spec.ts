import { join } from 'path';
import * as request from 'supertest';

import { UpdatePhaseDto } from '../../application/dto/update-phase.dto';

import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';

describe('Phase', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(__dirname, '..', '..', '..', '..', '..', 'ormconfig.ts'),
    );

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('DELETE Delete a phase - [DELETE /phase/:id]', () => {
    it('Should return a deleted box', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/phase/2')
        .expect(HttpStatus.OK);

      expect(body.name).toEqual('warm up');
    });

    it('Should return an error for phase not found', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Phase not found',
        error: 'Not Found',
      };

      const response = await request(app.getHttpServer())
        .delete('/phase/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual(mockResponse);
    });
  });

  describe('PUT Update a phase - [PUT phase/:id]', () => {
    it('Should return an updated box', async () => {
      const updatedPhase: UpdatePhaseDto = {
        name: 'Phase updated',
        id: 1,
      };

      const response = await request(app.getHttpServer())
        .put('/phase/1')
        .send(updatedPhase)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe(updatedPhase.name);
    });

    it('Should return a Not Found error if box to update does not exist', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Phase not found',
        error: 'Not Found',
      };

      const phaseUpdated = {
        name: 'Phase Update',
      };

      const response = await request(app.getHttpServer())
        .put('/phase/999')
        .send(phaseUpdated)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual(mockResponse);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
