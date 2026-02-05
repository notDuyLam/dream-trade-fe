'use client';

import type { AiInsight } from '@/types/trading';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyzeCoin, mapAnalyzeResponseToInsights } from '@/services/analysis/analysisService';
import { SentimentPriceChart } from './charts/SentimentPriceChart';
import { DetailedExplanations } from './DetailedExplanations';

type AIAnalysisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
};

type AnalysisState = {
  insights: AiInsight[] | null;
  loading: boolean;
  error: {
    status: 401 | 403 | 404 | 503;
    message?: string;
  } | null;
};

export const AiAnalysisModal = ({ isOpen, onClose, symbol }: AIAnalysisModalProps) => {
  const { t } = useLanguage();
  const [state, setState] = useState<AnalysisState>({
    insights: null,
    loading: false,
    error: null,
  });

  // Track if we've already run analysis for this symbol
  const hasRunRef = React.useRef(false);
  const currentSymbolRef = React.useRef(symbol);

  const runAnalysis = useCallback(async () => {
    setState({ insights: null, loading: true, error: null });

    try {
      const coin = symbol.replace('USDT', '');
      const result = await analyzeCoin(coin, 24);

      if (result.success) {
        const insights = mapAnalyzeResponseToInsights(result.data);
        setState({ insights, loading: false, error: null });
        hasRunRef.current = true;
        return;
      }

      setState({
        insights: null,
        loading: false,
        error: { status: result.status, message: result.message },
      });
      hasRunRef.current = true;
    } catch (err) {
      setState({
        insights: null,
        loading: false,
        error: {
          status: 503,
          message: err instanceof Error ? err.message : 'Unexpected error occurred',
        },
      });
      hasRunRef.current = true;
    }
  }, [symbol]);

  // Auto-run analysis when modal opens (only once per symbol)
  useEffect(() => {
    // Reset if symbol changed
    if (currentSymbolRef.current !== symbol) {
      hasRunRef.current = false;
      currentSymbolRef.current = symbol;
    }

    // Only run if modal is open and we haven't run yet
    if (isOpen && !hasRunRef.current && !state.loading) {
      void runAnalysis();
    }
  }, [isOpen, symbol, runAnalysis, state.loading]);

  if (!isOpen) {
    return null;
  }

  const insight = state.insights?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl dark:border-slate-800/50 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/50 p-6 dark:border-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('news.aiAnalysis')}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {symbol}
              {' '}
              - Causal Analysis (24h)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* Loading State */}
          {state.loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="h-12 w-12 animate-spin text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                {t('news.analysisLoading')}
              </p>
            </div>
          )}

          {/* Error States */}
          {state.error?.status === 401 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-800 dark:bg-rose-950/40">
              <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                Authentication Required
              </p>
              <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
                {state.error.message || 'Please sign in to use AI Analysis'}
              </p>
              <Link
                href="/sign-in"
                className="mt-4 inline-block rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
              >
                Sign In
              </Link>
            </div>
          )}

          {state.error?.status === 403 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/40">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {t('news.vipOnly')}
              </p>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                {state.error.message}
              </p>
              <Link
                href="/dashboard/subscription"
                className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
              >
                {t('news.upgradeCta')}
              </Link>
            </div>
          )}

          {(state.error?.status === 404 || state.error?.status === 503) && (
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('news.analysisUnavailable')}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {state.error.message}
              </p>
              <button
                type="button"
                onClick={() => void runAnalysis()}
                className="mt-4 rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600"
              >
                {t('news.retry')}
              </button>
            </div>
          )}

          {/* Success - Display Analysis */}
          {insight && !state.loading && (
            <div className="space-y-6">
              {/* Key Insights Summary */}
              <div className="rounded-xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-teal-950/40">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {insight.summary}
                    </h3>
                    {insight.reasoning && insight.reasoning.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {insight.reasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <span className="mt-1 text-emerald-500">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {insight.confidence && (
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Confidence:</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                            style={{ width: `${insight.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {Math.round(insight.confidence * 100)}
                          %
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sentiment Price Chart */}
              {insight.chartData && (
                <SentimentPriceChart data={insight.chartData} />
              )}

              {/* Detailed Explanations & Events */}
              <DetailedExplanations insight={insight} />

              {/* Correlations */}
              {insight.correlations && (
                <div className="rounded-xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-900/50">
                  <div className="mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Correlations (
                      {insight.correlations.method}
                      )
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {insight.correlations.correlation_matrix && (
                      <>
                        {/* Sentiment ↔ Price */}
                        {insight.correlations.correlation_matrix.sentiment_score?.price_change !== undefined && (
                          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Sentiment ↔ Price</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${
                                Math.abs(insight.correlations.correlation_matrix.sentiment_score.price_change) > 0.3
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                              >
                                {insight.correlations.correlation_matrix.sentiment_score.price_change.toFixed(3)}
                              </span>
                              {insight.correlations.p_values?.sentiment_score?.price_change !== undefined && (
                                <span className="text-xs text-slate-500">
                                  (p=
                                  {insight.correlations.p_values.sentiment_score.price_change.toFixed(3)}
                                  )
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Fear & Greed ↔ Price */}
                        {insight.correlations.correlation_matrix.fear_greed_score?.price_change !== undefined && (
                          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Fear & Greed ↔ Price</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${
                                Math.abs(insight.correlations.correlation_matrix.fear_greed_score.price_change) > 0.3
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                              >
                                {insight.correlations.correlation_matrix.fear_greed_score.price_change.toFixed(3)}
                              </span>
                              {insight.correlations.p_values?.fear_greed_score?.price_change !== undefined && (
                                <span className="text-xs text-slate-500">
                                  (p=
                                  {insight.correlations.p_values.fear_greed_score.price_change.toFixed(3)}
                                  )
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Volume ↔ Price */}
                        {insight.correlations.correlation_matrix.volume?.price_change !== undefined && (
                          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Volume ↔ Price</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${
                                Math.abs(insight.correlations.correlation_matrix.volume.price_change) > 0.3
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                              >
                                {insight.correlations.correlation_matrix.volume.price_change.toFixed(3)}
                              </span>
                              {insight.correlations.p_values?.volume?.price_change !== undefined && (
                                <span className="text-xs text-slate-500">
                                  (p=
                                  {insight.correlations.p_values.volume.price_change.toFixed(3)}
                                  )
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Stationarity Tests & Data Stats */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Stationarity */}
                {insight.stationarity && (
                  <div className="rounded-xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-900/50">
                    <div className="mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Stationarity Tests</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      {insight.stationarity.sentiment && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300">Sentiment:</span>
                          <span className={`font-semibold ${
                            insight.stationarity.sentiment.is_stationary
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                          >
                            {insight.stationarity.sentiment.is_stationary ? '✓ Stationary' : '✗ Non-stationary'}
                          </span>
                        </div>
                      )}
                      {insight.stationarity.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300">Price:</span>
                          <span className={`font-semibold ${
                            insight.stationarity.price.is_stationary
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                          >
                            {insight.stationarity.price.is_stationary ? '✓ Stationary' : '✗ Non-stationary'}
                          </span>
                        </div>
                      )}
                      {insight.stationarity.fear_greed && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300">Fear & Greed:</span>
                          <span className={`font-semibold ${
                            insight.stationarity.fear_greed.is_stationary
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                          >
                            {insight.stationarity.fear_greed.is_stationary ? '✓ Stationary' : '✗ Non-stationary'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Data Stats */}
                {insight.dataStats && (
                  <div className="rounded-xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-900/50">
                    <div className="mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Data Quality</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">Observations:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {insight.dataStats.observations}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">Frequency:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {insight.dataStats.resample_frequency}
                        </span>
                      </div>
                      {insight.dataStats.start_date && (
                        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(insight.dataStats.start_date).toLocaleDateString()}
                          {' → '}
                          {new Date(insight.dataStats.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
