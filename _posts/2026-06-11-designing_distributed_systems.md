---
title: Designing Distributed Systems
description: A Comprehensive Guide to Designing and Implementing Distributed Systems
image: /assets/images/designing_distributed_systems.jpg
tags: [کتاب, مهندسی, برنامه_نویسی]
---

## توضیحات
کتاب *Designing Distributed Systems* نوشته‌ی **Brendan Burns** یک راهنمای عملی برای طراحی سیستم‌های توزیع‌شده با استفاده از design patternهای مبتنی بر container است. این کتاب برای اولین بار در تاریخ مهندسی نرم‌افزار، زبان مشترکی از patternها را برای distributed systems معرفی می‌کند — شبیه به کاری که Gang of Four برای object-oriented design انجام دادند.  
ایده‌ی محوری کتاب این است که reusable containerized components می‌توانند مثل توابع استاندارد در برنامه‌نویسی، مبنای ساخت سیستم‌های پیچیده‌تر باشند. تمام مثال‌های عملی با Kubernetes پیاده‌سازی شده‌اند که این کتاب را از یک بحث انتزاعی به یک ابزار کاربردی تبدیل می‌کند.

## نظر
- `امتیاز` : 07/10
- `به دیگران توصیه می‌کنم` : بله
- `دوباره می‌خوانم` : خیر
- `ایده برجسته` : distributed systems هم مثل OOP به design patternهای استاندارد نیاز دارند؛ نام‌گذاری مشترک روی patternها (Sidecar, Ambassador, Scatter/Gather) باعث می‌شود تیم‌ها سریع‌تر communicate کنند و سیستم‌ها قابل‌فهم‌تر طراحی شوند
- `تاثیر در من` : نگاه من به معماری microservices از «سرویس‌های جداگانه» به «patternهای ترکیب‌پذیر» تغییر کرد. مفاهیم Sidecar و Ambassador مستقیماً در طراحی API gateway و service mesh کاربرد دارد
- `نکات مثبت` : معرفی زبان مشترک برای توصیف distributed patterns، دیاگرام‌های واضح برای هر pattern، مثال‌های عملی با Kubernetes، کتاب نسبتاً کوتاه و متمرکز است و وقت زیادی نمی‌برد، نویسنده از co-creatorهای Kubernetes است و دانش او کاملاً تجربی است
- `نکات منفی` : عمق فنی در برخی فصل‌ها کم است و بیشتر به سطح معرفی می‌ماند؛ تمرکز زیاد بر Kubernetes ممکن است برای کسانی که از orchestratorهای دیگر استفاده می‌کنند محدودکننده باشد؛ مباحث consistency، consensus (Raft/Paxos) و fault tolerance در سطح نظری پوشش داده نشده‌اند — برای آنها باید سراغ *Designing Data-Intensive Applications* رفت

## مشخصات
- `نویسنده` : Brendan Burns
- `انتشارات` : O'Reilly Media
- `صفحه مشخصات` : [oreilly.com/library/view/designing-distributed-systems/9781491983638](https://www.oreilly.com/library/view/designing-distributed-systems/9781491983638/)

## بخش‌هایی از کتاب

