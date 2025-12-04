import type { NewsArticle, TradingSymbol } from '@/types/trading';

const now = Date.now();

const createArticle = (
  id: string,
  symbols: TradingSymbol[],
  overrides: Partial<NewsArticle>,
): NewsArticle => ({
  id,
  title: 'Placeholder headline',
  source: 'DreamTrade Intelligence',
  url: 'https://dreamtrade.ai/research',
  excerpt: 'High level update covering liquidity, derivatives, and macro catalysts.',
  publishedAt: new Date(now - Number(id) * 15 * 60 * 1000).toISOString(),
  sentiment: 'neutral',
  symbols,
  ...overrides,
});

const articles: NewsArticle[] = [
  createArticle('1', ['BTCUSDT'], {
    title: 'U.S. spot Bitcoin ETFs post largest inflow streak in six weeks',
    excerpt: 'Sustained demand from wirehouse advisors keeps flows positive ahead of the next FOMC decision.',
    sentiment: 'bullish',
    source: 'Blockworks',
    url: 'https://blockworks.co/',
  }),
  createArticle('2', ['ETHUSDT'], {
    title: 'L2 gas burns spike as Eigenlayer restaking unlocks new TVL',
    excerpt: 'Eigenlayer AVSs absorbed 450K ETH equivalent in 24 hours, pushing gas markets higher.',
    source: 'Bankless',
    sentiment: 'bullish',
  }),
  createArticle('3', ['SOLUSDT', 'BTCUSDT'], {
    title: 'Macro recap: DXY softens as CPI trend cools to 2.8%',
    excerpt: 'Lower dollar strength reopens the door for beta trades across Solana and alt L1 pairs.',
    source: 'MacroScope',
    sentiment: 'bullish',
  }),
  createArticle('4', ['XRPUSDT'], {
    title: 'SEC settlement chatter resurfaces after sealed filing',
    excerpt: 'Community lawyers highlight unusual docket activity that could precede a path to settlement.',
    source: 'The Defiant',
    sentiment: 'neutral',
  }),
  createArticle('5', ['ADAUSDT'], {
    title: 'Cardano Hydra upgrade hits mainnet with lower fees',
    excerpt: 'The network processed 70 TPS in stress tests, setting expectations for Q2 dApp launches.',
    source: 'Messari',
    sentiment: 'bullish',
  }),
];

export const newsFeedService = {
  async list() {
    return {
      data: articles,
      nextCursor: undefined,
    };
  },
};
