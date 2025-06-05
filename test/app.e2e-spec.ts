import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Polls GraphQL (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const graphqlEndpoint = '/graphql';

  it('deve criar uma enquete via mutation createPoll', async () => {
    const mutation = `
      mutation {
        createPoll(data: {question: "Teste integração?", options: ["Sim", "Não"]}) {
          _id
          question
          options {
            _id
            text
            votes
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createPoll.question).toBe('Teste integração?');
    expect(response.body.data.createPoll.options).toHaveLength(2);
  });

  it('deve votar em uma opção e receber poll atualizada', async () => {
    const createPollMutation = `
      mutation {
        createPoll(data: {question: "Votar teste?", options: ["Op1", "Op2"]}) {
          _id
          options {
            _id
            text
            votes
          }
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query: createPollMutation });

    const pollId = createResponse.body.data.createPoll._id;
    const optionId = createResponse.body.data.createPoll.options[0]._id;

    const voteMutation = `
      mutation {
        addVote(data: {pollId: "${pollId}", optionId: "${optionId}"}) {
          _id
          question
          options {
            _id
            text
            votes
          }
        }
      }
    `;

    const voteResponse = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query: voteMutation })
      .expect(200);

    expect(voteResponse.body.data.addVote.options.find(o => o._id === optionId).votes).toBe(1);
  });
});
