---
title: Entity Framework Core in Action
description: A Comprehensive Guide to Using Entity Framework Core
image: /assets/images/entity_framework_core_in_action.jpg
tags: [کتاب, مهندسی, برنامه_نویسی]
---

## توضیحات
کتاب *Entity Framework Core in Action* نوشته‌ی **Jon P. Smith** یک راهنمای جامع و عملی برای کار با EF Core در اپلیکیشن‌های .NET است. این کتاب با رویکردی واقع‌گرایانه، نه‌تنها نحوه‌ی استفاده از EF Core را آموزش می‌دهد، بلکه الگوها و best practiceهای مورد نیاز در محیط production را نیز پوشش می‌دهد.  
ویرایش دوم (2021) با 624 صفحه، بر اساس تجربه‌ی واقعی نویسنده در پروژه‌های enterprise نوشته شده و شامل مطالب جدیدی درباره‌ی NoSQL، performance tuning، و unit testing است. پروژه‌ی عملی کتاب یک اپلیکیشن فروشگاه کتاب آنلاین است که به‌تدریج ساخته و بهبود داده می‌شود — رویکردی که یادگیری را ملموس و کاربردی می‌کند.

## نظر
- `امتیاز` : 08/10
- `به دیگران توصیه می‌کنم` : بله
- `دوباره می‌خوانم` : بله
- `ایده برجسته` : EF Core فقط یک ORM نیست — نحوه‌ی طراحی مدل و ارتباط آن با business logic مستقیماً روی performance و maintainability اپلیکیشن تأثیر می‌گذارد؛ تفکیک لایه‌ها و آگاهی از SQL تولیدشده از همان ابتدا ضروری است
- `تاثیر در من` : نگاه من به EF Core از «ابزار ساده برای دسترسی به دیتابیس» به «لایه‌ای که باید معماری‌اش درست طراحی شود» تغییر کرد. فصل‌های performance و unit testing به‌طور مستقیم در پروژه‌های .NET 6/8 قابل استفاده است
- `نکات مثبت` : مثال‌های واقعی و کاربردی با پروژه‌ی عملی، پوشش کامل performance tuning و N+1 problem، نگاه جدی به unit testing با EF Core، توضیح DDD در کنار EF Core، بیش از 100 دیاگرام که درک مفاهیم را آسان می‌کند، کد کتاب به‌صورت کامل روی GitHub موجود است
- `نکات منفی` : ویرایش دوم بر اساس EF Core در .NET 5 نوشته شده و برخی API های EF Core 7/8 (مثل bulk operations بومی، JSON columns، complex types) در آن نیست؛ برای استفاده در .NET 8 باید release notes رسمی مایکروسافت را موازی مطالعه کرد. همچنین مباحث Interceptors و Compiled queries عمق کمتری نسبت به انتظار دارد

## مشخصات
- `نویسنده` : Jon P. Smith
- `انتشارات` : Manning Publications
- `صفحه مشخصات` : [manning.com/books/entity-framework-core-in-action-second-edition](https://www.manning.com/books/entity-framework-core-in-action-second-edition)

## بخش‌هایی از کتاب

