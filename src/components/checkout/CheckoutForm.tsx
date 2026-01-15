'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  paymentMethod: z.enum(['card', 'paypal'], {
    message: 'Please select a payment method',
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  paypalEmail: z.string().email('Invalid PayPal email').optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'card') {
    if (!data.cardNumber || data.cardNumber.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card number is required',
        path: ['cardNumber'],
      });
    }
    if (!data.cardExpiry || data.cardExpiry.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expiry date is required',
        path: ['cardExpiry'],
      });
    }
    if (!data.cardCvv || data.cardCvv.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV is required',
        path: ['cardCvv'],
      });
    }
  }
  if (data.paymentMethod === 'paypal') {
    if (!data.paypalEmail || data.paypalEmail.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PayPal email is required',
        path: ['paypalEmail'],
      });
    }
  }
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

type CheckoutFormProps = {
  planName: string;
  price: number;
  onSubmit: (data: CheckoutFormData) => Promise<void>;
};

export const CheckoutForm = ({ planName, price, onSubmit }: CheckoutFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onFormSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // Redirect to success page with plan info
      const planId = searchParams.get('plan') ?? 'vip';
      // Use replace instead of push to prevent back navigation to checkout
      router.replace(`/checkout/success?plan=${planId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      // In production, use a toast notification or proper error UI
      // eslint-disable-next-line no-alert
      window.alert('Payment processing failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, (errors) => {
      // Scroll to first error
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const element = document.querySelector(`[name="${firstError}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      })}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-300">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <fieldset>
            <legend className="mb-3 block text-sm font-semibold text-slate-300">
              Payment Method
            </legend>
            <div className="space-y-2">
              <label htmlFor="paymentMethod-card" className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 p-4 hover:border-slate-600">
                <input
                  id="paymentMethod-card"
                  type="radio"
                  value="card"
                  {...register('paymentMethod')}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-white">Credit/Debit Card</span>
              </label>
              <label htmlFor="paymentMethod-paypal" className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 p-4 hover:border-slate-600">
                <input
                  id="paymentMethod-paypal"
                  type="radio"
                  value="paypal"
                  {...register('paymentMethod')}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-white">PayPal</span>
              </label>
            </div>
          </fieldset>
          {errors.paymentMethod && (
            <p className="mt-1 text-xs text-rose-400">{errors.paymentMethod.message}</p>
          )}
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div>
              <label htmlFor="cardNumber" className="block text-xs font-semibold text-slate-400">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                {...register('cardNumber')}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
              {errors.cardNumber && (
                <p className="mt-1 text-xs text-rose-400">{errors.cardNumber.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-xs font-semibold text-slate-400">
                  Expiry Date
                </label>
                <input
                  id="cardExpiry"
                  type="text"
                  {...register('cardExpiry')}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
                {errors.cardExpiry && (
                  <p className="mt-1 text-xs text-rose-400">{errors.cardExpiry.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="cardCvv" className="block text-xs font-semibold text-slate-400">
                  CVV
                </label>
                <input
                  id="cardCvv"
                  type="text"
                  {...register('cardCvv')}
                  placeholder="123"
                  maxLength={4}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
                {errors.cardCvv && (
                  <p className="mt-1 text-xs text-rose-400">{errors.cardCvv.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <label htmlFor="paypalEmail" className="block text-xs font-semibold text-slate-400">
              PayPal Email
            </label>
            <input
              id="paypalEmail"
              type="email"
              {...register('paypalEmail')}
              placeholder="paypal@example.com"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
            />
            {errors.paypalEmail && (
              <p className="mt-1 text-xs text-rose-400">{errors.paypalEmail.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Plan</span>
          <span className="font-semibold text-white">{planName}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2">
          <span className="text-lg font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-emerald-400">
            $
            {price.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Complete Payment'}
      </button>

      <p className="text-center text-xs text-slate-500">
        This is a mock checkout. No actual payment will be processed.
      </p>
    </form>
  );
};
