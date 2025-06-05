import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { getModelToken } from '@nestjs/mongoose';
import { Poll } from './poll.schema';
import { VoteOption } from './vote-option.schema';
import { PubSub } from 'graphql-subscriptions';
import { NotFoundException } from '@nestjs/common';

const mockPollModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
  populate: jest.fn(),
  exec: jest.fn(),
  save: jest.fn(),
};

const mockOptionModel = {
  insertMany: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

const mockPubSub = {
  publish: jest.fn(),
};

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        { provide: getModelToken(Poll.name), useValue: mockPollModel },
        { provide: getModelToken(VoteOption.name), useValue: mockOptionModel },
        { provide: 'PUB_SUB', useValue: mockPubSub },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all polls', async () => {
      const mockPolls = [{ question: 'Question?', options: [] }];
      mockPollModel.find.mockReturnValueOnce({
        populate: () => ({
          exec: () => Promise.resolve(mockPolls),
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(mockPolls);
    });
  });

  describe('findById', () => {
    it('should return a poll by id', async () => {
      const mockPoll = { _id: '1', question: 'Test?', options: [] };
      mockPollModel.findById.mockReturnValueOnce({
        populate: () => ({
          exec: () => Promise.resolve(mockPoll),
        }),
      });

      const result = await service.findById('1');
      expect(result).toEqual(mockPoll);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPollModel.findById.mockReturnValueOnce({
        populate: () => ({
          exec: () => Promise.resolve(null),
        }),
      });

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('vote', () => {
    it('should increment vote and publish update', async () => {
      const option = { _id: 'opt1', votes: 0, save: jest.fn() };
      const updatedPoll = { _id: 'poll1', options: [option] };

      mockOptionModel.findById.mockResolvedValue(option);
      mockPollModel.findById.mockReturnValueOnce({
        populate: () => ({
          exec: () => Promise.resolve(updatedPoll),
        }),
      });

      const result = await service.vote('poll1', 'opt1');

      expect(option.votes).toBe(1);
      expect(option.save).toHaveBeenCalled();
      expect(mockPubSub.publish).toHaveBeenCalledWith('pollUpdated', {
        pollUpdated: updatedPoll,
      });
      expect(result).toEqual(updatedPoll);
    });

    it('should throw NotFoundException if option not found', async () => {
      mockOptionModel.findById.mockResolvedValue(null);
      await expect(service.vote('poll1', 'badOption')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if poll not found after voting', async () => {
      const option = { _id: 'opt1', votes: 0, save: jest.fn() };
      mockOptionModel.findById.mockResolvedValue(option);

      mockPollModel.findById.mockReturnValueOnce({
        populate: () => ({
          exec: () => Promise.resolve(null),
        }),
      });

      await expect(service.vote('poll1', 'opt1')).rejects.toThrow(NotFoundException);
    });
  });
});
