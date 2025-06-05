import { Test, TestingModule } from '@nestjs/testing';
import { PollsResolver } from './polls.resolver';
import { PollsService } from './polls.service';
import { PubSub } from 'graphql-subscriptions';
import { CreatePollInput } from './poll.input';
import { AddVoteInput } from './vote.input';

describe('PollsResolver', () => {
  let resolver: PollsResolver;
  let service: PollsService;

  const mockPoll = { _id: 'poll1', question: 'Example?', options: [] };
  const mockPollsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createPoll: jest.fn(),
    vote: jest.fn(),
    deletePoll: jest.fn(),
    deleteAllPolls: jest.fn(),
  };

  const mockPubSub = {
    asyncIterableIterator: jest.fn(() => 'mockSubscription'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsResolver,
        { provide: PollsService, useValue: mockPollsService },
        { provide: 'PUB_SUB', useValue: mockPubSub },
      ],
    }).compile();

    resolver = module.get<PollsResolver>(PollsResolver);
    service = module.get<PollsService>(PollsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPolls', () => {
    it('should return all polls', async () => {
      mockPollsService.findAll.mockResolvedValue([mockPoll]);
      const result = await resolver.getPolls();
      expect(result).toEqual([mockPoll]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getPollById', () => {
    it('should return a poll by id', async () => {
      mockPollsService.findById.mockResolvedValue(mockPoll);
      const result = await resolver.getPollById('poll1');
      expect(result).toEqual(mockPoll);
      expect(service.findById).toHaveBeenCalledWith('poll1');
    });
  });

  describe('createPoll', () => {
    it('should call service with correct arguments', async () => {
      const input: CreatePollInput = {
        question: 'New Question?',
        options: ['Yes', 'No'],
      };
      mockPollsService.createPoll.mockResolvedValue(mockPoll);
      const result = await resolver.createPoll(input);
      expect(result).toEqual(mockPoll);
      expect(service.createPoll).toHaveBeenCalledWith(input.question, input.options);
    });
  });

  describe('addVote', () => {
    it('should call service.vote with correct input', async () => {
      const input: AddVoteInput = {
        pollId: 'poll1',
        optionId: 'opt1',
      };
      mockPollsService.vote.mockResolvedValue(mockPoll);
      const result = await resolver.addVote(input);
      expect(result).toEqual(mockPoll);
      expect(service.vote).toHaveBeenCalledWith(input.pollId, input.optionId);
    });
  });

  describe('deletePoll', () => {
    it('should call service.deletePoll', async () => {
      mockPollsService.deletePoll.mockResolvedValue(true);
      const result = await resolver.deletePoll('poll1');
      expect(result).toBe(true);
      expect(service.deletePoll).toHaveBeenCalledWith('poll1');
    });
  });

  describe('deleteAllPolls', () => {
    it('should call service.deleteAllPolls', async () => {
      mockPollsService.deleteAllPolls.mockResolvedValue(true);
      const result = await resolver.deleteAllPolls();
      expect(result).toBe(true);
      expect(service.deleteAllPolls).toHaveBeenCalled();
    });
  });

  describe('pollUpdated (subscription)', () => {
    it('should return subscription iterator', () => {
      const result = resolver.pollUpdated();
      expect(result).toBe('mockSubscription');
      expect(mockPubSub.asyncIterableIterator).toHaveBeenCalledWith('pollUpdated');
    });
  });
});
