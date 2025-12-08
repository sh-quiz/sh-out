# Frontend Economy Integration - Usage Guide

## 🎯 Quick Start

### Import the Hooks

```typescript
import {
  useEnergy,
  useConsumeEnergy,
  useRefillEnergy,
  useDiamondBalance,
  usePurchaseDiamonds,
  useSpendDiamonds,
} from '@/api/query';
```

---

## 📊 Energy Hooks

### 1. Display Energy Status

```tsx
'use client';

import { useEnergy } from '@/api/query';

export function EnergyDisplay() {
  const { data: energy, isLoading, error } = useEnergy();

  if (isLoading) return <div>Loading energy...</div>;
  if (error) return <div>Error loading energy</div>;

  return (
    <div className="energy-display">
      <h3>Energy: {energy?.energy}/{energy?.maxEnergy}</h3>
      {energy?.nextRefillAt && (
        <p>Next refill: {new Date(energy.nextRefillAt).toLocaleTimeString()}</p>
      )}
    </div>
  );
}
```

### 2. Consume Energy (Quiz Start)

```tsx
'use client';

import { useConsumeEnergy } from '@/api/query';
import { useState } from 'react';

export function QuizStartButton({ quizId }: { quizId: number }) {
  const consumeEnergy = useConsumeEnergy();

  const handleStartQuiz = async () => {
    try {
      await consumeEnergy.mutateAsync({
        amount: 1,
        reason: 'quiz_play',
        metadata: { quizId },
        idempotencyKey: `quiz_${quizId}_${Date.now()}`,
      });
      
      // Navigate to quiz or start quiz logic
      console.log('Quiz started! Energy consumed.');
    } catch (error) {
      console.error('Failed to start quiz:', error);
      // Show error to user (e.g., "Not enough energy")
    }
  };

  return (
    <button
      onClick={handleStartQuiz}
      disabled={consumeEnergy.isPending}
      className="quiz-start-btn"
    >
      {consumeEnergy.isPending ? 'Starting...' : 'Start Quiz'}
    </button>
  );
}
```

### 3. Refill Energy with Diamonds

```tsx
'use client';

import { useRefillEnergy, useEnergyPricing } from '@/api/query';

export function EnergyRefillButton() {
  const refillEnergy = useRefillEnergy();
  const { data: pricing } = useEnergyPricing();

  const handleRefill = async () => {
    const amountToRefill = 5;
    const cost = (pricing?.costPerEnergy || 10) * amountToRefill;

    if (confirm(`Refill ${amountToRefill} energy for ${cost} diamonds?`)) {
      try {
        const result = await refillEnergy.mutateAsync({
          amount: amountToRefill,
          idempotencyKey: `refill_${Date.now()}`,
        });
        
        console.log(`Refilled! Spent ${result.diamondsSpent} diamonds`);
      } catch (error) {
        console.error('Refill failed:', error);
      }
    }
  };

  return (
    <button
      onClick={handleRefill}
      disabled={refillEnergy.isPending}
      className="refill-btn"
    >
      {refillEnergy.isPending ? 'Refilling...' : 'Refill Energy'}
    </button>
  );
}
```

---

## 💎 Diamond Hooks

### 1. Display Diamond Balance

```tsx
'use client';

import { useDiamondBalance } from '@/api/query';

export function DiamondDisplay() {
  const { data: balance, isLoading } = useDiamondBalance();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="diamond-display">
      <span>💎 {balance?.diamonds || 0}</span>
    </div>
  );
}
```

### 2. Purchase Diamonds (After Payment)

```tsx
'use client';

import { usePurchaseDiamonds } from '@/api/query';

export function DiamondPurchaseButton() {
  const purchaseDiamonds = usePurchaseDiamonds();

  const handlePurchase = async () => {
    // This would be called AFTER successful payment verification
    // from your payment provider (Stripe, Apple, Google, etc.)
    
    try {
      const result = await purchaseDiamonds.mutateAsync({
        amount: 100,
        receiptId: 'stripe_receipt_123', // From payment provider
        provider: 'stripe',
        idempotencyKey: `purchase_${Date.now()}`,
      });
      
      console.log(`Purchased! New balance: ${result.diamonds}`);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <button onClick={handlePurchase} disabled={purchaseDiamonds.isPending}>
      {purchaseDiamonds.isPending ? 'Processing...' : 'Buy 100 Diamonds'}
    </button>
  );
}
```

---

## 🔄 Complete Example: Energy System Component

