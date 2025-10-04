# ⚡ Daily Quick Test - 5 Minute Checkup

**Purpose**: Fast daily health check of critical application paths  
**Time Required**: ~5 minutes  
**When to Run**: Every morning, after deployments, or after database changes

---

## 🎯 Quick Start

### Option 1: Manual UI Test (5 min)
Follow the checklist below in your browser.

### Option 2: Console Script (2 min)
1. Open browser console (F12)
2. Navigate to your app
3. Run: `quickDailyTest()`

---

## ✅ Manual Daily Checklist

### 1️⃣ Data Health (30 sec)
**Goal**: Verify database is accessible

- [ ] Open `/admin` and login with `monaco1@ya.ru`
- [ ] Check dashboard shows statistics (bookings, orders, feedback counts)
- [ ] **PASS**: Numbers display, no "0" everywhere
- [ ] **FAIL**: Error messages, all zeros, or infinite loading

**Quick Fix**: Check Supabase connection, verify RLS policies

---

### 2️⃣ Guest Access (1 min)
**Goal**: Token-based authentication works

- [ ] In admin panel → "Генератор ссылок" tab
- [ ] Select any booking and generate link
- [ ] Copy link and open in incognito/private window
- [ ] Wait for authentication
- [ ] **PASS**: Redirects to home with guest name displayed
- [ ] **FAIL**: Error page, infinite loading, or no personalization

**Quick Fix**: Check `bookings` table has `access_token`, verify `visible_to_guests=true`

---

### 3️⃣ Core Orders - Shop (1 min)
**Goal**: Shop catalog loads and cart works

- [ ] Navigate to `/shop`
- [ ] Verify items display with prices
- [ ] Click "+" on any item
- [ ] **PASS**: Cart updates, total calculates
- [ ] **FAIL**: No items, broken images, cart doesn't update

**Quick Fix**: Check `shop_items` table has `is_active=true` items

---

### 4️⃣ Core Orders - Travel (1 min)
**Goal**: Travel services load

- [ ] Navigate to `/travel`
- [ ] Click "Дополнительные услуги" tab
- [ ] Verify services display
- [ ] **PASS**: Services visible with prices and descriptions
- [ ] **FAIL**: Empty state, loading errors

**Quick Fix**: Check `travel_services` table has active items

---

### 5️⃣ Notifications (1 min)
**Goal**: Edge functions operational

- [ ] Submit a quick shop order (use test data)
- [ ] Open Supabase Dashboard → Functions → `submit-shop-order` → Logs
- [ ] **PASS**: Recent log entry, status 200, no errors
- [ ] **FAIL**: No logs, error status, or exception

**Quick Fix**: Check edge function deployed, verify `RESEND_API_KEY` secret

---

### 6️⃣ Host Portal (30 sec)
**Goal**: Host login and view works

- [ ] Navigate to `/host`
- [ ] Login with any host email from database
- [ ] **PASS**: Bookings list displays
- [ ] **FAIL**: Login error, no bookings visible

**Quick Fix**: Check `rooms` table has `host_email` set

---

## 🔴 Critical Failure Indicators

Stop and investigate immediately if you see:

- ❌ **"Failed to fetch"** errors → Supabase connection issue
- ❌ **All pages show demo data** → Token authentication broken
- ❌ **No items in shop/travel** → Database tables empty or RLS too strict
- ❌ **Edge function logs empty** → Functions not deployed
- ❌ **Console full of errors** → JavaScript errors need fixing

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

✅ Data Health
✅ Guest Access  
✅ Shop Orders
✅ Travel Services
✅ Notifications
✅ Host Portal

Issues Found: ___________
Time to Fix: ___________
```

---

## 🚀 Console Quick Test Script

If you prefer automation, run this in browser console:

```javascript
// Run the quick daily test
quickDailyTest();

// Or run individual checks:
quickTests.db();
quickTests.guest();
quickTests.shop();
quickTests.travel();
```

See `tests/app-tests.ts` for full test implementation.

---

## 📈 When to Run Full Test Suite

Run the complete manual test suite (see `MANUAL_TEST_INSTRUCTIONS.md`) when:

- 🔄 Major feature releases
- 🗄️ Database migrations executed
- 🆕 New edge functions deployed
- 🐛 After fixing critical bugs
- 📅 Weekly comprehensive check

---

## 💡 Pro Tips

1. **Bookmark this page** for quick access
2. **Run in incognito mode** to test clean sessions
3. **Check different browsers** weekly (Chrome, Safari, Firefox)
4. **Keep console open** to catch silent errors
5. **Screenshot failures** for faster debugging

---

## 🔗 Related Resources

- Full Test Suite: `MANUAL_TEST_INSTRUCTIONS.md`
- Automated Tests: `tests/app-tests.ts`
- Edge Function Logs: [Supabase Dashboard](https://supabase.com/dashboard/project/xsklkktajwtcdgkmmsrk/functions)
- Database Tables: [Supabase Tables](https://supabase.com/dashboard/project/xsklkktajwtcdgkmmsrk/editor)

---

**Last Updated**: 2025  
**Version**: 1.0
