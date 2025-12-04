import type { AiInsight, TradingSymbol } from '@/types/trading';

const createInsight = (
  id: string,
  symbol: TradingSymbol,
  overrides: Partial<AiInsight>,
): AiInsight => ({
  id,
  symbol,
  timeframe: '1h',
  direction: 'up',
  confidence: 0.64,
  summary: 'Momentum building after liquidity sweep; looking for continuation into the next session.',
  reasoning: [
    'Funding normalized after aggressive short covering.',
    'Stablecoin flows turn positive on Binance spot pairs.',
  ],
  catalystWindowMinutes: 90,
  sentiment: 'bullish',
  ...overrides,
});

const insights: AiInsight[] = [
  createInsight('btc-1', 'BTCUSDT', {
    timeframe: '4h',
    confidence: 0.71,
    summary: 'Gamma bands expanding higher as perpetual positioning rotates net long.',
  }),
  createInsight('eth-1', 'ETHUSDT', {
    direction: 'range',
    confidence: 0.56,
    summary: 'On-chain staking flows offset derivatives bleed, implying choppy consolidation.',
    sentiment: 'neutral',
  }),
  createInsight('sol-1', 'SOLUSDT', {
    direction: 'up',
    confidence: 0.62,
    summary: 'Breakout above VWAP resistance after Chicago session demand spike.',
  }),
];

export const aiAnalysisService = {
  async list() {
    return {
      data: insights,
      nextCursor: undefined,
    };
  },
};