```tsx
'use client';

import {
  useEnergy,
  useConsumeEnergy,
  useRefillEnergy,
  useDiamondBalance,
  useEnergyPricing,
} from '@/api/query';

export function EnergySystem() {
  const { data: energy, isLoading: energyLoading } = useEnergy();
  const { data: diamonds } = useDiamondBalance();
  const { data: pricing } = useEnergyPricing();
  const consumeEnergy = useConsumeEnergy();
  const refillEnergy = useRefillEnergy();

  const handlePlayQuiz = async () => {
    try {
      await consumeEnergy.mutateAsync({
        amount: 1,
        reason: 'quiz_play',
        idempotencyKey: `quiz_${Date.now()}`,
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Not enough energy!');
    }
  };

  const handleRefill = async () => {
    const cost = (pricing?.costPerEnergy || 10) * 5;
    
    if ((diamonds?.diamonds || 0) < cost) {
      alert('Not enough diamonds!');
      return;
    }

    try {
      await refillEnergy.mutateAsync({
        amount: 5,
        idempotencyKey: `refill_${Date.now()}`,
      });
    } catch (error) {
      alert('Refill failed!');
    }
  };

  if (energyLoading) return <div>Loading...</div>;

  return (
    <div className="energy-system">
      <div className="stats">
        <div className="energy">
          ⚡ Energy: {energy?.energy}/{energy?.maxEnergy}
        </div>
        <div className="diamonds">
          💎 Diamonds: {diamonds?.diamonds || 0}
        </div>
      </div>

      {energy && energy.energy < energy.maxEnergy && energy.nextRefillAt && (
        <p className="refill-timer">
          Next refill: {new Date(energy.nextRefillAt).toLocaleTimeString()}
        </p>
      )}

      <div className="actions">
        <button
          onClick={handlePlayQuiz}
          disabled={!energy || energy.energy < 1 || consumeEnergy.isPending}
          className="play-btn"
        >
          {consumeEnergy.isPending ? 'Starting...' : 'Play Quiz (1 ⚡)'}
        </button>

        <button
          onClick={handleRefill}
          disabled={refillEnergy.isPending}
          className="refill-btn"
        >
          {refillEnergy.isPending
            ? 'Refilling...'
            : `Refill 5 ⚡ (${(pricing?.costPerEnergy || 10) * 5} 💎)`}
        </button>
      </div>
    </div>
  );
}
```

---

## 📜 Transaction History

```tsx
'use client';

import { useEnergyTransactions } from '@/api/query';

export function EnergyHistory() {
  const { data: transactions, isLoading } = useEnergyTransactions({ limit: 10 });

  if (isLoading) return <div>Loading history...</div>;

  return (
    <div className="transaction-history">
      <h3>Energy History</h3>
      <ul>
        {transactions?.map((tx) => (
          <li key={tx.id}>
            <span>{tx.type}</span>
            <span>{tx.amount > 0 ? '+' : ''}{tx.amount}</span>
            <span>{new Date(tx.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎨 Integration with Existing Components

### Update ShopCard.tsx

```tsx
// In your ShopCard component
import { usePurchaseDiamonds } from '@/api/query';

export function ShopCard({ product }: { product: DiamondPackage }) {
  const purchaseDiamonds = usePurchaseDiamonds();

  const handlePurchase = async () => {
    // 1. Process payment with your provider
    const receipt = await processPayment(product.price);
    
    // 2. Grant diamonds after successful payment
    await purchaseDiamonds.mutateAsync({
      amount: product.diamonds,
      receiptId: receipt.id,
      provider: 'stripe',
      idempotencyKey: receipt.id,
    });
  };

  return (
    <div className="shop-card">
      <h3>{product.diamonds} Diamonds</h3>
      <p>${product.price}</p>
      <button onClick={handlePurchase}>
        Purchase
      </button>
    </div>
  );
}
```

---

## 🔧 Advanced Usage

### Optimistic Updates

The hooks automatically handle optimistic updates:
- Energy consumption shows instant UI feedback
- Diamond spending updates balance immediately
- Rollback on error automatically

### Error Handling

```tsx
const consumeEnergy = useConsumeEnergy({
  onError: (error: any) => {
    if (error.response?.status === 400) {
      toast.error('Not enough energy!');
    } else if (error.response?.status === 409) {
      toast.error('Duplicate transaction detected');
    } else {
      toast.error('Something went wrong');
    }
  },
  onSuccess: () => {
    toast.success('Energy consumed!');
  },
});
```

### Custom Refetch Intervals

```tsx
// Faster refetch for energy (every 10 seconds)
const { data: energy } = useEnergy({
  refetchInterval: 10 * 1000,
});

// Disable auto-refetch
const { data: energy } = useEnergy({
  refetchInterval: false,
});
```

---

## 🐛 Debugging

### React Query DevTools

The DevTools are automatically enabled in development. Look for the React Query icon in the bottom-right corner of your browser.

You can:
- Inspect query cache
- See refetch intervals
- Monitor mutations
- Debug stale queries

### Manual Cache Invalidation

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/query';

function MyComponent() {
  const queryClient = useQueryClient();

  const forceRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.energy.status });
    queryClient.invalidateQueries({ queryKey: queryKeys.diamonds.balance });
  };

  return <button onClick={forceRefresh}>Refresh</button>;
}
```

---

## ✅ Best Practices

1. **Always use idempotency keys** for mutations
2. **Handle errors gracefully** with user-friendly messages
3. **Show loading states** during mutations
4. **Disable buttons** while mutations are pending
5. **Use optimistic updates** for better UX
6. **Monitor React Query DevTools** during development

---

## 🚀 Next Steps

1. Integrate energy display in your header/navbar
2. Add energy check before quiz start
3. Implement diamond shop UI
4. Add transaction history page
5. Set up payment provider integration
6. Test all flows thoroughly

---

**Need help?** Check the implementation plan for more details!
