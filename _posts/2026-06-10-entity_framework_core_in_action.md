---
title: Entity Framework Core in Action
description: A Comprehensive Guide to Using Entity Framework Core
image: /assets/images/entity_framework_core_in_action.jpg
tags: [کتاب, مهندسی, برنامه_نویسی]
categories: [کتاب, مهندسی, برنامه_نویسی]
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
- `صفحه مشخصات` : 

## بخش‌هایی از کتاب

## بخش اول: تعریف بنیادی EF Core و مفهوم O/RM

نویسنده، جان پی. اسمیت، از همان ابتدا EF Core را به‌عنوان یک **Object-Relational Mapper (O/RM)** معرفی می‌کند؛ یعنی کتابخانه‌ای که پلی میان دو دنیای متفاوت می‌سازد: دنیای پایگاه داده رابطه‌ای با API خودش، و دنیای شی‌گرای نرم‌افزار با کلاس‌ها و کد. نکته کلیدی اینجاست که EF Core این نگاشت (mapping) را طوری انجام می‌دهد که توسعه‌دهنده بتواند به‌جای نوشتن مستقیم SQL، با زبانی که برایش آشناتر است (LINQ در C#) با دیتابیس کار کند. 

نویسنده جدولی ارائه می‌دهد که این نگاشت را دقیقاً مشخص می‌کند و از نظر معماری برای شما بسیار مهم است:

| مفهوم در پایگاه داده رابطه‌ای | مفهوم متناظر در نرم‌افزار .NET |
|---|---|
| Table | .NET Class |
| Table columns | Class properties/fields |
| Rows | عناصر داخل کالکشن‌های .NET (مثلاً List) |
| Primary key (تعیین یکتایی ردیف) | یک instance یکتا از کلاس |
| Foreign key (تعریف رابطه) | Reference به کلاس دیگر |
| SQL (مثل WHERE) | LINQ در .NET (مثل Where(p => ...))   |

### دو چالش بنیادی O/RM که نویسنده به‌صراحت هشدار می‌دهد

این بخش از نظر فنی برای شما که دغدغه Performance و Clean Code دارید بسیار مهم است، چون نویسنده اینجا مرز بین «راحتی» و «خطر پنهان» O/RM را ترسیم می‌کند:

**۱. Object-Relational Impedance Mismatch:** پایگاه داده از Primary Key برای یکتایی هر ردیف استفاده می‌کند، در حالی‌که در .NET به‌طور پیش‌فرض یک instance از کلاس با reference آن یکتا شناخته می‌شود، نه با یک کلید. EF Core بخش زیادی از این ناهماهنگی را مدیریت می‌کند، اما نتیجه‌اش این است که کلاس‌های شما مجبورند primary key و foreign key را حمل کنند؛ داده‌ای که از دید منطق تجاری خالص (pure business logic) اضافه است و فقط برای دیتابیس لازم است. 

**۲. پنهان‌سازی بیش‌ازحد دیتابیس:** نویسنده مثالی بسیار مهم می‌زند که نشان می‌دهد EF Core گاهی دیتابیس را آن‌قدر خوب "پنهان" می‌کند که ممکن است فراموش کنید در پس‌زمینه یک دیتابیس واقعی وجود دارد. مثال او:

```csharp
public string FullName => $"{FirstName} {LastName}";
```

این کد در C# خالص کاملاً صحیح و idiomatic است (یک expression-bodied property)، اما اگر بخواهید روی این property فیلتر (Where) یا مرتب‌سازی (OrderBy) در یک LINQ query انجام دهید، EF Core استثنا (Exception) پرتاب می‌کند؛ چون در سمت دیتابیس ستونی به نام FullName وجود ندارد تا SQL بتواند دستور WHERE یا ORDER BY را روی آن اعمال کند. 

**نتیجه‌گیری نویسنده از این دو نکته:** رویکرد پیشنهادی او "Get it working, but be ready to make it faster if I need to" است — یعنی ابتدا EF Core را برای توسعه سریع به کار بگیرید، اما همیشه آماده باشید که در جاهایی performance کافی نباشد و نیاز به بهینه‌سازی داشته باشید (که فصل‌های ۱۴ و ۱۵ کتاب کاملاً به همین موضوع اختصاص دارند). 

---

## بخش دوم: هشدار به توسعه‌دهندگان EF6.x و ورود NoSQL

نویسنده در بخش ۱.۳ صریحاً به کسانی که پیش‌تر با **EF6.x** کار کرده‌اند هشدار می‌دهد که این تجربه می‌تواند دام باشد. او می‌گوید در دوره یادگیری خودش، دانستن EF6.x باعث شد که ناخودآگاه راه‌حل‌های EF6.x را روی مسائل EF Core پیاده کند، در حالی‌که EF Core در بسیاری موارد راه‌حل جدید و متفاوتی دارد؛ توصیه او این است که EF Core را نه یک بروزرسانی ساده، بلکه کتابخانه‌ای مستقل با رفتار داخلی متفاوت در نظر بگیرید. 

نکته فنی مهم‌تر در بخش ۱.۵ مطرح می‌شود: برخلاف EF6.x که فقط برای دیتابیس‌های رابطه‌ای طراحی شده بود، **EF Core از نسخه ۳.۰ به بعد از دیتابیس‌های NoSQL هم پشتیبانی می‌کند** و اولین provider رسمی آن برای Cosmos DB ارائه شد. نویسنده تجربه شخصی خودش را مثال می‌زند: در یک پروژه واحد، هم از SQL Server (رابطه‌ای) و هم از Azure Tables (غیررابطه‌ای) استفاده کرده تا دو نیاز کسب‌وکاری متفاوت را برطرف کند؛ این نشان می‌دهد فلسفه EF Core این است که یک API یکسان روی چند نوع دیتابیس کار کند. 

### تفاوت‌های کلیدی بین دو نوع دیتابیس از دید EF Core

| ویژگی | دیتابیس رابطه‌ای (SQL) | دیتابیس NoSQL (مثل Cosmos DB) |
|---|---|---|
| مقیاس‌پذیری جهانی | محدودتر، نیاز به راه‌حل‌های پیچیده replication | ذاتاً آسان؛ می‌توان چند نسخه در نقاط مختلف جهان داشت   |
| تحمل خطا (Fault tolerance) | نیاز به معماری‌های خاص | اگر یک دیتاسنتر قطع شود، نسخه‌های دیگر جای آن را می‌گیرند   |
| پیچیدگی دستورات پشتیبانی‌شده | کامل (JOIN، تراکنش پیچیده و ...) | محدودتر، به نفع scalability و performance برخی دستورات پیچیده حذف شده‌اند   |
| Provider در EF Core | از ابتدا پشتیبانی کامل | از EF Core 3.0 با Cosmos DB (فصل ۱۶ کتاب به‌طور اختصاصی آن را بررسی می‌کند)   |

نکته جمع‌بندی نویسنده این است که با گسترش پشتیبانی EF Core از NoSQL، احتمالاً provider‌های بیشتری برای دیتابیس‌های غیررابطه‌ای دیگر هم در آینده نوشته خواهد شد؛ این یعنی مهارت EF Core شما را برای طیف وسیع‌تری از دیتابیس‌ها آماده می‌کند، نه فقط SQL Server. 

---

## بخش سوم: اولین اپلیکیشن و مدل داده

نویسنده در بخش ۱.۶ یک کنسول‌اپلیکیشن ساده به نام **MyFirstEfCoreApp** معرفی می‌کند که چهار کتاب را لیست می‌کند و امکان بروزرسانی URL یک کتاب را می‌دهد؛ هدف این مثال نه پیچیدگی کد، بلکه نمایش دقیق نحوه کار EF Core در پس‌صحنه است. او تصریح می‌کند برای این کار به NuGet package مخصوص دیتابیس هدف نیاز دارید؛ مثلاً برای SQL Server باید Microsoft.EntityFrameworkCore.SqlServer را نصب کنید، و نکته مهم اینکه نسخه Major.Minor این پکیج باید با نسخه پروژه شما هم‌خوانی داشته باشد. 

### دو رویکرد ساخت دیتابیس: Code-First در برابر Database-First

نویسنده در بخش ۱.۷ تفاوت این دو رویکرد را روشن می‌کند: در **Code-First** (رویکرد اصلی این کتاب)، شما کلاس‌های C# را می‌نویسید و EF Core دیتابیس را از روی آن‌ها می‌سازد؛ در **Database-First** دیتابیس از قبل وجود دارد و کلاس‌ها را با آن هم‌سو می‌کنید. یک نکته فنی مهم برای کسانی که پیش‌زمینه EF6.x دارند: EF Core دیگر رویکرد سوم قدیمی یعنی **Design-First** (طراحی بصری با EDMX Designer) را پشتیبانی نمی‌کند و قرار هم نیست پشتیبانی کند. 

### ساختار دیتابیس نمونه: دو جدول Books و Author

دیتابیس نمونه فقط دو جدول دارد که رابطه یک‌به‌چند بین آن‌ها برقرار است:

| جدول | ستون‌ها | نکته |
|---|---|---|
| Books | BookId (PK), Title, Description, PublishedOn, AuthorId (FK) | نام جدول از روی property به‌نام DbSet<Book> Books در DbContext گرفته می‌شود   |
| Author | AuthorId (PK), Name, WebUrl | چون DbSet مستقیم ندارد، EF Core نام جدول را از نام کلاس (Author) می‌گیرد   |

این نکته دقیقاً به یکی از دغدغه‌های شما (Clean Code و رعایت conventionها) مرتبط است: نامگذاری جدول در EF Core یا از property نوع DbSet در Context گرفته می‌شود، یا در غیاب آن، از نام کلاس entity استفاده می‌شود.

### کلاس‌های Book و Author: پیاده‌سازی OOP نگاشت‌شده به دیتابیس

نویسنده در بخش ۱.۸.۱ کلاس Book را به‌عنوان الگوی تیپیک یک entity class نمایش می‌دهد. کد اصلی کتاب دقیقاً به این صورت است:

```csharp
public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime PublishedOn { get; set; }
    public int AuthorId { get; set; }
    public Author Author { get; set; }
}
```

سه نکته فنی حیاتی درباره این کد که نویسنده تأکید می‌کند:

- **Primary Key به‌صورت Convention:** نام property به‌صورت `BookId` (یعنی `<ClassName>Id`) به EF Core می‌گوید که این ستون کلید اصلی جدول Books است، بدون نیاز به annotation صریح. 
- **Foreign Key:** پراپرتی `AuthorId` از نوع `int` دقیقاً با کلید اصلی جدول Author تطبیق دارد و رابطه بین دو جدول را در سطح دیتابیس برقرار می‌کند. 
- **Navigational Property:** پراپرتی `Author Author` یک navigational property است؛ EF Core از آن برای دو کار استفاده می‌کند: هنگام Save کردن، اگر یک نمونه Author به این پراپرتی متصل باشد، EF Core مقدار AuthorId را خودش تنظیم می‌کند؛ و هنگام Load کردن، متد `Include` می‌تواند این پراپرتی را با نمونه واقعی Author که از طریق foreign key به آن مرتبط است پر کند. 

کلاس Author نیز دقیقاً همین ساختار را دنبال می‌کند و از همان قرارداد نام‌گذاری `<ClassName>Id` برای کلید اصلی استفاده می‌کند. 

---

## بخش چهارم: مدل‌سازی و خواندن داده در پس‌صحنه EF Core

### مرحله ۱: Modeling the database (مدل‌سازی داخلی)

نکته حیاتی که نویسنده تأکید می‌کند این است که وقتی EF Core مدل داخلی خود را می‌سازد، **اصلاً به دیتابیس واقعی نگاه نمی‌کند**. این مدل صرفاً از روی این منابع ساخته می‌شود: 

- بررسی کلاس‌های entity (مثل Book و Author) و property هایشان با استفاده از قراردادهای نام‌گذاری (Convention) 
- اجرای متد مجازی `OnModelCreating` در DbContext که در آن می‌توانید با Fluent API تنظیمات اضافه بدهید 
- کش کردن این مدل نهایی برای سرعت بیشتر در دسترسی‌های بعدی 

نویسنده هشدار می‌دهد که چون این مدل‌سازی مستقل از دیتابیس واقعی است، اگر بین آنچه EF Core فکر می‌کند دیتابیس باید باشد و ساختار واقعی دیتابیس ناهم‌خوانی (mismatch) وجود داشته باشد، مشکلاتی بروز می‌کند؛ پس ساخت دقیق این مدل در کد اهمیت زیادی دارد. 

### مرحله ۲: Reading data from the database (خواندن داده)

نویسنده کد واقعی متد `ListAll` را نشان می‌دهد که تمام کتاب‌ها را همراه نویسنده‌شان چاپ می‌کند:

```csharp
public static void ListAll()
{
    using (var db = new AppDbContext())
    {
        foreach (var book in
            db.Books.AsNoTracking()
            .Include(book => book.Author))
        {
            var webUrl = book.Author.WebUrl == null
                ? "- no web URL given -"
                : book.Author.WebUrl;
            Console.WriteLine(
                $"{book.Title} by {book.Author.Name}");
            Console.WriteLine("     " +
                "Published on " +
                $"{book.PublishedOn:dd-MMM-yyyy}" +
                $". {webUrl}");
        }
    }
}
```

نویسنده این query را به سه مرحله دقیق تجزیه می‌کند که فهم آن‌ها برای بهینه‌سازی Performance ضروری است: 

- **ترجمه به SQL:** عبارت `db.Books.AsNoTracking().Include(book => book.Author)` توسط database provider به یک دستور SQL ترجمه می‌شود؛ این ترجمه cache می‌شود تا در فراخوانی‌های بعدی هزینه ترجمه دوباره پرداخت نشود. 
- **اجرای بهینه در یک Round-trip:** به‌جای دو تماس جدا برای Books و Author، EF Core این دو جدول را با یک `INNER JOIN` در **یک** دستور SQL واحد می‌خواند: 

```sql
SELECT [b].[BookId], [b].[AuthorId], [b].[Description],
       [b].[PublishedOn], [b].[Title],
       [a].[AuthorId], [a].[Name], [a].[WebUrl]
FROM [Books] AS [b]
INNER JOIN [Author] AS [a] ON [b].[AuthorId] = [a].[AuthorId]
```

- **Relational Fixup:** پس از دریافت داده، EF Core آن را به instance های کلاس .NET تبدیل می‌کند و با استفاده از foreign key ها، ارتباط بین آبجکت‌ها را به‌صورت reference برقرار می‌کند (این فرآیند را relational fixup می‌نامند). چون در این مثال `AsNoTracking` استفاده شده، این fixup به نسخه ساده‌شده و سریع‌تر انجام می‌شود، بدون ساخت tracking snapshot. 

### چرا AsNoTracking برای شما مهم است

این دقیقاً همان الگویی است که در فصل ۱۴ کتاب به‌عنوان یک best practice برای Performance معرفی می‌شود: نویسنده صریحاً می‌گوید همیشه برای query هایی که فقط خواندن هستند (read-only)، متد `AsNoTracking` را اضافه کنید، چون EF Core دیگر نیازی به نگه‌داشتن یک snapshot از داده برای تشخیص تغییرات بعدی ندارد و همین امر سربار پردازشی را کاهش می‌دهد. 

---

## بخش پنجم: مکانیزم Update و تصمیم نهایی درباره استفاده از EF Core

### مرحله ۳: Updating the database (بروزرسانی)

نویسنده در بخش ۱.۹.۳ فرآیند بروزرسانی را در سه گام دقیق توضیح می‌دهد که در فصل ۳ به‌طور کامل بسط داده می‌شود، اما اینجا اصل قضیه را نشان می‌دهد: 

- **خواندن با Tracking:** برخلاف کوئری خواندنی که در بخش قبل با `AsNoTracking` انجام شد، برای Update باید entity را به‌صورت **tracked** بخوانید (بدون AsNoTracking)، چون EF Core باید یک نسخه اصلی (snapshot) از داده را نگه دارد تا بعداً تغییرات را تشخیص دهد. 
- **تغییر Property:** شما فقط property مورد نظر را در نمونه C# تغییر می‌دهید؛ هیچ دستور صریحی به EF Core نمی‌دهید که "این ستون تغییر کرد". 
- **SaveChanges و DetectChanges:** وقتی `SaveChanges` را صدا می‌زنید، متد داخلی `DetectChanges` نسخه فعلی entity را با آن snapshot اولیه مقایسه می‌کند و دقیقاً تشخیص می‌دهد کدام property تغییر کرده است. 

نویسنده کد واقعی این فرآیند را این‌طور نشان می‌دهد:

```csharp
var book = context.Books
    .SingleOrDefault(p => p.Title == "Quantum Networking");
if (book == null)
    throw new Exception("Book not found");
book.PublishedOn = new DateTime(2058, 1, 1);
context.SaveChanges();
```

نکته فنی حیاتی برای Performance: EF Core فقط ستونی را در SQL بروزرسانی می‌کند که واقعاً تغییر کرده، نه همه ستون‌های جدول:

```sql
UPDATE [Books]
   SET [PublishedOn] = @p0
WHERE [BookId] = @p1;
```

### پنج گام داخلی SaveChanges (که نویسنده در بخش ۱.۹.۳ فهرست می‌کند)

نویسنده در ادامه، این فرآیند را به یک چرخه کامل‌تر تعمیم می‌دهد که در بخش‌های بعدی کتاب (فصل ۱۱) عمیق‌تر بررسی می‌شود:

1. EF Core متد `DetectChanges` را اجرا و entity های تغییریافته را پیدا می‌کند. 
2. یک Transaction آغاز می‌شود؛ به این معنا که هر بروزرسانی دیتابیس یک واحد atomic است — یا همه تغییرات با موفقیت اعمال می‌شوند، یا هیچ‌کدام، تا دیتابیس در حالت ناقص باقی نماند. 
3. درخواست بروزرسانی توسط database provider به دستور SQL متناظر تبدیل می‌شود. 
4. اگر SQL موفق باشد، Transaction commit می‌شود؛ در غیر این صورت، یک exception پرتاب می‌شود. 

### تصمیم نهایی: چه زمانی EF Core را انتخاب کنیم و چه زمانی نه

نویسنده بخش ۱.۱۱ را به شش دلیل برای استفاده از EF Core اختصاص می‌دهد که مهم‌ترین‌هایشان برای شما این‌ها هستند: **متن‌باز بودن و شفافیت جامعه توسعه**، **پشتیبانی چندسکویی** (Windows، Linux، Apple)، و مهم‌تر از همه فلسفه‌ای که نویسنده مکرراً تکرار می‌کند: **"Get it working, but be ready to make it faster if I need to"** — یعنی EF Core را برای توسعه سریع به کار بگیرید، و در ۵ تا ۱۰ درصد کوئری‌های حساس، دستی performance-tune کنید یا حتی به SQL خام (Dapper/ADO.NET) سوییچ کنید. 

---

## بخش ششم: معرفی دیتابیس Book App و انواع رابطه‌ها

### چرا یک اپلیکیشن واقعی‌تر؟

نویسنده در ابتدای فصل دوم توضیح می‌دهد که برخلاف مثال ساده فصل اول (که فقط یک رابطه one-to-many بین Book و Author داشت)، اکنون یک دیتابیس فروش کتاب واقعی‌تر معرفی می‌کند که همه‌ی انواع رابطه‌های رایج در EF Core را پوشش می‌دهد. 

### سه نوع رابطه اصلی در دیتابیس Book App

نویسنده جدول Books را مرکز این دیتابیس قرار می‌دهد و آن را به چهار جدول دیگر متصل می‌کند، که هرکدام یک نوع رابطه متفاوت را نشان می‌دهند:

| نوع رابطه | جدول‌های مرتبط | توضیح نویسنده |
|---|---|---|
| One-to-one-or-zero | Books ↔ PriceOffers | هر کتاب ممکن است یک تخفیف ویژه داشته یا نداشته باشد   |
| One-to-many | Books ↔ Review | هر کتاب می‌تواند صفر تا چند نظر (Review) داشته باشد   |
| Many-to-many (دستی) | Books ↔ Authors | از طریق جدول واسط BookAuthor که شامل ستون Order هم است تا ترتیب نمایش نام نویسندگان حفظ شود   |
| Many-to-many (خودکار EF Core 5) | Books ↔ Tags | از طریق جدول BookTag که خود EF Core آن را بدون نیاز به تعریف کلاس مربوطه می‌سازد   |

نکته فنی مهمی که نویسنده تأکید می‌کند این است که در رابطه many-to-many دستی بین Books و Authors، کلیدهای خارجی (foreign key) به‌عنوان کلید اصلی (primary key) جدول واسط استفاده می‌شوند تا اطمینان حاصل شود بین یک کتاب و یک نویسنده فقط یک لینک ممکن است وجود داشته باشد. 

### کلاس‌های Entity که به دیتابیس نگاشت می‌شوند

نویسنده پنج کلاس دات‌نت (Book، PriceOffer، Review، Tag، Author) و یک کلاس واسط (BookAuthor) می‌سازد که او این‌ها را entity class می‌نامد؛ نکته‌ای که تأکید می‌کند این است که از منظر نرم‌افزاری، هیچ چیز خاصی در این کلاس‌ها نیست — آن‌ها POCO (Plain Old CLR Object) معمولی هستند و صرفاً به این دلیل entity نامیده می‌شوند که EF Core آن‌ها را به دیتابیس نگاشت کرده است. کلاس اصلی Book این‌گونه تعریف می‌شود: 

```csharp
public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime PublishedOn { get; set; }
    public string Publisher { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }

    public PriceOffer Promotion { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Tag> Tags { get; set; }
    public ICollection<BookAuthor> AuthorsLink { get; set; }
}
```

نکته طراحی ظریفی که نویسنده در یادداشت پیشرفته (Advanced Note) اشاره می‌کند این است که او عمداً به‌جای `HashSet<T>` از `ICollection<T>` برای property های ناوبری (navigational) استفاده کرده، چون HashSet تضمینی برای حفظ ترتیب عناصر نمی‌دهد، در حالی که قابلیت eager loading با مرتب‌سازی (که در بخش بعد می‌بینیم) نیاز به یک collection مرتب دارد؛ او هشدار می‌دهد که این انتخاب هزینه‌ی Performance‌ای در مقابل HashSet دارد که در فصل ۱۴ به آن می‌پردازد. 

---

## بخش هفتم: تعریف و ساخت DbContext

### تعریف EfCoreContext

نویسنده تأکید می‌کند که برای دسترسی به دیتابیس، دو گام ضروری وجود دارد: نخست تعریف application's DbContext با ارث‌بری از کلاس `DbContext` در EF Core، و دوم ساخت یک نمونه (instance) از آن هر بار که نیاز به دسترسی به دیتابیس دارید. نکته مهمی که نویسنده اشاره می‌کند این است که DbContext کتاب فروشی (Book App) عمداً `DbSet<T>` را برای Review و BookAuthor تعریف نمی‌کند، چون این دو کلاس همیشه از طریق navigational property های کلاس Book در دسترس قرار می‌گیرند، نه به‌صورت مستقیم. 

### چرا نویسنده از OnConfiguring صرف‌نظر می‌کند

در فصل اول، نویسنده رشته اتصال (connection string) را با override کردن متد `OnConfiguring` تنظیم کرده بود، اما در این فصل رویکرد بهتری معرفی می‌کند: ارائه database options از طریق سازنده (constructor) کلاس DbContext. دلیل این تغییر رویکرد این است که در دنیای واقعی معمولاً به دیتابیس‌های متفاوتی برای development و unit testing نیاز دارید، و روش constructor این انعطاف‌پذیری را فراهم می‌کند: 

```csharp
public class EfCoreContext : DbContext
{
    public EfCoreContext(DbContextOptions<EfCoreContext> options)
        : base(options) {}

    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<PriceOffer> PriceOffers { get; set; }
    public DbSet<Tag> Tags { get; set; }
}
```

### ساخت نمونه DbContext (پیش‌نمایش)

نویسنده اشاره می‌کند که در همین فصل، از یک روش دستی برای ساخت `DbContextOptionsBuilder` استفاده خواهد کرد که مناسب unit testing است، اما در فصل پنجم (وقتی به ASP.NET Core می‌رسیم) روش بسیار قدرتمندتری معرفی می‌شود: **Dependency Injection**. در آن روش، به‌جای ساخت دستی options، خودِ فریم‌ورک ASP.NET Core یک نمونه از `EfCoreContext` را با استفاده از رشته اتصالی که در فایل `appsettings.json` تعریف شده، برایتان می‌سازد: 

```csharp
services.AddDbContext<EfCoreContext>(
    options => options.UseSqlServer(connection));
```

نکته کلیدی برای شما به‌عنوان یک توسعه‌دهنده Senior این است که این جداسازی بین تعریف DbContext و نحوه‌ی تامین connection string، دقیقاً همان اصل Separation of Concerns است که در فصل‌های بعدی (به‌ویژه فصل ۱۳ درباره معماری) بسط داده می‌شود؛ به همین دلیل نویسنده در فصل ۵ حتی `IDbContextFactory<TContext>` را هم برای سناریوهایی مثل Blazor Server معرفی می‌کند که در آن‌ها مدیریت دستی و موازی instance های DbContext ضروری است. 

---

## بخش هشتم: آناتومی یک کوئری EF Core

### سه جزء تشکیل‌دهنده هر کوئری

نویسنده در بخش ۲.۳ هر کوئری EF Core را به سه جزء منطقی تجزیه می‌کند که با مثال زیر نشان داده می‌شوند: 

```csharp
context.Books.Where(p => p.Title.StartsWith("Quantum")).ToList();
```

- **دسترسی به Property در DbContext:** بخش `context.Books` نقطه شروع است؛ شما همیشه باید از طریق یک `DbSet<T>` در application's DbContext به جدول متصل شوید. 
- **زنجیره‌ای از دستورات LINQ/EF Core:** بخش `.Where(...)` بدنه اصلی کوئری است و می‌تواند از یک فیلتر ساده تا کوئری‌های بسیار پیچیده متغیر باشد. 
- **دستور Execute:** بخش `.ToList()` است که کوئری را واقعاً روی دیتابیس اجرا می‌کند.

### چرا Execute Command اهمیت حیاتی دارد

نکته فنی بسیار مهمی که نویسنده تأکید می‌کند این است که تا زمانی که یک execute command در پایان زنجیره فراخوانی نشود، LINQ صرفاً به‌صورت یک **Expression Tree** نگه داشته می‌شود و هیچ کوئری‌ای روی دیتابیس اجرا نشده است. کوئری فقط در این شرایط اجرا می‌شود: 

- هنگام پیمایش با `foreach`
- هنگام فراخوانی متدهای جمع‌آورنده مثل `ToArray`، `ToDictionary`، `ToList`، `ToListAsync`
- هنگام استفاده از عملگرهای LINQ مثل `First` یا `Any` در بیرونی‌ترین بخش کوئری 

توصیه Performance‌ای که نویسنده به‌عنوان یک اصل طلایی مطرح می‌کند این است: همیشه دستورات فیلتر، مرتب‌سازی، و صفحه‌بندی (paging) را **قبل از** execute command قرار دهید، تا این عملیات در سمت دیتابیس اجرا شوند، نه در حافظه نرم‌افزار شما. 

### دو نوع کوئری: Read-Write و Read-Only

نویسنده در بخش ۲.۳.۴ دو نوع کوئری را از هم متمایز می‌کند که این تمایز در تمام کتاب (به‌ویژه فصل ۶ و ۱۴) تکرار می‌شود:

| نوع کوئری | نام دیگر | کاربرد |
|---|---|---|
| Normal query | Read-write query | برای دادهایی که قرار است بعداً Update یا در رابطه جدید استفاده شوند   |
| AsNoTracking query | Read-only query | با افزودن متد `AsNoTracking`؛ هم کوئری را فقط‌خواندنی می‌کند و هم با غیرفعال کردن ویژگی‌های ردیابی EF Core، Performance را بهبود می‌دهد   |

```csharp
context.Books.AsNoTracking()
    .Where(p => p.Title.StartsWith("Quantum")).ToList();
```

### پیش‌درآمد بخش بعدی: چهار روش بارگذاری داده‌های مرتبط

نویسنده نکته بسیار مهمی را پیش از ورود به بخش ۲.۴ گوشزد می‌کند: به‌صورت پیش‌فرض، EF Core **هیچ رابطه‌ای** را بارگذاری نمی‌کند. اگر شما یک Book را load کنید، property های ناوبری آن (Promotion، Reviews، AuthorsLink) به‌صورت پیش‌فرض null خواهند بود، مگر اینکه صریحاً از کد بخواهید آن‌ها را بارگذاری کند. این رفتار عمداً طراحی شده تا تعداد دسترسی‌های به دیتابیس را به حداقل برساند، و نویسنده در بخش بعدی چهار روش برای بارگذاری این روابط را معرفی می‌کند: Eager loading، Explicit loading، Select loading، و Lazy loading. 

---

## بخش نهم: چهار روش بارگذاری داده‌های مرتبط

### Eager Loading با Include و ThenInclude

روش نخست، Eager Loading است که با متد `Include` تمام رابطه‌ها را همراه با entity اصلی در همان کوئری بارگذاری می‌کند: 

```csharp
var firstBook = context.Books
    .Include(book => book.AuthorsLink)
        .ThenInclude(bookAuthor => bookAuthor.Author)
    .Include(book => book.Reviews)
    .Include(book => book.Promotion)
    .First();
```

نکته کلیدی این‌جاست که `ThenInclude` برای دسترسی به سطح دوم رابطه به کار می‌رود (یعنی از `AuthorsLink` به `Author` رسیدن)، و می‌توانید به هر عمقی که نیاز دارید این زنجیره را ادامه دهید. نویسنده یادآوری می‌کند که اگر رابطه‌ای وجود نداشته باشد (مثل `Promotion` که اختیاری است)، `Include` خطا نمی‌دهد؛ بلکه صرفاً مقدار null یا کالکشن خالی برمی‌گرداند. 

از نگاه یک Senior Developer، نکته بسیار مهم EF Core 5 این است که اکنون می‌توانید داخل `Include`/`ThenInclude` از `Where`، `OrderBy`، `Skip`، و `Take` استفاده کنید تا رابطه بارگذاری‌شده را فیلتر یا مرتب کنید: 

```csharp
var firstBook = context.Books
    .Include(book => book.AuthorsLink
        .OrderBy(bookAuthor => bookAuthor.Order))
        .ThenInclude(bookAuthor => bookAuthor.Author)
    .Include(book => book.Reviews
        .Where(review => review.NumStars == 5))
    .First();
```

مزیت Eager Loading کارایی آن در حداقل کردن round-trip های دیتابیس است، اما عیب آن این است که حتی داده‌هایی را که نیاز ندارید نیز بارگذاری می‌کند (مثل توضیحات طولانی کتاب که در لیست نمایش لازم نیست). 

### Explicit Loading: بارگذاری بعد از entity اصلی

روش دوم، ابتدا entity اصلی را به‌تنهایی بارگذاری می‌کند و سپس با دستور صریح، رابطه‌ها را جداگانه فرا می‌خواند: 

```csharp
var firstBook = context.Books.First();
context.Entry(firstBook)
    .Collection(book => book.AuthorsLink).Load();
context.Entry(firstBook)
    .Reference(book => book.Promotion).Load();
```

نکته پیشرفته‌تر اینجا استفاده از متد `Query()` است که به‌جای بارگذاری کامل رابطه، اجازه می‌دهد یک کوئری روی آن رابطه اجرا کنید، مثلاً فقط شمارش تعداد نظرات (Reviews) بدون بارگذاری کامل آن‌ها: 

```csharp
var numReviews = context.Entry(firstBook)
    .Collection(book => book.Reviews)
    .Query().Count();
```

### Select Loading: بارگذاری انتخابی

روش سوم، Select Loading است که تنها بخش‌های مورد نیاز از entity اصلی و رابطه‌های آن را بارگذاری می‌کند. عیب این روش این است که باید کد جداگانه‌ای برای هر Property یا محاسبه بنویسید، اما نویسنده در بخش ۷.۱۵.۴ روشی برای خودکارسازی این فرآیند معرفی می‌کند. 

### Lazy Loading: بارگذاری در لحظه نیاز

روش چهارم، Lazy Loading است که ساده‌ترین روش نوشتن کد را دارد اما بدترین اثر روی Performance دیتابیس می‌گذارد. برای فعال کردن آن باید دو کار انجام دهید: افزودن کلیدواژه `virtual` قبل از هر Property رابطه‌ای، و افزودن متد `UseLazyLoadingProxies` هنگام تنظیم DbContext: 

```csharp
public class BookLazy
{
    public int BookLazyId { get; set; }
    public virtual PriceOffer Promotion { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
}
```

```csharp
optionsBuilder.UseLazyLoadingProxies().UseSqlServer(connection);
```

نویسنده به‌عنوان یک هشدار Performance تأکید می‌کند که خود از Lazy Loading پرهیز می‌کند، چون هر دسترسی به یک navigational property بدون بارگذاری قبلی، یک round-trip جدید و کاملاً جداگانه به دیتابیس ایجاد می‌کند. نکته‌ی ظریف اینجاست که حتی اگر Lazy Loading فعال باشد، افزودن یک `Include` صریح باعث می‌شود EF Core تشخیص دهد که آن Property از پیش بارگذاری شده و دیگر آن را دوباره از دیتابیس نخواند. 

| روش بارگذاری | تعداد Round-trip | مناسب برای |
|---|---|---|
| Eager Loading | حداقل (یک کوئری) | زمانی که از قبل می‌دانید به تمام رابطه‌ها نیاز دارید   |
| Explicit Loading | چندگانه، ولی قابل کنترل | زمانی که تصمیم بارگذاری رابطه باید بعد از دیدن entity اصلی گرفته شود   |
| Select Loading | حداقل (فقط ستون‌های لازم) | زمانی که فقط بخشی از داده لازم است؛ بهترین برای Performance   |
| Lazy Loading | بسیار زیاد و غیرقابل پیش‌بینی | تنها در پروتوتایپ سریع؛ در Production توصیه نمی‌شود   |

---

## بخش دهم: Client vs. Server Evaluation

### مفهوم اصلی

نویسنده توضیح می‌دهد که تمام کوئری‌هایی که تا این‌جا دیده‌اید به دستورات قابل‌اجرا روی دیتابیس تبدیل می‌شوند، اما EF Core ویژگی‌ای به نام **client vs. server evaluation** دارد که به شما اجازه می‌دهد در آخرین مرحله کوئری (یعنی بخش نهایی `Select`) کدی اجرا کنید که قابل تبدیل به دستورات دیتابیس نیست. این دستورات پس از بازگشت داده از دیتابیس، در سمت نرم‌افزار (client) اجرا می‌شوند. 

نویسنده تأکید می‌کند این ویژگی از EF Core 3 به بعد محدودتر شده: تنها در آخرین بخش کوئری LINQ قابل استفاده است، نه در هر جای دلخواه. این تغییر برای جلوگیری از کوئری‌های فوق‌العاده بدپرفورمنس بود که قبلاً ممکن بود بخش زیادی از منطق در نرم‌افزار اجرا شود. 

### هشدار حیاتی: InvalidOperationException

نکته‌ای که یک Senior Developer باید همیشه در نظر داشته باشد این است: اگر LINQ شما قابل تبدیل به دستورات دیتابیس نباشد، EF Core یک `InvalidOperationException` با پیام حاوی عبارت "could not be translated" پرتاب می‌کند. مشکل اینجاست که این خطا فقط زمانی رخ می‌دهد که آن کوئری خاص واقعاً اجرا شود، و طبیعتاً کسی نمی‌خواهد این خطا در محیط Production رخ دهد. به همین دلیل، نویسنده در فصل ۱۷ (Unit Testing) تأکید می‌کند که کوئری‌های دیتابیس باید حتماً با دیتابیس واقعی تست شوند. 

### مثال عملی: ترکیب نام نویسندگان

نویسنده مثال ملموسی از ساخت رشته‌ای شامل نام تمام نویسندگان یک کتاب با کاما ارائه می‌دهد:

```csharp
var firstBook = context.Books
    .Select(book => new
    {
        book.BookId,
        book.Title,
        AuthorsString = string.Join(", ",
            book.AuthorsLink
            .OrderBy(ba => ba.Order)
            .Select(ba => ba.Author.Name))
    }
    ).First();
```

در این مثال، `BookId` و `Title` مستقیماً به SQL تبدیل می‌شوند، اما `string.Join` قابل تبدیل به SQL نیست و توسط EF Core در سمت نرم‌افزار اجرا می‌شود، پس از این‌که داده‌های خام از دیتابیس بازگردانده شدند. نویسنده یک هشدار مهم اضافه می‌کند: اگر بخواهید روی `AuthorsString` مرتب‌سازی یا فیلتر کنید، همان `InvalidOperationException` را دریافت خواهید کرد، چون آن Property دیگر در دیتابیس وجود ندارد. 

### پیش‌درآمد: ساخت کوئری‌های پیچیده (بخش ۲.۶)

نویسنده سپس وارد بخش ۲.۶ می‌شود و نکته معماری مهمی را بیان می‌کند: برای نمایش لیست کتاب‌ها (مثلاً در مقیاس Amazon)، Eager Loading کامل و سپس محاسبه در نرم‌افزار روش نادرستی است، چون هم داده اضافی بارگذاری می‌شود و هم فیلتر/مرتب‌سازی در نرم‌افزار انجام می‌شود که کند است. راه‌حل درست، **Select Loading** است که تمام محاسبات (میانگین امتیازات، قیمت تخفیف‌دار، رشته نویسندگان) را در خودِ کوئری SQL انجام می‌دهد. برای این کار، نویسنده یک کلاس DTO به نام `BookListDto` معرفی می‌کند: 

```csharp
public class BookListDto
{
    public int BookId { get; set; }
    public string Title { get; set; }
    public DateTime PublishedOn { get; set; }
    public decimal Price { get; set; }
    public decimal ActualPrice { get; set; }
    public string PromotionPromotionalText { get; set; }
    public string AuthorsOrdered { get; set; }
    public int ReviewsCount { get; set; }
    public double? ReviewsAverageVotes { get; set; }
    public string[] TagStrings { get; set; }
}
```

نویسنده این کلاس را DTO (Data Transfer Object) می‌نامد و آن را این‌گونه تعریف می‌کند: «شیئی که برای کپسوله کردن داده و انتقال آن از یک زیرسیستم اپلیکیشن به زیرسیستم دیگر استفاده می‌شود». سپس یک نمودار پیچیده ارائه می‌کند که نشان می‌دهد هر Property از `BookListDto` دقیقاً از کدام زیرکوئری LINQ تغذیه می‌شود—مثلاً `ReviewsAverageVotes` از `p.Reviews.Select(q => (double?)q.NumStars).Average()` می‌آید. 

---

## بخش یازدهم: ساخت کوئری Select و معماری Book App

### متد MapBookToDto: پر کردن DTO با یک کوئری

نویسنده متد `MapBookToDto` را می‌سازد که ورودی آن `IQueryable<Book>` و خروجی آن `IQueryable<BookListDto>` است، و تمام محاسبات لازم را در همان کوئری انجام می‌دهد: 

```csharp
public static IQueryable<BookListDto>
    MapBookToDto(this IQueryable<Book> books)
{
    return books.Select(book => new BookListDto
    {
        BookId = book.BookId,
        Title = book.Title,
        Price = book.Price,
        PublishedOn = book.PublishedOn,
        ActualPrice = book.Promotion == null
            ? book.Price
            : book.Promotion.NewPrice,
        PromotionPromotionalText =
            book.Promotion == null
                ? null
                : book.Promotion.PromotionalText,
        AuthorsOrdered = string.Join(", ",
            book.AuthorsLink
                .OrderBy(ba => ba.Order)
                .Select(ba => ba.Author.Name)),
        ReviewsCount = book.Reviews.Count,
        ReviewsAverageVotes =
            book.Reviews.Select(review =>
                (double?) review.NumStars).Average(),
        TagStrings = book.Tags
            .Select(x => x.TagId).ToArray(),
    });
}
```

نکته فنی مهمی که نویسنده تأکید می‌کند این است: برای این‌که `Average` به دستور SQL `AVG` تبدیل شود، باید `NumStars` را به `(double?)` تبدیل (cast) کنید؛ در غیر این صورت EF Core نمی‌تواند این عملیات را به SQL ترجمه کند. همچنین برای این‌که کلاس مقصد در select loading قابل استفاده باشد، باید یک constructor پیش‌فرض داشته باشد، static نباشد، و Property هایش دارای setter عمومی باشند. 

### الگوی Query Object

نویسنده این روش را **Query Object Pattern** می‌نامد: متدی که `IQueryable<T1>` می‌گیرد و `IQueryable<T2>` برمی‌گرداند، و به این ترتیب کوئری (یا بخشی از آن) را در یک متد کپسوله می‌کند تا پیدا کردن، دیباگ کردن، و Performance-tuning آن آسان‌تر شود. از منظر OOP، این متد یک **Extension Method** نیز هست، چون در یک کلاس static تعریف شده، خود متد static است، و اولین پارامتر آن کلیدواژه `this` را دارد؛ این ویژگی امکان زنجیره کردن (Chaining) چند Query Object پشت سر هم را فراهم می‌کند. 

### معماری لایه‌ای Book App

نویسنده در بخش ۲.۷ توضیح می‌دهد که چرا معماری Book App را در همین نقطه معرفی می‌کند: اکنون که هم Entity Class ها (مثل Book) و هم DTO (مثل BookListDto) وجود دارند، تفاوت در نگرش بین لایه دیتابیس و لایه نمایش قابل درک است. این تفکیک، اصل **Separation of Concerns (SoC)** را پیاده می‌کند: کوئری نمایش لیست کتاب‌ها نباید حاوی کدی باشد که HTML را برای نمایش به کاربر می‌سازد. 


---

## بخش دوازدهم: Sort، Filter، Paging و ترکیب نهایی

### مرتب‌سازی: OrderBooksBy

نویسنده متد `OrderBooksBy` را می‌سازد که یک `enum` به نام `OrderByOptions` می‌گیرد و بر اساس آن، دستور `OrderBy` یا `OrderByDescending` مناسب را به کوئری اضافه می‌کند. نکته کلیدی این است که حتی وقتی کاربر هیچ مرتب‌سازی‌ای انتخاب نکرده باشد، باز هم یک مرتب‌سازی پیش‌فرض (بر اساس `BookId`) اعمال می‌شود، چون در SQL بدون ترتیب مشخص، امکان Paging صحیح وجود ندارد و دیتابیس‌های رابطه‌ای هیچ تضمینی برای ترتیب پیش‌فرض ردیف‌ها نمی‌دهند. 

### فیلتر کردن: FilterBooksBy

فیلترکردن کمی پیچیده‌تر است، چون کاربر باید ابتدا نوع فیلتر (سال انتشار، امتیاز، دسته‌بندی) و سپس مقدار فیلتر را انتخاب کند. نویسنده متد `GetFilterDropDownValues` را نشان می‌دهد که با استفاده از `Distinct` روی سال‌های انتشار کتاب، لیست کشویی سال‌ها را می‌سازد و یک گزینه "Coming Soon" برای کتاب‌های هنوز منتشرنشده اضافه می‌کند. متد `FilterBooksBy` سپس بر اساس نوع فیلتر انتخابی، دستور `Where` مناسب را اعمال می‌کند؛ مثلاً برای فیلتر بر اساس امتیاز، فقط کتاب‌هایی برگردانده می‌شوند که `ReviewsAverageVotes` آن‌ها بالاتر از مقدار انتخابی باشد. 

### جستجوی متنی و Collation

نویسنده هشدار می‌دهد که باید فقط متدهایی از رشته استفاده کنید که EF Core بتواند آن‌ها را به دستورات SQL ترجمه کند، از جمله `StartsWith`، `EndsWith`، `Contains`، و `IndexOf`. نکته مهم دیگر، حساسیت به حروف بزرگ/کوچک (Case Sensitivity) است که به نوع Collation دیتابیس بستگی دارد؛ SQL Server به‌طور پیش‌فرض Case-Insensitive است، در حالی که Cosmos DB به‌طور پیش‌فرض Case-Sensitive است. برای کنترل دقیق‌تر، می‌توانید از `EF.Functions.Collate` برای تعیین Collation در سطح یک کوئری خاص استفاده کنید، یا از `EF.Functions.Like` برای الگوهای جستجوی شبیه SQL LIKE بهره بگیرید. 

### صفحه‌بندی: یک Query Object جنریک

برخلاف Query Object های قبلی که به کلاس `BookListDto` وابسته بودند، متد `Page` به‌صورت Generic نوشته شده و با هر `IQueryable<T>` کار می‌کند: 

```csharp
public static IQueryable<T> Page<T>(
    this IQueryable<T> query,
    int pageNumZeroStart, int pageSize)
{
    if (pageSize == 0)
        throw new ArgumentOutOfRangeException
            (nameof(pageSize), "pageSize cannot be zero.");
    if (pageNumZeroStart != 0)
        query = query
            .Skip(pageNumZeroStart * pageSize);
    return query.Take(pageSize);
}
```

این متد صرفاً از دستورات `Skip` و `Take` استفاده می‌کند، اما یادآوری می‌کند که Paging تنها زمانی درست کار می‌کند که داده مرتب‌سازی شده باشد؛ در غیر این صورت SQL Server خطا پرتاب می‌کند. 

### ترکیب نهایی: کلاس ListBooksService

در پایان فصل، نویسنده تمام این Query Object ها را در کلاس `ListBooksService` زنجیره (Chain) می‌کند:

```csharp
public class ListBooksService
{
    private readonly EfCoreContext _context;
    public ListBooksService(EfCoreContext context)
    {
        _context = context;
    }
    public IQueryable<BookListDto> SortFilterPage
        (SortFilterPageOptions options)
    {
        var booksQuery = _context.Books
            .AsNoTracking()
            .MapBookToDto()
            .OrderBooksBy(options.OrderByOptions)
            .FilterBooksBy(options.FilterBy,
                           options.FilterValue);
        options.SetupRestOfDto(booksQuery);
        return booksQuery.Page(options.PageNum-1,
                               options.PageSize);
    }
}
```

از منظر Design Pattern، این یک نمونه‌ی درخشان از **Method Chaining** است که هر Query Object، خروجی Query Object قبلی را می‌گیرد و مرحله بعدی را اضافه می‌کند. نویسنده تأکید می‌کند که استفاده از `AsNoTracking` روی کوئری‌های صرفاً خواندنی (Read-only) باعث می‌شود EF Core از گرفتن Snapshot برای Change Tracking صرف‌نظر کند، که این کار عملکرد کوئری را کمی بهتر می‌کند. با این کار، فصل دوم به پایان می‌رسد و تمام مبانی لازم برای ساخت کوئری‌های واقعی و کارآمد در EF Core فراهم شده است. 

---

## بخش سیزدهم: مفهوم Entity State در EF Core

### چرا State اهمیت دارد؟

نویسنده پیش از پرداختن به هر عملیات نوشتنی، مفهوم `State` را معرفی می‌کند: هر instance از یک کلاس Entity، دارای یک Property به نام `State` است که از طریق دستور `context.Entry(someEntityInstance).State` قابل دسترسی است. این `State` به EF Core می‌گوید که هنگام فراخوانی `SaveChanges`، با این instance چه کاری باید انجام دهد. 

### پنج مقدار ممکن برای State

نویسنده جدولی از پنج حالت ممکن ارائه می‌دهد که رفتار `SaveChanges` را کاملاً مشخص می‌کنند:

- Added: Entity باید در دیتابیس ایجاد شود؛ SaveChanges آن را INSERT می‌کند. 
- Unchanged: Entity در دیتابیس وجود دارد و در سمت Client تغییر نکرده؛ SaveChanges آن را نادیده می‌گیرد. 
- Modified: Entity در دیتابیس وجود دارد و در سمت Client تغییر کرده؛ SaveChanges آن را UPDATE می‌کند. 
- Deleted: Entity در دیتابیس وجود دارد اما باید حذف شود؛ SaveChanges آن را DELETE می‌کند. 
- Detached: Entity ارائه‌شده Tracked نیست؛ SaveChanges آن را نمی‌بیند. 

نویسنده تأکید می‌کند که معمولاً شما مستقیماً `State` را نمی‌بینید یا تغییر نمی‌دهید؛ در عوض از دستوراتی مانند `Add`، `Update`، و `Remove` استفاده می‌کنید که خودشان `State` را به‌درستی تنظیم می‌کنند. 

### تعریف کلیدی: Tracked Entities

نویسنده یک تعریف مهم ارائه می‌دهد که در ادامه کتاب بسیار پرکاربرد است: **Tracked Entities** یعنی instance هایی از Entity که با کوئری‌ای که شامل متد `AsNoTracking` نبوده، از دیتابیس خوانده شده‌اند؛ یا instance هایی که پس از استفاده به‌عنوان پارامتر متدهایی مانند `Add`، `Update`، یا `Delete`، به‌صورت Tracked درآمده‌اند. وقتی `SaveChanges` فراخوانی می‌شود، تمام Entity های Tracked را بررسی می‌کند و بر اساس `State` هرکدام، تصمیم می‌گیرد چه نوع تغییری روی دیتابیس اعمال کند. 

### مثال عملی: ساخت یک ردیف جدید

نویسنده ساده‌ترین مثال ممکن از عملیات Create را ارائه می‌دهد، برای Entity ای بدون Navigational Property:

```csharp
var itemToAdd = new ExampleEntity
{
    MyMessage = "Hello World"
};
context.Add(itemToAdd);
context.SaveChanges();
```

نویسنده توضیح می‌دهد که این عملیات دو مرحله دارد: اضافه کردن Entity به DbContext، و سپس فراخوانی `SaveChanges`. از منظر EF6.x، نویسنده یک نکته مقایسه‌ای می‌آورد: در EF6.x باید Entity را به یک Property از نوع `DbSet<T>` در DbContext اضافه می‌کردید (مثلاً `context.ExampleEntities.Add`)، اما EF Core این کار را کوتاه کرده و خودش نوع Entity را از روی پارامتر تشخیص می‌دهد. 

نویسنده سپس SQL تولیدشده توسط EF Core را نشان می‌دهد که شامل دو دستور است: یک `INSERT INTO` برای ایجاد ردیف جدید، و یک `SELECT` برای بازخوانی Primary Key ای که توسط دیتابیس تولید شده، تا instance اصلی در حافظه هم با آن Primary Key به‌روزرسانی شود. 

---

## بخش چهاردهم: به‌روزرسانی دیتابیس و رابطه‌ها

### حالت Disconnected: چالش وب‌اپلیکیشن‌ها

نویسنده توضیح می‌دهد که در یک اپلیکیشن وب، برخلاف یک اپلیکیشن کنسول، DbContext بین درخواست خواندن داده و درخواست ذخیره تغییرات، از بین می‌رود؛ به این حالت **Disconnected State** گفته می‌شود. برای نشان دادن این الگو، نویسنده کلاس `AddReviewService` را معرفی می‌کند که فرآیند اضافه‌کردن یک Review به یک کتاب را در دو مرحله جداگانه انجام می‌دهد: 

```csharp
public class AddReviewService
{
    private readonly EfCoreContext _context;
    public string BookTitle { get; private set; }
    public AddReviewService(EfCoreContext context)
    {
        _context = context;
    }
    public Review GetBlankReview(int id)
    {
        BookTitle = _context.Books
            .Where(p => p.BookId == id)
            .Select(p => p.Title)
            .Single();
        return new Review { BookId = id };
    }
    public Book AddReviewToBook(Review review)
    {
        var book = _context.Books
            .Include(r => r.Reviews)
            .Single(k => k.BookId == review.BookId);
        book.Reviews.Add(review);
        _context.SaveChanges();
        return book;
    }
}
```

نکته حیاتی این‌جاست: متد اول (`GetBlankReview`) فقط یک Review خالی با `BookId` پر شده برمی‌گرداند تا کاربر آن را تکمیل کند؛ متد دوم (`AddReviewToBook`) با یک instance جدید از `DbContext` اجرا می‌شود، کتاب را همراه با Review های موجودش Load می‌کند، و سپس Review جدید را به Collection اضافه می‌کند. نویسنده هشدار می‌دهد که اگر Collection موجود (`Reviews`) را قبل از افزودن Review جدید Load نکنید، EF Core نمی‌تواند تشخیص دهد چه چیزی باید حذف، جایگزین یا اضافه شود، و ممکن است به‌جای جایگزینی، رکوردهای تکراری ایجاد شود. 

### رابطه Many-to-Many: دو روش پیاده‌سازی

نویسنده تأکید می‌کند که در پایگاه‌داده رابطه‌ای، رابطه Many-to-Many به‌صورت مستقیم وجود ندارد؛ بلکه از دو رابطه One-to-Many و یک جدول واسط (Linking Table) ساخته می‌شود. او دو رویکرد را معرفی می‌کند: 

- لینک از طریق یک کلاس واسط (مثل `BookAuthor`): این روش امکان دسترسی به داده اضافی در جدول واسط (مثل ترتیب نویسندگان) را فراهم می‌کند. 
- لینک مستقیم بین دو Entity (مثل `Book` و `Tag`): این روش ساده‌تر است چون EF Core خودش جدول واسط پنهان را می‌سازد، اما شما نمی‌توانید در یک `Include` به آن جدول واسط دسترسی مستقیم داشته باشید. 

نویسنده مثال عملی اضافه‌کردن یک نویسنده جدید (Martin Fowler) به کتاب Quantum Networking را نشان می‌دهد، جایی که یک `BookAuthor` جدید با مقدار `Order` مناسب به Collection اضافه می‌شود:

```csharp
var book = context.Books
    .Include(p => p.AuthorsLink)
    .Single(p => p.Title == "Quantum Networking");
var existingAuthor = context.Authors
    .Single(p => p.Name == "Martin Fowler");
book.AuthorsLink.Add(new BookAuthor
{
    Book = book,
    Author = existingAuthor,
    Order = (byte) book.AuthorsLink.Count
});
context.SaveChanges();
```

نکته معماری مهمی که نویسنده تأکید می‌کند: هنگام Load کردن `AuthorsLink` سمت Book، نیازی نیست سمت متناظر آن (`BooksLink` در Author) نیز Load شود، چون EF Core به‌طور خودکار هنگام SaveChanges آن سمت را نیز به‌روزرسانی می‌کند. همچنین حذف یک رکورد از جدول واسط `BookAuthor`، خودِ Entity های `Book` یا `Author` را حذف نمی‌کند، چون آن‌ها Principal Entity هستند و `BookAuthor` به هر دوی آن‌ها Dependent است. 

---

## بخش پانزدهم: حذف Entity ها در EF Core

### رویکرد Soft-delete: پنهان‌سازی به‌جای حذف

نویسنده پیش از توضیح حذف واقعی، رویکرد **Soft Delete** را معرفی می‌کند: به‌جای حذف فیزیکی یک رکورد، آن را با یک Flag پنهان می‌کنید، چون در دنیای واقعی داده‌ها معمولاً به‌جای نابود شدن، به حالتی دیگر تغییر می‌کنند. برای مثال، یک کتاب ممکن است دیگر فروخته نشود، اما وجود سابق آن نباید انکار شود. برای پیاده‌سازی این رویکرد، نویسنده دو گام مشخص می‌کند: 

- افزودن یک Property بولین به نام `SoftDeleted` به کلاس `Book`، که اگر `true` باشد، آن Entity نباید در کوئری‌های معمولی ظاهر شود. 
- افزودن یک **Global Query Filter** از طریق Fluent API، که به‌طور خودکار یک شرط `Where` به هر دسترسی به جدول `Books` اضافه می‌کند. 

کد پیاده‌سازی این فیلتر به این صورت است:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Book>()
        .HasQueryFilter(p => !p.SoftDeleted);
}
```

نویسنده تأکید می‌کند که اگر لازم باشد به تمام Entity ها، حتی موارد Soft-deleted شده، دسترسی داشته باشید، می‌توانید متد `IgnoreQueryFilters` را به کوئری اضافه کنید تا این فیلتر را نادیده بگیرد. 

### حذف واقعی: Entity های ساده و Entity های با رابطه

برای حذف یک Entity بدون رابطه (مثل `PriceOffer`)، فقط کافی است متد `Remove` را صدا بزنید که `State` را به `Deleted` تنظیم می‌کند، و سپس `SaveChanges` را فراخوانی کنید. اما حذف یک Entity اصلی (Principal) که رابطه‌هایی دارد، پیچیده‌تر است چون پایگاه‌داده باید **Referential Integrity** را حفظ کند. نویسنده سه راه‌حل ممکن برای این چالش را برمی‌شمارد: 

- Cascade Delete: پایگاه‌داده به‌طور خودکار Entity های Dependent را نیز حذف می‌کند. 
- تنظیم کلید خارجی Entity های Dependent روی null، در صورتی که آن ستون nullable باشد. 
- اگر هیچ‌کدام از این قوانین تنظیم نشده باشد، پایگاه‌داده در صورت تلاش برای حذف یک Entity اصلی که وابسته دارد، خطا صادر می‌کند. 

نویسنده مثال حذف کتاب Quantum Networking را نشان می‌دهد که دارای `Promotion`، دو `Review`، و یک `BookAuthor` است. نکته کلیدی این‌جاست: باید تمام رابطه‌های Dependent را از طریق `Include` بارگذاری کنید تا EF Core بتواند آن‌ها را نیز حذف کند:

```csharp
var book = context.Books
    .Include(p => p.Promotion)
    .Include(p => p.Reviews)
    .Include(p => p.AuthorsLink)
    .Include(p => p.Tags)
    .Single(p => p.Title == "Quantum Networking");
context.Books.Remove(book);
context.SaveChanges();
```

نویسنده هشدار می‌دهد که اگر این `Include` ها را فراموش کنید، EF Core از وجود آن رابطه‌ها بی‌خبر می‌ماند و مسئولیت حفظ Referential Integrity به خودِ سرور پایگاه‌داده منتقل می‌شود. نکته ظریف دیگری که تأکید می‌شود: کلاس‌های `Author` و `Tag` که به کتاب لینک شده‌اند حذف نمی‌شوند، چون آن‌ها Dependent کتاب نیستند؛ فقط جداول واسط `BookAuthor` و `BookTag` حذف می‌شوند، زیرا ممکن است همان `Author` یا `Tag` به کتاب‌های دیگری هم مرتبط باشد. 

---

## بخش شانزدهم: سطوح پیچیدگی منطق تجاری

### چرا Business Logic با CRUD تفاوت دارد؟

نویسنده پیش از ورود به کدنویسی، یک تعریف دقیق ارائه می‌دهد: **Business Rule** یک عبارت قابل‌فهم برای انسان است (مثل «قیمت کتاب نمی‌تواند منفی باشد»)، در حالی که **Business Logic** کدی است که تمام Business Rule های لازم برای یک Feature خاص را پیاده‌سازی می‌کند. پیش از نوشتن کد، او پیشنهاد می‌کند به پنج سؤال پاسخ دهید: آیا Business Rule ها را کامل درک کرده‌اید؟ آیا این قوانین منطقی و کامل‌اند؟ آیا Edge Case ای وجود دارد؟ چگونه می‌توان اثبات کرد که پیاده‌سازی با قوانین مطابقت دارد؟ و اگر قوانین تغییر کنند، کد شما چقدر انعطاف‌پذیر است ؟ 

### سه سطح پیچیدگی: Validation، Simple، Complex

بر اساس تجربه‌اش، نویسنده Business Logic را به سه سطح تقسیم می‌کند که هرکدام الگوی طراحی متفاوتی می‌طلبند:

- Validation: بررسی داده‌هایی که برای تغییر یک Entity استفاده می‌شوند، مثل اطمینان از این‌که `NumStars` یک Review بین 0 تا 5 باشد؛ این ساده‌ترین نوعی است که می‌توان آن را Business Logic نامید. 
- Simple: منطقی با Branching بسیار کم یا صفر که به‌راحتی قابل درک است، مثل ایجاد یک کتاب همراه با نویسندگانش که نیاز به چند مرحله ساده و بدون شرط دارد. 
- Complex: منطقی که نیاز به تلاش فکری جدی برای نوشتن صحیح آن دارد؛ نویسنده جمله‌ای از اریک ایوانز (Eric Evans)، نویسنده کتاب Domain-Driven Design، نقل می‌کند که تأکید می‌کند قلب نرم‌افزار، توانایی آن در حل مسائل حوزه کسب‌وکار است، و وقتی این حوزه پیچیده باشد، این کار نیازمند تلاش متمرکز افراد ماهر است. 

نویسنده در یک نکته مهم توضیح می‌دهد که همه Business Logic لزوماً در یک لایه مجزا زندگی نمی‌کنند؛ برخی از آن‌ها، مخصوصاً Validation، بهتر است در لایه Presentation (نمایش) قرار گیرند تا کاربر سریع‌تر بازخورد بگیرد. 

### مثال Complex: پردازش سفارش کتاب

نویسنده برای نشان دادن الگوی Complex Business Logic، مثال پردازش یک سفارش خرید کتاب در Book App را انتخاب می‌کند، جایی که کاربر روی دکمه Purchase کلیک می‌کند. این الگو بر مبنای مفاهیم DDD اریک ایوانز است، اما بدون قرار دادن منطق داخل خودِ Entity Class ها؛ به این الگو **Transaction Script** یا **Procedural Pattern** گفته می‌شود. نویسنده هشدار می‌دهد که برخی طراحان DDD این رویکرد را یک Antipattern به نام Anemic Domain Model می‌دانند، اما او در فصل ۱۳ کتاب رویکرد کامل‌تر DDD را نیز معرفی خواهد کرد. 

---

## بخش هفدهم: پنج اصل معماری Business Logic

### الگوی Transaction Script

نویسنده پیش از ارائه اصول، الگوی مورد استفاده را نام‌گذاری می‌کند: **Transaction Script** یا **Procedural Pattern**، که بر مبنای مفاهیم DDD اریک ایوانز است اما بدون قرار دادن کد منطق تجاری داخل خودِ Entity Class ها. او صادقانه اشاره می‌کند که بسیاری از طراحان DDD این رویکرد را یک Antipattern به نام **Anemic Domain Model** می‌دانند، و در فصل ۱۳ کتاب رویکرد کامل‌تر DDD (با منطق داخل Entity ها) را نیز معرفی خواهد کرد. 

### پنج اصل راهنما

نویسنده این پنج اصل را این‌گونه شرح می‌دهد:

- اصل اول - اولویت با Business Logic در طراحی دیتابیس: چون مسئله‌ای که می‌خواهید حل کنید (که ایوانز آن را Domain Model می‌نامد) قلب مسئله است، این منطق باید نحوه طراحی کل اپلیکیشن را هدایت کند؛ یعنی ساختار دیتابیس و Entity Class ها باید با نیازهای Business Logic هم‌راستا شوند. 
- اصل دوم - Business Logic نباید حواس‌پرتی داشته باشد: نوشتن منطق تجاری به‌خودی‌خود دشوار است، پس باید آن را از تمام لایه‌های دیگر اپلیکیشن (جز Entity Class ها) ایزوله کنید؛ وظیفه آداپته کردن داده برای نمایش باید به Service Layer محول شود. 
- اصل سوم - Business Logic باید تصور کند روی داده درون‌حافظه‌ای کار می‌کند: ایوانز به نویسنده آموخت که منطق تجاری را طوری بنویسد که گویی داده در حافظه است؛ بخش‌های Load و Save لازم است، اما هسته منطق تجاری باید تا حد ممکن با کلاس‌ها و Collection های معمولی درون‌حافظه‌ای رفتار کند. 
- اصل چهارم - جداسازی کد دسترسی به دیتابیس در یک پروژه مجزا: این قانون از تجربه ساخت یک اپلیکیشن پیچیده تجارت الکترونیک با قوانین قیمت‌گذاری و تحویل پیچیده حاصل شده؛ استفاده مستقیم از EF Core داخل Business Logic نگهداری و Performance Tuning را دشوار می‌کند. 
- اصل پنجم - Business Logic نباید مستقیماً SaveChanges را صدا بزند: یک کلاس در Service Layer (یا یک کتابخانه سفارشی) باید مسئول اجرای Business Logic باشد، و در صورت نبود خطا، خودش SaveChanges را فراخوانی کند؛ این کار کنترل کامل بر روی نوشتن یا ننوشتن داده را فراهم می‌کند. 

### معماری پروژه: پنج بخش

نویسنده برای پیاده‌سازی این اصول، ساختار اپلیکیشن را به دو پروژه جدید توسعه می‌دهد که در کنار ساختار قبلی Book App قرار می‌گیرند:

- Pure Business Logic Project: کلاس‌های خالص منطق تجاری که روی داده درون‌حافظه‌ای فراهم‌شده توسط متدهای همراه کار می‌کنند. 
- Business Database Access Project: یک کلاس همراه برای هر کلاس Pure Business Logic که نیاز به دسترسی دیتابیس دارد و آن را وادار می‌کند تصور کند روی مجموعه‌ای درون‌حافظه‌ای کار می‌کند. 

جریان کلی معماری این‌گونه است: لایه ASP.NET Core Web App، از طریق Service Layer، به Pure Business Logic متصل می‌شود، و Pure Business Logic از طریق Business Database Access با دیتابیس SQL Server ارتباط برقرار می‌کند. نویسنده این پنج شماره را دقیقاً با پنج اصل بالا تطبیق می‌دهد تا رابطه مفهومی میان معماری و اصول کاملاً شفاف باشد. 

---

## بخش هجدهم: طراحی دیتابیس بر اساس Business Rules

### از قوانین کسب‌وکار به ساختار جدول

نویسنده از میان شش قانون کسب‌وکار سفارش خرید کتاب، فقط سه قانون را به طراحی دیتابیس مرتبط می‌داند: یک سفارش باید حداقل یک کتاب داشته باشد (با این پیامد که می‌تواند بیشتر هم باشد)، قیمت کتاب باید در لحظه سفارش در خودِ Order کپی شود چون ممکن است بعداً تغییر کند، و سفارش باید شخص سفارش‌دهنده را به خاطر بسپارد. این سه قانون مستقیماً منجر به طراحی یک Entity کلاس Order با یک Collection از LineItem می‌شود، یعنی یک رابطه one-to-many. 

### جداول Orders و LineItem

ساختار نهایی این‌گونه است: جدول Orders شامل OrderId، DateOrderedUtc و CustomerName است، و جدول LineItem شامل LineItemId، LineNum، NumBooks، BookPrice و دو کلید خارجی BookId و OrderId است. نکته مهمی که نویسنده تأکید می‌کند این است که نام جدول Orders به شکل جمع است زیرا از نام Property یعنی DbSet<Order> Orders در DbContext گرفته شده، در حالی که LineItem تکی است چون از طریق رابطه Order به آن دسترسی پیدا می‌شود و پراپرتی مستقیمی در DbContext ندارد. این یک نمونه دقیق از By Convention Configuration در EF Core است که در فصل هفتم به تفصیل شرح داده می‌شود. 

## بخش نوزدهم: Guideline دوم و کلاس خطایابی

### چرا Business Logic باید بدون حواس‌پرتی باشد

نویسنده تأکید می‌کند نوشتن Business Logic خود به‌تنهایی دشوار است، پس باید آن را از هر بخش دیگر اپلیکیشن (به‌جز Entity Class ها و کلاس همراه دیتابیس) ایزوله کرد؛ کد باید فقط با دو بخش در ارتباط باشد: Entity Class های Order، LineItem و Book، و کلاس همراهی که تمام دسترسی‌های دیتابیس را مدیریت می‌کند. برای Validation، او بین دو رویکرد رایج تمایز می‌گذارد: پرتاب Exception در صورت بروز خطا، یا بازگرداندن خطاها از طریق یک Status Interface به Caller؛ نویسنده رویکرد دوم را انتخاب می‌کند. 

### کلاس پایه BizActionErrors

برای پیاده‌سازی این رویکرد، یک کلاس abstract به نام `BizActionErrors` طراحی می‌شود که یک اینترفیس خطایابی مشترک برای تمام Business Logic فراهم می‌کند:

```csharp
public abstract class BizActionErrors
{
    private readonly List<ValidationResult> _errors
        = new List<ValidationResult>();
    public IImmutableList<ValidationResult>
        Errors => _errors.ToImmutableList();
    public bool HasErrors => _errors.Any();
    protected void AddError(string errorMessage,
        params string
    {
        _errors.Add( new ValidationResult
            (errorMessage, propertyNames));
    }
}
```

این کلاس از نظر طراحی شی‌گرا، الگوی Template روش را دنبال می‌کند: با ارائه یک متد `AddError` و یک لیست غیرقابل تغییر (Immutable) از خطاها، تمام کلاس‌های Business Logic که از آن ارث‌بری می‌کنند، رفتار یکسانی برای مدیریت خطا خواهند داشت، حتی اگر هرگز خطایی رخ ندهد و `HasErrors` به‌صورت پیش‌فرض false برگردد. استفاده از `ValidationResult` به‌جای یک رشته ساده، این امکان را می‌دهد که هر خطا به یک یا چند Property مرتبط متصل شود، که بعداً برای نمایش خطای دقیق در فرم کاربر کاربرد دارد. 

---

## بخش بیستم: Guideline سوم و کلاس PlaceOrderAction

### تصور کار روی داده درون‌حافظه‌ای

نویسنده توضیح می‌دهد که کلاس `PlaceOrderAction` که منطق خالص تجاری را در بر دارد، به یک کلاس همراه به نام `PlaceOrderDbAccess` تکیه می‌کند. وظیفه این کلاس همراه این است که داده را به‌صورت یک مجموعه درون‌حافظه‌ای (در این‌جا یک Dictionary) در اختیار Business Logic قرار دهد و در نهایت سفارش ساخته‌شده را در دیتابیس بنویسد؛ به این ترتیب، حتی بدون پنهان‌سازی کامل دیتابیس، منطق تجاری تصور می‌کند با کلاس‌های معمولی .NET کار می‌کند. 

### پیاده‌سازی کامل PlaceOrderAction

کلاس `PlaceOrderAction` از کلاس abstract `BizActionErrors` ارث‌بری می‌کند و اینترفیس `IBizAction<PlaceOrderInDto,Order>` را پیاده‌سازی می‌کند: 

```csharp
public class PlaceOrderAction :
    BizActionErrors,
    IBizAction<PlaceOrderInDto,Order>
{
    private readonly IPlaceOrderDbAccess _dbAccess;
    public PlaceOrderAction(IPlaceOrderDbAccess dbAccess)
    {
        _dbAccess = dbAccess;
    }
    public Order Action(PlaceOrderInDto dto)
    {
        if (!dto.AcceptTAndCs)
        {
            AddError(
                "You must accept the T&Cs to place an order.");
            return null;
        }
        if (!dto.LineItems.Any())
        {
            AddError("No items in your basket.");
            return null;
        }
        var booksDict =
            _dbAccess.FindBooksByIdsWithPriceOffers
                 (dto.LineItems.Select(x => x.BookId));
        var order = new Order
        {
            CustomerId = dto.UserId,
            LineItems =
                FormLineItemsWithErrorChecking
                     (dto.LineItems, booksDict)
        };
        if (!HasErrors)
            _dbAccess.Add(order);
        return HasErrors ? null : order;
    }
}
```

از منظر اصول شی‌گرایی، این کلاس نمونه دقیقی از **Dependency Inversion Principle** است: `PlaceOrderAction` به اینترفیس `IPlaceOrderDbAccess` وابسته است، نه به یک پیاده‌سازی خاص، و این وابستگی از طریق Constructor Injection تزریق می‌شود. این طراحی بعداً در فصل ۱۷ امکان جایگزینی این کلاس با یک نسخه آزمایشی (Stubbing یا Mocking) را برای Unit Testing فراهم می‌کند. 

### جریان منطقی متد Action

متد `Action` سه گام منطقی را دنبال می‌کند: نخست دو اعتبارسنجی ابتدایی (پذیرش شرایط و عدم خالی بودن سبد خرید) را انجام می‌دهد و در صورت خطا فوراً `null` برمی‌گرداند. سپس با فراخوانی `FindBooksByIdsWithPriceOffers` روی کلاس همراه، تمام کتاب‌های موردنیاز را همراه با تخفیف‌های احتمالی (`PriceOffers`) به‌صورت یک Dictionary دریافت می‌کند. در آخر، شیء `Order` را با فراخوانی متد کمکی `FormLineItemsWithErrorChecking` می‌سازد و فقط در صورت نبود خطا، آن را از طریق `_dbAccess.Add` به Context اضافه می‌کند، بدون این‌که خودش SaveChanges را صدا بزند. 

---

## بخش بیست‌ویکم: Guideline چهارم - جداسازی دسترسی دیتابیس

### متد کمکی FormLineItemsWithErrorChecking

پیش از رسیدن به کلاس همراه، نویسنده متد کمکی `FormLineItemsWithErrorChecking` را در همان `PlaceOrderAction` معرفی می‌کند که با استفاده از Dictionary کتاب‌های بازیابی‌شده (`booksDict`)، برای هر ردیف سفارش یک `LineItem` می‌سازد و در همین حین قیمت کتاب را در لحظه سفارش کپی می‌کند. اگر کتابی در Dictionary یافت نشود (یعنی BookId نامعتبر باشد)، این متد بلافاصله یک خطا از طریق `AddError` اضافه می‌کند، که نشان می‌دهد اعتبارسنجی و منطق ساخت داده در یک بستر واحد و بدون وابستگی مستقیم به EF Core جریان دارند. 

### کلاس PlaceOrderDbAccess

این کلاس تنها بخشی از کد است که واقعاً EF Core و `DbContext` را می‌شناسد، و دقیقاً همان چیزی است که Guideline چهارم توصیه می‌کند: ایزوله کردن کد دسترسی به دیتابیس در یک پروژه مجزا. متد `FindBooksByIdsWithPriceOffers` یک کوئری با `Include` روی `PriceOffers` اجرا می‌کند و نتیجه را با `ToDictionary` به شکل یک مجموعه درون‌حافظه‌ای (Dictionary) به Business Logic تحویل می‌دهد، دقیقاً همان چیزی که Guideline سوم می‌خواهد: Business Logic باید تصور کند با یک Collection معمولی کار می‌کند، نه با یک کوئری زنده به دیتابیس. متد `Add` هم صرفاً `context.Add(order)` را صدا می‌زند و SaveChanges را فرانمی‌خواند، که این دقیقاً پیاده‌سازی Guideline پنجم است. 

## بخش بیست‌ودوم: Guideline پنجم و الگوی BizRunner

### چرا Business Logic نباید SaveChanges را صدا بزند

نویسنده استدلال می‌کند که اگر Business Logic خودش SaveChanges را صدا بزند، کنترل بر روی این‌که «آیا نتیجه باید در دیتابیس نوشته شود یا نه» را از دست می‌دهید؛ ممکن است بخواهید در صورت وجود خطا هرگز SaveChanges اجرا نشود، یا بخواهید چند عملیات Business Logic را در یک Transaction واحد به هم زنجیر کنید. راه‌حل این مسئله یک کلاس واسط به نام **BizRunner** است که مسئولیت فراخوانی Business Logic و سپس (در صورت نبود خطا) فراخوانی SaveChanges را بر عهده می‌گیرد. 

### جریان کامل فراخوانی

الگوی نهایی به این شکل عمل می‌کند: کنترلر ASP.NET Core یک نمونه از `PlaceOrderAction` (از طریق Dependency Injection) دریافت می‌کند، سپس آن را به BizRunner می‌دهد؛ BizRunner متد `Action` را صدا می‌زند، خطاها را بررسی می‌کند، و تنها در صورت نبود خطا `SaveChanges` را روی DbContext فرا می‌خواند. این جداسازی سه‌گانه (Business Logic خالص، دسترسی دیتابیس، و Runner) دقیقاً معماری پنج‌بخشی است که در بخش‌های قبلی معرفی شد و امکان تست مستقل هر بخش، جایگزینی ساده دیتابیس با نسخه آزمایشی، و کنترل کامل بر لحظه نوشتن داده را فراهم می‌کند. 

---

## بخش بیست‌وسوم: نمودار کامل جریان سفارش

نویسنده در پایان بخش ۴.۴، کل مسیر پردازش سفارش را از کلیک کاربر روی دکمه خرید تا ثبت نهایی در دیتابیس به‌صورت یک نمودار پنج‌مرحله‌ای ترسیم می‌کند. این مسیر شامل `CheckoutController` (لایه Presentation) است که اکشن `PlaceOrder` را اجرا می‌کند و آن را به `PlaceOrderService` (لایه Service) می‌سپارد؛ این سرویس داده‌های سبد خرید را از کوکی استخراج کرده، DTO مناسب می‌سازد و آن را به `BizRunner` عمومی (کلاس `RunnerWriteDb<TIn, TOut>`) تحویل می‌دهد. 

`BizRunner` سپس متد `Action` کلاس Business Logic را فرا می‌خواند و در صورت نبود خطا، `SaveChanges` را روی Context صدا می‌زند. اگر سفارش با موفقیت ثبت شود، کوکی سبد خرید پاک می‌شود و صفحه تأیید نمایش داده می‌شود؛ در غیر این صورت، پیام‌های خطا به کاربر بازگردانده می‌شوند تا فرم را اصلاح کند. این جریان نمونه‌ای دقیق از الگوی **Adapter** است که در آن `PlaceOrderService` نقش تبدیل داده بین لایه‌های مختلف را ایفا می‌کند. 

### مزایا و معایب الگوی پیچیده

نویسنده به‌صراحت اعلام می‌کند که سال‌ها از این الگو استفاده کرده و آن را الگویی عالی می‌داند، اما هشدار می‌دهد که این الگو «سنگین از نظر کد» (Code-Heavy) است و باید فقط برای منطق تجاری واقعاً پیچیده استفاده شود. جدول زیر مزایا و معایب را خلاصه می‌کند: 

| جنبه | توضیح |
|---|---|
| مزیت اصلی | پیروی از رویکرد DDD که رویکردی شناخته‌شده و پرکاربرد است   |
| مزیت دوم | منطق تجاری «خالص» باقی می‌ماند چون هیچ اطلاعاتی از دیتابیس ندارد؛ این پنهان‌سازی از طریق متدهای `BizDbAccess` انجام می‌شود   |
| مزیت سوم | امکان تست منطق تجاری بدون نیاز به دیتابیس واقعی، با جایگزینی کلاس دسترسی داده با نسخه Stub یا Mock   |
| معیب اصلی | نیاز به نوشتن کد اضافه برای جداسازی منطق تجاری از دسترسی دیتابیس، که زمان و تلاش بیشتری می‌طلبد   |
| نتیجه‌گیری نویسنده | اگر منطق تجاری ساده باشد یا بیشتر کد روی خود دیتابیس کار کند، تلاش برای ساخت کلاس مجزای دسترسی داده ارزشش را ندارد   |

## بخش بیست‌وچهارم: منطق تجاری ساده - ChangePriceOfferService

### قوانین کسب‌وکار مثال جدید

نویسنده حالا به سراغ سطح دوم پیچیدگی می‌رود: منطق تجاری «ساده» که کمترین شاخه‌بندی شرطی دارد. مثال انتخابی، مدیریت افزودن یا حذف یک تخفیف قیمتی (`PriceOffer`) برای یک کتاب است، با سه قانون ساده: اگر کتاب تخفیف داشته باشد، تخفیف حذف می‌شود؛ اگر نداشته باشد، تخفیف جدید اضافه می‌شود؛ و متن تخفیف (`PromotionalText`) هنگام افزودن نمی‌تواند خالی باشد. 

### رویکرد طراحی برای منطق ساده

نکته کلیدی این بخش، تفاوت رویکرد طراحی است: برای منطق تجاری ساده، نویسنده عمداً از پنج Guideline قبلی استفاده نمی‌کند تا کد سریع‌تر نوشته شود. او این کلاس‌ها را نه در لایه BizLogic بلکه در لایه Service قرار می‌دهد، زیرا این کلاس‌ها نیاز به دسترسی مستقیم به `DbContext` دارند و لایه BizLogic چنین دسترسی را اجازه نمی‌دهد. بهای این سادگی، آن است که منطق تجاری با کد دیگر (دسترسی دیتابیس) مخلوط می‌شود، که می‌تواند فهم و Unit Test کردن آن را دشوارتر کند؛ این یک Trade-off عامدانه برای توسعه سریع‌تر است. 

### پیاده‌سازی متد AddRemovePriceOffer

این متد از الگوی **Guard Clause** برای بررسی شرایط استفاده می‌کند: 

```csharp
public ValidationResult AddRemovePriceOffer(PriceOffer promotion)
{
    var book = _context.Books
        .Include(r => r.Promotion)
        .Single(k => k.BookId == promotion.BookId);
    if (book.Promotion != null)
    {
        _context.Remove(book.Promotion);
        _context.SaveChanges();
        return null;
    }
    if (string.IsNullOrEmpty(promotion.PromotionalText))
    {
        return new ValidationResult(
            "This field cannot be empty",
            new;
    }
    book.Promotion = promotion;
    _context.SaveChanges();
    return null;
}
```

نکته فنی مهم این‌جا برخلاف Guideline پنجم، این کلاس خودش مستقیماً `SaveChanges` را صدا می‌زند، چون طبق تصمیم طراحی، این کلاس یک سرویس ساده در لایه Service است، نه یک BizLogic خالص که باید از BizRunner عبور کند. همچنین توضیح داده می‌شود که EF Core (برخلاف EF6.x) به‌صورت پیش‌فرض قبل از نوشتن در دیتابیس، داده را Validate نمی‌کند، چون فرض بر این است که اعتبارسنجی معمولاً در Frontend انجام می‌شود. 

---

## بخش بیست‌وپنجم: منطق تجاری اعتبارسنجی - افزودن Review

### نقص نسخه قبلی و قوانین جدید

نویسنده به نسخه ساده CRUD فصل سوم برمی‌گردد که برای افزودن یک `Review` به کتاب نوشته شده بود، اما هیچ اعتبارسنجی نداشت. اکنون دو قانون کسب‌وکار اضافه می‌شود: مقدار `NumStars` باید بین صفر تا پنج باشد، و فیلد `Comment` نباید خالی یا فقط فاصله باشد. 

### پیاده‌سازی با StatusGenericHandler

برخلاف مثال سفارش کتاب که از `ValidationResult` و `AddError` مستقیم استفاده می‌کرد، این‌جا نویسنده یک کتابخانه NuGet جداگانه به نام `GenericServices.StatusGeneric` را معرفی می‌کند که یک الگوی Status عمومی‌تر برای بازگرداندن نتیجه عملیات فراهم می‌کند: 

```csharp
public IStatusGeneric AddReviewWithChecks(Review review)
{
    var status = new StatusGenericHandler();
    if (review.NumStars < 0 || review.NumStars > 5)
        status.AddError("This must be between 0 and 5.",
            nameof(Review.NumStars));
    if (string.IsNullOrWhiteSpace(review.Comment))
        status.AddError("Please provide a comment with your review.",
            nameof(Review.Comment));
    if (!status.IsValid)
        return status;
    var book = _context.Books
        .Include(r => r.Reviews)
        .Single(k => k.BookId == review.BookId);
    book.Reviews.Add(review);
    _context.SaveChanges();
    return status;
}
```

از منظر Clean Code، این متد الگوی **Fail Fast** را رعایت می‌کند: بررسی‌های اعتبارسنجی پیش از هرگونه تغییر در Context اجرا می‌شوند و تنها در صورت معتبر بودن داده، عملیات نوشتن آغاز می‌شود. نویسنده تأکید می‌کند که این نوع اعتبارسنجی معمولاً باید در Frontend هم تکرار شود، اما تکرار آن در Backend، اپلیکیشن را در برابر داده‌های نامعتبر مقاوم‌تر می‌کند. 

### مزایا و معایب این الگو

| جنبه | توضیح |
|---|---|
| مزیت | این کلاس‌ها همان سرویس‌های CRUD فصل سوم هستند به‌همراه چند بررسی اضافه، پس دانش جدیدی لازم نیست   |
| معیب | باید نتیجه Status را در لایه بالاتر مدیریت کرد (مثلاً نمایش دوباره فرم با پیام خطا)، که خودش یک هزینه اضافی است   |

## بخش بیست‌وششم: اعتبارسنجی در سطح SaveChanges

### چرا EF Core به‌صورت پیش‌فرض اعتبارسنجی نمی‌کند

نکته مهم فنی این بخش این است که برخلاف EF6.x که پیش از نوشتن در دیتابیس به‌صورت خودکار داده را Validate می‌کرد، EF Core به دلایل عملکردی (Performance) این کار را به‌صورت پیش‌فرض انجام نمی‌دهد، چون فرض بر این است که اعتبارسنجی معمولاً در Frontend صورت می‌گیرد. نویسنده حالا راهی نشان می‌دهد که این قابلیت را به‌صورت اختیاری بازگردانیم. 

### اعتبارسنجی در سطح Entity با IValidatableObject

نویسنده منطق بررسی «آیا کتاب برای فروش است یا نه» را از Business Logic به داخل کلاس Entity منتقل می‌کند و از دو مکانیزم استفاده می‌کند: صفت `

```csharp
public class LineItem : IValidatableObject
{
    [Range(1,5, ErrorMessage =
        "This order is over the limit of 5 books.")]
    public byte LineNum { get; set; }
    ...
    IEnumerable<ValidationResult> IValidatableObject.Validate
        (ValidationContext validationContext)
    {
        var currContext =
            validationContext.GetService(typeof(DbContext));
        if (ChosenBook.Price < 0)
            yield return new ValidationResult(
                $"Sorry, the book '{ChosenBook.Title}' is not for sale.");
        if (NumBooks > 100)
            yield return new ValidationResult(
                "If you want to order a 100 or more books please phone us",
                new;
    }
}
```

نکته فنی مهم این‌جا این است که داخل متد `Validate` می‌توان به property‌های Navigational مانند `ChosenBook.Title` دسترسی داشت، چون تا زمانی که `DetectChanges` اجرا شده باشد، مرحله **Relational Fixup** تضمین می‌کند این property هرگز null نیست. 

### متد افزونه SaveChangesWithValidation

برای فعال‌سازی این اعتبارسنجی، نویسنده به‌جای تغییر مستقیم `DbContext`، یک متد افزونه (Extension Method) می‌سازد که روی هر `DbContext` قابل استفاده است: 

```csharp
public static ImmutableList<ValidationResult>
    SaveChangesWithValidation(this DbContext context)
{
    var result = context.ExecuteValidation();
    if (result.Any()) return result;
    context.SaveChanges();
    return result;
}
```

متد کمکی `ExecuteValidation` با استفاده از `ChangeTracker.Entries()` تمام Entity‌های در حالت Added یا Modified را پیدا می‌کند و هرکدام را با `Validator.TryValidateObject` بررسی می‌کند. یک کلاس کمکی به نام `ValidationDbContextServiceProvider` اینترفیس `IServiceProvider` را پیاده می‌کند تا در صورت نیاز، دسترسی به `DbContext` جاری درون متد `Validate` فراهم شود؛ این نمونه‌ای از الگوی **Service Locator** محدود است. 

از آن‌جا که Business Logic خطاها را به شکل لیست برمی‌گرداند نه Exception، نویسنده یک نسخه جدید از BizRunner به نام `RunnerWriteDbWithValidation` می‌سازد که هم خطاهای Business Logic و هم خطاهای اعتبارسنجی سطح SaveChanges را در یک لیست واحد جمع‌آوری می‌کند. 

---

## بخش بیست‌وهفتم: زنجیره‌کردن منطق تجاری با Transaction

### سه گزینه برای منطق تجاری پیچیده

نویسنده وقتی با منطق تجاری بزرگ یا پیچیده مواجه می‌شود، سه گزینه پیش رو می‌گذارد: نوشتن یک متد بزرگ واحد (که خوانایی و Refactor را دشوار می‌کند و اصل DRY را نقض می‌کند)، نوشتن چند متد کوچک‌تر با یک متد ناظر (که اگر مراحل بعدی به داده‌های نوشته‌شده توسط مراحل قبلی وابسته باشند، اصل Atomic Unit را نقض می‌کند)، یا گزینه سوم که نویسنده انتخاب می‌کند: نوشتن چند متد کوچک که هرکدام مستقل به دیتابیس می‌نویسند اما در یک Unit of Work واحد ترکیب می‌شوند. 

### مکانیزم Transaction در EF Core

راه‌حل نهایی بر پایه ویژگی **Transaction** پایگاه‌داده بنا شده است. وقتی EF Core یک Transaction صریح می‌سازد، دو اثر دارد: تمام نوشتن‌ها در دیتابیس از دید سایر کاربران پنهان می‌ماند تا زمانی که متد `Commit` صدا زده شود، و در صورت بروز خطا، متد `RollBack` تمام نوشتن‌های انجام‌شده در آن Transaction را کنار می‌گذارد. به این ترتیب، سه بخش مجزا از منطق تجاری (Biz1، Biz2، Biz3) که هرکدام مستقلاً `SaveChanges` را صدا می‌زنند، از دید دیتابیس به‌صورت یک واحد اتمی عمل می‌کنند. 

### کلاس RunnerTransact2WriteDb

این کلاس، نسخه پیشرفته‌تر BizRunner است که دو مرحله از منطق تجاری را در یک Transaction اجرا می‌کند: 

```csharp
public class RunnerTransact2WriteDb<TIn, TPass, TOut>
    where TOut : class
{
    private readonly IBizAction<TIn, TPass> _actionPart1;
    private readonly IBizAction<TPass, TOut> _actionPart2;
    private readonly EfCoreContext _context;
    public IImmutableList<ValidationResult> Errors { get; private set; }
    public bool HasErrors => Errors.Any();

    public RunnerTransact2WriteDb(
        EfCoreContext context,
        IBizAction<TIn, TPass> actionPart1,
        IBizAction<TPass, TOut> actionPart2)
    {
        _context = context;
        _actionPart1 = actionPart1;
        _actionPart2 = actionPart2;
    }

    public TOut RunAction(TIn dataIn)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            var passResult = RunPart(_actionPart1, dataIn);
            if (HasErrors) return null;
            var result = RunPart(_actionPart2, passResult);
            if (!HasErrors)
            {
                transaction.Commit();
            }
            return result;
        }
    }

    private TPartOut RunPart<TPartIn, TPartOut>(
        IBizAction<TPartIn, TPartOut> bizPart,
        TPartIn dataIn)
        where TPartOut : class
    {
        var result = bizPart.Action(dataIn);
        Errors = bizPart.Errors;
        if (!HasErrors)
        {
            _context.SaveChanges();
        }
        return result;
    }
}
```

### تحلیل فنی الگو

از منظر Design Pattern، این کلاس دقیقاً بر پایه دستور `using` برای مدیریت Transaction طراحی شده است: اگر `Commit` هرگز صدا زده نشود و کد از بلوک `using` خارج شود، Dispose شدن Transaction به‌صورت خودکار `RollBack` را فرا می‌خواند. متد کمکی خصوصی `RunPart` هر بخش از منطق تجاری را اجرا می‌کند، خطاهای آن را کپی می‌کند، و در صورت نبود خطا `SaveChanges` را صدا می‌زند تا تغییرات در همان Transaction محلی ذخیره شوند (نه در دیتابیس نهایی). 

نکته کلیدی معماری این‌جا این است که **هیچ‌کدام از کلاس‌های منطق تجاری اصلی نیازی به تغییر ندارند** و اصلاً نمی‌دانند در حال اجرا در یک Transaction هستند؛ فقط نحوه فراخوانی آن‌ها (توسط BizRunner) تغییر می‌کند. این ویژگی نمونه‌ای عالی از رعایت اصل **Open/Closed Principle** است. 

### کاربرد عملی: تقسیم منطق سفارش

نویسنده منطق سفارش قبلی را به دو بخش تقسیم می‌کند: `PlaceOrderPart1` که شیء `Order` را بدون `LineItems` می‌سازد، و `PlaceOrderPart2` که `LineItems` را به آن اضافه می‌کند. کلاس `PlaceOrderServiceTransact` این دو بخش را به `RunnerTransact2WriteDb` می‌دهد و این کلاس آن‌ها را در یک Transaction واحد اجرا می‌کند. 

### مزایا و معایب زنجیره Transaction

| جنبه | توضیح |
|---|---|
| مزیت | امکان تقسیم و/یا استفاده مجدد از بخش‌های منطق تجاری، به‌طوری‌که از دید دیتابیس یک عملیات واحد به‌نظر برسند   |
| کاربرد نمونه | ساخت یک Entity پیچیده چندبخشی و سپس بروزرسانی فوری آن، با ترکیب منطق Create و Update در یک Transaction   |
| معیب | افزودن پیچیدگی به دسترسی دیتابیس که Debug کردن را دشوارتر می‌کند و ممکن است مشکل Performance ایجاد کند   |
| هشدار فنی | اگر از گزینه `EnableRetryOnFailure` (بخش ۱۱.۸) استفاده می‌کنید، باید امکان فراخوانی چندگانه منطق تجاری را مدیریت کنید   |

## جمع‌بندی فصل چهارم

نویسنده در پایان فصل تأکید می‌کند که مهم‌ترین تفاوت EF Core با EF6.x در این فصل این است که متد `SaveChanges` در EF Core، برخلاف EF6.x، داده را پیش از نوشتن در دیتابیس اعتبارسنجی نمی‌کند، اما پیاده‌سازی این قابلیت (که در بخش‌های قبلی دیدیم) در EF Core ساده است. همچنین، انتخاب بین رویکردهای مختلف منطق تجاری همیشه یک Trade-off بین سادگی راه‌حل و زمان توسعه و تست است، نه یک قانون مطلق. 

---

## بخش بیست‌وهشتم: معرفی ASP.NET Core و معماری Book App

### چرا ASP.NET Core

نویسنده ASP.NET Core را چارچوبی متن‌باز و چندسکویی برای ساخت اپلیکیشن‌های ابری معرفی می‌کند و تجربه شخصی خود را بیان می‌کند که این چارچوب از نظر Performance به‌طور قابل‌توجهی از نسخه قبلی (ASP.NET MVC5) بهتر است. یک نکته فنی مهم و کاربردی این‌جا مطرح می‌شود: در حالت Development، سیستم Logging پیش‌فرض می‌تواند به‌شدت سرعت اپلیکیشن را کاهش دهد؛ نویسنده با جایگزین‌کردن یک Logger درون‌حافظه‌ای سریع‌تر، سرعت صفحه لیست کتاب‌ها را سه برابر افزایش داد. Book App در این کتاب با الگوی Model-View-Controller (MVC) از ASP.NET Core ساخته می‌شود. 

### معماری لایه‌ای کامل Book App

با افزودن دو پروژه‌ای که در فصل چهارم برای منطق تجاری اضافه شدند (BizLogic و BizDbAccess)، معماری کامل اپلیکیشن اکنون شامل پنج لایه است: 

- **DataLayer**: شامل کلاس‌های Entity و DbContext اپلیکیشن؛ این لایه هیچ اطلاعی از لایه‌های بالاتر ندارد 
- **BizDbAccess**: دسترسی پایگاه‌داده مخصوص منطق تجاری پیچیده 
- **BizLogic**: منطق تجاری خالص (Pure)، بدون دسترسی مستقیم به EF Core 
- **ServiceLayer**: نقش Adapter بین DataLayer و اپلیکیشن وب را ایفا می‌کند و شامل DTOها، اشیای Query، و سرویس‌های CRUD/منطق تجاری ساده است 
- **BookApp**: لایه نمایش (Presentation) که صفحات HTML و کد JavaScript/Ajax را ارائه می‌دهد 

نویسنده تأکید می‌کند این معماری لایه‌ای که در یک اجرایی (Executable) واحد کامپایل می‌شود، با سرویس‌های ابری که نیاز به Scale Out (در Azure) یا Auto Scaling (در AWS) دارند سازگار است، چون هر Instance کپی کامل اپلیکیشن را اجرا می‌کند و بار از طریق Load Balancer توزیع می‌شود. 

### زمینه‌سازی برای بخش بعدی: چرا DI لازم است

نویسنده در انتهای این بخش وارد موضوع Dependency Injection می‌شود و دلیل نیاز به آن را روشن می‌کند: روش ساده‌ای که در فصل دوم برای ساخت نمونه `DbContext` دیدیم (با نوشتن مستقیم Connection String و `DbContextOptionsBuilder`) دو مشکل اساسی دارد؛ باید این کد در هر محل دسترسی پایگاه‌داده تکرار شود (نقض DRY)، و Connection String به‌صورت ثابت (Hardcoded) نوشته شده که هنگام Deploy کردن روی هاست دیگر، آدرس پایگاه‌داده متفاوت خواهد بود. ASP.NET Core این مشکل را از طریق یک ارائه‌دهنده DI حل می‌کند که نحوه ساخت `DbContext` را یک‌بار «ثبت» (Register) می‌کند و سپس هر بخش از سیستم که به آن نیاز دارد می‌تواند نمونه‌ای از آن را درخواست کند. 

---

## بخش بیست‌ونهم: مکانیزم Dependency Injection

### چرا کد قبلی مشکل دارد

نویسنده به روش ساده فصل دوم برای ساخت `DbContext` برمی‌گردد که در آن Connection String به‌صورت مستقیم در کد نوشته می‌شد: 

```csharp
const string connection =
    "Data Source=(localdb)\\mssqllocaldb;" +
    "Database=EfCoreInActionDb.Chapter02;" +
    "Integrated Security=True;";
var optionsBuilder = new DbContextOptionsBuilder<EfCoreContext>();
optionsBuilder.UseSqlServer(connection);
var options = optionsBuilder.Options;
using (var context = new EfCoreContext(options))
{...
```

این کد دو نقص فنی اساسی دارد: باید در هر نقطه از برنامه که به دیتابیس دسترسی لازم است تکرار شود (نقض اصل DRY)، و Connection String به‌صورت Hardcoded نوشته شده، در حالی‌که هنگام Deploy روی هاست، آدرس دیتابیس تغییر خواهد کرد. 

### تعریف دقیق DI

نویسنده تعریف دقیقی ارائه می‌دهد: به‌جای نوشتن مستقیم `var myClass = new MyClass()` که ساخت کلاس را Hardcode می‌کند، با DI یک کلاس را همراه با اینترفیسش (مثلاً `IMyClass`) نزد یک DI Provider «ثبت» (Register) می‌کنید؛ سپس هرجا به آن نیاز داشتید، فقط `IMyClass myClass` را در سازنده (Constructor) بگذارید و DI Provider به‌صورت پویا یک نمونه می‌سازد و آن را «تزریق» می‌کند. سه مزیت اصلی DI عبارتند از: اتصال پویای اجزای برنامه (DI ترتیب ساخت کلاس‌ها را خودش تشخیص می‌دهد)، کاهش Coupling با استفاده از اینترفیس (که برای Unit Testing و جایگزینی با Mock بسیار مفید است)، و امکان انتخاب پویای کلاس بر اساس تنظیمات (مثلاً استفاده از یک Handler ساختگی کارت اعتباری در محیط Development). 

### مثال پایه: کلاس Demo

نویسنده یک مثال ساده با کلاس `Demo` و اینترفیس `IDemo` ارائه می‌دهد که در `HomeController` تزریق می‌شود: 

```csharp
services.AddTransient<IDemo, Demo>();
services.AddControllersWithViews();
```

وقتی ASP.NET Core به `HomeController` نیاز دارد، ابتدا `Demo` ساخته می‌شود، سپس `HomeController` با تزریق آن نمونه در پارامتر سازنده `IDemo demo` ساخته می‌شود. این روش را **Constructor Injection** می‌نامند که رایج‌ترین شکل DI است. 

### سه نوع Lifetime سرویس

مفهوم کلیدی این بخش که مستقیماً بر EF Core اثر می‌گذارد، Lifetime سرویس‌های DI است. نویسنده سه نوع را معرفی می‌کند: 

| نوع Lifetime | رفتار | کاربرد نمونه |
|---|---|---|
| Transient | هر بار درخواست، یک نمونه جدید ساخته می‌شود | سرویس‌های معمولی که باید با تنظیمات پیش‌فرض شروع شوند   |
| Singleton | همیشه یک نمونه واحد بازگردانده می‌شود | داده‌های ثابت که فقط یک‌بار در Startup مقداردهی می‌شوند   |
| Scoped | یک نمونه واحد در طول یک HTTP Request، و نمونه جدید در Request بعدی | `DbContext` اپلیکیشن   |

### چرا DbContext باید Scoped باشد

این بخش نکته‌ای بسیار مهم از منظر Clean Code و معماری را روشن می‌کند: اگر منطق پیچیده‌ای بین چند کلاس (مثلاً یک کلاس Main و یک کلاس SubPart) تقسیم شود و هرکدام از طریق DI نمونه جداگانه‌ای از `DbContext` دریافت کنند، تغییراتی که کلاس SubPart روی یک Entity اعمال می‌کند در نمونه Main دیده نمی‌شود و هنگام فراخوانی `SaveChanges` در انتهای کار از بین می‌رود. از طرف دیگر، هر HTTP Request باید نمونه اختصاصی خود را داشته باشد، چون `DbContext` در EF Core **Thread-Safe نیست** و اشتراک‌گذاری آن بین Request‌های موازی باعث خطا می‌شود ؛ به همین دلیل Lifetime پیش‌فرض `DbContext` دقیقاً روی Scoped تنظیم شده است. 

### نکته ویژه: اپلیکیشن‌های Blazor Server

نویسنده هشدار می‌دهد که در معماری Blazor Server، چون فرانت‌اند می‌تواند به‌صورت موازی چندین درخواست دیتابیس ارسال کند، Lifetime استاندارد Scoped کافی نیست، زیرا چند Thread ممکن است هم‌زمان بخواهند از یک نمونه `DbContext` استفاده کنند که غیرمجاز است. راه‌حل ساده‌تر استفاده از یک **DbContext Factory Method** در EF Core 5 است که هر بار یک نمونه کاملاً جدید می‌سازد؛ اما عیب این روش این است که کلاس‌های مختلف دیگر نمونه یکسانی از Context را به اشتراک نمی‌گذارند، و راه‌حل آن انتقال دستی یک نمونه واحد از کلاس Main به SubPart است. 

---

## بخش سی‌ام: ثبت DbContext نزد DI

### مکان‌یابی دیتابیس بدون Hardcode

اولین قدم، رفع مشکلی است که در ابتدای فصل مطرح شد: به‌جای نوشتن Connection String مستقیماً در کد، این مقدار باید در فایل تنظیمات اپلیکیشن (`appsettings.json` یا نسخه‌های محیطی آن مانند `appsettings.Development.json`) قرار گیرد. این فایل‌ها به‌صورت سلسله‌مراتبی خوانده می‌شوند؛ به‌طوری‌که در هنگام Deploy، فایل `appsettings.Production.json` آخرین‌بار خوانده می‌شود و هر مقداری با نام یکسان در فایل‌های قبلی را Override می‌کند. این معماری دقیقاً همان مشکل دوم بخش قبل را حل می‌کند: در محیط توسعه از یک Connection String محلی (مثل `(localdb)\mssqllocaldb`) استفاده می‌شود، و روی سرور Production بدون تغییر کد، مقدار متفاوتی بارگذاری می‌شود. 

### ثبت DbContext در ConfigureServices

نویسنده تأکید می‌کند که متد `ConfigureServices` در کلاس `Startup` (یا معادل آن در `Program.cs`) دقیقاً همان محلی است که باید نمونه `DbContext` اپلیکیشن ثبت شود. برای این کار، سازنده کلاس `DbContext` باید یک پارامتر از نوع `DbContextOptions<TContext>` بپذیرد و آن را به سازنده کلاس پایه ارسال کند: 

```csharp
public EfCoreContext(DbContextOptions<EfCoreContext> options)
    : base(options)
{
}
```

این طراحی امکان می‌دهد که تنظیمات دیتابیس (نوع Provider، Connection String) به‌صورت پویا از بیرون به کلاس تزریق شود، نه اینکه در خود کلاس Hardcode شده باشد. سپس، برخلاف روش دستی فصل دوم (ساخت مستقیم `DbContextOptionsBuilder`)، در اپلیکیشن ASP.NET Core این تنظیمات به‌صورت خودکار توسط زیرساخت DI فراهم و به سازنده کلاس تزریق می‌شود. 

### نتیجه عملی: دریافت DbContext از طریق DI

طبق خلاصه صریح نویسنده در پایان این فصل، روش استاندارد دریافت یک نمونه از `DbContext` اپلیکیشن در ASP.NET Core این است: از طریق **Constructor Injection**، جایی که DI با بررسی نوع پارامترهای سازنده، سرویس متناظر را پیدا کرده و نمونه‌اش را فراهم می‌کند. این دقیقاً همان مفهومی است که در بخش قبل با مثال `IDemo`/`Demo` دیدیم، با این تفاوت که اکنون سرویس تزریق‌شده خود `EfCoreContext` است — با Lifetime پیش‌فرض Scoped، که همان‌طور که در بخش قبل توضیح داده شد، برای هر HTTP Request یک نمونه یکتا فراهم می‌کند. 

### نکته تکمیلی: DbContext Factory

نویسنده همچنین اشاره می‌کند که به‌جای تزریق مستقیم نمونه `DbContext`، می‌توان یک **DbContext Factory** ثبت کرد که هر بار که فراخوانی شود، یک نمونه کاملاً تازه از `DbContext` می‌سازد؛ این روش دقیقاً همان راه‌حلی است که در بخش قبل برای اپلیکیشن‌های Blazor Server و اجرای Task‌های موازی (Parallel Tasks) پیشنهاد شد، چون در آن سناریوها Lifetime استاندارد Scoped برای Thread-Safety کافی نیست. 

---

## بخش سی‌ویکم: معماری فراخوانی EF Core از ASP.NET Core

### واژگان پایه‌ای ASP.NET Core MVC

نویسنده ابتدا واژگان کلیدی الگوی MVC را دقیق تعریف می‌کند: کلاسی که مسئول تحویل صفحات HTML است **Controller** نامیده می‌شود (مانند `HomeController` که از کلاس پایه `Controller` در ASP.NET Core ارث‌بری می‌کند)، و متدهای این کلاس که به Razor View‌ها متصل می‌شوند **Action Method** نام دارند (مانند متد `Index` که لیست کتاب‌ها را نمایش می‌دهد یا `About`). نکته مهم این است که هرچند از نظر فنی می‌توان تمام کد دسترسی به دیتابیس را داخل هر Action Method نوشت، نویسنده این کار را انجام نمی‌دهد، بلکه از اصل **Separation of Concerns (SoC)** پیروی می‌کند. 

### چرا کد EF Core نباید در لایه ASP.NET Core باشد

نویسنده اصل SoC را دقیقاً تعریف می‌کند: یک سیستم نرم‌افزاری باید به بخش‌هایی تجزیه شود که کمترین همپوشانی عملکردی را داشته باشند؛ این اصل با دو مفهوم مرتبط دیگر پیوند دارد: **Coupling** (هر پروژه باید تا حد امکان خودکفا باشد) و **Cohesion** (هر پروژه باید کدهایی با کارکرد مشابه یا به‌شدت مرتبط داشته باشد). با اعمال این اصل، پروژه ASP.NET Core و پروژه منطق تجاری خالص (BizLogic) به‌هیچ‌وجه شامل کد Query یا Update مستقیم EF Core نمی‌شوند. 

سه دلیل عملی برای این جداسازی بیان می‌شود:

- **تمرکز بهتر روی UX**: چون فرانت‌اند ASP.NET Core باید تمرکزش را کاملاً روی نمایش بهینه داده‌ها بگذارد، تبدیل داده‌های دیتابیس به شکل قابل‌استفاده برای Frontend (معمولاً از طریق DTO یا ViewModel) به‌جای Controller در لایه سرویس (Service Layer) انجام می‌شود 
- **جلوگیری از پخش‌شدن کد در Controller**: از آنجا که Controller‌های ASP.NET معمولاً چند Action دارند (لیست، افزودن، ویرایش و غیره)، انتقال کد دیتابیس به لایه سرویس اجازه می‌دهد برای هر عملیات کلاس مجزایی ساخته شود، به‌جای پخش‌شدن منطق دیتابیس در سراسر Controller 
- **تست‌پذیری بهتر**: تست‌کردن کد دیتابیس در لایه سرویس بسیار ساده‌تر از تست‌کردن آن داخل Controller است، چون Controller به ویژگی‌هایی مانند `HttpRequest` دسترسی دارد که شبیه‌سازی‌شان برای Unit Test دشوار است؛ برای تست کل اپلیکیشن باید از پکیج `Microsoft.AspNetCore.Mvc.Testing` استفاده کرد که به آن Integration Testing گفته می‌شود، در تقابل با Unit Testing که تست بخش‌های کوچک‌تر است 

### تزریق عملی DbContext در Controller

اکنون نویسنده مثال `Demo`/`IDemo` بخش‌های قبل را با یک مثال واقعی جایگزین می‌کند: تزریق مستقیم `EfCoreContext` (کلاس DbContext اپلیکیشن) به داخل `HomeController` از طریق Constructor Injection: 

```csharp
public class HomeController : Controller
{
    private readonly EfCoreContext _context;
    public HomeController(EfCoreContext context)
    {
        _context = context;
    }
    public IActionResult Index
        (SortFilterPageOptions options)
```

در این کد، `EfCoreContext` توسط ASP.NET Core از طریق DI فراهم می‌شود و در یک فیلد Local (`_context`) ذخیره می‌شود تا بتوان از آن برای ساخت نمونه‌ای از کلاس `ListBooksService` (که در فصل دوم برای مرتب‌سازی، فیلتر و صفحه‌بندی کتاب‌ها نوشته شده بود) استفاده کرد. پارامتر `options` در متد `Index` نیز به‌صورت خودکار از طریق URL با مقادیر مرتب‌سازی، فیلتر و صفحه‌بندی پر می‌شود. 

---

## بخش سی‌ودوم: پیاده‌سازی صفحه لیست کتاب‌ها

### تزریق DbContext و فراخوانی سرویس

نویسنده اکنون کد کامل Action Method `Index` را نشان می‌دهد که از `EfCoreContext` تزریق‌شده استفاده می‌کند: 

```csharp
{
    var listService =
        new ListBooksService(_context);
    var bookList = listService
        .SortFilterPage(options)
        .ToList();
    return View(new BookListCombinedDto
        (options, bookList));
}
```

نکته کلیدی این کد این است که `_context` (که همان `EfCoreContext` تزریق‌شده توسط DI است) به‌عنوان پارامتر به سازنده `ListBooksService` — کلاسی که در فصل دوم برای مرتب‌سازی، فیلتر و صفحه‌بندی نوشته شده بود — ارسال می‌شود. این دقیقاً همان الگوی معماری‌ای است که در بخش قبل توضیح داده شد: `Controller` خودش کد EF Core نمی‌نویسد، بلکه فقط `DbContext` را به لایه سرویس منتقل می‌کند. 

نویسنده دلیل مهمی برای انتخاب نوع بازگشتی متد `SortFilterPage` می‌دهد: به‌جای بازگرداندن `List<BookListDto>`، این متد `IQueryable<BookListDto>` برمی‌گرداند و سپس متد `ToList()` در انتهای زنجیره به آن اضافه می‌شود. این طراحی محدودیتی که با بازگشت مستقیم یک List ایجاد می‌شد را از بین می‌برد؛ چون به این ترتیب فراخوانی‌کننده می‌تواند بین اجرای همزمان (Synchronous) و ناهمزمان (Async/Await) یکی را انتخاب کند، موضوعی که در بخش ۵.۱۰ فصل به‌تفصیل توضیح داده می‌شود. 

### راه‌حل DbContext Factory برای Blazor Server

نویسنده دقیقاً همان مشکل اشاره‌شده در بخش‌های پیشین (عدم کفایت Lifetime استاندارد Scoped در Blazor Server) را با مثال کد حل می‌کند. به‌جای تزریق مستقیم `DbContext`، در این سناریو `IDbContextFactory<TContext>` تزریق می‌شود: 

```csharp
@inject IDbContextFactory<ContactContext> DbFactory
```

و هرگاه به یک نمونه تازه از `DbContext` نیاز باشد (مثلاً هنگام ذخیره یک Contact جدید)، این نمونه به‌صورت محلی و درون یک بلوک `using` ساخته می‌شود: 

```csharp
using var context = DbFactory.CreateDbContext();
context.Contacts.Add(Contact);
try
{
    await context.SaveChangesAsync();
```

نویسنده تأکید ویژه‌ای می‌کند که این نمونه‌های ساخته‌شده توسط Factory، برخلاف نمونه‌های معمولی که توسط DI مدیریت می‌شوند، **باید به‌صورت دستی Dispose شوند** — دقیقاً همان کاری که `using var context` انجام می‌دهد. این نکته یک تفاوت اساسی و حیاتی بین دو روش دریافت `DbContext` است: در روش استاندارد DI، چرخه عمر و آزادسازی حافظه به‌طور خودکار توسط Container مدیریت می‌شود، اما در روش Factory این مسئولیت به‌عهده برنامه‌نویس منتقل می‌شود. 

### آغاز مبحث Parameter Injection

نویسنده در انتهای این بخش، روش سومی از DI را معرفی می‌کند که ایزوله‌سازی بهتری نسبت به Constructor Injection فراهم می‌کند: **Parameter Injection** با استفاده از Attribute به نام `

---

## بخش سی‌وسوم: ثبت و تزریق سرویس‌های دیتابیس

### تعریف Interface برای سرویس

نویسنده ابتدا رابط `IChangePubDateService` را معرفی می‌کند که پیش‌نیاز روش Parameter Injection است: 

```csharp
public interface IChangePubDateService
{
    ChangePubDateDto GetOriginal(int id);
    Book UpdateBook(ChangePubDateDto dto);
}
```

نکته مهم این است که هرچند از نظر فنی تعریف Interface الزامی نیست، این کار **Best Practice** محسوب می‌شود و در ادامه به تسهیل Unit Testing و همچنین ثبت خودکار سرویس‌ها کمک می‌کند. باید توجه داشت که چون Controller در نهایت با نوع `IChangePubDateService` کار می‌کند، تمام متدها و Propertyهای Public باید در Interface نیز تعریف شوند. 

### ثبت کلاس در ConfigureServices

ثبت این سرویس به روش استاندارد، با افزودن یک خط کد به متد `ConfigureServices` در کلاس `Startup` انجام می‌شود: 

```csharp
services.AddTransient
    <IChangePubDateService, ChangePubDateService>();
```

نویسنده به‌صراحت دلیل انتخاب Lifetime نوع **Transient** را توضیح می‌دهد: چون در هر بار درخواست این سرویس، یک نمونه کاملاً تازه ساخته می‌شود. 

### تزریق سرویس با Parameter Injection

اکنون کد Action Method واقعی نشان داده می‌شود که چگونه Attribute `

```csharp
public IActionResult ChangePubDate
    (int id,
    
{
    var dto = service.GetOriginal(id);
    return View(dto);
}
```

نویسنده دلیل انتخاب Parameter Injection به‌جای Constructor Injection را با استدلال دقیق توضیح می‌دهد: چون کلاس `AdminController` شامل چند دستور به‌روزرسانی دیتابیس دیگر است (مثل افزودن Review یا Promotion به کتاب)، استفاده از Constructor Injection باعث می‌شد نمونه‌ای از `ChangePubDateService` بی‌جهت ساخته شود حتی وقتی یکی از آن دستورات دیگر فراخوانی می‌شود؛ اما با Parameter Injection، فقط زمانی که واقعاً به آن سرویس نیاز است، هزینه زمان و حافظه ساخت آن پرداخت می‌شود. 

نویسنده همچنین زنجیره چهار‌سطحیِ DI را توصیف می‌کند: فراخوانی Action در Controller باعث ساخت `ChangePubDateService` می‌شود، که خود نیازمند `EfCoreContext` است، که آن هم نیازمند `DbContextOptions<EfCoreContext>` است — و این نشان می‌دهد که DI به‌صورت بازگشتی (Recursive) عمل می‌کند و تا زمانی‌که تمام کلاس‌های مورد نیاز ثبت شده باشند، به‌طور خودکار زنجیره را کامل می‌کند. 

### خودکارسازی ثبت سرویس‌ها با NetCore.AutoRegisterDi

نویسنده مشکل عملی روش دستی را مطرح می‌کند: ثبت تک‌به‌تک هر کلاس در پروژه‌های بزرگ، هم زمان‌بر و هم مستعد خطا (فراموش‌کردن ثبت یک سرویس) است. راه‌حل ارائه‌شده، کتابخانه‌ای به نام **NetCore.AutoRegisterDi** است که خود نویسنده ساخته و صرفاً یک وظیفه دارد: اسکن‌کردن یک یا چند Assembly و ثبت خودکار تمام کلاس‌های Public دارای Interface در DI Container: 

```csharp
var assembly1ToScan = Assembly.GetAssembly(typeof(ass1Class));
var assembly2ToScan = Assembly.GetAssembly(typeof(ass2Class));
service.RegisterAssemblyPublicNonGenericClasses(
       assembly1ToScan, assembly2ToScan)
    .Where(c => c.Name.EndsWith("Service"))
    .AsPublicImplementedInterfaces();
```

نویسنده به‌طور شفاف نکته‌ای فنی جالب را افشا می‌کند: در نسخه اول کتاب، او کتابخانه **Autofac** را پیشنهاد می‌داد، اما بعداً از طریق یک توییت از دیوید فاولر (David Fowler) متوجه شد که DI Container داخلی ASP.NET Core به‌طور قابل‌توجهی سریع‌تر از Autofac عمل می‌کند، و این کشف او را به ساخت کتابخانه شخصی‌اش سوق داد. او همچنین کتابخانه مشابه دیگری به نام **Scrutor** را معرفی می‌کند که ویژگی‌های بیشتری برای فیلترکردن کلاس‌ها دارد. 

الگوی توصیه‌شده نویسنده این است که در هر پروژه (مانند `ServiceLayer`، `BizDbAccess`، `BizLogic`) یک Extension Method مجزا برای ثبت خودکار کلاس‌های آن پروژه نوشته شود: 

```csharp
public static class NetCoreDiSetupExtensions
{
    public static void RegisterServiceLayerDi
        (this IServiceCollection services)
    {
        services.RegisterAssemblyPublicNonGenericClasses()
            .AsPublicImplementedInterfaces();
    }
}
```

سپس این متدها در `ConfigureServices` به‌صورت متمرکز فراخوانی می‌شوند: 

```csharp
services.RegisterBizDbAccessDi();
services.RegisterBizLogicDi();
services.RegisterServiceLayerDi();
```

این الگو دو مزیت کلیدی دارد: صرفه‌جویی در زمان ثبت دستی، و مهم‌تر، جلوگیری از خطای انسانی فراموش‌کردن ثبت یک سرویس، چون تمام کلاس‌های واجد شرایط در هر پروژه به‌طور خودکار پیدا و ثبت می‌شوند. 

---

## بخش 5.9: استفاده از قابلیت Migrate در EF Core برای تغییر ساختار دیتابیس

بر اساس متن کتاب، بخش 5.9 با عنوان «Using EF Core's Migrate to change the database structure» توضیح می‌دهد چگونه می‌توان به‌صورت خودکار ساختار دیتابیس را در محیط Production به‌روزرسانی کرد  .

### 5.9.1 به‌روزرسانی دیتابیس Production

نویسنده یادآوری می‌کند که در فصل 2 دو دستور اصلی EF Core Migrations معرفی شد:

- **Add-Migration** — کدی برای ایجاد یا تغییر ساختار دیتابیس تولید می‌کند، منطبق با وضعیت فعلی کلاس‌های Entity و DbContext  .
- **Update-Database** — این کد Migration را روی دیتابیسی که DbContext برنامه به آن اشاره دارد، اعمال می‌کند  .

نکته کلیدی این‌جاست: دستور دوم فقط دیتابیس پیش‌فرض (معمولاً روی ماشین توسعه) را به‌روز می‌کند، نه دیتابیس Production. برای حل این مشکل، سه رویکرد معرفی می‌شود:

1. برنامه در زمان Startup، خودش دیتابیس را بررسی و Migrate کند.
2. یک برنامه مستقل (Standalone) وظیفه Migration را انجام دهد.
3. دستورات SQL استخراج شده و با ابزار دیگری روی دیتابیس Production اجرا شوند  .

نویسنده رویکرد اول (ساده‌ترین حالت) را برای این فصل انتخاب می‌کند، اما صراحتاً هشدار می‌دهد که این روش برای محیط‌های Multi-instance (مثل Scale-out در Azure) مناسب نیست  .

> **⚠️ نکته حیاتی (به‌عنوان یک منتور معماری باید تأکید کنم):**
> مایکروسافت توصیه رسمی می‌کند که به‌روزرسانی دیتابیس Production باید از طریق اسکریپت‌های SQL مجزا انجام شود، چون این روش مقاوم‌تر (Robust) است. نویسنده کتاب هم این هشدار را بیان می‌کند، اما به دلیل پیچیدگی ابزارهای موردنیاز، رویکرد ساده‌تر `Database.Migrate()` را برای آموزش انتخاب کرده است   است — موضوعی که در فصل 11 با جزئیات کامل بررسی خواهد شد.

### 5.9.2 اجرای Migration در زمان Startup برنامه

مزیت این روش این است که هرگز فراموش نمی‌شود: وقتی نسخه جدید برنامه Deploy می‌شود، ابتدا نسخه قدیمی متوقف و سپس نسخه جدید اجرا می‌شود؛ در همین لحظه Startup می‌توانیم متد `context.Database.Migrate()` را فراخوانی کنیم تا هر Migration جاافتاده اعمال شود  .

محل پیشنهادی برای این کد، انتهای متد `BuildWebHost` در کلاس `Program` است، چون در آن‌جا به تمام سرویس‌های Configure شده دسترسی داریم  .

```csharp
public class Program
{
    public static void Main(string
    {
        BuildWebHost(args).Run();
    }

    public static IWebHost BuildWebHost(string =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .Build()
            .MigrateDatabase(); // متد Extension که خودمان تعریف می‌کنیم
}
```

**تحلیل فنی (از منظر Clean Code و Design Pattern):**

نکته‌ای که نویسنده به‌درستی به آن اشاره می‌کند این است که منطق Migration را نباید مستقیماً داخل `Main` نوشت؛ بلکه باید آن را در قالب یک **Extension Method** به نام `MigrateDatabase` جدا کرد و بعد از `Build()` به زنجیره (Fluent Chain) اضافه کرد  ** پیروی می‌کند — کلاس `Program` فقط مسئول راه‌اندازی Host است، و منطق مهاجرت دیتابیس در جای دیگری کپسوله می‌شود.

این متد `MigrateDatabase` باید یک `IWebHost` بگیرد، از آن یک Scope موقت DI بسازد، DbContext را از آن Scope دریافت کند و `Database.Migrate()` را روی آن صدا بزند (این جزئیات پیاده‌سازی در ادامه‌ی متن کتاب می‌آید که هنوز به آن نرسیده‌ایم).

---

## ادامه بخش 5.9: پیاده‌سازی کامل متد MigrateDatabase

اکنون به Listing 5.10 می‌رسیم که پیاده‌سازی کامل متد Extension برای Migration را نشان می‌دهد  .

```csharp
public static IWebHost MigrateDatabase
    (this IWebHost webHost)
{
    using (var scope = webHost.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        using (var context = services
            .GetRequiredService<EfCoreContext>())
        {
            try
            {
                context.Database.Migrate();
                //Possible seed database here
            }
            catch (Exception ex)
            {
                var logger = services
                    .GetRequiredService<ILogger<Program>>();
                logger.LogError(ex,
                "An error occurred while migrating the database.");
                throw;
            }
        }
    }
    return webHost;
}
```

### تحلیل خط‌به‌خط (از منظر OOP و مدیریت منابع)

نویسنده چند تصمیم طراحی مهم در این کد گرفته که ارزش تشریح دارند  :

- **`webHost.Services.CreateScope()`** — چون `MigrateDatabase` خارج از یک HTTP Request واقعی اجرا می‌شود (در زمان Startup)، امکان استفاده مستقیم از DI موجود در Pipeline وجود ندارد. راه‌حل صحیح، ایجاد یک **Scope دستی** است که چرخه‌حیات آن معادل یک Request فرضی است.
- **دو بلوک `using` تودرتو** — اولی Scope را و دومی نمونه DbContext را Dispose می‌کند. این دقیقاً پیاده‌سازی صحیح الگوی **Resource Management** در .NET است؛ چون DbContext پیاده‌ساز `IDisposable` است و نگه‌داشتن آن بدون Dispose باعث نشتی اتصال دیتابیس (Connection Leak) می‌شود.
- **`try/catch` با `throw;` (بدون آرگومان)** — این یک نکته حیاتی Clean Code است: استفاده از `throw;` به‌جای `throw ex;` باعث حفظ **Stack Trace اصلی** استثنا می‌شود. نویسنده Exception را عمداً دوباره پرتاب می‌کند چون معتقد است اگر Migration شکست بخورد، برنامه نباید بالا بیاید (Fail-Fast Principle)  .
- **بازگرداندن `webHost`** — این امکان **Method Chaining** (الگوی Fluent Interface) را فراهم می‌کند تا بتوان چندین متد Startup را پشت سر هم زنجیر کرد، دقیقاً همان‌طور که در Listing 5.9 دیدیم.

### Listing 5.11 — افزودن داده اولیه (Seeding)

پس از Migration، معمولاً نیاز به داده‌های اولیه (Seed Data) دارید. نویسنده این کار را به‌صورت جدا از Migration پیاده‌سازی می‌کند  :

```csharp
public static void SeedDatabase
    (this EfCoreContext context)
{
    if (context.Books.Any()) return;
    context.Books.AddRange(
        EfTestData.CreateFourBooks());
    context.SaveChanges();
}
```

نکته فنی: این متد قبل از افزودن داده، بررسی می‌کند آیا جدول `Books` از قبل داده دارد یا نه (Idempotency ساده) تا از افزودن تکراری داده جلوگیری شود. نویسنده همچنین اشاره می‌کند که اگر بخواهید Seed فقط زمانی اجرا شود که Migration جدیدی اعمال شده، باید از متد `Database.GetPendingMigrations` **قبل از** فراخوانی `Migrate()` استفاده کنید، چون بعد از اجرای Migrate لیست Pending خالی می‌شود  .

> **نکته مقایسه‌ای با EF6.x:** در EF6.x، کلاس `Configuration` و متد `Seed` به‌صورت خودکار در هر اجرای برنامه صدا زده می‌شدند. EF Core این مکانیزم را ندارد و کنترل کامل آن به توسعه‌دهنده واگذار شده — که هم مزیت (کنترل بیشتر) و هم هزینه (کد بیشتر) دارد  .



## شروع بخش 5.10: استفاده از Async/Await برای مقیاس‌پذیری بهتر

اینجا وارد یکی از مهم‌ترین مباحث فصل می‌شویم: چرا و کجا باید از async/await در دسترسی به دیتابیس استفاده کرد  .

### 5.10.1 چرا Async/Await در برنامه وب مهم است؟

وقتی EF Core به دیتابیس دسترسی پیدا می‌کند، باید منتظر پاسخ سرور دیتابیس بماند — که برای Query های پیچیده می‌تواند صدها میلی‌ثانیه طول بکشد. در این مدت، اگر از دستور Synchronous استفاده کنید، یک **Thread از Thread Pool برنامه** اشغال می‌ماند  .

نویسنده با یک مثال دو کاربره این را توضیح می‌دهد:

- **حالت A (بدون async):** دو کاربر هم‌زمان درخواست می‌دهند؛ چون هر دو Synchronous هستند، دو Thread جداگانه (T1 و T2) از Pool اشغال می‌شود  .
- **حالت B (با async):** درخواست کاربر ۱ از دستور Async استفاده می‌کند، پس در حین انتظار برای دیتابیس، Thread آزاد می‌شود. کاربر ۲ می‌تواند از همان Thread آزادشده (T1) استفاده کند، بدون نیاز به Thread جدید  .

**اهمیت مهندسی این موضوع:** این دقیقاً همان چیزی است که به آن **Scalability** می‌گویند — توانایی سرویس‌دهی به تعداد بیشتری کاربر همزمان با همان تعداد منابع سخت‌افزاری. برای یک توسعه‌دهنده .NET Core که با API های پرترافیک کار می‌کند (مثل پروژه‌های شما)، این نکته مستقیماً روی هزینه Infrastructure و تجربه کاربر در بار بالا اثر می‌گذارد.

---

## بخش 5.10.2 و 5.10.3: کجا و چگونه از Async/Await استفاده کنیم

### 5.10.2 در کجا باید از Async/Await با دسترسی به دیتابیس استفاده کرد؟

توصیه کلی مایکروسافت این است که تا حد امکان در برنامه‌های وب از متدهای Async استفاده شود، چون مقیاس‌پذیری بهتری فراهم می‌کند  .

> **تحلیل Trade-off (این دقیقاً همان چیزی است که شما به‌عنوان یک توسعه‌دهنده دغدغه Performance باید بدانید):**
> نویسنده می‌گوید تفاوت سرعت بسیار کوچک است، پس پیروی از قاعده «همیشه از async در ASP.NET استفاده کن» توصیه خوبی است. اما اگر یک Command خاص از نظر سرعت مشکل دارد، ممکن است دلیلی برای بازگشت به روش Synchronous وجود داشته باشد  .

نویسنده همچنین به مقاله‌ای که خودش نوشته ارجاع می‌دهد که موضوع async/await، Scalability و Speed را با جزئیات بیشتری پوشش می‌دهد (http://mng.bz/13b6)  .

### 5.10.3 تبدیل دستورات EF Core به نسخه Async/Await

نویسنده با یک مثال ساده شروع می‌کند — متدی که تعداد کل کتاب‌ها در دیتابیس را برمی‌گرداند (شکل 5.8)  :

```csharp
public async Task<int>
    GetNumBooksAsync(
    EfCoreContext context)
{
    return await
        context.Books
        .CountAsync();
}
```

**آناتومی این متد (نکته‌به‌نکته):**

- **کلیدواژه `async`** — به Compiler می‌گوید این متد Asynchronous است و شامل `await` می‌شود.
- **نوع بازگشتی `Task<int>`** — متدهای Async باید `Task`، `Task<T>` یا نوع Task-like دیگری برگردانند؛ چون خروجی این متد یک `int` است، نوع آن `Task<int>` می‌شود  .
- **قرارداد نام‌گذاری** — طبق Convention، نام متد Async باید به `Async` ختم شود (`GetNumBooksAsync`).
- **`CountAsync()`** — EF Core نسخه Async بسیاری از دستورات معمول خود را دارد؛ این متد تعداد ردیف‌های نتیجه Query را برمی‌گرداند  .
- **کلیدواژه `await`** — نقطه‌ای را نشان می‌دهد که متد منتظر می‌ماند تا عملیات Async فراخوانی‌شده برگردد  .

سپس نویسنده قانون مهمی را بیان می‌کند: بعد از استفاده از یک دستور Async، **هر Caller باید یا خودش Async باشد، یا Task را مستقیماً به بالا پاس بدهد** تا به بالاترین سطح Caller برسد که باید آن را به‌صورت Asynchronous مدیریت کند  . خوشبختانه ASP.NET Core از Async در تمام دستورات اصلی مثل Action Methods کنترلر‌ها پشتیبانی می‌کند، پس این مسئله‌ای ایجاد نمی‌کند.

### مثال عملی: تبدیل Index Action به نسخه Async

Listing 5.12 نسخه Async از متد Index کنترلر HomeController را نشان می‌دهد، با بخش‌های تغییریافته به‌صورت Bold  :

```csharp
public async Task<IActionResult> Index
    (SortFilterPageOptions options)
{
    var listService =
        new ListBooksService(_context);
    var bookList = await listService
        .SortFilterPage(options)
        .ToListAsync();
    return View(new BookListCombinedDto
        (options, bookList));
}
```

نکته طراحی کلیدی اینجا این است: چون متد `SortFilterPage` طراحی شده که یک `IQueryable<T>` برگرداند (نه `List<T>`)، تبدیل به Async بسیار ساده می‌شود — فقط کافی است `.ToList()` را با `.ToListAsync()` جایگزین کنید  . این یک نمونه عالی از **Open/Closed Principle** در عمل است: کد قابل توسعه است بدون اینکه ساختار داخلی Query تغییر کند.

> **راهنمایی نویسنده:** لایه Business Logic معمولاً کاندید خوبی برای استفاده از دستورات Async دیتابیس است، چون اغلب شامل عملیات Read/Write پیچیده هستند. نویسنده نسخه‌های Async از کلاس‌های BizRunner را نیز در مخزن Git پروژه قرار داده است  .

---

## بخش 5.11: اجرای Parallel Tasks و نحوه تأمین DbContext

نویسنده در این بخش چهار مرحله‌ای که پیش‌تر معرفی کرده بود را با یک مثال عملی پیاده‌سازی می‌کند: چگونه هنگام اجرای چند Task موازی، به هر کدام یک نمونه ایزوله از DbContext بدهیم  .

### گام ۱: دریافت IServiceProvider از طریق Constructor Injection

```csharp
private readonly IServiceProvider _serviceProvider;

public AdminController(
    IServiceProvider serviceProvider)
{
    _serviceProvider = serviceProvider;
}
```

نویسنده مثالی را انتخاب می‌کند که به‌طور معمول در دنیای واقعی رخ می‌دهد: فرض کنید باید هم‌زمان به چند سرویس RESTful خارجی دسترسی پیدا کنید. اجرای موازی این درخواست‌ها باعث می‌شود کل زمان اجرا برابر با **طولانی‌ترین** درخواست باشد، نه **مجموع** همه آن‌ها  .

### گام‌های ۲ و ۳: اجرای دو Task موازی با ServiceScopeFactory

```csharp
public async Task<IActionResult> RunTaskWait()
{
    var scopeFactory = _serviceProvider
        .GetRequiredService<IServiceScopeFactory>();
    var task1 = MyTask(scopeFactory, 10);
    var task2 = MyTask(scopeFactory, 20);
    var results = await
        Task.WhenAll(task1, task2);
    return View(results);
}
```

نکته کلیدی طراحی اینجا این است: به هر Task، به‌جای یک نمونه مستقیم DbContext، `ServiceScopeFactory` پاس داده می‌شود تا هر Task بتواند به‌صورت مستقل و Thread-Safe نمونه خودش از DbContext را بسازد  .

### گام ۴: استفاده از DbContext درون هر Task

```csharp
private async Task<int> MyTask
    (IServiceScopeFactory scopeFactory,
    int waitMilliseconds)
{
    using (var serviceScope =
        scopeFactory.CreateScope())
    using (var context =
        serviceScope.ServiceProvider
        .GetService<EfCoreContext>())
    {
        await Task.Delay(waitMilliseconds);
        await context.Books.CountAsync();
    }
}
```

اینجا یک Scope خصوصی و مستقل ساخته می‌شود که چرخه‌حیات آن فقط تا پایان بلوک `using` است  .

> **چرا این الگو از نظر معماری درست است؟**
> `DbContext` به‌هیچ‌عنوان Thread-Safe نیست — اگر یک نمونه مشترک بین دو Task استفاده شود، EF Core یک Exception پرتاب می‌کند  .

### 5.11.1 روش‌های دیگر برای دریافت نمونه DbContext

نویسنده اشاره می‌کند که DI روش توصیه‌شده است، اما در برخی موارد (مثل یک Console Application) که DI پیکربندی نشده، دو گزینه دیگر وجود دارد  :

- Override کردن متد `OnConfiguring` در خود کلاس DbContext.
- استفاده از همان Constructor که در ASP.NET Core به‌کار می‌رود و تزریق دستی گزینه‌های دیتابیس و Connection String (همان روشی که در Unit Test ها استفاده می‌شود، فصل 15)  .

عیب هر دو روش این است که Connection String ثابت است، پس همیشه به همان دیتابیس متصل می‌شوید که می‌تواند Deploy روی محیط‌های دیگر را دشوار کند  .



## پایان فصل 5 — جمع‌بندی رسمی کتاب

فصل با یک Summary رسمی به پایان می‌رسد که نکات کلیدی را فهرست می‌کند  :

- ASP.NET Core از DI برای فراهم‌کردن DbContext برنامه استفاده می‌کند.
- متد `ConfigureServices` در کلاس Startup محل ثبت DbContext با Connection String است.
- دسترسی به DbContext از طریق Constructor Injection یا Parameter Injection (با Attribute ` ممکن است.
- Deploy کردن یک برنامه ASP.NET Core نیازمند تعیین Connection String دیتابیس Host است.
- ویژگی Migration در EF Core یک راه برای تغییر دیتابیس است، اما محدودیت‌هایی روی هاست‌های Cloud با چند Instance دارد.
- Async/await می‌تواند تعداد کاربران هم‌زمان قابل سرویس‌دهی را افزایش دهد، اما ممکن است روی Performance عملیات ساده اثر منفی بگذارد.
- برای اجرای Task های موازی، باید یک نمونه Scoped و مجزا از DbContext به هر Task داده شود  .

همچنین برای خوانندگانی که با EF6.x آشنا هستند، نویسنده تفاوت‌های کلیدی را یادآوری می‌کند: EF Core بر خلاف EF6.x هیچ Database Initializer یا کلاس Configuration با متد Seed ندارد؛ کنترل کامل این فرآیندها به توسعه‌دهنده سپرده شده است  .

---

## فصل 6: پیکربندی ویژگی‌های غیر رابطه‌ای (Configuring Nonrelational Properties)

با پایان فصل 5، وارد بخش دوم کتاب می‌شویم: «Entity Framework in Depth». فصل 6 با عنوان **Configuring Nonrelational Properties** آغاز می‌شود و ساختار آن شامل بخش‌های 6.1 تا 6.15 است  .

### نقشه کلی فصل

بر اساس فهرست مطالب کتاب، فصل با معرفی سه روش پیکربندی EF Core شروع می‌شود  :

- **6.1 Three ways of configuring EF Core** — معرفی کلی سه رویکرد.
- **6.2 A worked example of configuring EF Core** — یک مثال عملی کامل.
- سپس هر رویکرد به‌طور جداگانه با جزئیات کامل بررسی می‌شود (6.3 تا 6.5).

### 6.3 پیکربندی By Convention

نویسنده توضیح می‌دهد که رویکرد By Convention پیش‌فرض است و توسط دو رویکرد دیگر (Data Annotations و Fluent API) قابل بازنویسی (Override) است. این رویکرد بر پایه استانداردهای نام‌گذاری متکی است تا EF Core بتواند به‌طور خودکار Entity Class ها و روابط بین آن‌ها را پیدا و پیکربندی کند  .

**قوانین کلاس‌های Entity:**

- کلاس باید Public باشد.
- کلاس نباید Static باشد، چون EF Core باید بتواند نمونه جدیدی از آن بسازد.
- کلاس باید بدون Constructor یا با Constructor بدون پارامتر باشد (با هر سطح دسترسی، حتی Private)  .

> **نکته EF Core 2.1:** این نسخه امکان Constructor با پارامتر را نیز اضافه می‌کند که برای ویژگی Lazy Loading و تزریق سرویس‌ها به Entity در زمان خوانده‌شدن از دیتابیس کاربرد دارد  .

**قوانین نام، نوع و اندازه ستون‌ها:**

نام Property به‌عنوان نام ستون استفاده می‌شود، و نوع .NET به نوع SQL معادل تبدیل می‌شود  . برای مثال:

```csharp
public string Description { get; set; }
```

این خط به‌طور خودکار به `.

**قانون Nullability بر اساس نوع .NET:**

- اگر نوع `string` باشد، ستون می‌تواند NULL باشد.
- انواع Primitive (مثل `int`) یا Struct (مثل `DateTime`) به‌طور پیش‌فرض Non-null هستند.
- می‌توان با `?` یا `Nullable<T>` این انواع را Nullable کرد  .

**قانون شناسایی کلید اصلی (Primary Key):**

EF Core فقط یک Property به‌عنوان کلید اصلی می‌پذیرد (روش By Convention از کلیدهای ترکیبی/Composite پشتیبانی نمی‌کند) و نام آن باید `Id` یا `<ClassName>Id` باشد (مثلاً `BookId`)  .

```csharp
public int BookId { get; set; }
```

این کد به این SQL تبدیل می‌شود:

```sql

    CONSTANT [PK_Books]
    PRIMARY KEY CLUSTERED,
```

> **توصیه نویسنده (که برای شما به‌عنوان توسعه‌دهنده .NET بسیار کاربردی است):** حتی اگر امکان استفاده از نام کوتاه `Id` وجود دارد، از نام کامل `<ClassName>Id` استفاده کنید. خوانایی کد در Query هایی مثل `Where(p => p.BookId == 1)` به‌مراتب بهتر از `Where(p => p.Id == 1)` است، به‌خصوص وقتی تعداد Entity Class ها زیاد می‌شود  .

### 6.4 پیکربندی از طریق Data Annotations

Data Annotation ها نوعی Attribute مخصوص .NET هستند که هم برای Validation و هم برای تعریف ویژگی‌های دیتابیس استفاده می‌شوند. این Attribute ها از دو Namespace می‌آیند  :

**6.4.1 System.ComponentModel.DataAnnotations** — عمدتاً برای Validation در Frontend (مثل ASP.NET) استفاده می‌شود، اما EF Core از برخی از آن‌ها مثل `:

```csharp
[Required]
]
public string AuthorName { get; set; }
```

که به `.

**6.4.2 System.ComponentModel.DataAnnotations.Schema** — این فضای نام Attribute‌هایی مخصوص پیکربندی دیتابیس دارد، مثل `.

### 6.5 پیکربندی از طریق Fluent API

سومین و جامع‌ترین رویکرد، **Fluent API** است — مجموعه‌ای از متدها که روی کلاس `ModelBuilder` عمل می‌کنند و در متد `OnModelCreating` داخل DbContext برنامه در دسترس‌اند. بسیاری از پیکربندی‌ها فقط از طریق Fluent API قابل انجام هستند  .

**6.5.1 روش بهتر برای ساختاردهی دستورات Fluent API**

نویسنده به یک نکته مهم Clean Code اشاره می‌کند: قرار دادن همه دستورات Fluent API داخل یک متد `OnModelCreating` با رشد پروژه غیرقابل مدیریت می‌شود. راه‌حل، جدا کردن پیکربندی Fluent API هر Entity Class به یک کلاس Configuration مجزا و فراخوانی آن از داخل `OnModelCreating` است، با استفاده از اینترفیس `IEntityTypeConfiguration<T>` که خود EF Core فراهم می‌کند  .

> **تحلیل معماری (این دقیقاً چیزی است که شما به‌عنوان یک توسعه‌دهنده علاقه‌مند به Design Pattern باید بدانید):** این الگو در واقع اعمال **Single Responsibility Principle** روی سطح پیکربندی دیتابیس است. هر Entity، پیکربندی خودش را در یک فایل مستقل دارد، که هم Merge Conflict های تیمی را کاهش می‌دهد و هم خوانایی کد را بهبود می‌بخشد.

---

## بخش 6.6 (ادامه)، 6.7 و 6.8: حذف Property، فیلترهای Query و نوع ستون‌ها

ابتدا نکته تکمیلی مهمی از پایان بخش 6.5 را ببینیم که پیش‌تر رد شده بود، سپس وارد 6.6 تا 6.8 می‌شویم.

### نکته مهم: اولویت بین Data Annotations و Fluent API

نویسنده آزمایشی انجام داده: وقتی هم Data Annotation و هم Fluent API روی یک Property مقدار متفاوتی تنظیم کنند، **مقدار Fluent API غالب می‌شود**  . این یک قانون عملی مهم است که باید در ذهن داشته باشید، چون در پروژه‌های بزرگ که چند نفر روی یک Entity کار می‌کنند، تناقض بین این دو منبع پیکربندی می‌تواند باعث سردرگمی شود.

### 6.6 حذف Property و Class از دیتابیس

گاهی می‌خواهید داده‌ای در Entity Class داشته باشید (مثلاً برای محاسبات موقت در طول عمر Instance)، اما نمی‌خواهید در دیتابیس ذخیره شود. دو روش برای این کار وجود دارد  :

**6.6.1 با Data Annotations — استفاده از `[NotMapped]`:**

```csharp
public class MyEntityClass
{
    public int MyEntityClassId { get; set; }
    public string NormalProp { get; set; }

    [NotMapped]
    public string LocalString { get; set; }

    public ExcludeClass LocalClass { get; set; }
}

[NotMapped]
public class ExcludeClass
{
    public int LocalInt { get; set; }
}
```

می‌توانید `.

**6.6.2 با Fluent API — استفاده از متد `Ignore`:**

```csharp
public class ExcludeDbContext : DbContext
{
    public DbSet<MyEntityClass> MyEntities { get; set; }

    protected override void OnModelCreating
        (ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MyEntityClass>()
            .Ignore(b => b.LocalString);
        modelBuilder.Ignore<ExcludeClass>();
    }
}
```

### 6.7 پیکربندی فیلترهای Query در سطح مدل (Model-Level Query Filters)

این ویژگی معمولاً برای پیاده‌سازی **Soft Delete** استفاده می‌شود — رویکردی که در آن به‌جای حذف واقعی یک رکورد، آن را «پنهان» می‌کنید  .

برای پیاده‌سازی Soft Delete دو کار لازم است:

1. افزودن یک Property بولی به نام `SoftDeleted` به Entity Class.
2. افزودن یک Model-Level Query Filter از طریق Fluent API که یک `Where` اضافه به تمام دسترسی‌های آن جدول اعمال می‌کند  .

```csharp
public class EfCoreContext : DbContext
{
    protected override void
        OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>()
            .HasQueryFilter(p => !p.SoftDeleted);
    }
}
```

> **نکته حیاتی برای عملیات:** اگر بخواهید یک بار Entity هایی را که فیلتر شده‌اند هم بخوانید (مثلاً برای پنل مدیریت)، باید متد `IgnoreQueryFilters()` را به Query اضافه کنید: `context.Books.IgnoreQueryFilters()`   — این یک نکته ریز اما مهم است که می‌تواند در Debug کردن رفتار غیرمنتظره کمک کند.

### 6.8 تعیین نوع، اندازه و Nullability ستون دیتابیس

این بخش عملاً همان تکنیک‌هایی است که در Listing 6.3 دیدیم و اکنون به‌طور خلاصه جمع‌بندی می‌شوند  . نمونه کامل از کلاس `BookConfig`:

```csharp
internal class BookConfig : IEntityTypeConfiguration<Book>
{
    public void Configure
        (EntityTypeBuilder<Book> entity)
    {
        entity.Property(p => p.PublishedOn)
            .HasColumnType("date");
        entity.Property(p => p.Price)
            .HasColumnType("decimal(9,2)");
        entity.Property(x => x.ImageUrl)
            .IsUnicode(false);
        entity.HasIndex(x => x.PublishedOn);

        entity.HasQueryFilter(p => !p.SoftDeleted);
    }
}
```

هر خط یک هدف مشخص دارد  :

- **`HasColumnType("date")`** — نگاشت پیش‌فرض `DateTime` به `datetime2` را به `date` تغییر می‌دهد؛ فقط تاریخ ذخیره می‌شود، نه زمان.
- **`HasColumnType("decimal(9,2)")`** — Precision و Scale پیش‌فرض `(18,2)` را کوچک‌تر می‌کند، که باعث کاهش مصرف فضای ذخیره‌سازی می‌شود.
- **`IsUnicode(false)`** — نگاشت پیش‌فرض `string` به `nvarchar` (یونیکد ۱۶ بیتی) را به `varchar` (ASCII، ۸ بیتی) تغییر می‌دهد.
- **`HasIndex(...)`** — یک Index روی ستون `PublishedOn` می‌سازد، چون این ستون در Sort و Filter استفاده می‌شود.

می‌توانید همچنین این متدها را به‌صورت زنجیره‌ای (Fluent Chaining) استفاده کنید:

```csharp
modelBuilder.Entity<Book>()
    .Property(x => x.ImageUrl)
    .IsUnicode(false)
    .HasColumnName("DifferentName")
    .HasMaxLength(123)
    .IsRequired(false);
```

> **تحلیل Performance (که برای شما به‌عنوان توسعه‌دهنده‌ای که دغدغه بهینه‌سازی دارید مهم است):** انتخاب نوع ستون درست، مستقیماً روی حجم دیسک و سرعت Index تأثیر دارد. مثلاً تغییر `PublishedOn` از `datetime2` (8 بایت) به `date` (3 بایت) باعث می‌شود Index روی این ستون سریع‌تر Scan شود، به‌خصوص در جداول با میلیون‌ها ردیف.

---

## بخش 6.9، 6.10 و 6.11: پیکربندی Primary Key، Index و نام‌گذاری دیتابیس

### 6.8 جمع‌بندی جدول تنظیم نوع، اندازه و Nullability

پیش از ادامه، جدول ۶.۱ کتاب یک مرجع خلاصه و کاربردی برای مقایسه Data Annotations و Fluent API ارائه می‌دهد که ارزش دارد به‌صورت مستقل ببینیم  :

| تنظیم | Data Annotations | Fluent API |
|---|---|---|
| Not Null (پیش‌فرض Nullable) | ` |
| اندازه رشته (پیش‌فرض MAX) | ` |
| نوع varchar (پیش‌فرض nvarchar) | در دسترس نیست | `.IsUnicode(false)`   |
| نوع/اندازه SQL دقیق | ` |

نکته فنی مهم: در EF Core، اگر بخواهید نوع SQL ستون را مشخص کنید، باید **کل تعریف** (نوع + طول/Precision) را بدهید، برخلاف EF6.x که می‌شد نوع و طول را جدا تنظیم کرد  .

### 6.9 روش‌های مختلف پیکربندی Primary Key

پیکربندی صریح Primary Key در دو حالت لازم است  :

- وقتی نام کلید با قانون By Convention مطابقت ندارد.
- وقتی Primary Key از چند Property/ستون تشکیل شده — یعنی **Composite Key**.

مثال کلاسیک برای Composite Key، جدول واسط Many-to-Many مثل `BookAuthor` است  .

**6.9.1 با Data Annotations:**

```csharp
public class BookAuthor
{
    [Key]
    ]
    public int BookId { get; set; }

    [Key]
    ]
    public int AuthorId { get; set; }

    public byte Order { get; set; }

    public Book Book { get; set; }
    public Author Author { get; set; }
}
```

`.

**6.9.2 با Fluent API:**

```csharp
protected override void
    OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Book>()
        .HasKey(x => x.BookId);

    modelBuilder.Entity<BookAuthor>()
        .HasKey(x => new {x.BookId, x.AuthorId});
}
```

نکته: تنظیم Key برای `Book` اصلاً لازم نیست چون By Convention همین رفتار را دارد؛ اما برای Composite Key در `BookAuthor` که By Convention پشتیبانی نمی‌کند، باید از یک **Anonymous Object** در متد `HasKey` استفاده شود، که ترتیب Property ها در آن ترتیب کلید ترکیبی را تعیین می‌کند  .

### 6.10 افزودن Index به ستون‌های دیتابیس

Index یک ساختار دیتابیسی است که جست‌وجو و مرتب‌سازی روی یک یا چند ستون را سریع‌تر می‌کند، و می‌تواند شامل یک Constraint برای یکتا بودن مقادیر هم باشد  . افزودن Index **فقط از طریق Fluent API** ممکن است:

| عملیات | Fluent API |
|---|---|
| افزودن Index ساده | `modelBuilder.Entity<MyClass>().HasIndex(p => p.MyProp);`   |
| Index چند ستونی | `modelBuilder.Entity<Person>().HasIndex(p => new {p.First, p.Surname});`   |
| Index با نام دلخواه | `.HasIndex(p => p.MyProp).HasName("Index_MyProp");`   |
| Index یکتا (Unique) | `.HasIndex(p => p.BookISBN).IsUnique();`   |

> **نکته Performance که مستقیماً به کار شما می‌آید:** طراحی درست Index روی ستون‌هایی که در `WHERE`، `ORDER BY` یا `JOIN` زیاد استفاده می‌شوند، یکی از مؤثرترین راه‌های بهبود Performance در SQL Server است. اما هر Index هزینه‌ای هم دارد — عملیات Insert/Update/Delete را کندتر می‌کند چون باید ساختار Index هم به‌روزرسانی شود. این یک Trade-off کلاسیک بین سرعت Read و سرعت Write است.

### 6.11 پیکربندی نام‌گذاری در سمت دیتابیس

**تعریف Schema:** نحوه سازمان‌دهی داده در دیتابیس — یعنی جدول‌ها، ستون‌ها، Constraint ها — و در برخی دیتابیس‌ها مثل SQL Server، Schema همچنین به‌عنوان یک Namespace برای گروه‌بندی منطقی داده استفاده می‌شود  .

**6.11.1 نام‌گذاری جدول:**

به‌طور پیش‌فرض، نام جدول یا از نام Property نوع `DbSet<T>` در DbContext می‌آید، یا اگر چنین Property‌ای تعریف نشده باشد، از نام خود Class استفاده می‌شود  .

| روش | مثال (تنظیم نام جدول Book به "XXX") |
|---|---|
| Data Annotations | ` |
| Fluent API | `modelBuilder.Entity<Book>().ToTable("XXX");`   |

**6.11.2 نام‌گذاری Schema:**

به‌طور پیش‌فرض، نام Schema توسط Database Provider تعیین می‌شود (چون برخی دیتابیس‌ها مثل SQLite و MySQL از Schema پشتیبانی نمی‌کنند)  . در SQL Server، نام پیش‌فرض `dbo` است و فقط از طریق Fluent API قابل تغییر است:

```csharp
modelBuilder.HasDefaultSchema("NewSchemaName");
```

برای تنظیم Schema روی یک جدول خاص  :

| روش | مثال |
|---|---|
| Data Annotations | ` |
| Fluent API | `.ToTable("SpecialOrder", schema: "sales");`   |

**6.11.3 نام‌گذاری ستون‌ها:**

| روش | مثال (تغییر نام ستون BookId به SpecialCol) |
|---|---|
| Data Annotations | ` |
| Fluent API | `.Property(b => b.BookId).HasColumnName("SpecialCol");`   |



## 6.12: دستورات Fluent API مخصوص هر Database Provider

نکته جالب اینجاست: بعضی وقت‌ها می‌خواهید رفتار پیکربندی بسته به نوع دیتابیس (SQL Server، SQLite و غیره) متفاوت باشد. هر Database Provider یک متد Extension به‌شکل `Is<DatabaseName>` دارد که در صورت تطابق نوع دیتابیس، `true` برمی‌گرداند  :

```csharp
protected override void OnModelCreating
    (ModelBuilder modelBuilder)
{
    modelBuilder.Entity<MyEntityClass>()
        .Property(p => p.NormalProp)
        .HasColumnName(
            Database.IsSqlite()
                ? "SqliteDatabaseCol"
                : "GenericDatabaseCol");
}
```

نویسنده مثال دیگری هم می‌زند: چون SQLite از Computed Column پشتیبانی نمی‌کند (موضوع فصل 8)، می‌توانید با یک شرط ساده `if (!Database.IsSqlite())` آن پیکربندی را برای SQLite غیرفعال کنید   بسیار کاربردی است.

---

## بخش 6.13، 6.14 و 6.15: توصیه‌های نویسنده، Shadow Properties و Backing Fields

### 6.13 توصیه‌های نویسنده برای انتخاب روش پیکربندی

با سه روش پیکربندی که تا اینجا دیدید (By Convention، Data Annotations، Fluent API)، ممکن است گیج شوید کدام را کجا استفاده کنید. نویسنده سه قاعده عملی ارائه می‌دهد  :

1. **By Convention را در اولویت اول قرار دهید** — سریع و ساده است  .
2. **از Validation Attribute های Data Annotations استفاده کنید** (مثل `MaxLength` و `Required`)  .
3. **برای بقیه موارد از Fluent API استفاده کنید** — چون جامع‌ترین مجموعه دستورات را دارد  .

نویسنده دلایل مشخصی برای ترجیح Data Annotations در سناریوهای Validation دارد  :

- **استفاده در Frontend Validation** — چون ASP.NET Core از همین Attribute ها برای اعتبارسنجی ورودی استفاده می‌کند.
- **قابل استفاده در `SaveChanges`** — همان‌طور که در فصل 4 دیدیم، می‌توانید این Validation ها را در فرآیند ذخیره‌سازی هم اجرا کنید تا منطق Business Logic ساده‌تر بماند  .
- **Data Annotation ها مثل کامنت خوب عمل می‌کنند** — چون Attribute ها ثابت‌های زمان کامپایل (Compile-time Constants) هستند و خواندنشان راحت است  .

برای Fluent API، نویسنده معمولاً از آن برای تنظیم نگاشت ستون دیتابیس استفاده می‌کند (نام ستون، نوع داده و غیره) وقتی که با مقادیر قراردادی متفاوت باشد؛ ترجیح او این است که این جزئیات را داخل `OnModelCreating` پنهان کند، چون این‌ها مسائل مربوط به پیاده‌سازی دیتابیس هستند، نه ساختار نرم‌افزار  .

### 6.14 Shadow Properties — پنهان‌سازی داده در EF Core

> **EF6 در مقابل EF Core:** در EF6.x مفهوم Shadow Property فقط داخلی بود و صرفاً برای مدیریت Foreign Key های گم‌شده استفاده می‌شد. در EF Core، Shadow Property به یک ویژگی رسمی و قابل استفاده مستقیم تبدیل شده است  .

Shadow Property راهی است برای دسترسی به ستون‌های دیتابیس **بدون این‌که** به‌شکل Property در Entity Class ظاهر شوند  . نویسنده دو کاربرد اصلی معرفی می‌کند:

- **ردیابی تغییرات (Audit)** — مثلاً چه کسی و کِی داده را تغییر داده، بدون این‌که این اطلاعات جزء استفاده معمول کلاس باشد  .
- **مدیریت Foreign Key در روابطی که Property آن‌ها را تعریف نکرده‌اید** — که موضوع فصل بعدی است  .

**6.14.1 پیکربندی Shadow Property:**

```csharp
public class Chapter06DbContext : DbContext
{
    protected override void
        OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MyEntityClass>()
            .Property<DateTime>("UpdatedOn");
    }
}
```

> **⚠️ هشدار مهم:** اگر Property‌ای با همان نام از قبل در Entity Class وجود داشته باشد، پیکربندی به‌جای ساخت Shadow Property، از همان Property موجود استفاده می‌کند  .

**6.14.2 دسترسی به Shadow Property:**

چون Shadow Property به هیچ Property واقعی در کلاس نگاشت نمی‌شود، باید مستقیماً از طریق دستورات EF Core به آن دسترسی پیدا کنید:

```csharp
var entity = new MyEntityClass
    { InDatabaseProp = "Hello"};
context.Add(entity);
context.Entry(entity)
    .Property("UpdatedOn").CurrentValue
        = DateTime.Now;
context.SaveChanges();
```

نکته حیاتی: برای خواندن یک Shadow Property از یک Entity بارگذاری‌شده، باید آن Entity به‌صورت **Tracked** خوانده شده باشد (یعنی بدون `AsNoTracking`)، چون این متد از داده‌های ردیابی‌شده داخلی EF Core استفاده می‌کند، نه از خود نمونه کلاس  .

در LINQ Query ها هم می‌توانید با متد `EF.Property` به آن دسترسی داشته باشید:

```csharp
context.MyEntities
    .OrderBy(b => EF.Property<DateTime>(b, "UpdatedOn"))
    .ToList();
```

### 6.15 Backing Fields — کنترل دسترسی به داده در Entity Class

> **EF6 در مقابل EF Core:** Backing Field یک ویژگی کاملاً جدید در EF Core است که کنترل بیشتری روی نحوه خواندن/نوشتن داده دیتابیس فراهم می‌کند — چیزی که کاربران EF6.x مدت‌ها به دنبالش بودند  .

ایده اصلی: به‌جای نگاشت مستقیم ستون به یک Property با `get/set` عمومی، می‌توانید آن را به یک **Private Field** نگاشت کنید. نویسنده چهار کاربرد اصلی معرفی می‌کند  :

1. استفاده ساده برای نمایش نحوه کارکرد پایه Backing Field.
2. ایجاد یک ستون فقط‌خواندنی (Read-Only).
3. پنهان‌سازی داده حساس از سایر لایه‌های نرم‌افزار.
4. تبدیل داده هنگام خواندن یا نوشتن.

**6.15.1 ساخت ساده‌ترین حالت Backing Field:**

```csharp
public class MyClass
{
    private string _myProperty;
    public string MyProperty
    {
        get { return _myProperty; }
        set { _myProperty = value; }
    }
}
```

**ایجاد یک ستون فقط‌خواندنی:**

```csharp
public class MyClass
{
    private string _readOnlyCol;
    public string ReadOnlyCol => _readOnlyCol;
}
```

**پنهان‌سازی داده حساس (مثال کاربردی و مهم — Listing 6.12):**

فرض کنید تاریخ تولد یک فرد باید قابل تنظیم باشد، اما فقط سن او از بیرون قابل خواندن باشد  :

```csharp
public class Person
{
    private DateTime _dateOfBirth;

    public void SetDateOfBirth(DateTime dateOfBirth)
    {
        _dateOfBirth = dateOfBirth;
    }

    public int AgeYears =>
        Years(_dateOfBirth, DateTime.Today);

    private static int Years(DateTime start, DateTime end)
    {
        return (end.Year - start.Year - 1) +
               (((end.Month > start.Month) ||
                 ((end.Month == start.Month)
                  && (end.Day >= start.Day)))
                   ? 1 : 0);
    }
}
```

> **تحلیل از منظر Encapsulation (اصول OOP):** این مثال یکی از بهترین نمونه‌های عملی **کپسوله‌سازی واقعی** است. تاریخ تولد به‌طور کامل از لایه‌های بالایی نرم‌افزار پنهان می‌ماند و فقط منطق محاسبه‌شده (سن) در دسترس است. این نکته دقیقاً همان چیزی است که در طراحی API های عمومی یا DTO ها باید رعایت کنید: کاربر بیرونی نباید بتواند مستقیماً State داخلی حساس را دستکاری کند.

**تبدیل داده هنگام خواندن (مثال DateTimeKind):**

یک مشکل رایج EF Core این است که هنگام ذخیره `DateTime` در دیتابیس، ویژگی `Kind` (که مشخص می‌کند زمان Local است یا UTC) از بین می‌رود. کتابخانه‌هایی مثل Newtonsoft.Json از این ویژگی در محاسبات خود استفاده می‌کنند  :

```csharp
public class Person
{
    private DateTime _updatedOn;
    public DateTime UpdatedOn
    {
        get
        {
            return DateTime.SpecifyKind(
                _updatedOn, DateTimeKind.Utc);
        }
        set { _updatedOn = value; }
    }
}
```

> **⚠️ هشدار عملیاتی از نویسنده:** آزمایش Unit Test نشان می‌دهد که اگر `UpdatedOn` را در یک LINQ Query استفاده کنید، EF Core از ستون **اصلی** استفاده می‌کند، نه نسخه Transform شده. این در این مثال خاص مفید است (چون Performance را تحت تأثیر قرار نمی‌دهد)، اما در موارد دیگر ممکن است نتیجه‌ای که انتظار دارید ندهد. این نوع استفاده از Backing Field باید با احتیاط انجام شود  .

**6.15.2 پیکربندی Backing Field:**

پیکربندی از طریق **By Convention** یا **Fluent API** ممکن است، اما **نه از طریق Data Annotations**  :

- `_<PropertyName>` (مثل `_MyProperty`)
- `_<camelCasePropertyName>` (مثل `_myProperty`)
- `m_<PropertyName>`
- `m_<camelCasePropertyName>`

اما چون در عمل کمتر پیش می‌آید Field شما دقیقاً با این قوانین مطابقت داشته باشد، معمولاً باید از **Fluent API** استفاده کنید  :

```csharp
protected override void OnModelCreating
    (ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Person>()
        .Property(b => b.UpdatedOn)
        .HasField("_differentName");
}
```

برای ساخت یک **Notional Property** (وقتی Field به هیچ Property‌ای وصل نیست، اما می‌خواهید نامی خوانا برای Query داشته باشید)  :

```csharp
protected override void
    OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Person>()
        .Property<DateTime>("DateOfBirth")
        .HasField("_dateOfBirth");
}
```

و برای کنترل کامل این‌که EF Core همیشه فقط از Field استفاده کند (نه Property)  :

```csharp
modelBuilder.Entity<Person>()
    .Property(b => b.UpdatedOn)
    .HasField("_updatedOn")
    .UsePropertyAccessMode(PropertyAccessMode.Field);
```

گزینه‌های دیگر `UsePropertyAccessMode` شامل `PropertyAccessMode.Property` (همیشه از Property عبور کند، وگرنه Exception پرتاب شود) و `PropertyAccessMode.FieldDuringConstruction` (رفتار پیش‌فرض) است  .

---

## فصل 7: پیکربندی روابط (Configuring Relationships)

بر اساس ساختار فهرست کتاب که پیش‌تر دیدیم، فصل 7 با تعریف اصطلاحات کلیدی روابط آغاز می‌شود که در فصل 3 هم به‌طور مختصر با آن‌ها آشنا شدیم  .

### 7.1 تعریف اصطلاحات روابط: Principal و Dependent

مهم‌ترین دو اصطلاحی که نویسنده در سراسر کتاب استفاده می‌کند **Principal Entity** و **Dependent Entity** هستند. این اصطلاحات مشخص می‌کنند «چه کسی مسئول است»  :

- **Principal Entity** — طرف اصلی رابطه که سایر Entity ها به آن وابسته‌اند. در برنامه کتاب‌فروشی، `Book` نقش Principal را دارد.
- **Dependent Entity** — طرفی که از طریق Foreign Key به Principal وابسته است. `PriceOffer`، `Review` و `BookAuthor` همگی Dependent روی `Book` هستند  .

> **نکته مهم:** یک Entity Class می‌تواند هم‌زمان هم Principal و هم Dependent باشد. مثلاً در یک رابطه سلسله‌مراتبی مثل «کتابخانه دارای کتاب‌ها، و کتاب‌ها دارای نقدها»، خود `Book` نسبت به `Library` وابسته (Dependent) است، اما نسبت به `Review` نقش Principal را دارد  .

**سؤال کلیدی: آیا Dependent می‌تواند بدون Principal وجود داشته باشد؟**

این موضوع کاملاً به **Nullability فیلد Foreign Key** بستگی دارد  :

- اگر Foreign Key از نوع **غیر Nullable** باشد (مثل `int`)، رابطه Dependent بدون Principal معنا ندارد و در صورت حذف Principal، رکورد Dependent هم حذف می‌شود. مثال: یک نقد کتاب (`Review`) بدون کتاب معنایی ندارد  .
- اگر Foreign Key از نوع **Nullable** باشد (مثل `Nullable<int>` یا `int?`)، رابطه Dependent می‌تواند مستقل از Principal باقی بماند. مثال کاربردی نویسنده: فرض کنید کلاسی به نام `BookLog` برای ثبت لاگ تغییرات کتاب دارید. اگر کتاب حذف شود، منطقی نیست که تاریخچه لاگ‌ها هم پاک شود؛ در این حالت `BookId` را از نوع `Nullable<int>` تعریف می‌کنید تا در صورت حذف کتاب، فقط مقدار Foreign Key به `null` تنظیم شود  .

> **جزئیات فنی مهم:** رفتار پیش‌فرض EF Core برای این حالت، تنظیم `OnDelete` روی مقدار **ClientSetNull** برای روابط اختیاری (Optional) است — یعنی وقتی Principal حذف می‌شود، Foreign Key در سمت Dependent به‌طور خودکار `null` می‌شود. این رفتار با جزئیات بیشتر در بخش 7.4.4 پوشش داده خواهد شد  .

### چرا این مفاهیم اهمیت دارند؟

نویسنده تأکید می‌کند که هنگام به‌روزرسانی روابط (مثلاً جایگزین‌کردن یک مجموعه از رکوردهای Dependent با مجموعه‌ای جدید)، سرنوشت رکوردهای قدیمی حذف‌شده کاملاً به Nullability آن‌ها بستگی دارد: اگر Foreign Key غیر-Nullable باشد، رکوردهای Dependent قدیمی حذف می‌شوند؛ اگر Nullable باشد، فقط مقدار Foreign Key آن‌ها `null` می‌شود  . این رفتار در بخش 3.5 هم با جزئیات بیشتر بحث شده بود.

> **تحلیل معماری:** این تصمیم — یعنی Nullable بودن یا نبودن Foreign Key — در واقع یک تصمیم **Domain Modeling** است، نه صرفاً یک انتخاب فنی دیتابیس. باید از خودتان بپرسید: «آیا این داده وابسته، از نظر کسب‌وکار، بدون والدش معنا دارد؟» پاسخ به این سؤال باید نوع Foreign Key را تعیین کند، نه برعکس.

---

## بخش 7.2: چه Navigational Property هایی نیاز دارید؟

پس از تعریف اصطلاحات Principal و Dependent، نویسنده به این سؤال کلیدی می‌پردازد که در طراحی یک Entity Class، اساساً چه **Navigational Property** هایی باید تعریف شوند تا EF Core بتواند نوع رابطه را به‌درستی تشخیص دهد  .

### تعریف Navigational Property

Navigational Property، یک Property در کلاس Entity است که به‌جای نگهداری یک مقدار Scalar (مثل `int` یا `string`)، به یک Entity دیگر یا مجموعه‌ای از Entity ها اشاره می‌کند. نوع .NET که برای این Property انتخاب می‌کنید، مستقیماً به EF Core می‌گوید که این رابطه از چه جنسی است  . کلاس `Book` در برنامه کتاب‌فروشی مثال کاملی از این موضوع است:

```csharp
public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime PublishedOn { get; set; }
    public string Publisher { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    //-----------------------------------------------
    //relationships
    public PriceOffer Promotion { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<BookAuthor> AuthorsLink { get; set; }
}
```

### تحلیل هر Navigational Property

هر یک از سه Property مربوط به رابطه در کلاس بالا، الگوی متفاوتی از رابطه را نشان می‌دهد  :

- **`Promotion` (نوع `PriceOffer`)** — چون این Property به یک شیء منفرد (نه یک مجموعه) اشاره دارد، EF Core آن را به‌عنوان رابطه **one-to-one (یا دقیق‌تر، one-to-zero-or-one)** تفسیر می‌کند. یعنی هر کتاب حداکثر یک تخفیف فعال دارد.
- **`Reviews` (نوع `ICollection<Review>`)** — استفاده از یک Collection Type به EF Core می‌گوید که این یک رابطه **one-to-many** است: یک کتاب می‌تواند صفر تا چند نقد داشته باشد.
- **`AuthorsLink` (نوع `ICollection<BookAuthor>`)** — این Property به جدول واسط (Linking Table) اشاره دارد و پایه رابطه **many-to-many** بین `Book` و `Author` را تشکیل می‌دهد.

> **نکته معماری مهم:** توجه کنید که نویسنده در اینجا مستقیماً به `Author` اشاره نکرده، بلکه از طریق `BookAuthor` (که خودش یک Entity Class کامل با Property های `BookId`، `AuthorId`، و `Order` است) این ارتباط را برقرار کرده است. این الگو دقیقاً همان چیزی است که در فصل 2 دیدیم: در EF Core بر خلاف EF6.x، برای رابطه Many-to-Many باید خودتان کلاس Linking Table را به‌صراحت تعریف کنید  .

### چرا این تصمیم اهمیت دارد؟

انتخاب نوع Navigational Property مستقیماً بر ساختار دیتابیس تولیدی اثر می‌گذارد. اگر به اشتباه به‌جای `ICollection<Review>` از یک Property تکی به نام `Review` استفاده می‌کردید، EF Core تصور می‌کرد رابطه شما one-to-one است، در حالی که منطق کسب‌وکار شما نیاز به چندین نقد برای هر کتاب دارد. به همین دلیل، طراحی صحیح Navigational Property ها اولین و مهم‌ترین قدم در پیکربندی روابط By Convention محسوب می‌شود، موضوعی که در بخش 7.4 با جزئیات بیشتری پوشش داده خواهد شد  .

---

## بخش 7.3 و 7.4: پیکربندی روابط و قرارداد نام‌گذاری Foreign Key

نویسنده در بخش 7.3 یادآوری می‌کند که دقیقاً همان **سه رویکرد پیکربندی** که در فصل 6 برای Property های غیر رابطه‌ای معرفی شد، برای روابط (Relationships) هم به‌کار می‌روند  :

- **By Convention** — تکیه بر قواعد نام‌گذاری پیش‌فرض EF Core (مثل آنچه در بخش 7.2 با `ICollection<Review>` دیدیم).
- **Data Annotations** — استفاده از Attribute هایی مانند `[ForeignKey]` و `[InverseProperty]`.
- **Fluent API** — قدرتمندترین و کامل‌ترین روش، از طریق متدهایی مثل `HasOne`، `WithMany` در متد `OnModelCreating`.

> **توصیه معماری نویسنده (که در بخش 6.13 هم تکرار شده):** همیشه با روش By Convention شروع کنید چون سریع و کم‌هزینه است؛ از Data Annotations برای اعتبارسنجی استفاده کنید؛ و برای هر چیز دیگری سراغ Fluent API بروید  .

### 7.4.1 و 7.4.2: چگونه EF Core به‌طور خودکار Foreign Key را پیدا می‌کند؟

قلب پیکربندی By Convention، **قرارداد نام‌گذاری Foreign Key** است. EF Core به دنبال Propertyـی در کلاس Dependent می‌گردد که نامش با یکی از این دو الگو مطابقت داشته باشد  :

1. `<نام کلاس Principal>Id` — مثلاً `AuthorId` در کلاس `Book`.
2. یا نام Primary Key کلاس Principal، اگر از الگوی `<ClassName>Id` پیروی نکند.

مثال کلاسیک از همان ابتدای کتاب (فصل 1) این قرارداد را به‌خوبی نشان می‌دهد:

```csharp
public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; }
    // ...
    public int AuthorId { get; set; }   // Foreign Key به‌صورت خودکار شناسایی می‌شود
    public Author Author { get; set; }  // Navigational Property
}

public class Author
{
    public int AuthorId { get; set; }   // Primary Key
    public string Name { get; set; }
    public string WebUrl { get; set; }
}
```

در این مثال، چون نام `AuthorId` در کلاس `Book` دقیقاً با نام Primary Key کلاس `Author` یکسان است، EF Core بدون نیاز به هیچ پیکربندی اضافه، رابطه one-to-many بین `Author` و `Book` را تشخیص می‌دهد  .

### مثال دوم: رابطه One-to-One با PriceOffer

همین قرارداد در رابطه one-to-one بین `Book` و `PriceOffer` هم دیده می‌شود:

```csharp
public class PriceOffer
{
    public int PriceOfferId { get; set; }
    public decimal NewPrice { get; set; }
    public string PromotionalText { get; set; }
    //-----------------------------------------------
    public int BookId { get; set; }   // Foreign Key به سمت Book
}
```

> **نکته ظریف طراحی:** توجه کنید که کلاس `PriceOffer` هیچ Navigational Property به‌سمت `Book` ندارد (یعنی رابطه Unidirectional است). نویسنده تصریح می‌کند این تصمیم عمدی است، چون از نظر منطق کسب‌وکار، هیچ نیازی نیست از یک `PriceOffer` مستقیماً به `Book` مربوطه‌اش دسترسی پیدا کنید؛ این دقیقاً همان اصل بخش 7.2 است: **فقط Navigational Property هایی را اضافه کنید که واقعاً به آن‌ها نیاز دارید**، نه اینکه صرفاً برای «تقارن» کد، رابطه را در هر دو جهت تعریف کنید  .

### چرا این قرارداد اهمیت دارد؟

اگر نام Property با این الگو مطابقت نداشته باشد (مثلاً به‌جای `AuthorId` از `WriterId` استفاده کنید)، EF Core دیگر نمی‌تواند به‌طور خودکار Foreign Key را تشخیص دهد و یا رابطه اصلاً شکل نمی‌گیرد، یا EF Core مجبور می‌شود یک **Shadow Property** پنهان بسازد (موضوعی که در بخش 6.14 دیدیم و در ادامهٔ همین فصل، تحت عنوان «وقتی By Convention کار نمی‌کند»، با جزئیات بیشتری پوشش داده خواهد شد)  .

---

### بخش ۷.۵: پیکربندی از طریق Fluent API

**جامع‌ترین روش برای پیکربندی نگاشت‌ها (Mappings) در Entity Framework Core، استفاده از Fluent API است**. این روش با زنجیره‌سازی متدهای توسعه‌دهنده (Extension Methods) روی کلاس `ModelBuilder` کار می‌کند که در متد مجازی `OnModelCreating` درون کلاس `DbContext` شما در دسترس است. برخی پیکربندی‌های پیشرفته دیتابیس **صرفاً و منحصراً از طریق Fluent API در دسترس هستند** و امکان پیاده‌سازی آن‌ها با استفاده از کنوانسیون‌ها (Conventions) یا ویژگی‌ها (Data Annotations) وجود ندارد.

#### چالش متد OnModelCreating متورم
به صورت پیش‌فرض، تمام دستورات پیکربندی Fluent API درون متد `OnModelCreating` قرار می‌گیرند. با بزرگ‌تر شدن برنامه و افزایش تعداد کلاس‌های موجودیت (Entity Classes)، قرار دادن کل پیکربندی‌ها در این متد منفرد منجر به شلوغی شدید کد شده و فرآیند نگهداری و یافتن نگاشت‌های خاص را دشوار می‌سازد.

#### تفکیک پیکربندی با الگوی کلاس‌های مجزا
برای حل مشکل شلوغی کد، الگو این است که دستورات پیکربندی مربوط به هر موجودیت را به کلاس جداگانه‌ای منتقل کنید. EF Core برای ساده‌سازی این کار اینترفیس **`IEntityTypeConfiguration<T>`** را ارائه داده است. 

> در فریم‌ورک EF6.x، توسعه‌دهندگان کلاس `EntityTypeConfiguration<T>` را برای تفکیک پیکربندی‌ها ارث‌بری می‌کردند. در EF Core، این رفتار با پیاده‌سازی اینترفیس سبک‌تر و کارآمدتر `IEntityTypeConfiguration<T>` بازنویسی شده است.

#### پیاده‌سازی کلاس پیکربندی نمونه (`BookConfig`)
برای نمونه، کلاس پیکربندی زیر اینترفیس `IEntityTypeConfiguration<Book>` را پیاده‌سازی کرده و پیکربندی‌های خاص موجودیت `Book` را درون متد `Configure` کپسوله‌سازی می‌کند:

```csharp
internal class BookConfig : IEntityTypeConfiguration<Book> 
{     
    public void Configure(EntityTypeBuilder<Book> entity)     
    {         
        // تغییر نگاشت پیش‌فرض DateTime به نوع دقیق date در SQL Server
        entity.Property(p => p.PublishedOn)               
              .HasColumnType("date");
              
        // تعیین دقیق ابعاد و مقیاس ستون Price در دیتابیس برای بهینه‌سازی فضا
        entity.Property(p => p.Price)
              .HasPrecision(9, 2); 
    } 
}
```

#### روش‌های رجیستر کردن کلاس‌های پیکربندی در DbContext
پس از ساخت کلاس‌های مجزای پیکربندی، باید آن‌ها را در DbContext خود ثبت کنید تا در فاز مدل‌سازی اولیه (Modeling Stage) توسط موتور EF Core خوانده شوند. برای ثبت این کلاس‌ها دو روش وجود دارد:

۱. **ثبت دستی (انفرادی):**
با فراخوانی مستقیم متد `ApplyConfiguration` به صورت تک‌به‌تک در کلاس DbContext:
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfiguration(new BookConfig());
    // ثبت دستی سایر پیکربندی‌ها...
}
```

۲. **ثبت خودکار (اسمبلی‌محور):**
متد زمان‌بر و ملال‌آور ثبت دستی را می‌توان با متد هوشمند **`ApplyConfigurationsFromAssembly`** جایگزین کرد. این متد اسمبلی در حال اجرا را جستجو کرده و تمام کلاس‌هایی که اینترفیس `IEntityTypeConfiguration<T>` را پیاده‌سازی کرده‌اند، به طور خودکار شناسایی و رجیستر می‌کند:
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
}
```

---

### بخش ۷.۶: مستثنی کردن کلاس‌ها و پروپرتی‌ها از بانک اطلاعاتی

در طراحی شی‌گرا، بسیار رایج است که کلاس‌های موجودیت (Entity Classes) شامل داده‌ها یا رفتارهایی باشند که صرفاً برای محاسبات درون‌برنامه‌ای (In-Memory) کاربرد دارند و نیازی به ذخیره‌سازی آن‌ها در بانک اطلاعاتی نیست. برای مثال، ممکن است بخواهید یک ویژگی محاسباتی موقت را در طول عمر یک نمونه (Instance) نگهداری کنید، اما تمایلی به ایجاد ستون متناظر برای آن در جدول دیتابیس نداشته باشید.

برای جلوگیری از نگاشت خودکار این موارد توسط کنوانسیون‌های پیش‌فرض EF Core، دو استراتژی مجزا وجود دارد: **Data Annotations** و **Fluent API**.

---

#### ۷.۶.۱ مستثنی‌سازی از طریق ویژگی‌ها (Data Annotations)

ساده‌ترین روش برای ممانعت از نگاشت یک کلاس یا پروپرتی، استفاده از اتریبیوت **`[NotMapped]`** از فضای نام `System.ComponentModel.DataAnnotations.Schema` است. اعمال این ویژگی به موتور مدل‌سازی EF Core اعلام می‌کند که باید از فرآیند نگاشت ستون یا جدول چشم‌پوشی کند.

##### نمونه پیاده‌سازی مستثنی‌سازی با ویژگی‌ها (`Listing 7.4`)

```csharp
using System.ComponentModel.DataAnnotations.Schema;

// این کلاس به طور کامل از مدل دیتابیس حذف شده و هیچ جدولی برای آن ساخته نمی‌شود
[NotMapped]
public class ExcludedClass 
{
    public string SomeData { get; set; }
}

public class Book
{
    public int BookId { get; set; } // طبق کنوانسیون کلید اصلی می‌شود
    public string Title { get; set; }
    
    // یک پروپرتی معمولی که به ستون دیتابیس نگاشت می‌شود
    public string IncludedProperty { get; set; }

    // این پروپرتی در حافظه در دسترس است اما به ستون دیتابیس نگاشت نمی‌شود
    [NotMapped]
    public string ExcludedProperty { get; set; }
}
```

---

#### ۷.۶.۲ مستثنی‌سازی از طریق Fluent API

در سناریوهای پیشرفته‌تر یا زمانی که تمایل دارید کلاس‌های دامنه (Domain Classes) خود را به ویژگی‌های وابسته به زیرساخت (مانند اتریبیوت‌های دیتابیس) آلوده نکنید (رعایت اصول معماری پاک و DDD)، استفاده از Fluent API انتخاب بهینه است. در این روش، از متد **`Ignore`** روی `ModelBuilder` در متد `OnModelCreating` استفاده می‌شود.

##### نمونه پیاده‌سازی مستثنی‌سازی با Fluent API (`Listing 7.5`)

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // مستثنی کردن یک پروپرتی خاص از موجودیت MyEntityClass
    modelBuilder.Entity<MyEntityClass>()
                .Ignore(b => b.LocalString);

    // مستثنی کردن کل یک کلاس از مدل بانک اطلاعاتی
    modelBuilder.Ignore<ExcludedClass>();
}
```

---

#### نکات کلیدی و اولویت‌های اجرایی در معماری نرم‌افزار

۱. **رفتار پیش‌فرض با پروپرتی‌های فقط‌خواندنی (Read-Only Properties):**
بر اساس کنوانسیون‌های پیش‌فرض EF Core، پروپرتی‌هایی که صرفاً دارای Getter هستند و هیچ Setter (حتی private) ندارند (مانند `public string FullName => $"{FirstName} {LastName}";`) به طور خودکار از نگاشت دیتابیس مستثنی می‌شوند و نیازی به قرار دادن دستی `[NotMapped]` یا متد `Ignore` روی آن‌ها نیست. با این حال، اگر بخواهید این پروپرتی‌ها را به دیتابیس نگاشت کنید، باید صریحاً از Fluent API استفاده نمایید.

۲. **قانون تقدم بالادستی (Precedence Rule):**
در صورت وجود تداخل پیکربندی بین Data Annotations و Fluent API، **همواره Fluent API داور نهایی است و تنظیمات آن بر Data Annotations اولویت دارد**. برای مثال، اگر پروپرتی با ویژگی `[NotMapped]` علامت‌گذاری شده باشد اما در Fluent API صریحاً برای آن ستون تعریف کنید، پیکربندی Fluent API اعمال خواهد شد.

---

### بخش ۷.۷: تنظیم نوع، اندازه و قابلیت نول‌پذیری ستون‌های دیتابیس

به طور پیش‌فرض، پیکربندی‌های مبتنی بر کنوانسیون (Conventions) در Entity Framework Core مقادیر، نوع داده، اندازه/دقت (Precision) و قابلیت نول‌پذیری (Nullability) را بر اساس نوع داده متناظر در .NET تعیین می‌کنند ``. با این حال، به دلایلی نظیر **بهینه‌سازی عملکرد (Performance)**، انطباق با یک دیتابیس موجود یا الزامات منطق کسب‌وکار، نیاز داریم این تنظیمات را به صورت دستی بازنویسی کنیم ``.

#### جدول مقایسه‌ای تنظیمات ستون (Table 7.1)
در جدول زیر روش‌های اعمال این تنظیمات با استفاده از ویژگی‌ها (Data Annotations) و Fluent API خلاصه شده است ``:

| هدف پیکربندی | ویژگی‌ها (Data Annotations) | متدهای Fluent API | توضیح عملکرد |
| :--- | :--- | :--- | :--- |
| **غیرقابل نول کردن ستون** | `[Required]` | `.IsRequired()` | ستون را در دیتابیس `NOT NULL` می‌کند (پیش‌فرض برای رشته‌ها nullable است) ``. |
| **تعیین حداکثر طول رشته** | `[MaxLength(nnn)]` | `.HasMaxLength(nnn)` | طول ستون متنی را محدود می‌کند (پیش‌فرض طول رشته‌ها `MAX` است) ``. |
| **تعیین نوع داده در SQL** | `[Column(TypeName = "type")]` | `.HasColumnType("type")` | نوع دقیق ستون در دیتابیس (مانند `date` یا `varchar`) را تحمیل می‌کند ``. |

---

#### متدهای اختصاصی Fluent API در EF Core 5
برای مدیریت دقیق‌تر ستون‌های خاص، متدهای زنجیره‌ای پیشرفته‌ای در اختیار ما قرار دارد که برخی از آن‌ها در نسخه EF Core 5 معرفی شده‌اند ``:

۱. **`IsUnicode(false)`** ``:
نوع داده ستون متنی را از `nvarchar` (کدگذاری ۲ بایتی یونیکد) به `varchar` (کدگذاری تک بایتی ASCII) تغییر می‌دهد ``.
*   **مزیت عملکردی:** اگر ستونی مانند `ImageUrl` فقط حاوی کاراکترهای اسکی (ASCII) است، استفاده از این متد حجم ذخیره‌سازی را در دیتابیس **نصف می‌کند** (کاهش از ۱۰۲۴ بایت به ۵۱۲ بایت برای حداکثر طول ۵۱۲) ``. استفاده از این متد توصیه می‌شود زیرا امکان مدیریت مجزای طول رشته را نیز فراهم می‌کند ``.

۲. **`HasPrecision(precision, scale)`** ``:
این متد (که در EF Core 5 اضافه شده) به شما اجازه می‌دهد تعداد کل ارقام ستون‌های اعشاری (precision) و تعداد ارقام بعد از ممیز (scale) را دقیقاً مشخص کنید ``. به طور پیش‌فرض، نوع اعشاری دیتابیس به صورت `decimal(18,2)` تنظیم می‌شود ``.
```csharp
// بهینه‌سازی ستون قیمت برای فضا و سرعت بیشتر با محدود کردن به حداکثر ۹,۹۹۹,۹۹۹.۹۹
entity.Property(e => e.Price)
      .HasPrecision(9, 2);
```

۳. **`HasCollation("collation_name")`** ``:
این ویژگی جدید در EF Core 5 به شما اجازه می‌دهد تا قوانین مرتب‌سازی (Sorting) و حساسیت به حروف بزرگ و کوچک (Case Sensitivity) یا علائم نگارشی را برای یک ستون متنی خاص به صورت محلی در سطح پروپرتی تعریف کنید ``.

---

#### تفاوت‌های حیاتی با EF6.x که توسعه‌دهنده ارشد باید بداند
رویکرد EF Core در تنظیم نوع داده با EF6 تفاوت مهمی دارد ``:
*   در **EF Core**، اگر از اتریبیوت `Column` برای تعیین نوع استفاده کنید، باید تعریف کاملی از نوع داده و طول آن ارائه دهید؛ مانند `[Column(TypeName = "varchar(256)")]` ``.
*   در **EF6** می‌توانستید صرفاً بنویسید `[Column(TypeName = "varchar")]` و طول آن را با اتریبیوت مجزای `[MaxLength(256)]` مشخص کنید. **این تکنیک ترکیبی در EF Core کار نمی‌کند** و در صورت نیاز به تعیین طول به این شکل، خطای مدل‌سازی رخ خواهد داد ``.

---

### بخش ۷.۸: تبدیل مقادیر (Value Conversions)

در طراحی مدل‌های دامنه شی‌گرا، بسیار پیش می‌آید که نوع داده‌های ایده‌آل در زبان برنامه‌نویسی با نوع داده‌های پشتیبانی‌شده در بانک اطلاعاتی رابطه یک‌به‌یک نداشته باشند. ویژگی **Value Conversions** در Entity Framework Core به عنوان یک پیاده‌سازی ظریف از الگوی **Adapter/Converter** عمل می‌کند و به شما اجازه می‌دهد داده‌ها را در مرز میان حافظه (In-Memory) و دیسک (Storage)، در دو سناریوی خواندن و نوشتن بدون آلوده کردن لایه منطق کسب‌وکار، تغییر شکل (Transform) دهید.

هر مبدل مقدار (Value Converter) از دو لوله عبور اطلاعات (Pipeline) تشکیل شده است:
1.  **تبدیل رو به جلو (Write Pipeline):** تبدیل داده از نوع .NET به نوع دیتابیس در زمان ذخیره‌سازی.
2.  **تبدیل رو به عقب (Read Pipeline):** بازیابی و بازسازی نوع داده اصلی .NET از روی ستون دیتابیس در زمان واکشی.

---

#### سناریوی اول: حل معضل از دست رفتن منطقه زمانی (`DateTimeKind`)

دیتابیس‌های رابطه‌ای (مانند SQL Server) به طور پیش‌فرض اطلاعات منطقه زمانی یا همان ویژگی `DateTimeKind` از ساختار `DateTime` را در زمان ذخیره‌سازی حذف می‌کنند. این موضوع در زمان سریالایز کردن اطلاعات به خروجی‌های استاندارد مانند JSON باعث بروز خطا در فرانت‌اند می‌شود (عدم وجود کاراکتر `Z` برای شناسه UTC). 

با استفاده از یک کلاس واسط به نام **`ValueConverter<TModel, TProvider>`** می‌توان این فرآیند را در سطح زیرساخت کپسوله کرد:

##### نمونه پیاده‌سازی مبدل منطقه زمانی (`Listing 7.6`)

```csharp
// تعریف مبدل اختصاصی برای بازگرداندن وضعیت UTC در زمان خواندن از دیتابیس
var utcConverter = new ValueConverter<DateTime, DateTime>(
    v => v, // زمان نوشتن در دیتابیس، داده بدون تغییر پاس داده می‌شود
    v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // زمان خواندن، شناسه DateTimeKind.Utc به تاریخ تزریق می‌شود
);

// اعمال پیکربندی روی پروپرتی هدف از طریق Fluent API
modelBuilder.Entity<Book>()
            .Property(p => p.PublishedOn)
            .HasConversion(utcConverter);
```

---

#### سناریوی دوم: نگاشت Enum به String (توازن بین خوانایی و پرفورمنس)

به صورت پیش‌فرض، EF Core نوع‌های شمارشی (Enums) را به معادل عددی آن‌ها (`int`) نگاشت می‌کند. اگرچه این کار از نظر پرفورمنس و فضای ذخیره‌سازی بهینه است، اما کار دیباگ مستقیم روی دیتابیس را دشوار می‌کند. با تبدیل Enum به معادل متنی آن، خوانایی دیتابیس به شدت افزایش می‌یابد.

برای این کار نیازی به نوشتن یک `ValueConverter` دستی نیست؛ EF Core متد آماده توسعه‌یافته‌ای را برای آن ارائه داده است:

```csharp
modelBuilder.Entity<ValueConversionExample>()
            .Property(e => e.Stage)
            .HasConversion<string>(); // ذخیره‌سازی مقدار Enum به صورت NVARCHAR/VARCHAR در دیتابیس
```

---

#### قوانین، محدودیت‌ها و ملاحظات معماری نرم‌افزار

توسعه‌دهندگان ارشد باید پیش از به‌کارگیری گسترده این الگو، محدودیت‌های زیرساختی آن را در نظر بگیرند:

۱.  **مدیریت مقادیر نول (Null-Handling):**
    موتور داخلی EF Core به صورت هوشمند فرآیند نول‌پذیری را مدیریت می‌کند. **مقادیر `null` هرگز به خط لوله تبدیل مبدل‌ها (Value Converters) فرستاده نمی‌شوند**. مبدل شما صرفاً باید منطق تبدیل داده‌های واقعی و غیرنال را پیاده‌سازی کند.

۲.  **تأثیر بر مرتب‌سازی دیتابیس (Sorting & Ordering):**
    وقتی کوئری‌های LINQ شامل مرتب‌سازی (`OrderBy`) روی فیلدهای تبدیل‌شده باشند، **عملیات مرتب‌سازی در سمت سرور دیتابیس بر اساس مقدار تبدیل‌شده (تایپ ذخیره شده در دیتابیس) انجام می‌شود**. 
    *   *مثال کلیدی:* اگر یک Enum را به رشته تبدیل کنید، مرتب‌سازی بر اساس نام حروف الفبای رشته‌ها انجام خواهد شد، نه ترتیب تعریف عددی Enum در کد .NET!

۳.  **محدودیت نگاشت تک‌ستونی:**
    مبدل‌های معمولی صرفاً قادرند **یک پروپرتی منفرد از کلاس را به یک ستون منفرد دیتابیس** نگاشت کنند. نگاشت‌های پیچیده‌تر (یک به چند یا چند به یک) در این حوزه پشتیبانی نمی‌شوند.

۴.  **معضل ردیابی تغییرات با نوع‌های مرجع پیچیده (Value Comparer):**
    اگر مبدل پیشرفته‌ای بنویسید که یک ساختار مرجع پیچیده (مانند `List<int>`) را به یک رشته متنی مانند JSON تبدیل کند، EF Core به صورت پیش‌فرض توانایی تشخیص تغییرات عمیق (Deep Comparison) درون آن لیست را برای ردیابی حالت مدل (Change Tracking) ندارد. در این شرایط معماری، شما ملزم به نوشتن و ثبت یک کلاس واسط دیگر به نام **`ValueComparer`** در کنار مبدل هستید تا نحوه مقایسه مقادیر جدید و قدیم را به موتور EF Core آموزش دهید.

---

### بخش ۷.۹: روش‌های مختلف پیکربندی کلید اصلی (Primary Keys)

در مهندسی نرم‌افزار و طراحی دیتابیس‌های رابطه‌ای، **کلید اصلی (Primary Key) پایه و اساس حفظ یکپارچگی مرجع (Referential Integrity) و شناسایی منحصربه‌فرد سطرها است**. با وجود اینکه کنوانسیون‌های پیش‌فرض EF Core به خوبی فیلدهای با نام `Id` یا `[ClassName]Id` را به عنوان کلید اصلی شناسایی می‌کنند، در دنیای واقعی با سناریوهای پیچیده‌تری روبه‌رو هستیم که نیازمند دخالت و پیکربندی صریح توسعه‌دهنده معماری نرم‌افزار است. این شرایط عموماً به دو دسته تقسیم می‌شوند:
۱. نام‌گذاری فیلد کلید اصلی با قوانینی خارج از استانداردهای کنوانسیون.
۲. وجود کلیدهای ترکیبی (Composite Keys) که از چند ستون تشکیل شده‌اند.

---

#### ۷.۹.۱ پیکربندی کلید اصلی از طریق ویژگی‌ها (Data Annotations)

برای نگاشت صریح یک ویژگی غیرمتعارف به عنوان کلید اصلی، از اتریبیوت **`[Key]`** استفاده می‌شود. این ویژگی به صراحت به موتور مدل‌سازی اعلام می‌کند که پروپرتی هدف، کلید اصلی جدول است.

##### محدودیت بسیار مهم معماری:
**ویژگی `[Key]` به هیچ وجه از کلیدهای ترکیبی (Composite Keys) پشتیبانی نمی‌کند**. در نسخه‌های بسیار قدیمی EF، ترکیب اتریبیوت‌های `[Key]` و `[Column(Order = n)]` برای ساخت کلیدهای ترکیبی استفاده می‌شد، اما **این قابلیت در نسخه‌های مدرن EF Core به طور کامل حذف شده است**؛ بنابراین، برای کلیدهای چند ستونی، استفاده از Fluent API الزامی است.

```csharp
using System.ComponentModel.DataAnnotations;

public class NonStandardKeyEntity
{
    // فیلد با نام غیرقراردادی که صریحاً کلید اصلی می‌شود
    [Key]
    public int UniqueIdentifier { get; set; }
    
    public string Name { get; set; }
}
```

---

#### ۷.۹.۲ پیکربندی کلید اصلی از طریق Fluent API

استفاده از متد **`.HasKey()`** در Fluent API، جامع‌ترین راهکار برای تعریف کلیدهای اصلی است. این روش هم برای کلیدهای تک‌ستونی با نام غیرمتعارف کاربرد دارد و هم **تنها روش پیاده‌سازی کلیدهای ترکیبی (Composite Keys) است** .

##### نمونه پیاده‌سازی با Fluent API (`Listing 7.8`)

```csharp
// نمونه اول: پیکربندی کلید اصلی انفرادی با نام غیرقراردادی
modelBuilder.Entity<SomeEntity>()
            .HasKey(e => e.NonStandardKeyId); //

// نمونه دوم: پیکربندی کلید اصلی ترکیبی (Composite Key) در جدول واسط بسیاری‌به‌بسیاری
modelBuilder.Entity<BookAuthor>()
            .HasKey(ba => new { ba.BookId, ba.AuthorId }); //
```

> **نکته طراحی شی‌گرا (OOP):** ترتیب قرارگیری پروپرتی‌ها در شیء ناشناس (Anonymous Object) در متد `HasKey`، دقیقاً **تعیین‌کننده ترتیب ستون‌ها در کلید اصلی دیتابیس** خواهد بود.

---

#### ۷.۹.۳ پیکربندی موجودیت به عنوان فقط‌خواندنی (Read-Only / Keyless Entities)

در سناریوهای پیشرفته طراحی دامنه، ممکن است با موجودیت‌هایی مواجه شوید که اساساً فاقد کلید اصلی هستند. در EF Core، اگر یک موجودیت فاقد کلید اصلی تعریف شود، سیستم به طور خودکار آن را به عنوان **فقط‌خواندنی (Read-Only)** در نظر می‌گیرد، زیرا بدون وجود یک کلید منحصربه‌فرد، امکان اجرای عملیات بروزرسانی (Update) یا حذف (Delete) در سطح دیتابیس وجود ندارد و هرگونه تلاش برای تغییر آن‌ها منجر به بروز استثنا (Exception) خواهد شد .

سه سناریوی متداول برای موجودیت‌های فاقد کلید:
1.  موجودیت‌های صرفاً جهت گزارش‌گیری و نمایش (Read-Only Entities).
2.  نگاشت مستقیم به یک **SQL View** که ساختاری فقط‌خواندنی دارد.
3.  نگاشت به کوئری‌های SQL سفارشی با متد `.ToSqlQuery()`.

##### روش‌های تعریف موجودیت فاقد کلید (Keyless):
برای معرفی یک موجودیت بدون کلید، می‌توانید از اتریبیوت **`[Keyless]`** روی کلاس استفاده کنید یا از متد **`HasNoKey()`** در Fluent API بهره ببرید.

##### نمونه نگاشت به یک SQL View با Fluent API
اگر بخواهید یک کلاس به یک نمای دیتابیس (View) متصل شود، متد **`.ToView()`** به موتور EF Core اعلام می‌کند که نباید هیچ عملیات ساخت جدولی (Migration) برای این کلاس در نظر گرفته شود و مستقیماً باید به ساختار View متصل گردد :

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // معرفی موجودیت بدون کلید و نگاشت آن به یک SQL View جهت افزایش عملکرد کوئری‌ها
    modelBuilder.Entity<BookSummaryView>()
                .HasNoKey()
                .ToView("Views_BookSummaries"); //
}
```

---

### بخش ۷.۱۰: افزودن ایندکس به ستون‌های دیتابیس (Adding Indexes)

**ایندکس‌ها (Indexes) یکی از حیاتی‌ترین ابزارها در سطح بانک اطلاعاتی برای بهینه‌سازی سرعت جستجو (Searching) و مرتب‌سازی (Sorting) سطرها بر اساس یک یا چند ستون هستند**. علاوه بر بهبود کارایی، ایندکس‌ها می‌توانند با اعمال محدودیت یکتایی (Unique Constraint)، یکپارچگی داده‌ها را در سطح فیزیکی تضمین کنند. برای مثال، دیتابیس به صورت خودکار برای کلیدهای اصلی یک ایندکس یکتا (Unique Index) ایجاد می‌کند تا عدم تکرار کلیدها تضمین شود.

در EF Core، پیکربندی ایندکس‌ها از دو رویکرد **Data Annotations** و **Fluent API** پشتیبانی می‌کند.

---

#### ۷.۱۰.۱ پیکربندی ایندکس از طریق ویژگی‌ها (Data Annotations)

در نسخه‌های مدرن EF Core، امکان تعریف ایندکس در سطح کلاس با استفاده از اتریبیوت **`[Index]`** فراهم شده است. این اتریبیوت مستقیماً بالای کلاس موجودیت قرار می‌گیرد و نام پروپرتی‌های هدف را دریافت می‌کند.

##### نمونه پیاده‌سازی با ویژگی‌ها:

```csharp
using Microsoft.EntityFrameworkCore;

// تعریف یک ایندکس ساده روی ستون MyProp
[Index(nameof(MyProp))]
public class MyClass
{
    public int Id { get; set; }
    public string MyProp { get; set; }
}

// تعریف یک ایندکس ترکیبی (Composite Index) روی دو ستون
[Index(nameof(First), nameof(Surname))]
public class Person
{
    public int Id { get; set; }
    public string First { get; set; }
    public string Surname { get; set; }
}

// تعریف یک ایندکس یکتا (Unique Index)
[Index(nameof(BookISBN), IsUnique = true)]
public class Book
{
    public int BookId { get; set; }
    public string BookISBN { get; set; }
}
```

---

#### ۷.۱۰.۲ پیکربندی ایندکس از طریق Fluent API

استفاده از Fluent API جامع‌ترین روش برای مدیریت ایندکس‌ها است و زنجیره‌سازی متدهای آن دسترسی به تنظیمات پیشرفته دیتابیس را ممکن می‌سازد. برای این کار از متد **`HasIndex`** روی `ModelBuilder` استفاده می‌شود.

##### متدهای اصلی زنجیره‌سازی ایندکس:

*   **`IsUnique()`**: ایندکس را به یک ایندکس یکتا تبدیل می‌کند.
*   **`HasDatabaseName("Index_Name")`**: نام فیزیکی ایندکس را در دیتابیس تغییر می‌دهد (برای انطباق با قراردادهای نام‌گذاری سازمانی) .
*   **`HasFilter("SQL_Expression")`**: ایندکس فیلترشده (Filtered or Partial Index) ایجاد می‌کند.

##### نمونه پیاده‌سازی با Fluent API:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // ۱. تعریف ایندکس تک‌ستونی ساده
    modelBuilder.Entity<MyClass>()
                .HasIndex(p => p.MyProp);

    // ۲. تعریف ایندکس ترکیبی (Composite Index) روی دو پروپرتی
    modelBuilder.Entity<Person>()
                .HasIndex(p => new { p.First, p.Surname });

    // ۳. تعریف ایندکس یکتا همراه با نام‌گذاری اختصاصی در دیتابیس
    modelBuilder.Entity<Book>()
                .HasIndex(p => p.BookISBN)
                .IsUnique()
                .HasDatabaseName("UX_Books_BookISBN");
}
```

---

#### ۷.۱۰.۳ ایندکس‌های فیلترشده (Filtered/Partial Indexes) و مدیریت مقادیر Null

یکی از دغدغه‌های معماران نرم‌افزار در زمان کار با ایندکس‌های یکتا، رفتار آن‌ها در مواجهه با ستون‌های نول‌پذیر (Nullable) یا رکوردهای سافت‌دیلیت (Soft-Deleted) شده است. برخی بانک‌های اطلاعاتی اجازه می‌دهند تا بخش خاصی از داده‌ها را از ایندکس مستثنی کنید تا هم حجم ایندکس کاهش یابد و هم از تداخل‌های ناخواسته جلوگیری شود.

##### سناریوی اول: ایندکس یکتا با نادیده گرفتن حذف‌های منطقی (Soft Delete)
اگر از الگوی Soft Delete استفاده می‌کنید، ممکن است بخواهید فیلدی مانند `NationalCode` یکتا باشد، اما این یکتایی صرفاً باید روی رکوردهایی اعمال شود که هنوز حذف نشده‌اند (`SoftDeleted == false`). این کار با متد **`HasFilter`** انجام‌پذیر است:

```csharp
modelBuilder.Entity<User>()
            .HasIndex(u => u.NationalCode)
            .IsUnique()
            .HasFilter("[SoftDeleted] = 0"); // رکورد‌های حذف شده منطقی محدودیت یکتایی را نقض نمی‌کنند
```

##### سناریوی دوم: تفاوت حیاتی SQL Server در ستون‌های Nullable
در دیتابیس **SQL Server**، طبق استاندارد، ایندکس‌های یکتا اجازه درج بیش از یک مقدار `NULL` را نمی‌دهند (بر خلاف برخی دیتابیس‌های دیگر که چندین `NULL` را مجاز می‌دانند).
*   **رفتار خودکار EF Core:** زمان استفاده از پرووایدر SQL Server، فریم‌ورک EF Core به صورت هوشمند برای تمام ستون‌های نول‌پذیری که عضو یک ایندکس یکتا هستند، فیلتر خودکار `IS NOT NULL` را اضافه می‌کند تا درج رکوردهای متعدد با مقدار `NULL` دیتابیس را دچار خطا نکند.
*   **لغو رفتار پیش‌فرض:** اگر به هر دلیل معماری نیاز دارید این رفتار خودکار را غیرفعال کنید، می‌توانید مقدار `null` را به متد `HasFilter` پاس دهید:

```csharp
modelBuilder.Entity<MyClass>()
            .HasIndex(p => p.NullableProperty)
            .IsUnique()
            .HasFilter(null); // غیرفعال کردن فیلتر خودکار IS NOT NULL در SQL Server
```

---

### بخش ۷.۱۱: پیکربندی نام‌گذاری در سمت بانک اطلاعاتی (Configuring Naming on the Database Side)

در زمان ساخت یک بانک اطلاعاتی جدید، استفاده از نام‌های پیش‌فرضِ تولیدشده توسط کنوانسیون‌های EF Core کاملاً بی‌نقص است. اما در سناریوهای واقعی مهندسی نرم‌افزار، مانند کار با بانک‌های اطلاعاتی موجود (Legacy Databases) یا سیستم‌های خارجی که امکان تغییر ساختار آن‌ها وجود ندارد، ناگزیر به استفاده از نام‌های خاص برای جداول (Tables)، ستون‌ها (Columns) و طرحواره‌ها (Schemas) هستیم.

---

#### ۷.۱۱.۱ پیکربندی نام جداول (Configuring Table Names)

بر اساس کنوانسیون‌های پیش‌فرض EF Core، نام جداول دیتابیس بر اساس قواعد زیر تعیین می‌شود:
1. **نام ویژگیِ `DbSet<T>` تعریف‌شده در کلاس `DbContext` شما** (به عنوان مثال، جدول `Books` بر اساس ویژگی `DbSet<Book> Books`).
2. **اگر هیچ ویژگی `DbSet<T>` برای یک موجودیت تعریف نشده باشد** (مانند موجودیت `Review` که به صورت ناوبریِ درون‌بخش لود می‌شود)، نام کلاسِ موجودیت به عنوان نام جدول در نظر گرفته می‌شود.

اگر بانک اطلاعاتی شما دارای نام‌های خاصی است که با استانداردهای کدنویسی دات‌نت سازگار نیستند (مثلاً نام جدول حاوی کاراکتر فاصله است)، می‌توانید این نگاشت را با استفاده از ویژگی‌ها یا Fluent API اصلاح کنید.

##### روش Data Annotations:
با قرار دادن ویژگی **`[Table]`** بالای کلاس موجودیت:
```csharp
[Table("XXX")]
public class Book 
{
    // ...
}
```

##### روش Fluent API:
با استفاده از متد **`ToTable`** روی نمونه پیکربندی موجودیت در دیتابیس:
```csharp
modelBuilder.Entity<Book>()
            .ToTable("XXX");
```

---

#### ۷.۱۱.۲ پیکربندی نام طرحواره و گروه‌بندی دیتابیس (Configuring Schema Name)

بانک‌های اطلاعاتی پیشرفته (مانند SQL Server) امکان گروه‌بندی منطقی جداول را تحت فضاهای نام مجزا به نام طرحواره (Schema) فراهم می‌سازند. این کار به معماران اجازه می‌دهد جداول را در دسته‌های منطقی نظیر `sales` (فروش)، `production` (تولید) یا `accounts` (حسابداری) تفکیک کنند.

برخی دیتابیس‌ها مانند SQLite و MySQL از مفهوم Schema پشتیبانی نمی‌کنند. در SQL Server، طرحواره پیش‌فرض `dbo` است.

##### تغییر طرحواره پیش‌فرض برای تمام جداول دیتابیس:
شما می‌توانید طرحواره پیش‌فرض را صرفاً از طریق Fluent API و در متد `OnModelCreating` تغییر دهید:
```csharp
modelBuilder.HasDefaultSchema("NewSchemaName");
```

##### تخصیص طرحواره خاص به یک جدول مشخص:
*   **روش Data Annotations:**
    ```csharp
    [Table("SpecialOrder", Schema = "sales")]
    class MyClass 
    {
        // ...
    }
    ```
*   **روش Fluent API:**
    ```csharp
    modelBuilder.Entity<MyClass>()
                .ToTable("SpecialOrder", schema: "sales");
    ```

---

#### ۷.۱۱.۳ پیکربندی نام ستون‌های دیتابیس (Configuring Column Names)

به طور پیش‌فرض، نام ستون‌های جدول در بانک اطلاعاتی دقیقاً هم‌نام با پروپرتی‌های کلاس متناظر .NET است. در صورت ناهمخوانی این نام‌ها با ساختار فیزیکی دیتابیس، بازنویسی نام ستون‌ها به روش‌های زیر صورت می‌پذیرد.

##### روش Data Annotations:
با اعمال اتریبیوت **`[Column]`** بر روی پروپرتی هدف:
```csharp
[Column("SpecialCol")]
public int BookId { get; set; }
```

##### روش Fluent API:
با فراخوانی متد **`HasColumnName`** در زنجیره پیکربندی پروپرتی:
```csharp
modelBuilder.Entity<MyClass>()
            .Property(b => b.BookId)
            .HasColumnName("SpecialCol");
```

---

### بخش ۷.۱۲: پیکربندی فیلترهای پرس‌وجوی سراسری (Global Query Filters)

**فیلترهای پرس‌وجوی سراسری (Global Query Filters) یک لایه حفاظتی و منطقی بسیار قدرتمند در سطح مدل داده هستند که به طور خودکار یک شرط `WHERE` دائمی را به تمام کوئری‌های صادر شده بر روی یک موجودیت خاص تزریق می‌کنند** . این ویژگی معماری به عنوان یک مکانیزم دفاع پیشگیرانه (Defensive Programming) عمل کرده و تضمین می‌کند که توسعه‌دهندگان بدون نیاز به نوشتن دستی شروط تکراری در تک‌تک کوئری‌های LINQ، قوانین امنیتی و منطقی پایه را در سطح سیستم نقض نخواهند کرد.

دو سناریوی بسیار حیاتی در معماری نرم‌افزار که مستقیماً با این ویژگی پیاده‌سازی می‌شوند، **حذف نرم (Soft Delete)** و **سیستم‌های چندمستاجری (Multi-tenancy)** هستند .

---

#### ۷.۱۲.۱ سناریوی اول: پیاده‌سازی اصولی حذف نرم (Soft Delete)

در سیستم‌های سازمانی، داده‌ها به ندرت به صورت فیزیکی حذف می‌شوند؛ بلکه معمولاً به وضعیت‌های دیگری تغییر حالت می‌دهند. با اضافه کردن یک پروپرتی بولین ساده به نام `SoftDeleted` به موجودیت، می‌توان وضعیت فعال یا غیرفعال بودن رکورد را پیگیری کرد.

##### پیکربندی فیلتر در متد `OnModelCreating`:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // اعمال فیلتر سراسری برای حذف نرم موجودیت Book
    modelBuilder.Entity<Book>()
                .HasQueryFilter(b => !b.SoftDeleted); //
}
```

با این پیکربندی، هرگونه کوئری بر روی `Books` به صورت خودکار رکوردهایی که `SoftDeleted == true` هستند را نادیده می‌گیرد.

##### دور زدن فیلتر پرس‌وجو (Bypassing Filters):
در سناریوهای مدیریتی یا بازیابی داده‌ها (Undelete)، در صورت نیاز به خواندن تمام داده‌ها (حتی موارد حذف شده منطقی)، می‌توان فیلتر را با متد **`IgnoreQueryFilters()`** غیرفعال کرد:

```csharp
var allBooksIncludingDeleted = context.Books
                                      .IgnoreQueryFilters() //
                                      .ToList();
```

---

#### ۷.۱۲.۲ سناریوی دوم: معماری سیستم‌های چندمستاجری (Multi-tenancy)

در برنامه‌های تحت وب بزرگ (مانند نرم‌افزارهای SaaS)، داده‌های کاربران یا سازمان‌های مختلف (Tenants) در یک دیتابیس مشترک ذخیره می‌شود، اما هر کاربر صرفاً مجاز به دیدن داده‌های متعلق به مستأجر یا شناسه کاربری خود است .

برای این کار، شناسه کاربری (`UserId` یا `DataKey`) از کوکی یا کلیم‌های کاربر استخراج شده و به DbContext تزریق می‌شود .

##### نمونه کدهای DbContext پویا برای فیلتر چندمستاجری (`Listing 6.5`):

```csharp
public class EfCoreContext : DbContext
{
    private readonly string _userId; // فیلد پویا جهت نگهداری شناسه کاربر جاری

    // تزریق وابستگی سرویس کاربر جاری از طریق سازنده
    public EfCoreContext(DbContextOptions<EfCoreContext> options, 
                         IUserIdService userIdService) : base(options)
    {
        // دریافت شناسه کاربر جاری به صورت پویا در هر درخواست HTTP
        _userId = userIdService?.GetUserId() ?? string.Empty; //
    }

    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // اعمال فیلتر پویا بر اساس فیلد داینامیک دیتابیس
        modelBuilder.Entity<Order>()
                    .HasQueryFilter(o => o.CustomerId == _userId); //
    }
}
```

##### ⚠️ هشدار فنی بسیار مهم در ردیابی فیلدهای پویا (Stale Capture):
موتور داخلی EF Core، متد `OnModelCreating` و کل پیکربندی‌های مدل را **صرفاً یک‌بار در طول عمر کل برنامه (در زمان اولین دسترسی به دیتابیس) اجرا و کش می‌کند**.
*   **رفتار درست:** زمانی که فیلتر را به صورت بیانیه لامبدا متصل به یک فیلد کلاس DbContext (مانند `_userId`) می‌نویسید، ساختار فیلتر کش می‌شود اما مقدار درون متغیر `_userId` در هر بار نمونه‌سازی از DbContext به صورت کاملاً پویا و زنده (Live) ارزیابی می‌شود.
*   **خطای معماری شدید:** اگر تلاش کنید فیلتر داینامیک را به کلاس‌های پیکربندی مجزا (مانند `IEntityTypeConfiguration<T>`) منتقل کنید، این خطر جدی وجود دارد که ارجاع متغیر `_userId` در زمان اولین نمونه‌سازی فریم‌ورک تثبیت (Capture) شده و برای همیشه برای سایر کاربران سیستم به همان مقدار اولیه قفل شود. بنابراین، **فیلترهای پرس‌وجوی داینامیک متکی به کانتکست جاری همواره باید مستقیماً در متد OnModelCreating درون کلاس اصلی DbContext تعریف شوند**.

---

#### ۷.۱۲.۳ تله‌ها و چالش‌های پنهان حذف نرم در سناریوهای واقعی دیتابیس

توسعه‌دهندگان ارشد باید بدانند که حذف نرم رفتاری شبیه به عملیات بومی `ON DELETE CASCADE` در دیتابیس رابطه‌ای ندارد. در حذف فیزیکی، حذف یک سطر والد کل سطرهای فرزند را به صورت آبشاری حذف می‌کند، اما در حذف نرم سطر والد صرفاً مخفی می‌شود در حالی که فرزندان آن هنوز در دیتابیس معلق هستند .

##### ۱. معضل آمارگیری رکوردهای وابسته (Aggregates Counting):
اگر یک کتاب ده دیدگاه (Reviews) داشته باشد و کتاب حذف نرم شود، اجرای مستقیم `context.Reviews.Count()` تعداد آن‌ها را کم نخواهد کرد، زیرا فیلتر حذف نرم صرفاً روی موجودیت والد (`Books`) اعمال شده است نه روی `Reviews`.
*   **راهکار طراحی شی‌گرا (الگوی Root & Aggregate):** برای واکشی داده‌های وابسته، همواره باید عبور را از سطر والد (موجودیت ریشه) آغاز کنید تا فیلتر سراسری والد به زنجیره اعمال شود:
```csharp
// این کوئری به صورت خودکار فقط دیدگاه‌های کتاب‌هایی که حذف فیزیکی یا نرم نشده‌اند را می‌شمارد
var validReviewsCount = context.Books
                               .SelectMany(b => b.Reviews)
                               .Count(); //
```

##### ۲. معضل قفل شدن روابط یک‌به‌یک (One-to-One Relationships):
**اعمال فیلتر حذف نرم بر روی موجودیت‌های دارای رابطه یک‌به‌یک اکیداً ممنوع است**.
*   *مثال:* فرض کنید کتاب یک رابطه یک‌به‌یک با جدول پیشنهاد تخفیف (`PriceOffer`) دارد. فیلد `BookId` در جدول `PriceOffers` دارای ایندکس یکتا (Unique Index) است. اگر پیشنهاد فعلی را سافت‌دیلیت کنید، رکورد در دیتابیس مخفی می‌شود. حالا اگر کاربر بخواهد یک پیشنهاد تخفیف جدید برای همان کتاب ثبت کند، سیستم با **خطای نقض محدودیت یکتایی کلید خارجی دیتابیس (Unique Constraint Database Exception)** روبه‌رو می‌شود؛ زیرا رکورد قبلی همچنان فضا را اشغال کرده است، در حالی که فیلتر سراسری آن را از دید برنامه مخفی کرده بود .

---

### بخش ۷.۱۳: اعمال دستورات Fluent API بر اساس نوع پرووایدر دیتابیس (Applying Fluent API Commands Based on Database Provider Type)

در پروژه‌های واقعی، بسیار رایج است که از پرووایدرهای دیتابیس متفاوتی برای محیط‌های توسعه، تست و عملیات استفاده شود. برای مثال، ممکن است از دیتابیس **SQL Server** در محیط عملیاتی و از دیتابیس سبک درون‌حافظه‌ای **SQLite** برای اجرای سریع تست‌های واحد (Unit Tests) استفاده کنید. هرچند EF Core سعی می‌کند تفاوت‌های ساختاری دیتابیس‌ها را کپسوله‌سازی کند، اما برخی قابلیت‌ها یا نوع‌های داده‌ای توسط همه پرووایدرها به یک شکل پشتیبانی نمی‌شوند .

#### چالش ناسازگاری SQLite با نوع داده Decimal
برای نمونه، **SQLite به طور کامل از نوع داده `decimal` پشتیبانی نمی‌کند**. اگر تلاش کنید در یک دیتابیس SQLite، عملیات مرتب‌سازی (Sorting) یا فیلتر کردن را روی یک پروپرتی از نوع `decimal` انجام دهید، با یک Exception مواجه خواهید شد که اعلام می‌کند خروجی محاسبات در SQLite دقیق یا معتبر نخواهد بود. 
*   **راهکار معماری:** برای عبور از این محدودیت در زمان اجرای تست‌های واحد روی SQLite، می‌توان نوع داده اعشاری را به `double` تبدیل کرد؛ هرچند دقت اعشاری اندکی کاهش می‌یابد، اما برای تست واحد مناسب است.

#### متدهای تشخیص پرووایدر فعال در DbContext
EF Core متدهایی را برای تشخیص داینامیک پرووایدر جاری ارائه می‌دهد تا بتوان پیکربندی‌های شرطی اعمال کرد:
1.  **متدهای الحاقی بومی پرووایدرها:** هر پرووایدر یک متد الحاقی روی کلاس `Database` دارد؛ مانند **`Database.IsSqlServer()`** برای بررسی اتصال به SQL Server یا **`Database.IsSqlite()`** برای SQLite.
2.  **پروپرتی `ActiveProvider`:** این پروپرتی روی کلاس `ModelBuilder` قرار دارد و نام پکیج NuGet پرووایدر فعال را به صورت یک رشته (مانند `"Microsoft.EntityFrameworkCore.SqlServer"`) بازمی‌گرداند.
3.  **متد `IsRelational()`:** این متد در EF Core 5 معرفی شد و برای پرووایدرهای غیررابطه‌ای مانند Cosmos DB مقدار `false` برمی‌گرداند.

#### نمونه کد پیکربندی شرطی (Listing 7.9)
کد زیر نحوه اعمال این پیکربندی شرطی را در متد `OnModelCreating` نشان می‌دهد. در صورتی که دیتابیس فعال SQLite باشد، فیلدهای قیمت به صورت داینامیک به `double` تبدیل می‌شوند تا تست‌های واحد بدون خطا اجرا شوند:

```csharp
if (Database.IsSqlite()) // بررسی فعال بودن پرووایدر SQLite
{                                             
    modelBuilder.Entity<Book>()                    
                .Property(e => e.Price)                    
                .HasConversion<double>(); // تبدیل دسی‌مال به دابل برای سازگاری با SQLite
                
    modelBuilder.Entity<PriceOffer>()              
                .Property(e => e.NewPrice)                 
                .HasConversion<double>(); //
} 
```

#### یک توصیه حیاتی برای مهاجرت دیتابیس‌های چندگانه (Migrations for Multiple Databases)
هرچند استفاده از پیکربندی‌های شرطی داخل یک DbContext مشترک برای اجرای تست‌ها کاربردی است، اما **تیم مهندسی EF Core این روش را برای مدیریت دیتابیس‌های چندگانه در محیط عملیاتی توصیه نمی‌کند**.
*   **پیشنهاد رسمی:** پیشنهاد می‌شود برای هر نوع دیتابیس تولیدی متفاوت، **یک کلاس DbContext مجزا (که ترجیحاً از DbContext اصلی ارث‌بری می‌کند) تعریف کرده و فایل‌های Migration مربوط به هرکدام را در دایرکتوری‌های کاملاً مستقل نگهداری کنید**.
 
---

### بخش ۷.۱۴: ویژگی‌های سایه (Shadow Properties) - پنهان‌سازی ستون‌ها درون EF Core

در توسعه نرم‌افزار مبتنی بر اصول طراحی Domain-Driven Design (DDD) و Clean Code، همواره تلاش بر این است که کلاس‌های موجودیت (Entity Classes) صرفاً شامل داده‌ها و رفتارهایی باشند که مستقیماً به منطق کسب‌وکار (Core Business Logic) مربوط می‌شوند. اضافه کردن داده‌های زیرساختی یا فیزیکی دیتابیس (مانند فیلدهای حسابرسی یا کلیدهای خارجی فاقد رفتار دامنه) به این کلاس‌ها، ساختار دامنه را آلوده می‌کند.

**ویژگی‌های سایه (Shadow Properties) این چالش معماری را حل می‌کنند**. این ویژگی‌ها در مدل مفهومی EF Core و به عنوان ستون در جداول بانک اطلاعاتی وجود دارند، اما **هیچ فیلد یا پروپرتی متناظری برای آن‌ها در کلاس سی‌شارپ وجود ندارد**. این ویژگی به شما اجازه می‌دهد تا داده‌ها را در لایه فیزیکی دیتابیس ذخیره و بازیابی کنید، بدون اینکه لایه‌های بالایی نرم‌افزار از وجود آن‌ها مطلع شوند.

#### سناریوهای متداول به‌کارگیری Shadow Properties
۱. **ثبت اطلاعات حسابرسی (Auditing & Tracking):** ثبت دقیق زمان تغییر رکورد (`UpdatedOn`) یا شناسه کاربر ویرایش‌کننده، بدون شلوغ کردن فیلدهای کلاس دامنه.
۲. **مدیریت خودکار کلیدهای خارجی:** هنگامی که در یک رابطه، پروپرتی کلید خارجی را صریحاً در کلاس تعریف نکرده‌اید، EF Core جهت حفظ یکپارچگی مرجع، کلید خارجی را به صورت یک Shadow Property ایجاد و مدیریت می‌کند.

---

#### ۷.۱۴.۱ پیکربندی ویژگی‌های سایه (Configuring Shadow Properties)

از آنجا که پروپرتی فیزیکی در کلاس وجود ندارد، پیکربندی آن صرفاً از طریق Fluent API و با استفاده از متد **`Property<T>`** (که نوع داده را به صورت Generic و نام ستون را به صورت `string` دریافت می‌کند) انجام‌پذیر است :

##### نمونه پیاده‌سازی پیکربندی با Fluent API (`Listing 7.10`)

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // تعریف یک Shadow Property از نوع DateTime به نام UpdatedOn برای موجودیت SomeEntity
    modelBuilder.Entity<SomeEntity>()
                .Property<DateTime>("UpdatedOn"); // 
}
```

> **تغییر نام فیزیکی ستون:** به طور پیش‌فرض، نام ستون دیتابیس معادل با نام پاس‌داده‌شده به متد `Property` خواهد بود. در صورت نیاز به تغییر نام ستون فیزیکی، متد **`HasColumnName`** را زنجیره کنید.
> **هشدار امنیتی در پیکربندی:** اگر پروپرتی هم‌نام با رشته ورودی در کلاس دامنه وجود داشته باشد، EF Core به جای ساخت سایه، همان پروپرتی موجود در کلاس را نگاشت و استفاده می‌کند.

---

#### ۷.۱۴.۲ دسترسی و عملیات روی ویژگی‌های سایه (Accessing Shadow Properties)

از آنجا که این ویژگی‌ها در ساختار شیء .NET در دسترس نیستند، تعامل با آن‌ها (برای خواندن یا نوشتن) باید از طریق APIهای اختصاصی EF Core انجام شود.

##### سناریوی اول: آوانویسی و تغییر مقدار (نوشتن داده)
برای تغییر مقدار یک Shadow Property، باید موجودیت مربوطه به صورت **Tracked (تحت ردیابی)** در DbContext باشد . سپس با استفاده از متد `Entry` و پروپرتی `CurrentValue` تغییرات اعمال می‌شوند:

##### نمونه کدهای ذخیره‌سازی داده حسابرسی (`Listing 7.11`)

```csharp
var entity = new SomeEntityClass();
context.Add(entity); // موجودیت تحت ردیابی (Tracked) قرار می‌گیرد

// دسترسی مستقیم به داده سایه از طریق Change Tracker و تعیین مقدار جاری
context.Entry(entity)
       .Property("UpdatedOn")
       .CurrentValue = DateTime.Now; // 

context.SaveChanges(); // ذخیره همزمان فیلدهای معمولی و فیلد سایه در دیتابیس
```

##### سناریوی دوم: بازیابی داده درون پرس‌وجوهای LINQ (خواندن داده)
برای استفاده از ویژگی‌های سایه در شروطِ `Where` یا متدهای مرتب‌سازی مانند `OrderBy` در سطح بانک اطلاعاتی، از کلاس واسط static به نام **`EF.Property`** استفاده می‌شود:

```csharp
// اجرای مرتب‌سازی سمت سرور (SQL Server) بر اساس فیلد سایه پنهان‌شده
var sortedEntities = context.MyEntities
                            .OrderBy(b => EF.Property<DateTime>(b, "UpdatedOn")) // 
                            .ToList();
```

---

### بخش ۷.۱۵: فیلدهای پشتیبان (Backing Fields) - کنترل دسترسی به داده‌ها در کلاس موجودیت

در معماری‌های پیشرفته نرم‌افزار، به ویژه هنگام پیاده‌سازی **طراحی قلمرو‌محور (Domain-Driven Design - DDD)** و اصول **کپسوله‌سازی (Encapsulation)**، مایل نیستیم تمامی ستون‌های بانک اطلاعاتی به عنوان پروپرتی‌های عمومی با Getter و Setter آزاد در سطح کدهای دات‌نت در دسترس باشند . ویژگی **فیلدهای پشتیبان (Backing Fields)** در EF Core (که در نسخه‌های قدیمی‌تر مانند EF6.x وجود نداشت) به ما اجازه می‌دهد بانک اطلاعاتی را مستقیماً به فیلدهای خصوصی (private fields) کلاس نگاشت کنیم . این مکانیزم کنترل دقیقی روی نحوه خواندن یا تغییر فیلدها در لایه نرم‌افزار فراهم می‌سازد.

#### سناریوهای کلیدی به‌کارگیری Backing Fields
*   **پنهان‌سازی داده‌های حساس (Concealing Sensitive Data):** ذخیره داده‌های خام (مانند تاریخ تولد) در یک فیلد خصوصی و صرفاً ارائه خروجی‌های محاسباتی یا ایمن (مانند سن به سال) به لایه‌های بالاتر.
*   **رهگیری تغییرات (Catching Changes):** رهگیری دقیق عملیات نوشتن روی پروپرتی‌ها با تزریق کدهای سفارشی در متد Setter.
*   **توسعه موجودیت‌های کلین و DDD:** ساخت پروپرتی‌های کاملاً فقط‌خواندنی (Read-Only) و محافظت از یکپارچگی مجموعه‌ها (Collections) با استفاده از کلاس‌های ناوبری مسدودشده.

---

#### ۷.۱۵.۱ ایجاد یک فیلد پشتیبان ساده با پروپرتی خواندنی/نوشتنی

در ساده‌ترین شکل، یک فیلد خصوصی پشت یک پروپرتی عمومی استاندارد قرار می‌گیرد:

```csharp
public class MyClass 
{
    private string _myProperty; // فیلد خصوصی پشتیبان
    
    public string MyProperty
    {
        get { return _myProperty; }
        set { _myProperty = value; }
    }
}
```
طبق کنوانسیون‌های نام‌گذاری، EF Core به صورت خودکار رابطه بین فیلد خصوصی و پروپرتی را کشف کرده و برای خواندن و نوشتن داده‌ها در دیتابیس به صورت مستقیم از فیلد خصوصی استفاده می‌کند.

---

#### ۷.۱۵.۲ ایجاد ستون‌های دیتابیسِ فقط‌خواندنی (Read-Only Columns)

یکی از کاربردهای عالی فیلدهای پشتیبان، تعریف ستون‌هایی در دیتابیس است که برنامه دات‌نت باید قادر به خواندن آن‌ها باشد، اما تحت هیچ شرایطی نباید مجاز به ویرایش یا ذخیره مستقیم آن‌ها باشد. 

```csharp
public class MyClass 
{
    private string _readOnlyCol; // فیلد خصوصی فقط‌خواندنی
    
    // پروپرتی بدون Setter فیزیکی
    public string ReadOnlyCol => _readOnlyCol; 
}
```
مقدار فیزیکی این ستون در دیتابیس معمولاً از طریق مقادیر پیش‌فرض دیتابیس (Default Constraints) یا تریگرها مقداردهی می‌شود و برنامه دات‌نت صرفاً آن را لود می‌کند .

---

#### ۷.۱۵.۳ سناریوی عملی: مخفی‌سازی تاریخ تولد دقیق کاربر

در این سناریو، فیلد حساسِ تاریخ تولد به صورت کاملاً خصوصی نگهداری می‌شود تا از نمایش ناخواسته آن در UI جلوگیری شود . لایه‌های بیرونی صرفاً می‌توانند پروپرتی محاسباتی و غیرحساسِ `Age` را بخوانند:

```csharp
public class Person
{
    public int Id { get; set; }
    
    // فیلد فاقد پروپرتی متناظر در دات‌نت
    private DateTime _dateOfBirth; 

    public int Age => (DateTime.Today - _dateOfBirth).Days / 365;

    public void SetDateOfBirth(DateTime dob)
    {
        _dateOfBirth = dob;
    }
}
```

##### نحوه پیکربندی فیلد پشتیبان فاقد پروپرتی:
از آنجا که این فیلد فاقد پروپرتی جفت در کلاس است، کنوانسیون پیش‌فرض قادر به کشف آن نیست . باید با Fluent API فیلد را معرفی کرده و نام ستون فیزیکی آن را در جدول مشخص کنید:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Person>()
                .Property("_dateOfBirth") // معرفی فیلد خصوصی به عنوان ویژگی مدل
                .HasColumnName("DateOfBirth"); // تعیین نام دلخواه برای ستون جدول
}
```

##### نحوه کوئری زدن روی فیلد پشتیبان پنهان:
برای فیلتر کردن یا مرتب‌سازی بر اساس این فیلد در کدهای LINQ، همچنان می‌توانید از متد کلیدی `EF.Property` استفاده کنید:

```csharp
var adults = context.People
                    .Where(p => EF.Property<DateTime>(p, "_dateOfBirth") <= DateTime.Today.AddYears(-18))
                    .ToList();
```

---

#### ۷.۱۵.۴ روش‌های پیکربندی فیلدهای پشتیبان

۱. **طبق کنوانسیون (By Convention):**
اگر یک فیلد خصوصی با یکی از الگوهای زیر تعریف شده و نوع داده آن با پروپرتی هم‌نامش (`MyProperty`) یکسان باشد، EF Core به طور خودکار آن را به عنوان فیلد پشتیبان رجیستر می‌کند :
*   `_MyProperty`
*   `_myProperty`
*   `m_MyProperty`
*   `m_myProperty`

۲. **از طریق ویژگی‌ها (Data Annotations - جدید در EF Core 5):**
اگر نام فیلد شما از الگوهای پیش‌فرض بالا پیروی نمی‌کند، با اتریبیوت **`[BackingField]`** می‌توانید اتصال پروپرتی به فیلد خصوصی را صریحاً در سطح کلاس برقرار کنید:
```csharp
[BackingField(nameof(_differentFieldName))]
public string MyProperty { get; set; }
```

۳. **از طریق Fluent API:**
استفاده از متد **`HasField`** بر روی ویژگی مدل پایدارترین روش در لایه پیکربندی به شمار می‌رود :
```csharp
modelBuilder.Entity<MyClass>()
            .Property(b => b.MyProperty)
            .HasField("_differentFieldName"); // اتصال صریح به فیلد غیرهم‌نام
```

---

#### ۷.۱۵.۵ کنترل نحوه دسترسی و رفتار موتور EF Core با فیلد یا پروپرتی

به صورت پیش‌فرض (از نسخه EF Core 3.0 به بعد)، هر زمان که عملیات خواندن یا نوشتن فیزیکی در دیتابیس انجام می‌شود، EF Core **مستقیماً فیلد خصوصی را دور زده و مقدار آن را تغییر می‌دهد یا می‌خواند** و متدهای Get/Set پروپرتی را نادیده می‌گیرد. شما می‌توانید این رفتار دسترسی پیش‌فرض را با متد **`UsePropertyAccessMode`** تغییر دهید:

```csharp
modelBuilder.Entity<Person>()
            .Property(b => b.MyProperty)
            .UsePropertyAccessMode(PropertyAccessMode.PreferProperty); 
```

مقادیر پرکاربرد این Enum عبارتند از :
*   **`PreferField`:** برای بهینه‌سازی سرعت، همواره استفاده مستقیم از فیلد خصوصی اولویت دارد.
*   **`PreferProperty`:** اولویت با متدهای Get/Set پروپرتی است تا منطق سفارشی شما اجرا شود. اما اگر پروپرتی فاقد Setter (برای زمان لود) باشد، به صورت خودکار به سراغ فیلد می‌رود.
*   **`Property`:** الزامی کردن استفاده از پروپرتی؛ در صورت مسدود بودن دسترسی، استثنا پرتاب می‌شود.
*   **`Field`:** الزامی کردن استفاده انحصاری از فیلد خصوصی.

---

### بخش ۷.۱۶: توصیه‌ها و استراتژی‌های نهایی در پیکربندی (Recommendations for Configuration)

داشتن گزینه‌های متعدد برای پیکربندی در Entity Framework Core (شامل By Convention، Data Annotations و Fluent API) می‌تواند توسعه‌دهندگان را در انتخاب رویکرد مناسب سردرگم کند. برای ایجاد یک پایگاه کد تمیز (Clean Codebase) و بهینه‌سازی فرآیند توسعه، اتخاذ یک استراتژی هماهنگ و منظم توصیه می‌شود.

#### ۷.۱۶.۱ اولویت اول: استفاده حداکثری از کنوانسیون‌ها (By Convention First)
موتور داخلی EF Core فرآیند مدل‌سازی را به طور بسیار هوشمندانه‌ای بر اساس قراردادهای نام‌گذاری و نوع‌های داده استاندارد انجام می‌دهد. **همواره کار خود را با پیکربندی مبتنی بر کنوانسیون آغاز کنید**. این رویکرد تا زمان سازگاری کلاس‌ها با قوانین پیش‌فرض، حجم کدهای پیکربندی شما را به شدت کاهش داده و سرعت توسعه را بالا می‌برد.

#### ۷.۱۶.۲ استفاده هوشمندانه از Data Annotations برای اعتبارسنجی داده‌ها
محدود کردن طول رشته‌ها با ویژگی‌هایی مانند `[MaxLength]` یا اجباری کردن فیلدها با ویژگی `[Required]`، علاوه بر تأثیرگذاری بر روی طرحواره دیتابیس، در لایه‌های دیگر برنامه نیز کاربرد دارند. 
*   **مزیت اعتبارسنجی فرانت‌اند:** فریم‌ورک‌های رابط کاربری (مانند ASP.NET Core) از این ویژگی‌ها برای اعتبارسنجی خودکار ورودی‌ها قبل از فرستادن اطلاعات استفاده می‌کنند.
*   **ساده‌سازی منطق کسب‌وکار:** با اعتبارسنجی مستقیم موجودیت‌ها در هنگام فراخوانی متد `SaveChanges`، نیاز به نوشتن کدهای تکراری در بخش منطق کسب‌وکار کاهش می‌یابد.
*   **مستندسازی زمان کامپایل (Compile-time Constants):** این اتریبیوت‌ها به عنوان مستندات در لایه مدل عمل می‌کنند که خوانایی و درک قوانین فیلدها را برای هر توسعه‌دهنده‌ای بسیار ساده می‌سازد.

#### ۷.۱۶.۳ استفاده از Fluent API برای پیکربندی‌های فنی دیتابیس
تمامی مواردی که مربوط به پیاده‌سازی فیزیکی بانک اطلاعاتی می‌شوند (مانند نگاشت دقیق نوع ستون‌ها و تعیین نام جداول و فیلدها زمانی که از مقادیر پیش‌فرض پیروی نمی‌کنند) باید در Fluent API قرار گیرند. این کار باعث **جداسازی دغدغه‌ها (Separation of Concerns)** شده و کلاس‌های دامنه را از جزئیات فنی زیرساخت دیتابیس مستقل نگه می‌دارد.

---

#### ۷.۱۶.۴ خودکارسازی پیکربندی‌ها از طریق بررسی امضای پروپرتی‌ها (Bulk Configuration)
یکی از قدرتمندترین قابلیت‌های Fluent API، امکان پیمایش پویای مدل از طریق اینترفیس **`IMutableModel`** در زمان مقداردهی اولیه است. در پروژه‌های بزرگ با صدها جدول، اعمال دستی تنظیماتی نظیر تبدیل تاریخ‌های UTC یا تعیین دقت دسی‌مال‌ها کار فرساینده و خطاسازی است. شما می‌توانید این فرآیند را کاملاً خودکار کنید.

##### Listing 7.13: اعمال خودکار مبدل مقدار برای تمام تاریخ‌های UTC
کد زیر تمام پروپرتی‌های از نوع `DateTime` را که نام آن‌ها به پسوند `Utc` ختم می‌شود، شناسایی کرده و مبدل مقدار (`utcConverter`) را به صورت خودکار به آن‌ها تزریق می‌کند:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // تعریف مبدل زمان جهت بازگرداندن نوع DateTimeKind.Utc
    var utcConverter = new ValueConverter<DateTime, DateTime>(
        v => v,
        v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
    );

    // پیمایش تمام کلاس‌های موجودیت کشف‌شده توسط EF Core
    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        // پیمایش تمام پروپرتی‌های نگاشت‌شده به دیتابیس در هر کلاس
        foreach (var entityProperty in entityType.GetProperties())
        {
            // بررسی شرط نوع داده DateTime و پسوند نام Utc
            if (entityProperty.ClrType == typeof(DateTime) 
                && entityProperty.Name.EndsWith("Utc"))
            {
                entityProperty.SetValueConverter(utcConverter); // 
            }
        }
    }
}
```

##### سه سناریوی کلیدی دیگر برای خودکارسازی پیکربندی فیلدها:
1.  **پیکربندی جمعی فیلدهای قیمت (Price Precision):** تنظیم اتوماتیک مقیاس و دقت دسی‌مال (مانند `HasPrecision(9, 2)`) برای تمام پروپرتی‌هایی که نام آن‌ها شامل کلمه "Price" است.
2.  **ذخیره‌سازی بهینه آدرس‌های وب (ASCII Strings):** شناسایی پروپرتی‌های رشته‌ای با پسوند "Url" و تنظیم خودکار ویژگی `IsUnicode(false)` روی آن‌ها جهت تبدیل نوع داده به `VARCHAR` (تک بایتی اسکی) به جای `NVARCHAR` (دو بایتی یونیکد).
3.  **خودکارسازی فیلترهای پرس‌وجوی سراسری (Global Query Filters) و ایندکس‌ها:**
    *   با تعریف یک اینترفیس اختصاصی روی کلاس‌های موجودیت، می‌توان فیلترهای سراسری مانند حذف نرم (Soft Delete) یا شناسه مستأجر (UserId) را به صورت پویا به مدل‌های منطبق متصل کرد.
    *   **بهینه‌سازی خودکار عملکرد:** به دلیل اعمال فیلتر دائمی روی این ستون‌ها در پرس‌وجوها، کد خودکارساز شما می‌تواند به طور اتوماتیک برای تمامی این ستون‌ها یک ایندکس دیتابیس (Index) تعریف کند تا افت کارایی ناشی از شروط دائمی مرتفع شود.

##### قانون ارشد لغو پیکربندی‌های خودکار (Override Order):
اگر کدهای خودکارسازی جمعی در ابتدای متد `OnModelCreating` اجرا شوند، هرگونه پیکربندی دستی (اعم از ویژگی‌های کلاس یا Fluent APIهای خاص که در ادامه متد نوشته شده‌اند)، تنظیمات خودکار را بازنویسی و لغو خواهند کرد. این اولویت‌دهی، انعطاف‌پذیری لازم برای مدیریت استثناها را در اختیار معمار نرم‌افزار قرار می‌دهد.

---

### فصل ۸: پیکربندی روابط دیتابیس (Configuring Relationships)

پس از بررسی جامع پیکربندی پروپرتی‌های غیررابطه‌ای (Scalar)، مدیریت روابط بین موجودیت‌ها اساسی‌ترین بخش در طراحی مدل‌های داده در Entity Framework Core است. برای برقراری ارتباطی بی‌نقص میان دنیای شی‌گرا و دیتابیس‌های رابطه‌ای، ابتدا باید تعاریف مشترکی از مفاهیم روابط داشته باشیم تا از بروز ابهامات در فاز پیکربندی پیشرفته جلوگیری کنیم.

#### بخش ۸.۱: تعریف واژگان کلیدی در روابط (Relationship Terms)

برای درک عمیق‌تر، سناریوی رابطه بین کتاب (`Book`) و دیدگاه‌های آن (`Review`) را در نظر بگیرید. واژگان تخصصی زیر برای کالبدشکافی ساختار روابط در EF Core به کار می‌روند:

```csharp
public class Book 
{
    public int BookId { get; set; } // Principal Key
    public string Title { get; set; }
    public string UniqueISBN { get; set; } // Alternate Key
    public ICollection<Review> Reviews { get; set; } // Collection Navigation Property
}

public class Review 
{
    public int ReviewId { get; set; }
    public string Comment { get; set; }
    public int BookId { get; set; } // Foreign Key
}
```

۱. **موجودیت اصلی (Principal Entity):**
موجودیت یا کلاسی است که حاوی پروپرتی کلید اصلی (یا کلید جایگزین یکتا) است که موجودیت‌های دیگر به آن ارجاع می‌دهند. در این سناریو، کلاس `Book` موجودیت اصلی است.

۲. **کلید اصلی/مرجع (Principal Key):**
کلیدی در موجودیت اصلی است که روابط از طریق کلید خارجی به آن متصل می‌شوند . این کلید می‌تواند همان کلید اصلی جدول (`Primary Key` مانند `BookId`) یا یک کلید جایگزین یکتا (`Alternate Key` مانند `UniqueISBN`) باشد .

۳. **موجودیت وابسته (Dependent Entity):**
موجودیت یا کلاسی است که حاوی فیلد کلید خارجی (Foreign Key) جهت ارجاع به کلید مرجع در موجودیت اصلی است . در این سناریو، کلاس `Review` موجودیت وابسته به شمار می‌آید .

۴. **کلید خارجی (Foreign Key):**
پروپرتی یا ستونی در موجودیت وابسته است که مقدار کلید مرجع موجودیت اصلی را در خود ذخیره می‌کند تا پیوند مرجع (Referential Link) در سطح دیتابیس برقرار شود. در اینجا پروپرتی `BookId` در کلاس `Review` کلید خارجی است .

۵. **پروپرتی ناوبری (Navigation Property):**
پروپرتی‌هایی در کلاس‌های موجودیت هستند که به یک موجودیت منفرد (Reference Navigation) یا مجموعه‌ای از موجودیت‌ها (Collection Navigation) ارجاع می‌دهند. این پروپرتی‌ها به EF Core اجازه می‌دهند تا روابط را در حافظه لود کرده و پیوند دهد. پروپرتی `ICollection<Review> Reviews` در کلاس `Book` یک پروپرتی ناوبری مجموعه‌ای است .

۶. **رابطه اجباری (Required Relationship):**
رابطه‌ای است که در آن فیلد کلید خارجی در موجودیت وابسته **غیرقابل نول (Non-nullable)** تعریف می‌شود. این تعریف بدین معناست که موجودیت وابسته به هیچ وجه نمی‌تواند بدون وجود داشتن موجودیت اصلی ایجاد شود یا به کار خود ادامه دهد (مانند دیدگاهی که حتماً باید متعلق به یک کتاب واقعی باشد).

۷. **رابطه اختیاری (Optional Relationship):**
رابطه‌ای است که در آن فیلد کلید خارجی **نول‌پذیر (Nullable)** است. در این حالت، موجودیت وابسته می‌تواند مستقل از موجودیت اصلی وجود داشته باشد (مانند یک سطر گزارش مالی که لزوماً به مشتری خاصی متصل نیست).

---

#### بخش ۸.۲: تعیین نیازمندی به پروپرتی‌های ناوبری (What Navigational Properties Do You Need?)

در مهندسی نرم‌افزار تمیز، طراحی کلاس‌ها باید کاملاً مبتنی بر **نیازهای واقعی کسب‌وکار (Business Needs)** شکل بگیرد. یکی از اشتباهات رایج در فاز مدل‌سازی این است که توسعه‌دهندگان گمان می‌کنند هر زمان رابطه‌ای برقرار است، باید در هر دو سمت رابطه (دو سر کلاس) پروپرتی ناوبری تعریف کنند. 

رویکرد شی‌گرا و اصول Clean Code توصیه می‌کند که **صرفاً پروپرتی‌هایی را اضافه کنید که از منظر دامنه نرم‌افزار توجیه کاربردی دارند** :

*   **سمت Book به Reviews:** کلاس کتاب برای محاسبه میانگین امتیازات خود، شدیداً به لیست دیدگاه‌ها نیاز دارد؛ بنابراین وجود پروپرتی ناوبری `Reviews` در کلاس `Book` کاملاً منطقی و ضروری است .
*   **سمت Review به Book:** در کدهای برنامه و فلوهای بیزینس، هرگز نیازی به دسترسی مستقیم به اطلاعات کتاب از طریق یک دیدگاه مجزا نداریم؛ بنابراین نیازی به تعریف پروپرتی ناوبری `public Book Book { get; set; }` درون کلاس `Review` نیست .

##### مزایای محدود کردن پروپرتی‌های ناوبری (Minimizing Navigations):
۱. **کاهش پیچیدگی ذهنی و خوانایی بهتر کدهای کلاس دامنه**.
۲. **جلوگیری از اشتباه توسعه‌دهندگان جونیور** در واکشی‌های ناخواسته و دوطرفه دیتابیس (مانند لوپ‌های کوئری یا فراخوانی‌های نادرست دیتابیس).
۳. **تسهیل کپسوله‌سازی اصول DDD**.

---

#### بخش ۸.۳: رویکردهای سه‌گانه پیکربندی روابط (Configuring Relationships)

همانند فیلدهای اسکالر، روابط نیز به سه روش پیکربندی می‌شوند:
1.  **براساس کنوانسیون (By Convention):** موتور داخلی EF Core با کشف الگوهای نام‌گذاری کلاس‌ها و کلیدها، به صورت هوشمند و بدون نیاز به کدهای اضافی، روابط را حدس زده و اعمال می‌کند.
2.  **ویژگی‌ها (Data Annotations):** با استفاده از اتریبیوت‌های اختصاصی در لایه مدل (مانند `[ForeignKey]` یا `[InverseProperty]`) روابط را جهت‌دهی می‌کند.
3.  **متدهای Fluent API:** قدرتمندترین و منعتقدترین روش است که امکان پیاده‌سازی تمام جزئیات فنی از جمله روابط چند-به-چند پیچیده و رفتارهای Deletion را مهیا می‌سازد.

---

### بخش ۸.۴: پیکربندی روابط بر اساس کنوانسیون (Configuring Relationships By Convention)

**شروع فرآیند پیکربندی روابط در Entity Framework Core همواره باید با تکیه بر کنوانسیون‌های پیش‌فرض (By Convention) باشد**. موتور مدل‌سازی EF Core فوق‌العاده هوشمند است و با پیمایش کلاس‌های دامنه و تحلیل امضای پروپرتی‌ها، بخش عمده‌ای از روابط معمولی را بدون نیاز به حتی یک خط کد اضافه پیکربندی می‌کند. شناخت عمیق این قوانین به توسعه‌دهنده ارشد اجازه می‌دهد کدهای پیکربندی اضافه را به حداقل رسانده و از پیچیدگی‌های غیرضروری اجتناب کند.

---

#### ۸.۴.۱ چه چیز یک کلاس را به یک «موجودیت» تبدیل می‌کند؟ (What Makes a Class an Entity?)

برای اینکه EF Core یک کلاس معمولی .NET (موسوم به POCO) را به عنوان موجودیت (Entity) شناسایی کرده و روابط آن را کشف کند، فرآیند زیر طی می‌شود :

1.  **شناسایی نقاط ورود اصلی:** موتور مدل‌سازی ابتدا کلاس `DbContext` شما را اسکن کرده و تمام کلاس‌های جنریک تعریف‌شده در ویژگی‌های عمومی **`DbSet<T>`** را به عنوان موجودیت‌های پایه ثبت می‌کند.
2.  **اسکن بازگشتی پروپرتی‌ها و روابط متصل:** در گام بعد، تک‌تک پروپرتی‌های عمومی موجود در این کلاس‌های مدل اسکن می‌شوند. هر پروپرتی که از نوع داده‌های غیر اسکالر (Scalar نیستند، مانند کلاس‌های سفارشی یا مجموعه‌های پیاده‌سازی‌کننده `IEnumerable<T>` به جز رشته‌ها) باشد، توسط EF Core به عنوان **پروپرتی ناوبری (Navigation Property)** در نظر گرفته شده و کلاس متناظر با آن نیز برای مدل‌سازی اسکن می‌شود.
3.  **تست کلید اصلی:** تمام این کلاس‌ها باید واجد کلید اصلی (Primary Key) باشند. در غیر این صورت، یا باید صریحاً به عنوان کلاس فاقد کلید (`[Keyless]` یا `HasNoKey()`) پیکربندی شده باشند، در غیر این صورت EF Core در زمان بالا آمدن برنامه یک خطای مدل‌سازی صادر می‌کند.

---

#### ۸.۴.۲ انواع پیکربندی کنوانسیون بر اساس ساختار ناوبری

پیکربندی خودکار روابط بر اساس تعداد دو سر پروپرتی‌های ناوبری در کلاس‌ها رفتار متفاوتی نشان می‌دهد:

*   **روابط کاملاً تعریف‌شده (Fully Defined):** اگر پروپرتی‌های ناوبری در هر دو سمت رابطه (کلاس مبدا و کلاس مقصد) وجود داشته باشند، EF Core به صورت خودکار چندوجهی بودن رابطه (یک‌به‌یک یا یک‌به‌چند) را کشف و پیکربندی می‌کند.
*   **روابط یک‌طرفه (Single Navigation):** اگر پروپرتی ناوبری صرفاً در یک سمت رابطه تعریف شده باشد (برای نمونه کلاس `Book` لیستی از `Review`ها را دارد اما کلاس `Review` ارجاعی به `Book` ندارد)، **EF Core به طور پیش‌فرض فرض را بر این می‌گذارد که رابطه از نوع یک‌به‌چند (One-to-Many) است**.

---

#### ۸.۴.۳ کشف کلیدهای خارجی بر اساس کنوانسیون (How EF Core finds Foreign Keys)

هنگامی که EF Core وجود یک رابطه را تشخیص می‌دهد، برای اعمال یکپارچگی داده‌ها در بانک اطلاعاتی به یک کلید خارجی (Foreign Key) نیاز دارد. این کلید خارجی باید از نظر نوع داده با کلید اصلی مرجع مطابقت داشته باشد. کنوانسیون نام‌گذاری پیش‌فرض برای تطبیق و شناسایی خودکار کلید خارجی سه الگو ارائه می‌دهد (با فرض اینکه کلاس وابسته `Review` به کلاس اصلی `Book` با کلید اصلی `BookId` متصل است):

*   **الگوی اول (معمول‌ترین الگو):** نام پروپرتی با نام کلید اصلی مرجع یکسان باشد (`BookId`).
*   **الگوی دوم:** ترکیب نام کلاس اصلی با نام کلید اصلی مرجع؛ این الگو برای زمانی که کلاس اصلی از نام کوتاه `Id` استفاده می‌کند مناسب است (`BookBookId` یا `BookId`).
*   **الگوی سوم:** ترکیب نام پروپرتی ناوبری با نام کلید اصلی مرجع؛ برای مثال اگر در کلاس `Review` پروپرتی ناوبری را `public Book MyBook { get; set; }` نام‌گذاری کرده باشید، فیلد `MyBookBookId` به عنوان کلید خارجی شناخته می‌شود.

##### کالبدشکافی سناریوی روابط خودارجاعی (Hierarchical Relationships)
این الگوهای سه‌گانه به ویژه الگوی سوم در ساختارهای درختی بسیار کارآمد هستند. برای مثال در کلاس `Employee` که فیلد کلید اصلی آن `EmployeeId` است، برای اتصال کارمند به مدیر خود (که او هم یک کارمند است)، نمی‌توان فیلدی هم‌نام با کلید اصلی تعریف کرد. در اینجا با استفاده از الگوی سوم، پروپرتی ناوبری را `Manager` و فیلد کلید خارجی را **`ManagerEmployeeId`** نام‌گذاری می‌کنیم تا EF Core بدون کد اضافی ارتباط را کشف کند:

```csharp
public class Employee
{
    public int EmployeeId { get; set; } // کلید اصلی
    public string Name { get; set; }

    public int? ManagerEmployeeId { get; set; } // کلید خارجی خودکار طبق الگوی سوم کنوانسیون
    public Employee Manager { get; set; } // پروپرتی ناوبری مرجع
}
```

---

#### ۸.۴.۴ نول‌پذیری کلید خارجی و اثر بیواسطه آن بر رفتار حذف (Nullability & Delete Behavior)

نوعِ تعریف نول‌پذیری فیلد کلید خارجی در کلاس مدل دات‌نت، مستقیماً تبیین‌کننده منطق رابطه در لایه دیتابیس است:

۱.  **روابط اجباری (Required Relationships):**
    اگر فیلد کلید خارجی از نوع غیرقابل نول (مانند `int` یا `Guid`) تعریف شود، رابطه اجباری است و موجودیت وابسته نمی‌تواند بدون وجود موجودیت اصلی زنده بماند.
    *   **رفتار حذف پیش‌فرض:** EF Core به طور خودکار رفتار حذف آبشاری **`Cascade Delete`** را روی این رابطه در سطح بانک اطلاعاتی پیکربندی می‌کند. با حذف موجودیت اصلی (والد)، تمام موجودیت‌های وابسته (فرزند) نیز به طور فیزیکی حذف می‌شوند.

۲.  **روابط اختیاری (Optional Relationships):**
    اگر فیلد کلید خارجی نول‌پذیر (مانند `int?` یا `Nullable<int>`) باشد، رابطه اختیاری است.
    *   **رفتار حذف پیش‌فرض:** EF Core رفتار حذف را روی **`ClientSetNull`** تنظیم می‌کند.
    *   *رفتار در حافظه (Tracked):* اگر موجودیت‌های وابسته لود شده و تحت ردیابی باشند، با حذف والد، مقدار کلید خارجی فرزندان در حافظه به `null` تغییر می‌یابد.
    *   *تله عملکردی برای رکوردهای لودنشده (Untracked):* اگر فرزندان در حافظه لود نشده باشند، قانون دیتابیس وارد عمل می‌شود. به طور پیش‌فرض، EF Core دیتابیس را روی محدودیت `NO ACTION` (در SQL Server) پیکربندی می‌کند که باعث می‌شود در صورت تلاش برای حذف والد بدون لود کردن وابسته‌ها، بانک اطلاعاتی **خطای نقض یکپارچگی مرجع (Foreign Key Constraint Exception) صادر کرده و تراکنش را با شکست مواجه کند** .

---

#### ۸.۴.۵ عواقب تعریف نکردن فیلد کلید فیزیکی در کلاس (Shadow Foreign Keys)

در راستای حفظ پاکیزگی مدل‌های دامنه، برخی توسعه‌دهندگان تمایل دارند فیلد کلید خارجی (مثلاً `BookId`) را در کلاس وابسته (مثلاً `Review`) تعریف نکنند و صرفاً به پروپرتی ناوبری اکتفا کنند. 

در این سناریو، EF Core با موفقیت رابطه را ایجاد می‌کند، اما کلید خارجی را در لایه بانک اطلاعاتی به عنوان یک **ویژگی سایه (Shadow Property)** پیاده‌سازی و مدیریت می‌کند.

##### قوانین و محدودیت‌های Shadow Foreign Keys:
*   **نام‌گذاری پیش‌فرض ستون سایه:** بر اساس الگوی `<NavigationPropertyName><PrincipalPrimaryKeyName>` یا به شکل ساده‌تر `<ClassName><PrimaryKeyName>` (مثلاً `BookId` یا `CustomerId`) نام‌گذاری فیزیکی خواهد شد .
*   **نول‌پذیری پیش‌فرض:** کلیدهای خارجی که به عنوان Shadow Property ایجاد می‌شوند **به طور پیش‌فرض همواره نول‌پذیر (Nullable) هستند** (حتی اگر منطقاً رابطه اجباری باشد). اگر نیاز دارید این رابطه را اجباری کنید، باید صریحاً با متد `.IsRequired()` در Fluent API نول‌پذیری ستون سایه را بردارید.
*   **محدودیت جدی در روابط یک‌به‌یک:** کنوانسیون پیش‌فرض EF Core **به هیچ وجه قادر به حدس زدن و تولید ستون کلید خارجی سایه در روابط یک‌به‌یک نیست**. در روابط یک‌به‌یک، تعریف فیزیکی کلید خارجی در کلاس وابسته یا پیکربندی صریح آن در Fluent API برای جلوگیری از بروز خطای زمان پیکربندی مدل الزامی است.

---

#### ۸.۴.۶ چه زمانی کنوانسیون‌های پیش‌فرض روابط شکست می‌خورند؟ (When Convention Fails)

تحت شرایط فنی زیر، کنوانسیون‌های پیش‌فرض قادر به مدیریت پیکربندی نبوده و استفاده از Data Annotations یا Fluent API اجباری است:

1.  وجود کلیدهای خارجی ترکیبی (Composite Foreign Keys).
2.  روابط یک‌به‌یک (One-to-One) که پروپرتی‌های ناوبری آن دوطرفه نیستند.
3.  نیاز به تغییر و بازنویسی رفتارهای حذف پیش‌فرض (مانند تغییر از `Cascade` به `Restrict`).
4.  وجود دو پروپرتی ناوبری مجزا که هر دو به یک کلاس مشترک اشاره دارند (مثال کتابدار و قرض‌گیرنده که هر دو کلاس `Person` هستند).
5.  الزامات خاص برای تعریف دستی قیود بانک اطلاعاتی (Database Constraints).

---

### بخش ۸.۵: پیکربندی روابط با استفاده از ویژگی‌ها (Data Annotations)

در حالی که بخش عمده‌ای از تنظیمات پیشرفته روابط در لایه **Fluent API** انجام می‌شود، فریم‌ورک EF Core کماکان از دو ویژگی (Data Annotations) بسیار کلیدی برای مدیریت و جهت‌دهی به روابط پشتیبانی می‌کند. این دو اتریبیوت عبارتند از: **`[ForeignKey]`** و **`[InverseProperty]`**.

---

#### ۸.۵.۱ ویژگی `[ForeignKey]` (نگاشت صریح کلید خارجی)

از ویژگی **`[ForeignKey]`** زمانی استفاده می‌شود که نام‌گذاری کلیدهای خارجی با الگوهای سه‌گانه کنوانسیون‌های پیش‌فرض مطابقت نداشته باشد، یا معمار نرم‌افزار تمایل داشته باشد جهت افزایش خوانایی کد، کلیدهای خارجی را صریحاً مستند کند .

##### نحوه اعمال و پیاده‌سازی:
این ویژگی تک‌پارامتری است و رشته‌ای حاوی نام پروپرتی متناظر را دریافت می‌کند. شما می‌توانید این ویژگی را به دو روش پیاده‌سازی کنید:

۱. **اعمال روی پروپرتی ناوبری (Navigation Property):** ارجاع به فیلد کلید خارجی فیزیکی.
۲. **اعمال روی فیلد کلید خارجی (Foreign Key Property):** ارجاع به پروپرتی ناوبری متناظر.

##### نمونه کد پیاده‌سازی کلید خارجی بر روی رابطه خودارجاعی (`Listing 8.3`):

```csharp
using System.ComponentModel.DataAnnotations.Schema;

public class Employee
{
    public int EmployeeId { get; set; } // کلید اصلی
    public string Name { get; set; }

    public int? ManagerId { get; set; } // کلید خارجی فیزیکی در جدول دیتابیس

    // اعمال ویژگی روی پروپرتی ناوبری برای مشخص کردن کلید خارجی متناظر
    [ForeignKey(nameof(ManagerId))]
    public Employee Manager { get; set; } // پروپرتی ناوبری مرجع
}
```

> **نکته مهندسی شی‌گرا (OOP Tip):** همواره برای مقداردهی پارامترهای این ویژگی از کلمه کلیدی **`nameof(...)`** استفاده کنید تا از بروز خطاهای ناشی از تغییر نام پروپرتی‌ها در زمان بازنویسی کدهای سیستم (Refactoring) جلوگیری شود.
> 
> **کلیدهای خارجی ترکیبی (Composite FKs):** در صورتی که کلید خارجی ترکیبی و شامل چند ستون باشد، نام پروپرتی‌ها را به صورت کاملاً ویرگول‌خورده درون ویژگی پاس دهید؛ مانند: `[ForeignKey("Property1, Property2")]`.

---

#### ۸.۵.۲ ویژگی `[InverseProperty]` (حل تداخل در روابط موازی)

این ویژگی یک ابزار تخصصی و بسیار حیاتی برای سناریوهایی است که در آن **دو یا چند پروپرتی ناوبری مختلف در یک کلاس، همگی به یک کلاس مقصد مشترک اشاره می‌کنند**. در این شرایط، به دلیل موازی بودن روابط، موتور مدل‌سازی EF Core نمی‌تواند به طور خودکار جفت‌شدن کلیدهای خارجی و پروپرتی‌های ناوبری را تشخیص دهد و در صورت عدم پیکربندی صریح، در زمان راه‌اندازی برنامه (مدل‌سازی فاز اجرا) با صدور خطای بحرانی متوقف خواهد شد .

##### سناریوی عملی: سیستم امانت‌دهی کتابخانه (`Listing 8.4` & `Listing 8.5`)
فرض کنید در موجودیت کتاب (`LibraryBook`)، دو رابطه مجزا با کلاس `Person` داریم؛ یک رابطه برای کتابداری که کتاب را ثبت کرده (`Librarian`) و یک رابطه اختیاری برای شخصی که کتاب را به امانت برده است (`OnLoanTo`). در سمت کلاس `Person` نیز دو لیست ناوبری مجزا برای ردیابی این روابط تعریف شده است:

```csharp
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

public class LibraryBook
{
    public int LibraryBookId { get; set; }
    public string Title { get; set; }

    public int LibrarianId { get; set; }
    public Person Librarian { get; set; } // رابطه موازی اول

    public int? OnLoanToId { get; set; }
    public Person OnLoanTo { get; set; } // رابطه موازی دوم
}

public class Person
{
    public int PersonId { get; set; }
    public string Name { get; set; }

    // اتصال صریح لیست کتاب‌های ثبت‌شده به پروپرتی ناوبری Librarian در کلاس مقصد
    [InverseProperty(nameof(LibraryBook.Librarian))]
    public ICollection<LibraryBook> LibrarianBooks { get; set; }

    // اتصال صریح لیست کتاب‌های امانت‌گرفته‌شده به پروپرتی ناوبری OnLoanTo در کلاس مقصد
    [InverseProperty(nameof(LibraryBook.OnLoanTo))]
    public ICollection<LibraryBook> BooksBorrowedByMe { get; set; }
}
```

با اعمال ویژگی **`[InverseProperty]`**، خطوط ارتباطی روابط موازی به طور کامل برای Change Tracker فریم‌ورک EF Core تبیین شده و فرآیند Relational Fixup به درستی انجام خواهد شد .

---

### بخش ۸.۶: دستورات پیکربندی روابط در Fluent API

پیکربندی روابط از طریق Fluent API پایدارترین و انعطاف‌پذیرترین روش در مدل‌سازی EF Core است. تمام دستورات پیکربندی روابط در Fluent API از یک الگوی زنجیره‌ای مشخص پیروی می‌کنند که در آن ابتدا نوع ارتباط موجودیت جاری (مبدا) مشخص شده و سپس ارتباط موجودیت متناظر (مقصد) تعریف می‌شود:

\\[\text{Entity(A)} \rightarrow \text{HasOne/HasMany} \rightarrow \text{WithOne/WithMany} \rightarrow \text{Additional Configurations (FK, Delete Behavior, etc.)}\\]

---

#### ۸.۶.۱ ایجاد رابطه یک‌به‌یک (One-to-One Relationship)

طراحی روابط یک‌به‌یک (که در دنیای واقعی معمولاً به صورت یک‌به‌صفر‌یا‌یک یا One-to-Zero-or-One پیاده‌سازی می‌شوند) به دلیل تفاوت در نحوه نگاشت کلیدهای خارجی پیچیدگی‌های خاص خود را دارد. سناریوی کلاس شرکت‌کننده (`Attendee`) و بلیط (`Ticket`) را در نظر بگیرید. سه ساختار فیزیکی مجزا برای پیاده‌سازی این رابطه در دیتابیس رابطه‌ای وجود دارد:

##### گزینه ۱: رویکرد استاندارد EF Core (موجودیت وابسته حاوی کلید خارجی موجودیت اصلی)
در این ساختار، کلاس وابسته (`Attendee`) کلید خارجی موجودیت اصلی یعنی (`TicketId`) را در خود نگهداری می‌کند.
*   **تحلیل معماری:** اگر فیلد کلید خارجی غیرقابل نول (Non-nullable) تعریف شود، حضور بلیط برای هر شرکت‌کننده اجباری (`IsRequired`) خواهد بود. از آنجا که `Attendee` بخش وابسته رابطه است، با حذف آن، شیء `Ticket` در دیتابیس باقی می‌ماند (چون `Ticket` والد یا Principal است). 

```csharp
modelBuilder.Entity<Attendee>()
            .HasOne(a => a.Ticket)
            .WithOne(t => t.Attendee)
            .HasForeignKey<Attendee>(a => a.TicketId)
            .IsRequired(); // اجباری کردن وجود بلیط برای هر شرکت‌کننده
```

##### گزینه ۲: معکوس کردن والد و فرزند (موجودیت اصلی حاوی کلید خارجی موجودیت وابسته)
در این حالت، فیلد کلید خارجی در جدول وابسته واقعی یعنی `Ticket` قرار می‌گیرد (`AttendeeId`).
*   **تحلیل معماری:** نقش والد و فرزند فیزیکی تغییر می‌کند. اکنون شرکت‌کننده (`Attendee`) به عنوان موجودیت اصلی می‌تواند بدون بلیط وجود داشته باشد، اما بلیط (`Ticket`) به عنوان موجودیت وابسته نمی‌تواند بدون انتساب به یک شرکت‌کننده ثبت شود.

```csharp
modelBuilder.Entity<Attendee>()
            .HasOne(a => a.Ticket)
            .WithOne(t => t.Attendee)
            .HasForeignKey<Ticket>(t => t.AttendeeId); // تعیین تیکت به عنوان موجودیت وابسته
```

##### گزینه ۳: ادغام کلید اصلی و خارجی (Shared Primary Key Association)
کارآمدترین روش برای پیاده‌سازی روابط اختیاری (One-to-Zero-or-One) این است که موجودیت وابسته (`Ticket`) فاقد یک کلید اصلی مجزا مانند `TicketId` باشد و مستقیماً از کلید اصلی موجودیت اصلی (`AttendeeId`) هم به عنوان کلید اصلی (Primary Key) و هم به عنوان کلید خارجی (Foreign Key) استفاده کند.
*   **مزیت عملکردی:** حذف یک ستون کلید اصلی اضافه در سطح دیتابیس، کاهش حجم جدول و بهبود کارایی ایندکس‌ها.

---

#### ۸.۶.۲ ایجاد رابطه یک‌به‌چند (One-to-Many Relationship)

در روابط یک‌به‌چند، فیلد کلید خارجی همواره در جدول سمت «چند» (وابسته) قرار می‌گیرد. سناریوی رابطه یک کتاب (`Book`) با صفر یا چند دیدگاه (`Reviews`) را در نظر بگیرید که در آن کلاس `Review` فاقد پروپرتی ناوبری مرجع به سمت کتاب است (رابطه یک‌طرفه):

```csharp
modelBuilder.Entity<Book>()
            .HasMany(b => b.Reviews)
            .WithOne() // به دلیل عدم وجود پروپرتی ناوبری در کلاس Review خالی رها می‌شود
            .HasForeignKey(r => r.BookId);
```

##### تفاوت کلیدی عملکردی در نوع کلکسیون‌ها (`ICollection<T>` vs `HashSet<T>`)
در تعریف پروپرتی ناوبری مجموعه‌ای (Collection Navigation) امکان استفاده از تایپ‌های مختلف وجود دارد:
*   **`HashSet<T>`:** از منظر پرفورمنس، EF Core به شدت استفاده از `HashSet` را برای مجموعه‌ها توصیه می‌کند زیرا سرعت عملیات‌های داخلی Change Tracker و فرآیند اصلاح روابط (Relational Fixup) را افزایش می‌دهد. اما `HashSet` تضمینی برای حفظ ترتیب آیتم‌ها ارائه نمی‌دهد.
*   **`ICollection<T>`:** اگر در متد لودینگ خود (مانند `Include`) نیاز به فیلتر کردن و مرتب‌سازی داده‌های وابسته دارید (مثلاً لود کردن صرفاً کامنت‌های ۵ ستاره به ترتیب تاریخ ثبت)، استفاده از `ICollection` ترجیح داده می‌شود، زیرا ترتیب اعمال شده در کوئری LINQ را در حافظه حفظ می‌کند.

---

#### ۸.۶.۳ ایجاد رابطه چند‌به‌چند (Many-to-Many Relationship)

طراحی روابط چندبه‌چند فیزیکی در پایگاه داده‌های رابطه‌ای صرفاً از طریق یک جدول واسط (Linking Table) حاوی دو کلید خارجی کلیدهای اصلی جداول طرفین میسر است. EF Core برای نگاشت این سناریو دو استراتژی مجزا ارائه می‌دهد:

##### استراتژی اول: استفاده از کلاس واسط صریح (Explicit Linking Entity)
اگر جدول واسط شما علاوه بر کلیدهای خارجی، حاوی داده‌های بیزینسی دیگری نیز باشد (مانند جدول `BookAuthor` که فیلد `Order` را برای نگهداری ترتیب نام نویسندگان ذخیره می‌کند)، باید کلاس نگاشت واسط را به صورت صریح طراحی کنید.

*   در این حالت، رابطه چند‌به‌چند عملاً به دو رابطه یک‌به‌چند متصل به کلاس واسط تبدیل می‌شود.
*   تعریف یک کلید ترکیبی (Composite Key) در کلاس واسط با استفاده از متد `.HasKey` الزامی است.

```csharp
// پیکربندی کلید اصلی ترکیبی جدول واسط
modelBuilder.Entity<BookAuthor>()
            .HasKey(ba => new { ba.BookId, ba.AuthorId });

// پیکربندی روابط یک‌به‌چند به صورت صریح (اختیاری، در صورت انطباق با کنوانسیون)
modelBuilder.Entity<BookAuthor>()
            .HasOne(ba => ba.Book)
            .WithMany(b => b.AuthorsLink)
            .HasForeignKey(ba => ba.BookId);

modelBuilder.Entity<BookAuthor>()
            .HasOne(ba => ba.Author)
            .WithMany(a => a.BooksLink)
            .HasForeignKey(ba => ba.AuthorId);
```

##### استراتژی دوم: رابطه چند‌به‌چند مستقیم (Direct Many-to-Many) - معرفی شده در EF Core 5
اگر جدول واسط صرفاً حاوی دو کلید خارجی طرفین باشد و هیچ فیلد اطلاعاتی دیگری نداشته باشد (مانند رابطه `Book` و تگ‌های موضوعی `Tag` از طریق جدول واسط پنهان `BookTag`)، نیازی به ساخت کلاس فیزیکی واسط در سی‌شارپ ندارید. 

*   شما مستقیماً کلکسیونی از طرف مقابل را در هر کلاس تعریف می‌کنید (`ICollection<Tag>` در کتاب و `ICollection<Book>` در تگ).
*   موتور EF Core به صورت خودکار جدول واسط فیزیکی را در دیتابیس ساخته و با مفهوم کیف ویژگی‌های مشترک (Property Bag) آن را مدیریت می‌کند.
*   **مزیت تمیزی کد:** واکشی موجودیت‌های طرف دوم نیازی به زنجیره‌سازی متدهای `.ThenInclude` ندارد و با یک `.Include` ساده به طور مستقیم انجام می‌شود.

در صورت تمایل به سفارش‌سازی نام‌گذاری فیزیکی این جدول واسط خودکارساز، می‌توانید از متد **`UsingEntity`** استفاده کنید:

```csharp
modelBuilder.Entity<Book>()
            .HasMany(b => b.Tags)
            .WithMany(t => t.Books)
            .UsingEntity(j => j.ToTable("BookTag")); // سفارشی‌سازی نام جدول واسط پنهان دیتابیس
```

---

### بخش ۸.۷: کنترل مستقیم روی لود و به‌روزرسانی کلکسیون‌های ناوبری (Controlling Updates to Collection Navigations)

در مهندسی نرم‌افزار مدرن و پیاده‌سازی الگوهای **طراحی قلمرومحور (DDD)**، یکی از اصول کلیدی، حفظ یکپارچگی حالت موجودیت‌ها از طریق کپسوله‌سازی (Encapsulation) است . در روابط یک‌به‌یک، شما می‌توانید با `private` کردن متد Setter جلوی تغییر ناخواسته رابط ناوبری را از بیرون کلاس بگیرید. اما در روابط یک‌به‌چند (مانند موجودیت `Book` که دارای مجموعه‌ای از `Review`ها است)، این تکنیک به تنهایی کارساز نیست؛ زیرا نوع‌های کلکسیونی استاندارد (مانند `ICollection<T>` یا `List<T>`) همچنان متدهای عمومی مانند `Add` و `Remove` را در اختیار کدهای بیرونی قرار می‌دهند و به هر توسعه‌دهنده‌ای اجازه می‌دهند مستقیماً آیتم‌ها را دستکاری کند.

برای حل این معضل معماری و کنترل ۱۰۰ درصدی روی کلکسیون‌های ناوبری، باید از ترکیب **فیلدهای پشتیبان (Backing Fields)** و کلکسیون‌های فقط‌خواندنی استفاده کنیم.

---

#### چرا باید دسترسی به کلکسیون‌های ناوبری را کنترل کنیم؟

کنترل و فیلتر کردن تغییرات روی کلکسیون‌ها مزایای مهمی در معماری نرم‌افزار دارد:
1. **اجرای قواعد منطق کسب‌وکار (Business Rules):** به عنوان مثال، ممانعت از افزودن بیش از ده آیتم به کلکسیون یا پرتاب استثنا در صورت نقض شرایط خاص.
2. **به‌روزرسانی داده‌های پیش‌محاسبه‌شده (Local Cached Values):** برای مثال، محاسبه و به‌روزرسانی آنی میانگین امتیازات کتاب (`ReviewsAverageVotes`) در داخل کلاس به محض اضافه یا حذف شدن یک دیدگاه جدید، بدون نیاز به کوئری‌های سنگین دیتابیس .
3. **انطباق کامل با اصول DDD:** تمامی تغییرات حالت در مدل باید صرفاً از طریق متدهای صریح و تعریف‌شده در ریشه Aggregate (مانند `AddReview` یا `RemoveReview`) انجام شوند.

---

#### پیاده‌سازی کلکسیون ناوبری کپسوله‌شده (`Listing 8.8`)

در کد زیر، فیلد خصوصی `_reviews` کلکسیون واقعی را در خود نگه می‌دارد. پروپرتی عمومی `Reviews` صرفاً یک نمای فقط‌خواندنی (`IEnumerable<Review>`) به بیرون ارائه می‌دهد تا کدهای خارجی نتوانند متد `Add` را روی آن فراخوانی کنند :

```csharp
public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; }
    
    // فیلد محاسباتی کش‌شده برای ذخیره فیزیکی در دیتابیس
    public double? ReviewsAverageVotes { get; private set; } // 

    // ۱. تعریف فیلد خصوصی پشتیبان برای نگهداری دیدگاه‌ها
    private List<Review> _reviews; // 

    // ۲. ارائه کلکسیون فقط‌خواندنی به لایه نرم‌افزار برای ممانعت از تغییر مستقیم
    public IEnumerable<Review> Reviews => _reviews?.ToList(); // 

    // ۳. متد اختصاصی دامنه برای افزودن دیدگاه جدید همراه با به‌روزرسانی فیلد محاسباتی
    public void AddReview(Review review)
    {
        if (_reviews == null)
            throw new InvalidOperationException("کلکسیون Reviews باید ابتدا لود شده باشد."); // 

        _reviews.Add(review); // 
        
        // محاسبه مجدد فیلد کش‌شده
        ReviewsAverageVotes = _reviews.Average(x => x.NumStars); // 
    }

    // ۴. متد اختصاصی دامنه برای حذف دیدگاه همراه با محاسبه مجدد فیلد محاسباتی
    public void RemoveReview(Review review)
    {
        _reviews.Remove(review); // 
        
        // محاسبه مجدد فیلد محاسباتی یا نول کردن آن در صورت خالی بودن کلکسیون
        ReviewsAverageVotes = _reviews.Any() 
            ? _reviews.Average(x => x.NumStars) 
            : (double?)null; // 
    }
}
```

---

#### نحوه نگاشت و پیکربندی در EF Core

بزرگ‌ترین مزیت این پیاده‌سازی این است که **نیازی به نوشتن تنظیمات اضافی در Fluent API ندارید**. 
* **کشف خودکار بر اساس کنوانسیون:** از آنجا که فیلد خصوصی `_reviews` با پسوند پروپرتی عمومی `Reviews` هم‌خوانی دارد، EF Core طبق کنوانسیون‌های پیش‌فرض ارتباط بین آن‌ها را کشف می‌کند.
* **رفتار پیش‌فرض ردیاب تغییرات:** زمان لود کردن موجودیت کتاب از دیتابیس، EF Core به طور خودکار داده‌ها را مستقیماً درون فیلد خصوصی `_reviews` لود می‌کند و پروپرتی `Reviews` را نادیده می‌گیرد. زمان ذخیره‌سازی (`SaveChanges`) نیز تغییرات اعمال‌شده در فیلد خصوصی `_reviews` شناسایی شده و در دیتابیس اعمال می‌شوند.

---

### بخش ۸.۸: متدهای پیشرفته پیکربندی روابط در Fluent API

در سناریوهای پیچیده مهندسی نرم‌افزار، تنظیمات پیش‌فرض کنوانسیون‌ها برای نهایی‌سازی رفتار روابط در دیتابیس رابطه‌ای کافی نیستند. Fluent API مجموعه‌ای از متدهای تخصصی را برای اعمال کنترل دقیق روی قیود رابطه (Constraints) ارائه می‌دهد. در این بخش، چهار متد کلیدی را کالبدشکافی خواهیم کرد: **`OnDelete`**، **`IsRequired`**، **`HasPrincipalKey`** و **`HasConstraintName`** .

---

#### ۸.۸.۱ متد `OnDelete` (بازتعریف رفتار حذف در روابط)

یکی از مهم‌ترین بخش‌های کنترل جامع روابط، مدیریت رفتار دیتابیس در زمان حذف موجودیت اصلی (Principal Entity) است. نوع رفتار حذف آبشاری یا منطقی به واسطه این متد زنجیره‌ای تعریف می‌شود.

##### جدول تحلیل رفتارهای حذف (Table 8.1):
EF Core پنج رفتار اصلی برای حذف ارائه می‌دهد که هر کدام تأثیر فیزیکی مشخصی روی موجودیت وابسته (Dependent) دارند:

| نام رفتار حذف | تأثیر بر موجودیت وابسته در حافظه (Tracked) | تأثیر فیزیکی روی دیتابیس (SQL DDL) | رفتار پیش‌فرض برای |
| :--- | :--- | :--- | :--- |
| **`Cascade`** | موجودیت‌های وابسته لود شده در حافظه حذف می‌شوند. | دستور فیزیکی `ON DELETE CASCADE` صادر شده و تمام سطرهای فرزند حذف می‌شوند . | روابط اجباری (Required) |
| **`Restrict`** | هیچ تغییری روی وابسته‌ها اعمال نمی‌شود. | دیتابیس مانع حذف والد می‌شود (در صورت وجود فرزند). | - |
| **`SetNull`** | فیلد کلید خارجی به `null` تغییر می‌یابد. | دستور فیزیکی `ON DELETE SET NULL` صادر می‌شود. | - |
| **`ClientSetNull`** | فیلد کلید خارجی وابسته‌های لود شده در کانتکست به `null` مجهز می‌شود. | در بانک اطلاعاتی قید `ON DELETE NO ACTION` اعمال می‌شود. | روابط اختیاری (Optional) |
| **`ClientCascade`** | موجودیت‌های وابسته لود شده در حافظه حذف می‌شوند. | در دیتابیس به صورت `ON DELETE NO ACTION` نگاشت می‌شود. | - |

##### حل مشکل وابسته‌های لود نشده و گسل مسیرهای دایره‌ای (Cyclic Delete Paths)
در موتورهای دیتابیسی مانند SQL Server، اگر روابط دایره‌ای (Cyclic) یا چندگانه موازی میان جداول برقرار باشد، اعمال قیود فیزیکی `CASCADE` یا `SET NULL` منجر به بروز خطای سیستمی زمان مهاجرت (Migration Error) می‌شود .
*   **مزیت لایه کلاینت (`ClientSetNull` / `ClientCascade`):** برای جلوگیری از این قفل شدن دیتابیس، EF Core رفتارهای مبتنی بر کلاینت را معرفی کرده است . در این حالت، دیتابیس روی `NO ACTION` تنظیم می‌شود و فریم‌ورک تلاش می‌کند فرآیند آبشاری یا نول‌سازی را درون کدهای سی‌شارپ انجام دهد .
*   **⚠️ تله عملکردی (Trap):** این مکانیزم کلاینت‌محور **صرفاً زمانی کار می‌کند که موجودیت‌های وابسته از قبل در حافظه کانتکست لود (`Include`) شده باشند** . اگر سطر والد را بدون واکشی سطر فرزند حذف کنید، تراکنش با خطای نقض یکپارچگی مرجع دیتابیس شکست می‌خورد:

```csharp
// نمونه صحیح حذف والد با رفتارهای کلاینت‌محور:
var book = context.Books
                  .Include(b => b.Reviews) // واکشی الزامی فرزندان برای فعال‌سازی کلاینت‌تراکینگ
                  .Single(b => b.BookId == id);
context.Remove(book);
context.SaveChanges(); // فیلد کلید خارجی کامنت‌های لود شده به طور خودکار null می‌شود
```

---

#### ۸.۸.۲ متد `IsRequired` (تعیین نول‌پذیری کلید خارجی به صورت صریح)

در حالی که نول‌پذیری فیلد کلید خارجی بر اساس نوع داده آن در دات‌نت کشف می‌شود، استفاده از متد **`.IsRequired(bool)`** برای مواردی چون **ویژگی‌های سایه (Shadow Properties)** که فیلد فیزیکی در کلاس ندارند حیاتی است . به صورت پیش‌فرض، کلیدهای خارجی ایجاد شده به عنوان Shadow Property همواره نول‌پذیر هستند. با اعمال این متد، ستون فیزیکی به `NOT NULL` تغییر یافته و رابطه از اختیاری به اجباری ارتقا می‌یابد:

```csharp
modelBuilder.Entity<Attendee>()
            .HasOne(a => a.RequiredReference)
            .WithOne()
            .HasForeignKey<Attendee>("RequiredShadowFKId") // تعریف کلید خارجی سایه
            .IsRequired(); // غیرقابل نول کردن فیزیکی کلید خارجی سایه
```

---

#### ۸.۸.۳ متد `HasPrincipalKey` (اتصال کلید خارجی به کلیدهای جایگزین یکتا)

بر اساس معماری استاندارد، کلیدهای خارجی همواره به کلید اصلی (Primary Key) جدول والد متصل می‌شوند . با این حال، در دیتابیس‌های پیشرفته، سناریوهایی وجود دارند که نیاز است رابطه به ستون غیراصلی اما یکتای دیگری (Alternate Key) متصل گردد (مانند شماره ملی یا آدرس ایمیل منحصربه‌فرد) .

##### سناریوی پیاده‌سازی کلید جایگزین (`Listing 8.13` & `Listing 8.14`):
در این سناریو، کلاس `Person` دارای کلید اصلی عددی `PersonId` است، اما رابطه با اطلاعات تماس (`ContactInfo`) بر اساس شناسه منحصربه‌فرد کاربری (`UserId`) که یک `Guid` است برقرار می‌شود:

```csharp
public class Person
{
    public int PersonId { get; set; } // کلید اصلی فیزیکی
    public string Name { get; set; }
    public Guid UserId { get; set; } // قرار است کلید جایگزین رابطه شود
    public ContactInfo Contact { get; set; }
}

public class ContactInfo
{
    public int ContactInfoId { get; set; }
    public string EmailAddress { get; set; }
    public Guid UserIdentifier { get; set; } // کلید خارجی متصل به UserId
}
```

##### پیکربندی کلید جایگزین با Fluent API (`Figure 8.11`):
با استفاده از متد **`HasPrincipalKey`**، ستون `UserId` به عنوان کلید مرجع رابطه ثبت شده و یک ایندکس یکتا (Unique Constraint) به طور خودکار روی آن در دیتابیس ایجاد می‌شود:

```csharp
modelBuilder.Entity<Person>()
            .HasOne(p => p.Contact)
            .WithOne()
            .HasForeignKey<ContactInfo>(c => c.UserIdentifier) // کلید خارجی در جدول فرزند
            .HasPrincipalKey<Person>(p => p.UserId); // تنظیم ستون مرجع غیرکلید اصلی در جدول والد
```

---

#### ۸.۸.۴ متدهای کم‌کاربردتر در Fluent API روابط

۱. **`HasConstraintName("FK_Custom_Name")`:**
نام فیزیکی قید کلید خارجی (Foreign Key Constraint) را در دیتابیس تغییر می‌دهد. این ابزار برای تطبیق با کدهای مدیریت استثنای بانک اطلاعاتی کاربرد دارد.

۲. **پروپرتی `MetaData`:**
دسترسی کامل به جزئیات ساختاری و فیزیکی روابط را زمان مدل‌سازی فراهم می‌کند.

---

### بخش ۸.۹: روش‌های جایگزین نگاشت موجودیت‌ها به جداول بانک اطلاعاتی (Alternative Ways of Mapping Entities)

در طراحی کلاس‌های معماری نرم‌افزار، همواره رابطه یک‌به‌یک فیزیکی بین یک کلاس سی‌شارپ و یک جدول دیتابیس برقرار نیست . گاهی برای بهبود خوانایی کد، رعایت اصول شی‌گرایی، پیاده‌سازی الگوهای DDD یا **بهینه‌سازی کارایی (Performance Optimization)** نیاز داریم موجودیت‌ها را به شکل متفاوتی به جداول بانک اطلاعاتی نگاشت کنیم . 

EF Core پنج روش جایگزین برای نگاشت جداول ارائه می‌دهد :
1.  **نوع‌های تحت مالکیت (Owned Types):** ادغام یک کلاس معمولی فاقد هویت مستقل (Value Object) درون جدول یک موجودیت دیگر .
2.  **میراث تک‌جدولی (TPH - Table Per Hierarchy):** قرار دادن کل ساختار وراثت کلاسی درون یک جدول واحد دیتابیس .
3.  **میراث چندجدولی (TPT - Table Per Type):** نگاشت هر کلاس از ساختار وراثت به یک جدول مستقل فیزیکی .
4.  **شکستن جدول (Table Splitting):** نگاشت چندین کلاس موجودیت مجزا به یک جدول فیزیکی مشترک .
5.  **مجموعه ویژگی‌ها (Property Bags):** استفاده از یک دیکشنری عمومی به عنوان کلاس موجودیت جهت مدل‌سازی داینامیک جداول .

در این بخش، به کالبدشکافی عمیق مفهوم اول یعنی **Owned Types** می‌پردازیم .

---

### بخش ۸.۹.۱: نوع‌های تحت مالکیت (Owned Types) - پیاده‌سازی Value Objects

در متدولوژی **Domain-Driven Design (DDD)**، ساختارهایی مانند آدرس، اطلاعات تماس یا اطلاعات مالی که فاقد هویت مستقل (Primary Key) هستند و برابری آن‌ها صرفاً بر اساس مقادیر پروپرتی‌هایشان ارزیابی می‌شود، **Value Object (شیء مقدار)** نامیده می‌شوند . این کلاس‌ها برای بقای خود به یک موجودیت اصلی (Owner) وابسته‌اند .

در EF Core، این الگو با ویژگی **Owned Types** پیاده‌سازی می‌شود . داده‌های یک Owned Type به دو صورت فیزیکی قابل ذخیره هستند:
*   ذخیره در همان جدول موجودیت اصلی (درون‌جدولی) .
*   ذخیره در یک جدول مجزای پنهان (برون‌جدولی) .

---

#### ۱. ذخیره‌سازی داده‌های Owned Type در همان جدول موجودیت اصلی

در این سناریو، موجودیت اطلاعات سفارش (`OrderInfo`) به دو آدرس مجزای ارسال و پرداخت نیاز دارد که هر دو نمونه‌هایی از کلاس آدرس (`Address`) هستند . هدف ما این است که تمام این فیلدها در همان جدول سفارش فیزیکی ذخیره شوند .

##### کلاس آدرس به عنوان Value Object و کلاس سفارش (`Listing 8.15`):

```csharp
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

// اتریبیوت [Owned] نشان‌دهنده این است که کلاس فاقد کلید اصلی مستقل است
[Owned] 
public class Address
{
    public string NumberAndStreet { get; set; }
    public string City { get; set; }
    public string ZipPostCode { get; set; }

    [Required]
    public string CountryCodeIso2 { get; set; }
}

public class OrderInfo
{
    public int OrderInfoId { get; set; }
    public string OrderNumber { get; set; }

    // دو پروپرتی هم‌تایپ که تحت مالکیت این کلاس هستند
    public Address BillingAddress { get; set; }
    public Address DeliveryAddress { get; set; }
}
```

##### پیکربندی با Fluent API (در صورت عدم استفاده از اتریبیوت `[Owned]`) (`Listing 8.16`):
اگر تمایلی به آلوده کردن لایه دامین با اتریبیوت‌های EF Core ندارید، از متد **`OwnsOne`** در Fluent API استفاده کنید:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<OrderInfo>()
                .OwnsOne(p => p.BillingAddress); // معرفی به عنوان نوع تحت مالکیت اول

    modelBuilder.Entity<OrderInfo>()
                .OwnsOne(p => p.DeliveryAddress); // معرفی به عنوان نوع تحت مالکیت دوم
}
```

##### ساختار فیزیکی ستون‌ها در دیتابیس:
طبق کنوانسیون، EF Core نام ستون‌های تولیدی در دیتابیس را به صورت ترکیبی از نام پروپرتی مالک و پروپرتی والد می‌سازد: `BillingAddress_City` و `DeliveryAddress_City` .

##### رفتار نول‌پذیری فیلدها به صورت پیش‌فرض:
به طور پیش‌فرض، حتی اگر ویژگی‌های داخلی کلاس آدرس مانند `CountryCodeIso2` با اتریبیوت `[Required]` نشانه‌گذاری شده باشند، **ستون‌های متناظر دیتابیس به صورت `NULL` تعریف می‌شوند** . 
*   *علت معماری:* اگر کاربر فیلد `BillingAddress` را به طور کامل مقداردهی نکند (مقدار کل پروپرتی `null` باشد)، دیتابیس باید بتواند مقدار تمام این ستون‌ها را `NULL` ذخیره کند. هنگام بازیابی داده‌ها، اگر تمام فیلدهای آدرس در دیتابیس `NULL` باشند، EF Core به صورت هوشمند پروپرتی `BillingAddress` را در نمونه شیء خروجی `null` قرار می‌دهد .

##### اجباری کردن وجود Owned Type در نسخه EF Core 5:
اگر منطق بیزینس شما حکم می‌کند که آدرس حتماً باید موجود باشد (غیرقابل نول بودن کل آدرس)، با زنجیره‌سازی متد **`IsRequired`** در Fluent API، ستون‌های علامت‌گذاری شده با `[Required]` در سطح دیتابیس نیز کاملاً `NOT NULL` خواهند شد :

```csharp
modelBuilder.Entity<OrderInfo>()
            .OwnsOne(p => p.DeliveryAddress)
            .IsRequired(); // اجباری کردن وجود فیزیکی آدرس تحویل کالا
```

---

#### ۲. ذخیره‌سازی داده‌های Owned Type در یک جدول مستقل فیزیکی

روش دوم ذخیره‌سازی این است که به منظور نرمال‌سازی دیتابیس یا کاهش ابعاد جدول والد، داده‌های Owned Type را به یک جدول فیزیکی جداگانه بفرستید، بدون اینکه نیاز باشد کلاس فرزند را در DbContext به عنوان یک `DbSet` عمومی رجیستر کنید .

##### پیکربندی جدول اختصاصی مجزا با Fluent API (`Listing 8.19`):

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>()
                .OwnsOne(p => p.HomeAddress)
                .ToTable("Addresses"); // هدایت داده‌های آدرس به جدولی مجزا به نام Addresses
}
```

##### عواقب فیزیکی این پیکربندی در دیتابیس (`Listing 8.20`):
۱. این متد یک رابطه یک‌به‌یک فیزیکی در دیتابیس بین جداول `Users` و `Addresses` ایجاد می‌کند .
۲. جدول `Addresses` فاقد ستون هویت مستقل (Identity) خواهد بود. کلید اصلی آن یعنی ستون `UserId` به طور همزمان به عنوان **کلید اصلی (Primary Key)** و **کلید خارجی (Foreign Key)** ارجاع‌دهنده به جدول `Users` عمل می‌کند ( Shared Primary Key Association ) .
۳. رفتار حذف به صورت بومی بر روی **`ON DELETE CASCADE`** تنظیم می‌شود؛ با حذف یک کاربر، آدرس متناظر آن نیز فیزیکی از دیتابیس حذف خواهد شد .

##### مزیت بی‌نظیر عملکردی (Performance Advantage):
چه داده‌ها در همان جدول ذخیره شوند و چه در جدول مجزا، در زمان اجرای کوئری روی موجودیت اصلی (`User` یا `OrderInfo`)، **داده‌های Owned Type به صورت کاملاً خودکار و بدون نیاز به استفاده از متد `.Include()` واکشی شده و مقداردهی می‌شوند** . این رفتار علاوه بر ساده‌سازی کدهای LINQ، مانع فراموشی برنامه‌نویسان در لود داده‌های Value Object می‌شود .

---

### بخش ۸.۹.۲: میراث تک‌جدولی (Table Per Hierarchy - TPH)

**الگوی میراث تک‌جدولی (TPH)، تمام کلاس‌های موجود در یک ساختار وراثت شی‌گرا (Inheritance Hierarchy) را درون یک جدول فیزیکی مشترک در بانک اطلاعاتی ذخیره می‌کند**. این روش زمانی یکی از گزینه‌های بهینه معماری به شمار می‌رود که زیرکلاس‌ها (Subclasses) ساختار داده‌ای بسیار مشابهی داشته باشند و تفاوت آن‌ها صرفاً در چند پروپرتی محدود باشد . از آنجا که تمام داده‌ها در یک جدول ذخیره می‌شوند، زمان اجرای کوئری‌ها نیازی به Joinهای سنگین بین جداول وجود ندارد و سرعت واکشی به شدت بالا می‌رود.

---

#### ۱. پیکربندی TPH بر اساس کنوانسیون (By Convention)

اگر کلاس‌های مدل شما رابطه وراثت با یکدیگر داشته باشند (به عنوان مثال کلاس `PaymentCard` از کلاس `PaymentCash` ارث‌بری کند) و برای هرکدام از آن‌ها یک ویژگی `DbSet<T>` مجزا در کلاس `DbContext` تعریف کرده باشید، EF Core به صورت خودکار متوجه ساختار وراثت شده و الگوی TPH را اعمال می‌کند .

##### مکانیزم ستون تشخیص‌دهنده (Discriminator Column):
برای تفکیک رکوردهای مربوط به هر کلاس در جدول مشترک، EF Core ستونی ویژه به نام **`Discriminator`** به ساختار فیزیکی جدول اضافه می‌کند . 
* **رفتار پیش‌فرض:** به صورت خودکار نام ستون `Discriminator` و نوع آن `nvarchar(max)` تعیین می‌شود و مقدار ذخیره‌شده در آن برای هر رکورد، دقیقاً هم‌نام با کلاس سی‌شارپ مربوطه (مثلاً `"PaymentCash"` یا `"PaymentCard"`) خواهد بود .
* **نول‌پذیری فیلدهای اختصاصی:** تمام پروپرتی‌های اسکالر که صرفاً در زیرکلاس‌ها تعریف شده‌اند و در کلاس پایه وجود ندارند، در سطح بانک اطلاعاتی به صورت **`NULL`** نگاشت می‌شوند ؛ زیرا سطر مرتبط با کلاس پایه فاقد این داده‌هاست و دیتابیس باید بتواند برای سطر کلاس پایه مقدار خالی درج کند.

##### 💡 تکنیک بهینه‌سازی فیزیکی (Column Sharing):
اگر چندین زیرکلاس مجزا دارید که هرکدام پروپرتی‌های متفاوتی اما با نوع داده یکسان دارند (مثلاً کلاس محصولات عایق‌بندی به پروپرتی اعشاری `MaxTemp` نیاز دارد و کلاس محصولات ماسه‌ای به پروپرتی اعشاری `WeightKgs`)، از نظر طراحی فیزیکی دیتابیس می‌توانید هر دو پروپرتی هم‌نوع را به یک ستون فیزیکی مشترک در جدول نگاشت کنید تا حجم جدول کاهش یابد.

---

#### ۲. ارتقای معماری و کپسوله‌سازی TPH با Fluent API

رویکرد پیش‌فرض کنوانسیون چند اشکال ساختاری دارد: تعریف `DbSet`های جداگانه برای هر زیرکلاس کار را شلوغ می‌کند، امکان تعریف یک رابطه عمومی به کلاس پایه وجود ندارد و ستون تشخیص‌دهنده به دلیل استفاده از رشته‌های طولانی، بهینه نیست .

##### رویکرد شی‌گرا با کلاس پایه انتزاعی (Abstract Base Class):
بهترین الگوی طراحی این است که یک کلاس پایه انتزاعی (مانند `abstract class Payment`) ایجاد کرده و زیرکلاس‌ها از آن ارث‌بری کنند. با این کار، در کلاس `DbContext` شما صرفاً یک ویژگی **`DbSet<Payment>`** تعریف می‌کنید که دروازه ورود به تمام پرداخت‌هاست . همچنین موجودیت‌های دیگر (مانند ثبت سفارش `SoldIt`) می‌توانند به طور مستقیم رابطه‌ای با کلاس انتزاعی `Payment` برقرار کنند .

##### پیکربندی بهینه‌سازی ستون دیسکریمیناتور با Fluent API (`Listing 8.24`):
در متد `OnModelCreating` با استفاده از متد‌های زنجیره‌ای، می‌توانید ستون تشخیص‌دهنده را به جای رشته‌های حجیم، به نوع‌های کارآمدتر مانند **`enum`** (که به صورت عددی یا `byte` در دیتابیس ذخیره می‌شود) متصل کنید:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Payment>()
                // ۱. تعیین نام ستون تشخیص‌دهنده و نگاشت آن به یک ویژگی مانند PType از نوع Enum
                .HasDiscriminator<PTypes>("PType") 
                // ۲. تخصیص مقادیر مشخص Enum به هر زیرکلاس فیزیکی
                .HasValue<PaymentCash>(PTypes.Cash)
                .HasValue<PaymentCard>(PTypes.Card);

    // نگاشت رابطه سفارش به کلاس پایه انتزاعی
    modelBuilder.Entity<SoldIt>()
                .HasOne(s => s.Payment)
                .WithOne()
                .IsRequired();
}
```

---

#### ۳. نحوه تعامل و واکشی داده‌ها در مدل‌های TPH

یکی از نقاط قوت EF Core، مدیریت کاملاً هوشمندانه و بومی وراثت در زمان نوشتن و خواندن داده‌ها است:

* **عملیات درج (Create):** برای ثبت یک رکورد جدید، نیازی به کار اضافه نیست. صرفاً نمونه‌ای از کلاس فرزند خاص (مثلاً `new PaymentCash()`) ایجاد و به کانتکست اضافه می‌کنید. EF Core در زمان ثبت، مقدار تشخیص‌دهنده ستون فیزیکی را متناسب با نوع شیء به صورت خودکار درج می‌کند.
* **عملیات واکشی همگانی (Polymorphic Queries):** زمانی که جدول سفارشات را به همراه رابطه پرداخت لود می‌کنید (`context.SoldIts.Include(s => s.Payment)`)، فریم‌ورک EF Core در زمان مپ کردن داده‌های لود شده، مقدار ستون تشخیص‌دهنده را خوانده و **دقیقاً نمونه کلاس واقعی (یا `PaymentCash` یا `PaymentCard`) را در حافظه بازسازی کرده و به پروپرتی والد متصل می‌سازد**.
* **فیلتر کردن بر اساس نوع در کوئری‌های LINQ:** برای بازیابی رکوردهای مربوط به یک زیرکلاس خاص از کانتکست کلاس پایه، از متد الحاقی **`OfType<T>()`** استفاده می‌شود:
  ```csharp
  // این کوئری صرفاً تراکنش‌هایی را که پرداخت آن‌ها از نوع کارت اعتباری (PaymentCard) بوده لود می‌کند
  var cardPayments = context.Payments
                            .OfType<PaymentCard>()
                            .ToList();
  ```

---

### بخش ۸.۹.۳: میراث چندجدولی (Table Per Type - TPT)

ویژگی **میراث چندجدولی (TPT)** که در نسخه **EF Core 5** معرفی شد، به هر کلاس موجود در یک ساختار وراثت اجازه می‌دهد تا **یک جدول اختصاصی مستقل در بانک اطلاعاتی داشته باشد** . این رویکرد دقیقاً نقطه مقابل روش TPH (میراث تک‌جدولی) است و زمانی کارایی دارد که هر کدام از کلاس‌های فرزند، ویژگی‌های بسیار متفاوت و غیراشتراکی زیادی داشته باشند (Dissimilar Data). 

به عنوان مثال، سناریوی دو نوع مخزن ذخیره‌سازی را در نظر بگیرید: مخازن حمل‌ونقل دریایی بزرگ (`ShippingContainer`) و مخازن پلاستیکی کوچک (`PlasticContainer`). با وجود اینکه هر دو نوع مخزن دارای ویژگی‌های پایه‌ای مانند طول، عرض و عمق هستند، سایر ویژگی‌های فنی آن‌ها کاملاً با یکدیگر متفاوت است.

##### تعریف کلاس‌های مدل در الگوی TPT (`Listing 8.25`):

```csharp
// کلاس پایه انتزاعی برای نگهداری فیلد‌های مشترک
public abstract class Container
{
    public int ContainerId { get; set; } // کلید اصلی فیزیکی
    public int HeightCm { get; set; }
    public int WidthCm { get; set; }
    public int DepthCm { get; set; }
}

// کلاس فرزند اول (مخزن حمل‌ونقل فیزیکی کشتی)
public class ShippingContainer : Container
{
    public string CargoType { get; set; }
    public int MaxWeightTonnes { get; set; }
}

// کلاس فرزند دوم (مخازن پلاستیکی کوچک مانند بطری و جعبه)
public class PlasticContainer : Container
{
    public int CapacityMl { get; set; }
    public Shapes Shape { get; set; }
    public string ColorARGB { get; set; }
}
```

##### پیکربندی با Fluent API (`Listing 8.26`):
برای پیاده‌سازی این وراثت در قالب چند جدول فیزیکی مجزا، کلاس پایه را به عنوان دروازه ورود کل کلکسیون تعریف کرده و با استفاده از متد **`ToTable`** برای هر زیرکلاس، جدول اختصاصی آن را در دیتابیس معرفی می‌کنیم :

```csharp
public class ContainerDbContext : DbContext
{
    // استفاده از یک DbSet واحد جهت دسترسی به تمامی کانتینرها
    public DbSet<Container> Containers { get; set; } // 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // هدایت داده‌های زیرکلاس‌ها به جداول مجزا در دیتابیس
        modelBuilder.Entity<ShippingContainer>().ToTable("ShippingContainers"); // 
        modelBuilder.Entity<PlasticContainer>().ToTable("PlasticContainers"); // 
    }
}
```

##### ساختار فیزیکی جداول دیتابیس در الگوی TPT:
خروجی این پیکربندی شامل **۳ جدول فیزیکی** مجزا در دیتابیس خواهد بود:
1.  **جدول `Containers` (جدول والد):** حاوی ستون کلید اصلی `ContainerId` و ویژگی‌های مشترک (`HeightCm`, `WidthCm`, `DepthCm`).
2.  **جدول `ShippingContainers` (جدول فرزند):** حاوی فیلدهای اختصاصی. کلید اصلی این جدول همان ستون `ContainerId` است که به طور همزمان به عنوان **کلید خارجی (Foreign Key)** ارجاع‌دهنده به جدول والد عمل می‌کند .
3.  **جدول `PlasticContainers` (جدول فرزند):** ساختاری مشابه جدول قبلی دارد و از طریق کلید خارجی مشترک به جدول اصلی متصل می‌شود.

##### نحوه واکشی اطلاعات در الگوی TPT (`Listing 8.26`):
در زمان خواندن اطلاعات از `DbSet<Container>`، فریم‌ورک EF Core بر اساس نیاز شما روش‌های متنوعی را برای لود داده‌ها ارائه می‌دهد:

*   **۱. واکشی همگانی (Read All):**
    ```csharp
    var allContainers = context.Containers.ToList(); // 
    ```
    این متد کل کانتینرها را با نوع کلاس واقعی آن‌ها (`ShippingContainer` یا `PlasticContainer`) برمی‌گرداند . برای این کار، EF Core در پشت صحنه یک کوئری حاوی دستورات `LEFT JOIN` سنگین روی تمام جداول فرزند اجرا می‌کند که می‌تواند در دیتابیس‌های بزرگ چالش‌های جدی کارایی (Performance) ایجاد کند.

*   **۲. استفاده از فیلتر نوع (`OfType<T>`):**
    ```csharp
    var shippingOnly = context.Containers.OfType<ShippingContainer>().ToList(); // 
    ```
    این دستور فیلتر شده، صرفاً اطلاعات مربوط به مخازن کشتی را بازمی‌گرداند.

*   **۳. استفاده مستقیم از متد `Set<T>` (بهترین کارایی):**
    ```csharp
    var shippingDirect = context.Set<ShippingContainer>().ToList(); // 
    ```
    این روش از نظر کارایی ساختار SQL بسیار بهینه‌تر از `OfType` عمل می‌کند و سریع‌ترین راه واکشی یک نوع خاص در معماری TPT است .

---

### بخش ۸.۹.۴: شکستن جدول (Table Splitting)

ویژگی **Table Splitting** به شما اجازه می‌دهد **چندین کلاس موجودیت مجزا را در سی‌شارپ به یک جدول فیزیکی مشترک در بانک اطلاعاتی نگاشت کنید** . 

##### کاربرد کلیدی در بهینه‌سازی کارایی (Performance Optimization):
این الگو زمانی بسیار حیاتی است که جدول شما حاوی ستون‌های سنگین متنی یا فیلدهای کم‌کاربرد باشد (مانند توضیحات تفصیلی کتاب یا محتوای فایل‌های باینری) . با تقسیم فیلدهای جدول Books به دو کلاس مجزا به نام‌های `BookSummary` (برای فیلدهای سبک و پرکاربرد نظیر عنوان و قیمت) و `BookDetail` (برای فیلدهای سنگین نظیر متن توضیحات کامل)، شما بدون نیاز به طراحی دستی DTOهای سنگین، زمان لود داده‌های اولیه و سرعت به‌روزرسانی فیلدهای ساده را به شدت ارتقا می‌دهید .

##### نمونه پیاده‌سازی شکستن جدول Books (`Listing 8.27`):

```csharp
// موجودیت اول: سبک و بهینه برای واکشی‌های سریع
public class BookSummary
{
    public int BookSummaryId { get; set; } // کلید اصلی مشترک
    public string Title { get; set; }
    public decimal Price { get; set; }
    
    // رابطه ناوبری یک‌به‌یک فیزیکی با بخش سنگین موجودیت
    public BookDetail Details { get; set; } // 
}

// موجودیت دوم: حاوی فیلدهای سنگین و کم‌کاربرد
public class BookDetail
{
    public int BookDetailId { get; set; } // کلید اصلی مشترک
    public string DetailedDescription { get; set; }
    public string FullAbstract { get; set; }
}
```

##### پیکربندی با Fluent API (`Listing 8.27`):

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // ۱. تعریف رابطه یک‌به‌یک الزامی بین دو بخش جدول
    modelBuilder.Entity<BookSummary>()
                .HasOne(e => e.Details)
                .WithOne()
                .HasForeignKey<BookDetail>(e => e.BookDetailId); // ارجاع کلید خارجی به کلید اصلی والد

    // ۲. نگاشت صریح هر دو کلاس موجودیت به یک نام جدول فیزیکی مشترک
    modelBuilder.Entity<BookSummary>().ToTable("Books"); // 
    modelBuilder.Entity<BookDetail>().ToTable("Books"); // 
}
```

##### قوانین طلایی در پیاده‌سازی Table Splitting:
۱. **اشتراک کلید اصلی:** هر دو کلاس موجودیت باید کلیدهای اصلی منطبق بر هم داشته باشند تا ارتباط سطرها مخدوش نشود.
۲. **مدیریت توکن همزمانی (Concurrency Tokens):** اگر از مکانیزم همزمانی استفاده می‌کنید، **توکن‌های همزمانی باید در تمامی لایه‌های کلاس‌های تقسیم‌شده جدول وجود داشته باشند** تا از منقضی شدن داده‌ها زمان به‌روزرسانی‌های تک‌کلاسی جلوگیری شود.
۳. **به‌روزرسانی مستقل:** شما بدون نیاز به لود کردن یا ویرایش کل بخش سنگین `BookDetail` می‌توانید ویژگی‌های ساده لایه `BookSummary` را تغییر داده و مستقیماً ذخیره کنید .

---

### بخش ۸.۹.۵: مجموعه ویژگی‌ها (Property Bag) - استفاده از دیکشنری به عنوان موجودیت

ویژگی **Property Bag** که در نسخه **EF Core 5** معرفی شد، امکان فوق‌العاده‌ای را فراهم می‌کند که در آن بتوانید از نوع بومی **`Dictionary<string, object>` به عنوان کلاس موجودیت استفاده کرده و آن را به یک جدول نگاشت کنید**. این قابلیت برای پیاده‌سازی پشت‌پرده روابط چندبه‌چند بدون نیاز به کلاس واسط و همچنین سناریوهایی که ساختار جداول آن‌ها به صورت داینامیک در زمان اجرای برنامه (مانند فایل‌های کانفیگ خارجی یا فرم‌سازهای پویا) تغییر می‌کنند، طراحی شده است .

این مکانیزم بر دو پایه استوار است:
1.  **موجودیت‌های نوع مشترک (Shared Entity Types):** قابلیت نگاشت یک کلاس فیزیکی واحد (`Dictionary<string, object>`) به چند جدول مجزا و با نام‌های مختلف در دیتابیس .
2.  **شاخص‌گذارهای سی‌شارپ (C# Indexers):** استفاده از ساختار `indexer` عمومی برای لود و نوشتن مقادیر ویژگی‌ها.

##### پیکربندی پویا بر اساس فایل تنظیمات در DbContext (`Listing 8.28`):

```csharp
public class DynamicDbContext : DbContext
{
    // فیلد دسترسی پویا به جدول Property Bag
    public DbSet<Dictionary<string, object>> MyTable => Set<Dictionary<string, object>>("MyTableSharedType"); // 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // دریافت داینامیک ساختار دیتابیس از یک منبع خارجی بر اساس فرضیات پروژه
        var tableSpec = GetExternalTableSpecification(); 

        // ۱. ثبت دیکشنری به عنوان یک موجودیت از نوع مشترک (Shared Type) همراه با تعیین نام مستعار
        var sharedEntity = modelBuilder.SharedTypeEntity<Dictionary<string, object>>("MyTableSharedType"); // 

        // ۲. پیمایش ویژگی‌ها و اضافه کردن پویا به ساختار فیزیکی مدل
        foreach (var col in tableSpec.Columns)
        {
            sharedEntity.Property(col.Type, col.Name) // افزودن فیلد با تعیین نوع داده و نام ستون
                        .IsRequired(!col.IsNullable); // 
        }

        // ۳. نگاشت به جدول فیزیکی هدف در دیتابیس
        sharedEntity.ToTable(tableSpec.TableName); // 
    }
}
```

##### درج و اجرای پرس‌وجو روی Property Bag (`Listing 8.29`):
تعامل با این موجودیت‌های بدون کلاس صریح، از قوانین استاندارد دیکشنری تبعیت می‌کند:

```csharp
// الف) ایجاد و درج یک رکورد داینامیک جدید
var newRow = new Dictionary<string, object>
{
    ["Id"] = 1, // کلید اصلی به صورت قراردادی اسکن می‌شود
    ["Title"] = "کتاب شگفت‌انگیز",
    ["Price"] = 85000.0
};

// برای نوع‌های مشترک باید صریحاً نام مستعار را به متد Add پاس دهید
context.Add("MyTableSharedType", newRow); // 
context.SaveChanges();

// ب) بازیابی اطلاعات و اجرای کوئری با استفاده از ساختار Indexer
var cheapBooks = context.MyTable
                        .Where(b => (double)b["Price"] < 100000.0) // فیلتر داینامیک با تبدیل تایپ فیزیکی
                        .ToList(); // 
```

##### چند نکته حیاتی در به‌کارگیری Property Bags:
*   **کش شدن دائمی تنظیمات:** به دلیل اینکه پیکربندی مدل صرفاً یک‌بار در شروع برنامه اجرا شده و کش می‌شود، ساختار ستون‌های پویای ورودی از فایل تنظیمات باید در طول زمان اجرای برنامه کاملاً ثابت بماند.
*   **کلیدهای قراردادی:** به طور پیش‌فرض، EF Core فیلد با نام `"Id"` را به عنوان کلید اصلی این جداول اسکن می‌کند، اما امکان تغییر دستی آن با Fluent API به قوت خود باقی است.
*   **روابط:** شما می‌توانید با Property Bagها روابط یک‌به‌چند یا چند‌به‌چند ایجاد کنید، اما به دلیل عدم وجود فیزیکی کلاس دامنه، امکان تعریف پراپرتی ناوبری (Navigation Properties) درون آن‌ها وجود ندارد.

---

### فصل ۹: مدیریت مهاجرت‌های بانک اطلاعاتی (Handling Database Migrations)

تغییر ساختار دیتابیس (Database Schema) همزمان با رشد و تکامل نرم‌افزار، یکی از حساس‌ترین و پرریسک‌ترین بخش‌های مهندسی نرم‌افزار است. اضافه کردن جداول یا ستون‌های جدید کار نسبتاً ساده‌ای است، اما تغییر نام یک ویژگی یا انتقال ستون‌ها بین جداول در یک دیتابیس عملیاتی فعال (Live Production) بدون داون‌تایم و بدون از دست رفتن داده‌ها، نیازمند اتخاذ استراتژی‌های بسیار دقیق و مهندسی‌شده است .

در این فصل، چگونگی تکامل امن ساختار دیتابیس و انطباق کامل آن با مدل مفهومی EF Core را کالبدشکافی خواهیم کرد .

---

#### بخش ۹.۱: چالش‌ها و پیچیدگی‌های تکامل دیتابیس (The Complexities of Database Schema Changes)

پیش از به‌کارگیری ابزارهای مهاجرت، درک ساختار محیط‌های مختلف دیتابیس و انواع تغییرات برای هر معمار نرم‌افزار الزامی است.

##### ۹.۱.۱ چشم‌انداز دیتابیس‌های چندگانه در چرخه توسعه نرم‌افزار (Multi-Database Landscape)
در پروژه‌های تیمی بزرگ، معمولاً با چند دیتابیس مجزا سروکار داریم که باید همگی به طور منظم با آخرین نسخه کدها هماهنگ و به‌روزرسانی شوند:
1.  **دیتابیس توسعه شخصی (Developer Database):** دیتابیس محلی هر توسعه‌دهنده که روی آن به آزمایش امکانات جدید و نوشتن کدهای خود می‌پردازد.
2.  **دیتابیس تست (Testing Database):** جهت اجرای تست‌های واحد (Unit Tests) و تست‌های یکپارچه‌سازی (Integration Tests) در محیط شبیه‌سازی‌شده.
3.  **دیتابیس پیش‌تولید (Pre-production / Staging):** دیتابیسی با ساختار و داده‌های کاملاً شبیه به محیط واقعی برای تایید نهایی منطق کل سیستم.
4.  **دیتابیس عملیاتی (Production Database):** دیتابیس اصلی و حساسی که کاربران نهایی به طور زنده با آن کار می‌کنند و حفظ پایداری و امنیت داده‌های آن بالاترین اهمیت را دارد.

##### ۹.۱.۲ تغییرات غیرمخرب (Non-breaking) در برابر تغییرات مخرب همراه با ریسکِ از دست رفتن داده (Data-loss Breaking Changes)
تغییراتی که روی دیتابیس اعمال می‌شوند به دو دسته تقسیم می‌شوند:
*   **تغییرات غیرمخرب (Non-breaking Changes):** مانند اضافه کردن یک جدول یا ستون جدید به جدول‌های موجود. این قبیل تغییرات آسیبی به کدهای در حال اجرا نمی‌زنند و داده‌ای را حذف نمی‌کنند.
*   **تغییرات مخرب همراه با از دست رفتن داده (Data-loss Breaking Changes):** تغییراتی نظیر حذف یک ستون، تغییر نام یک پروپرتی (موجب حذف ستون قبلی و ایجاد ستون جدید می‌شود)، یا جابه‌جایی ستون‌ها از یک جدول به جدولی دیگر. به طور پیش‌فرض، ابزارهای خودکارساز مهاجرت در این سناریوها ستون قدیمی را حذف و ستون جدید می‌سازند که منجر به **حذف دائمی اطلاعات قبلی** می‌شود . برای جلوگیری از این فاجعه، باید کدهای مهاجرت را پیش از اعمال به صورت دستی اصلاح کنیم تا کپی داده‌ها به درستی انجام شود .

---

#### بخش ۹.۲: منبع حقیقت (Source of Truth) و رویکردهای سه‌گانه ساخت مهاجرت

برای ایجاد فایل‌های تغییر دیتابیس، ابتدا باید مشخص کنید که در معماری پروژه شما، **منبع حقیقت (Source of Truth)** کدام لایه است. بر این اساس، سه رویکرد اصلی برای طراحی مهاجرت وجود دارد :

```
                                 ┌─────────────────────────┐
                                 │     منبع حقیقت پروژه     │
                                 └────────────┬────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
           کدهای دات‌نت (C# Classes)          اسکریپت‌های SQL              ساختار فیزیکی دیتابیس
           [EF Core Migrations]           [SQL Change Scripts]          [Reverse Engineering]
```

##### ۱. رویکرد اول: کدهای EF Core به عنوان منبع حقیقت (EF Core Migrations)
در این حالت، کلاس‌های موجودیت سی‌شارپ و پیکربندی‌های DbContext مبنای تصمیم‌گیری هستند. 
*   **مکانیزم:** ابزار با مقایسه نسخه فعلی کدهای شما با تصویر لحظه‌ای قبلی دیتابیس (Model Snapshot)، کدهای مهاجرت متناظر به زبان سی‌شارپ را برای اعمال در دیتابیس تولید می‌کند .
*   **مزیت:** سادگی بی‌نظیر، عدم نیاز به دانش عمیق SQL در سناریوهای ساده و تولید خودکار فایل‌ها .
*   **نقطه ضعف:** برای سناریوهای مخرب (مانند تغییر نام فیلد)، نیاز به دستکاری دستی کدهای تولیدشده دارد .

##### ۲. رویکرد دوم: اسکریپت‌های SQL به عنوان منبع حقیقت (SQL Change Scripts)
در این متدولوژی، کدهای SQL نوشته‌شده توسط توسعه‌دهندگان یا خروجی ابزارهای مقایسه دیتابیس، منبع حقیقت سیستم هستند.
*   **مکانیزم:** شما تغییرات را به صورت اسکریپت‌های دستی SQL مدیریت می‌کنید و از ابزارهایی نظیر DbUp یا Flyway برای اعمال منظم آن‌ها در دیتابیس استفاده می‌کنید .
*   **مزیت:** کنترل ۱۰۰ درصدی بر روی تمامی قابلیت‌های دیتابیس (نظیر CHECK Constraints، ویوها و پروسیجرها که تحت کنترل مستقیم EF نیستند) .
*   **نقطه ضعف:** سخت بودن حفظ هماهنگی کامل بین کدهای سی‌شارپ و ساختار فیزیکی دیتابیس .

##### ۳. رویکرد سوم: خود دیتابیس به عنوان منبع حقیقت (Reverse Engineering / Scaffold)
این الگو که به **Database-First** نیز معروف است، دیتابیس فیزیکی موجود را به عنوان مرجع قرار می‌دهد .
*   **مکانیزم:** با اجرای دستور Scaffolding، مدل‌های سی‌شارپ و کلاس DbContext متناسب با ساختار دیتابیس تولید و به‌روزرسانی می‌شوند .
*   **مزیت:** ایده‌آل برای اتصال به سیستم‌های قدیمی (Legacy Databases) .
*   **نقطه ضعف:** محدودیت در سفارشی‌سازی کلاس‌های دامنه و انطباق با قواعد پیشرفته طراحی دامنه (DDD) .

---

### بخش ۹.۳: روش ایجاد و ثبت مهاجرت (Creating a Migration by add migration command)

در فریم‌ورک EF Core، فرآیند ایجاد مهاجرت بر اساس مقایسه بین دو ساختار متمایز از پایگاه داده صورت می‌گیرد . هنگامی که شما دستور ساخت مهاجرت را صادر می‌کنید، موتور ابزارهای EF Core ابتدا کدهای سی‌شارپ کلاس‌های موجودیت (Entity Classes) و پیکربندی‌های متد `OnModelCreating` را اسکن کرده و یک مدل ذهنی پویا از پایگاه داده هدف می‌سازد . سپس این مدل جدید را با آخرین وضعیت ثبت‌شده دیتابیس در فایلی به نام **Model Snapshot** مقایسه کرده و تغییرات (تفاوت‌ها) را به عنوان دستورات اجرایی مهاجرت صادر می‌کند .

---

#### ۹.۳.۱ پیش‌نیازهای فنی برای اجرای ابزار مهاجرت (Prerequisites)

برای اینکه بتوانید دستورات مهاجرت را در محیط توسعه دات‌نت اجرا کنید، باید زیرساخت و پکیج‌های ابزاری زیر را از قبل در پروژه‌های خود مستقر کرده باشید:

۱. **نصب پکیج‌های توسعه (NuGet Packages):**
   * **پروژه اصلی (Startup Project):** باید شامل پکیج **`Microsoft.EntityFrameworkCore.Tools`** (جهت فعال‌سازی دستورات در Package Manager Console) و پرووایدر دیتابیس عملیاتی (مثلاً `Microsoft.EntityFrameworkCore.SqlServer`) باشد.
   * **پروژه کانتکست (Data Project):** پکیج پایه EF Core و ترجیحاً پرووایدر دیتابیس باید در آن حضور داشته باشند.

۲. **نصب ابزار خط فرمان جهانی (Global CLI Tool):**
   اگر مایل به استفاده از ترمینال سیستم به جای کنسول ویژوال استودیو هستید، باید ابزار `dotnet-ef` را به صورت سراسری با دستور زیر نصب کنید:
   ```bash
   dotnet tool install --global dotnet-ef
   ```

۳. **نیاز به نمونه‌سازی در زمان طراحی (Design-Time DbContext Instantiation):**
   ابزار مهاجرت برای فهم مدل شما، باید بتواند کلاسی از `DbContext` را بسازد و پیکربندی‌های آن را بخواند. 
   * **اگر پروژه وب (ASP.NET Core) دارید:** ابزار به صورت خودکار از کلاس `Program` برای پیکربندی و ساخت موقت نمونه DbContext استفاده می‌کند.
   * **اگر لایه دیتابیس شما در یک Class Library مجزاست:** باید کلاسی بنویسید که اینترفیس **`IDesignTimeDbContextFactory<TContext>`** را پیاده‌سازی کند. این کلاس در زمان طراحی فعال شده و نمونه تنظیم‌شده DbContext را به ابزار مهاجرت تحویل می‌دهد:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class OrderDbContextFactory : IDesignTimeDbContextFactory<OrderDbContext>
{
    public OrderDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<OrderDbContext>();
        optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=OrderDb;Trusted_Connection=True;");

        return new OrderDbContext(optionsBuilder.Options); // 
    }
}
```

---

#### ۹.۳.۲ اجرای دستور ساخت مهاجرت (Running the Command)

برای ثبت تغییراتِ اعمال‌شده در لایه کد و تبدیل آن‌ها به فایل مهاجرت، بسته به محیط ترمینال خود یکی از دو دستور زیر را اجرا می‌کنید:

* **روش اول: کنسول مدیریت پکیج در ویژوال استودیو (Package Manager Console - PMC)**
  ```powershell
  Add-Migration InitialMigration -Project DataLayer
  ```
* **روش دوم: خط فرمان دات‌نت (dotnet CLI)**
  ```bash
  dotnet ef migrations add InitialMigration -p ../DataLayer
  ```

> **نکته نام‌گذاری:** نام انتخاب‌شده برای مهاجرت (مانند `InitialMigration`) باید معرف نوع تغییرات لایه کد باشد (مثلاً `AddOrderTable` یا `RenameCustomerIdToUserId`) تا در تاریخچه تغییرات به راحتی قابل پیگیری باشد.

---

#### ۹.۳.۳ کالبدشکافی فایل‌های تولیدشده در پوشه Migrations

پس از اجرای موفق دستور ساخت مهاجرت، پوشه‌ای به نام **`Migrations`** در پروژه دیتابیس شما ایجاد می‌شود که حاوی **۳ فایل کلیدی** جدید است :

```
/Migrations/
├── 20260815024900_InitialMigration.cs          <-- فایل اصلی اجرایی مهاجرت
├── 20260815024900_InitialMigration.Designer.cs <-- فایل متادیتا و اسنپ‌شات لحظه‌ای این مهاجرت
└── OrderDbContextModelSnapshot.cs              <-- تصویر لحظه‌ای کل مدل (منبع حقیقت مهاجرت بعدی)
```

##### ۱. فایل اصلی مهاجرت (`[Timestamp]_[MigrationName].cs`)
این فایل حاوی کدهای سی‌شارپی است که وظیفه دارند دیتابیس را ارتقا داده یا در صورت لزوم به عقب بازگردانند . این کلاس از کلاس پایه `Migration` ارث‌بری کرده و شامل دو متد اصلی است :

* **متد `Up`:** دستورالعمل‌های اعمال تغییرات بر روی دیتابیس (مانند ساخت جدول، افزودن ستون یا ایندکس) در این متد قرار می‌گیرند.
* **متد `Down`:** دستورالعمل‌های معکوس‌کننده متد `Up` در این فیلد قرار دارند تا در صورت لزوم، تغییرات دیتابیس بدون آسیب به بخش‌های دیگر لغو شوند (مثلاً با Drop کردن جداول ساخته‌شده در متد Up) .

```csharp
public partial class InitialMigration : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // دستور ساخت فیزیکی جدول Books در دیتابیس
        migrationBuilder.CreateTable(
            name: "Books",
            columns: table => new
            {
                BookId = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Title = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Books", x => x.BookId);
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // لغو عملیات بالا و حذف فیزیکی جدول Books
        migrationBuilder.DropTable(name: "Books");
    }
}
```

##### ۲. فایل طراح (`[Timestamp]_[MigrationName].Designer.cs`)
این فایل یک فایل کد کمکی و سیستمی است که متادیتای مرتبط با مهاجرت فعلی را در قالب ویژگی‌های کامپایلر دات‌نت ذخیره می‌کند تا ردیاب Change Tracker داخلی EF Core بتواند این تغییرات را تحلیل کند. **توسعه‌دهندگان هرگز نباید این فایل را به صورت دستی ویرایش کنند**.

##### ۳. فایل تصویر لحظه‌ای کل مدل (`[MyDbContext]ModelSnapshot.cs`)
این فایل **مهم‌ترین فایل مدیریت تغییرات در EF Core است** . 
* **منبع حقیقت لایه زیرساخت:** این فایل تصویر کاملی از ساختار نهایی مدل دیتابیس شما را بر اساس آخرین کدهای سی‌شارپ ذخیره می‌کند. 
* **نقش در ساخت مهاجرت بعدی:** هنگامی که در آینده دستور ساخت مهاجرت دوم را صادر می‌کنید، ابزار به دیتابیس فیزیکی متصل نمی‌شود، بلکه کدهای جدید شما را با داده‌های ذخیره‌شده در این فایل `ModelSnapshot` مقایسه می‌کند تا تفاوت‌های اعمال‌شده جدید را استخراج کند . به همین دلیل، هماهنگ بودن این فایل با سیستم کنترل نسخه (Git) برای جلوگیری از تداخل کاری بین اعضای تیم حیاتی است .

---

### بخش ۹.۴ (ادامه): افزودن داده‌های اولیه دیتابیس (Seeding)، مدیریت تیمی مهاجرت‌ها و چند کانتکستی (Multi-DbContext)

---

#### ۹.۴.۳ افزودن داده‌های اولیه دیتابیس از طریق مهاجرت (Model Seeding via `HasData`)

**فرایند افزودن داده‌های اولیه (Data Seeding) شامل درج اطلاعات پایه و ثابتی نظیر نقش‌های سیستمی (Roles)، دسته‌بندی کدهای محصول و مقادیر ثابت سیستمی در زمان راه‌اندازی یا ارتقای دیتابیس است**. در EF Core، پیاده‌سازی رسمی این الگو کاملاً با ساختار مهاجرت‌ها یکپارچه شده است.

##### روش تعریف کدهای بذرپاشی با متد `HasData`:
داده‌های اولیه باید درون متد `OnModelCreating` دیتابیس DbContext و با استفاده از متد **`HasData`** معرفی شوند :

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // ۱. تعریف پروژه‌های پیش‌فرض سیستم (موجودیت اصلی)
    modelBuilder.Entity<Project>().HasData(
        new { ProjectId = 1, ProjectName = "Project1" },
        new { ProjectId = 2, ProjectName = "Project2" }
    );

    // ۲. تعریف کاربران سیستمی همراه با تعیین کلید خارجی (موجودیت وابسته)
    modelBuilder.Entity<User>().HasData(
        new { UserId = 1, Name = "Jill", ProjectId = 1 },
        new { UserId = 2, Name = "Jack", ProjectId = 2 }
    );

    // ۳. بذرپاشی یک نوع تحت مالکیت (Owned Type) نظیر آدرس کاربر
    modelBuilder.Entity<User>()
                .OwnsOne(x => x.Address)
                .HasData(
                    new { UserId = 1, Street = "Street1", City = "City1" },
                    new { UserId = 2, Street = "Street2", City = "City2" }
                ); // 
}
```

##### سه قانون فنی و حیاتی در مدیریت داده‌های اولیه با `HasData`:
1.  **تعیین اجباری کلید اصلی (Explicit Primary Keys):** در سناریوهای بذرپاشی، حتی اگر کلید اصلی شما از نوع Identity دیتابیس (تولید خودکار خود دیتابیس) باشد، **حتماً باید مقدار کلید اصلی (مانند `ProjectId = 1`) را به صورت صریح در کدهای شیء بذرپاشی بنویسید**. در غیر این صورت، EF Core قادر نخواهد بود ارتباط رکوردهای دیگر را در فاز طراحی مدل (Design-time) از طریق کلیدهای خارجی با موجودیت اصلی برقرار کند.
2.  **پیامد تغییر فیلدهای کلید:** اگر در مهاجرت‌های بعدی، فیلد کلید اصلی یک داده بذرپاشی‌شده را تغییر دهید، EF Core در لایه مهاجرت جدید یک دستور فیزیکی **`DELETE`** برای رکورد قبلی و یک دستور **`INSERT`** برای ثبت سطر جدید صادر می‌کند. اما اگر مقدار کلید ثابت بماند و صرفاً پروپرتی‌های جانبی (مانند نام کاربر) تغییر کنند، موتور مهاجرت یک دستور بهینه **`UPDATE`** تولید خواهد کرد.
3.  **تفاوت حیاتی معماری با EF6.x:** در فریم‌ورک قدیمی EF6.x، متد `Seed` در زمان اولین شروع برنامه روی دیتابیس فیزیکی اجرا می‌شد . اما در EF Core، **داده‌ها به طور مستقیم درون فایل متد Up مهاجرت شما سریالایز و ذخیره می‌شوند** . با اعمال مهاجرت به دیتابیس، این داده‌ها بلافاصله به شکل دستورات بومی SQL درج خواهند شد. این مکانیزم برای تست‌های واحد یا مستقر کردن کدهای اولیه بسیار پایدارتر است.

---

#### ۹.۴.۴ مدیریت همزمان مهاجرت‌ها در تیم‌های توسعه بزرگ (Handling Merges & Conflicts)

زمان کار تیمی روی یک مخزن گیت (Git) مشترک، بسیار رایج است که دو توسعه‌دهنده به طور موازی تغییراتی در مدل‌های خود ایجاد کرده و هر دو دستور `Add-Migration` را صادر کنند. در زمان ادغام شاخه‌ها (Merge)، این کار منجر به بروز **تداخل (Conflict) در فایل تصویر لحظه‌ای کل مدل (`[DbContextName]ModelSnapshot.cs`)** خواهد شد.

##### پروتکل گام‌به‌گام و استاندارد رفع تداخل مهاجرت در گیت:
برای حل اصولی تداخل‌ها، فرآیند زیر پیشنهاد می‌شود :

```
1. انصراف از ادغام گیت (Abort Merge) 
   │
   ▼
2. حذف آخرین مهاجرت محلی خود با دستور Remove-Migration (بدون دستکاری مدل‌ها)
   │
   ▼
3. ادغام شاخه اصلی گیت (Merge incoming migrations successfully)
   │
   ▼
4. اجرای مجدد دستور Add-Migration برای تولید مهاجرت جدید منطبق بر کدهای تلفیق‌شده
```

##### سه استراتژی حفاظتی برای توسعه‌دهندگان ارشد:
*   قبل از ایجاد مهاجرت‌های جدید، همواره آخرین کدهای شاخه عملیاتی (`main` / `production`) را در لوکال خود لود و ادغام کنید.
*   تلاش کنید در هر درخواست ادغام (Pull Request)، صرفاً **یک فایل مهاجرت** قرار داشته باشد.
*   به محض ایجاد تغییرات ساختاری در مدل‌ها، سایر هم‌تیمی‌ها را مطلع کنید تا دیتابیس‌های لوکال خود را زودتر هماهنگ کنند.

---

#### ۹.۴.۵ اشتراک‌گذاری یک دیتابیس فیزیکی بین چندین DbContext

در برخی از الگوهای پیچیده نرم‌افزار، نظیر تجمیع دیتابیس‌ها به دلایل اقتصادی یا تفکیک کانتکست‌های منطقی بر اساس الگوی Bounded Context در Domain-Driven Design، نیاز است که **چند کانتکست DbContext مجزا همزمان به یک دیتابیس فیزیکی واحد متصل شوند**.

##### چالش اول: مدیریت جدول تاریخچه مهاجرت پیش‌فرض (`__EFMigrationsHistory`)
به طور پیش‌فرض، EF Core پیشرفت مهاجرت‌ها را در جدولی به نام `__EFMigrationsHistory` ثبت می‌کند. اگر دو کانتکست مستقل بدون کانفیگ جداگانه از یک دیتابیس استفاده کنند، تلاش کانتکست دوم برای مدیریت مهاجرت‌ها منجر به تداخل ساختاری و بازنویسی نادرست اطلاعات می‌شود.
*   **راهکار:** با استفاده از متد الحاقی **`MigrationsHistoryTable`** در زمان رجیستر کردن وابستگی سرویس‌ها، برای هر کانتکست نام فیزیکی مجزایی اختصاص دهید:

```csharp
services.AddDbContext<EfCoreContext>(options => 
    options.UseSqlServer(connection, dbOptions =>
        dbOptions.MigrationsHistoryTable("CustomHistoryTableName", "dbo") // نام متمایز برای جلوگیری از تداخل
    )); // 
```

##### چالش دوم: جداول مشترک بین چند DbContext (مانند جدول کتاب‌ها در کانتکست فروش و توزیع)
اگر هر دو کانتکست به کلاسی مانند `Book` دسترسی داشته باشند، ابزار مهاجرت در زمان تولید فایل Up هر دو کانتکست، دستور ساخت فیزیکی جدول `Books` را درج می‌کند که منجر به خطای ساخت مجدد جدول در دیتابیس خواهد شد.
*   **راهکار فنی (Table-to-View Mapping):** در کانتکستی که صرفاً به دسترسی فقط‌خواندنی (Read-Only) به کتاب‌ها نیاز دارد، موجودیت کتاب را به جای یک جدول فیزیکی، به یک ویو (View) نگاشت کنید:
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Book>().ToView("Books"); // نادیده گرفته شدن فرآیند ساخت فیزیکی جدول توسط مهاجرت‌های این کانتکست
}
```
با این تکنیک، موتور ابزار مهاجرت آن کلاس را در فاز اسکن ساختار فیزیکی مهاجرت جاری کانتکست دوم نادیده می‌گیرد، در حالی که در زمان اجرا، دسترسی به داده‌ها همچنان بدون کوچکترین مشکلی برقرار خواهد بود.

---

### بخش ۹.۵: ویرایش دستی کدهای مهاجرت برای مدیریت سناریوهای پیچیده (Editing an EF Core Migration to Handle Complex Situations)

هرچند ابزارهای خودکارساز مهاجرت در Entity Framework Core فوق‌العاده هوشمند و توسعه‌یافته هستند، اما به صورت پیش‌فرض نمی‌توانند برخی از سناریوهای پیچیده و حساس بانک اطلاعاتی (مانند تغییرات مخربی که منجر به از دست رفتن داده‌ها می‌شوند) را به درستی تشخیص دهند . تیم مهندسی EF Core این محدودیت را پیش‌بینی کرده و به همین دلیل، قابلیت **ویرایش دستی کدهای مهاجرت تولیدشده** را به عنوان یک استاندارد رسمی در اختیار توسعه‌دهندگان قرار داده است . 

چهار سناریوی کلیدی وجود دارد که ابزارهای استاندارد مهاجرت بدون مداخله دستی شما در آن‌ها شکست خورده یا اطلاعات را نابود می‌کنند:
1. **تغییرات مخرب همراه با از دست رفتن داده (Data-loss Breaking Changes)** مانند تغییر نام فیلدها یا جابه‌جایی ستون‌ها بین جداول دیتابیس.
2. **افزودن قابلیت‌های بومی دیتابیس که فراتر از قلمرو مدل‌سازی EF Core هستند** مانند ساخت ویوهای SQL، رویه‌های ذخیره‌شده (Stored Procedures)، تریگرها یا توابع تعریف‌شده توسط کاربر (UDFs).
3. **افزودن دستورات مهاجرت سفارشی و قانونمند در سطح سازمان**.
4. **توسعه مهاجرت‌های چندگانه برای بانک‌های اطلاعاتی ناهمگون** (مانند سازگار کردن یک فایل مهاجرت برای کار روی هر دو دیتابیس SQL Server و PostgreSQL).

در ادامه این بخش، تکنیک‌های پیشرفته ویرایش دستی فایل‌های مهاجرت را کالبدشکافی خواهیم کرد.

---

#### ۹.۵.۱ اضافه و حذف کردن متدها در کلاس مهاجرت (تغییر نام اصولی فیلدها)

تغییر نام پروپرتی‌های یک کلاس، متداول‌ترین عملیاتی است که منجر به فاجعه نابودی داده‌ها می‌شود. فرض کنید طبق تغییرات فصل هفتم، تصمیم گرفته‌اید پروپرتی `CustomerId` را در کلاس سفارشات (`Order`) به `UserId` تغییر نام دهید تا با استانداردهای فیلتر سراسری شما هماهنگ شود.

##### ⚠️ رفتار مخرب پیش‌فرض EF Core:
هنگامی که دستور `Add-Migration` را صادر می‌کنید، ابزار مقایسه‌گر تصویر لحظه‌ای متوجه نمی‌شود که شما فیلد قبلی را تغییر نام داده‌اید. این ابزار تغییر مدل را به عنوان **حذف فیزیکی ستون `CustomerId`** و **ایجاد یک ستون جدید و خالی به نام `UserId`** در نظر می‌گیرد. با اعمال این مهاجرت به محیط عملیات، کل داده‌های ستون `CustomerId` برای همیشه حذف فیزیکی می‌شوند!

##### 🛠️ راهکار ویرایش دستی کدهای Up و Down (`Listing 9.4`):
برای جلوگیری از این مشکل، باید فایل مهاجرت سی‌شارپ متناظر را باز کرده و کدهای زیر را ویرایش کنید :
1. دستور `AddColumn` مربوط به ستون جدید (`UserId`) را حذف یا کامنت کنید .
2. دستور `DropColumn` مربوط به ستون قدیمی (`CustomerId`) را حذف یا کامنت کنید .
3. متد بومی **`RenameColumn`** را از طریق شیء `migrationBuilder` فراخوانی کنید :

```csharp
public partial class RenameCustomerToUser : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ۱. کامنت کردن دستورات خودکارساز مخرب
        // migrationBuilder.AddColumn<Guid>(name: "UserId", table: "Orders", nullable: false);
        // migrationBuilder.DropColumn(name: "CustomerId", table: "Orders");

        // ۲. جایگزینی با متد اصولی تغییر نام جهت حفظ ۱۰۰ درصدی داده‌های قبلی
        migrationBuilder.RenameColumn(
            name: "CustomerId",
            table: "Orders",
            newName: "UserId"); // 
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // ۳. معکوس کردن دقیق فرآیند در متد بازگشت (Down)
        migrationBuilder.RenameColumn(
            name: "UserId",
            table: "Orders",
            newName: "CustomerId"); // 
    }
}
```

با این ویرایش ساده، دیتابیس صرفاً یک دستور بهینه `SP_RENAME` (در SQL Server) اجرا می‌کند و داده‌های قدیمی بدون کوچک‌ترین آسیبی به ستون جدید منتقل می‌شوند.

---

#### ۹.۵.۲ تزریق دستورات مستقیم SQL به مهاجرت (سناریوی انتقال ستون‌ها بین دو جدول)

گاهی تکامل معماری نرم‌افزار ایجاب می‌کند که ساختار داده‌ها را به طور کلی نرمال‌سازی کنید. برای مثال، فرض کنید در ابتدا آدرس کاربران (شامل پروپرتی‌های `Street` و `City`) به صورت ستون‌های فیزیکی درون همان جدول اصلی کاربران (`Users`) ذخیره می‌شد. با بزرگ شدن سیستم، تصمیم می‌گیرید جدول مجزایی به نام `Addresses` ساخته و داده‌های آدرس را به این جدول منتقل کنید و در جدول `Users` صرفاً یک کلید خارجی به نام `AddressId` نگه دارید .

##### کالبدشکافی فرآیند گام‌به‌گام انتقال تمیز داده‌ها (`Figure 9.4`):

```
۱. ساخت جدول Addresses فاقد داده ──► ۲. ساخت ستون موقت UserId در Addresses ──► ۳. کپی اطلاعات آدرس‌ها به Addresses با کدهای SQL
                                                                                               │
                                                                                               ▼
۶. حذف ستون‌های قدیمی Street/City ◄── ۵. حذف ستون موقت UserId ◄── ۴. ثبت کلید خارجی AddressId در Users بر اساس سطر متناظر
```

برای اجرای این عملیات، ابتدا تغییرات کلاس‌ها را در کدهای دات‌نت اعمال کرده و دستور ایجاد مهاجرت را اجرا کنید. سپس متد `Up` فایل مهاجرت را باز کرده و با استفاده از متد قدرتمند **`migrationBuilder.Sql`**، دستورات انتقال داده را به صورت SQL خام بین کدهای سی‌شارپ تزریق کنید .

##### Listing 9.5: پیاده‌سازی متد `Up` برای جابه‌جایی ایمن ستون‌ها

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // گام اول: ساخت جدول فیزیکی جدید Addresses بر اساس مدل جدید (کدهای پیش‌فرض تولید شده)
    migrationBuilder.CreateTable(
        name: "Addresses",
        columns: table => new {
            AddressId = table.Column<int>(nullable: false).Annotation("SqlServer:Identity", "1, 1"),
            Street = table.Column<string>(nullable: true),
            City = table.Column<string>(nullable: true),
            TempUserId = table.Column<int>(nullable: false) // ستون موقت جهت ردیابی مالک آدرس در فاز مهاجرت
        },
        constraints: table => {
            table.PrimaryKey("PK_Addresses", x => x.AddressId);
        });

    // گام دوم: تزریق کدهای SQL خام جهت کپی داده‌های قدیمی به سطر جدید جدول فرزند
    migrationBuilder.Sql(@"
        INSERT INTO Addresses (Street, City, TempUserId)
        SELECT Street, City, UserId FROM Users WHERE Street IS NOT NULL;
    "); // 

    // گام سوم: افزودن ستون کلید خارجی AddressId به جدول اصلی Users
    migrationBuilder.AddColumn<int>(
        name: "AddressId",
        table: "Users",
        nullable: true);

    // گام چهارم: به‌روزرسانی کلیدهای خارجی در جدول Users بر اساس آدرس‌های تازه درج‌شده
    migrationBuilder.Sql(@"
        UPDATE Users
        SET Users.AddressId = Addresses.AddressId
        FROM Users
        INNER JOIN Addresses ON Users.UserId = Addresses.TempUserId;
    "); // 

    // گام پنجم: حذف فیزیکی ستون موقت TempUserId از جدول Addresses
    migrationBuilder.DropColumn(name: "TempUserId", table: "Addresses"); // 

    // ⚠️ گام ششم (بسیار حیاتی): اجرای متدهای حذف ستون‌های قدیمی Street و City 
    // این متدها باید دقیقاً در انتهای کار اجرا شوند؛ اگر آن‌ها را بالاتر از کدهای کپی بنویسید، داده‌ها قبل از انتقال کپی، پاک خواهند شد.
    migrationBuilder.DropColumn(name: "Street", table: "Users");
    migrationBuilder.DropColumn(name: "City", table: "Users");
}
```

---

#### ۹.۵.۳ ساخت کدهای کمکی سفارشی در مهاجرت‌ها (مثال: متد افزودن خودکار SQL View)

اگر در فرآیند توسعه مکرراً نیاز به استفاده از دستورات SQL خاصی دارید که خارج از کنترل مستقیم کدهای پیش‌فرض EF Core هستند (مانند ساخت یک View برای مدل‌های فقط‌خواندنی)، نوشتن مکرر متدهای `Sql` خام کار فرساینده و خطاسازی است. راهکار معمارانه برتر، توسعه **توابع الحاقی (Extension Methods) روی اینترفیس `MigrationBuilder`** است .

##### Listing 9.6: نوشتن متد الحاقی `AddViewViaSql` جهت خودکارسازی ایجاد ویو

```csharp
public static class AddViewExtensions
{
    public static void AddViewViaSql<TView>(
        this MigrationBuilder migrationBuilder, 
        string viewName, 
        string tableName, 
        string whereSql) 
        where TView : class
    {
        // استخراج نام ویژگی‌های کلاس مپ‌شده به ویو جهت تنظیم ستون‌های SELECT
        var properties = typeof(TView).GetProperties().Select(p => p.Name);
        var columns = string.Join(", ", properties);

        // تولید داینامیک دستور فیزیکی دیتابیس
        var sqlCommand = $"CREATE OR ALTER VIEW {viewName} AS SELECT {columns} FROM {tableName} WHERE {whereSql}";

        // ارسال دستور فیزیکی تولیدشده به موتور دیتابیس
        migrationBuilder.Sql(sqlCommand); // 
    }
}
```

اکنون در هر فایل مهاجرتی که ایجاد می‌کنید، می‌توانید این متد تمیز را مانند متدهای بومی سی‌شارپ زنجیره‌سازی کنید:
```csharp
migrationBuilder.AddViewViaSql<BookSqlQuery>("EntityFilterView", "Books", "PublishedOn >= '2026-01-01'");
```

---

#### ۹.۵.۴ سازگار کردن مهاجرت برای پرووایدرهای دیتابیس چندگانه

به طور پیش‌فرض، کدهای مهاجرت تولیدشده توسط EF Core به شدت به ساختار نحوی (Dialect) پرووایدر فعال دیتابیس وابسته هستند. برای مثال، تعریف یک کلید Identity یا یک ستون نوع تاریخ در SQL Server کاملاً متفاوت با SQLite یا PostgreSQL است. 

اگر پروژه شما ملزم به پشتیبانی از چند نوع دیتابیس متفاوت است، از دو استراتژی می‌توانید استفاده کنید:

۱. **استراتژی اول (پیشنهاد رسمی و استاندارد تیم EF Core):**
طراحی کلاس‌های کانتکست مجزا برای هر دیتابیس (مثلاً کلاس‌های مشتق‌شده `MySqlServerDbContext` و `MyPostgreSqlDbContext`) و **نگهداری مجزای فایل‌های مهاجرت هر پرووایدر در پوشه‌ها یا اسمبلی‌های کاملاً مستقل** . این کار پایداری بانک اطلاعاتی را به حداکثر می‌رساند.

۲. **استراتژی دوم (رویکرد شرطی داخل کدهای مهاجرت):**
استفاده از پروپرتی کلیدی **`migrationBuilder.ActiveProvider`** در متد `Up` جهت تشخیص نوع دیتابیسِ در حال به‌روزرسانی و هدایت تراکنش از طریق بلاک‌های شرطی `if/else`:

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    if (migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.SqlServer")
    {
        // کدهای اختصاصی برای بانک اطلاعاتی SQL Server
        migrationBuilder.Sql("CREATE OR ALTER VIEW MyView ...");
    }
    else if (migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.Sqlite")
    {
        // کدهای سازگار با دیتابیس سبک SQLite (مانند کدهای خام شبیه‌ساز ویو)
        migrationBuilder.Sql("CREATE VIEW MyView ...");
    }
}
```

---

### بخش ۹.۶: استفاده از اسکریپت‌های SQL برای ایجاد مهاجرت (Using SQL Scripts to Build Migrations)

در برخی پروژه‌ها، به ویژه پروژه‌های سازمانی بزرگ که تیم‌های اختصاصی مدیریت پایگاه داده (DBAs) در آن‌ها مستقر هستند، استفاده از ابزارهای خودکارساز مهاجرت سی‌شارپ پذیرفته نیست . در این سناریوها، **اسکریپت‌های تغییر فیزیکی دیتابیس (SQL Change Scripts) به عنوان منبع حقیقت (Source of Truth) پروژه در نظر گرفته می‌شوند** . 

این رویکرد به توسعه‌دهندگان و مدیران دیتابیس اجازه می‌دهد تا **کنترل ۱۰۰ درصدی بر روی معماری فیزیکی دیتابیس** داشته باشند و بتوانند قابلیت‌هایی نظیر قیود شرطی پیشرفته (`CHECK Constraints`)، ایندکس‌های سفارشی، ویوها، رویه‌های ذخیره‌شده (`Stored Procedures`) و توابع دیتابیس را به طور مستقیم مدیریت کنند .

برای پیاده‌سازی این رویکرد، دو استراتژی اصلی جهت تولید اسکریپت‌های تغییر وجود دارد :
1. **استفاده از ابزارهای مقایسه‌گر دیتابیس (Database Comparison Tools)**.
2. **نوشتن دستی کدهای SQL (Handcoding SQL Change Scripts)**.

---

#### ۹.۶.۱ روش اول: استفاده از ابزارهای مقایسه‌گر دیتابیس (Database Comparison Tools)

این رویکرد بر پایه **مقایسه فیزیکی بین دو دیتابیس مبدا و مقصد** استوار است :

*   **دیتابیس هدف (Target Database):** دیتابیس در وضعیت فعلی (مانند دیتابیس محیط عملیات یا Staging) که می‌خواهیم طرحواره (Schema) آن را ارتقا دهیم .
*   **دیتابیس منبع (Source Database):** دیتابیسی که دارای ساختار جدید و مورد نظر ماست . برای ایجاد این دیتابیس جدید و همگام با کدهای سی‌شارپ جاری، معمولاً از متد الحاقی **`context.Database.EnsureCreated()`** در لایه تست استفاده می‌شود تا یک دیتابیس منطبق بر مدل ذهنی EF Core ساخته شود .

##### نحوه کارکرد فرآیند مقایسه فیزیکی جداول (`Figure 9.5`):

```
                                  ┌───────────────────────────┐
                                  │      کدهای دات‌نت جدید      │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
┌───────────────────────────┐     ┌───────────────────────────┐
│  Target DB (وضعیت فعلی)   │     │ Source DB (از EnsureCreated)│
└─────────────┬─────────────┘     └─────────────┬─────────────┘
              │                                 │
              └──────────────┬──────────────────┘
                             ▼
               ┌───────────────────────────┐
               │    ابزار مقایسه‌گر دیتابیس   │
               └─────────────┬─────────────┘
                             │
                             ▼
               ┌───────────────────────────┐
               │    اسکریپت نهایی تغییر SQL  │
               └───────────────────────────┘
```

##### ابزارهای پرکاربرد مقایسه طرحواره دیتابیس:
شما می‌توانید از ابزارهای تجاری قدرتمندی مانند **Redgate SQL Compare** یا ابزار داخلی و بومی ویژوال استودیو یعنی **SQL Server Schema Comparison** (واقع در منوی `Tools > SQL Server > New Schema Comparison`) استفاده کنید . 

پس از اتصال دیتابیس منبع و هدف به این ابزارها، تفاوت‌ها اسکن شده و اسکریپت SQL نهایی جهت ارتقای دیتابیس هدف به صورت کاملاً خودکار تولید می‌شود.

##### جدول تحلیل و ارزیابی رویکرد مقایسه‌گرها (`Table 9.3`):
*   **مزایا:** تولید خودکار کدهای SQL بدون نیاز به نوشتن دستی و مناسب برای توسعه‌دهندگانی که تسلط عمیقی بر زبان T-SQL ندارند .
*   **معایب و محدودیت‌ها:** این ابزارها توانایی تحلیل و خودکارسازی تغییرات شکست مرز داده (Data-loss Breaking Changes) را ندارند و همچنان نیازمند بررسی انسانی هستند . همچنین اسکریپت‌های خروجی معمولاً بسیار شلوغ بوده و حاوی کدهای تنظیمات ریز دیتابیس هستند.

---

#### ۹.۶.۲ روش دوم: نوشتن دستی کدهای تغییر (Handcoding SQL Change Scripts)

در این روش، شما مستقیماً کدهای مهاجرت فیزیکی را به زبان SQL می‌نویسید. برای ساده‌سازی کار، می‌توانید با اجرای دستور **`Script-DbContext`** (در Package Manager Console) یا **`dotnet ef migrations script`** (در CLI)، کدهای SQL پیش‌فرضی که EF Core برای ایجاد جداول استفاده می‌کند را خروجی گرفته و از آن‌ها به عنوان الگو برای نوشتن کدهای مهاجرت خود استفاده کنید .

##### نمونه کد تولیدی الگو با دستور ساخت فیزیکی جدول (`Listing 9.8`):

```sql
-- کدهای تولیدشده توسط EnsureCreated برای جدول Review
CREATE TABLE [Review] (
    [ReviewId] int NOT NULL IDENTITY,
    [VoterName] nvarchar(100) NULL,
    [NumStars] int NOT NULL,
    [Comment] nvarchar(max) NULL,
    [BookId] int NOT NULL,
    CONSTRAINT [PK_Review] PRIMARY KEY ([ReviewId]),
    CONSTRAINT [FK_Review_Books_BookId] FOREIGN KEY ([BookId]) REFERENCES [Books] ([BookId]) ON DELETE CASCADE
);

CREATE INDEX [IX_Review_BookId] ON [Review] ([BookId]); -- ساخت ایندکس کلید خارجی
```

##### مدیریت و سازماندهی اسکریپت‌های دستی:
اسکریپت‌های SQL تولید شده باید به صورت **منظم و مرتب با پیشوند‌های متوالی و تاریخ‌های زمان‌بندی صعودی** نام‌گذاری شوند تا ابزار اعمال مهاجرت بداند آن‌ها را به چه ترتیبی اجرا کند :
*   `Script001 - Create DatabaseRegions.sql` 
*   `Script002 - Create Tenant table.sql` 
*   `Script003 - TenantAddress table.sql` 

---

#### ۹.۶.۳ بررسی انطباق کامل کدهای SQL دستی با مدل مفهومی EF Core

بزرگ‌ترین کابوس زمان استفاده از روش اسکریپت‌های SQL دستی، **انحراف طرحواره (Schema Drift)** است؛ یعنی حالتی که در آن ساختار فیزیکی دیتابیس با مدل مفهومی لایه کدهای سی‌شارپ (`context.Model`) هماهنگ نباشد، که منجر به بروز خطاهای سخت و پنهان در زمان اجرای برنامه می‌شود .

برای مرتفع ساختن این چالش معماری، ابزار متن‌باز **`EfSchemaCompare`** (موجود در کتابخانه **`EfCore.SchemaCompare`** نوشته Jon P. Smith) توسعه یافته است .

```csharp
[Fact]
public void Test_DatabaseSchema_Matches_EfCoreModel()
{
    var options = this.CreateUniqueClassOptions<EfCoreContext>();
    using var context = new EfCoreContext(options);

    var comparer = new EfSchemaCompare(context);
    
    // مقایسه فیزیکی ساختار دیتابیس فعلی با مدل لایه کدهای C#
    bool isMatch = comparer.CompareWithDatabase(); // 
    
    // در صورت وجود هرگونه تداخل، لیست دقیق تفاوت‌ها نمایش داده می‌شود
    Assert.True(isMatch, comparer.GetAllErrorsMessage()); 
}
```

این تست واحد در خط لوله **CI/CD** قرار می‌گیرد و تضمین می‌کند که کدهای نوشته‌شده توسط توسعه‌دهندگان با اسکریپت‌های SQL اعمال‌شده به دیتابیس کاملاً منطبق هستند .

---

### بخش ۹.۷: مهندسی معکوس ساختار دیتابیس (Reverse Engineering / Scaffolding)

اگر با یک سیستم قدیمی با دیتابیس موجود و فعال سروکار دارید (Legacy Database) و قرار است برنامه جدیدی بر پایه EF Core روی آن بنویسید، **دیتابیس فیزیکی منبع حقیقت کل پروژه خواهد بود** . ویژگی مهندسی معکوس (Scaffolding) به شما اجازه می‌دهد تا کلاس‌های موجودیت دات‌نت و کلاس DbContext را به صورت اتوماتیک از روی پایگاه داده فیزیکی بسازید .

---

#### ۹.۷.۱ اجرای دستور مهندسی معکوس (Running Scaffold Command)

برای استخراج طرحواره دیتابیس و تولید کدهای متناظر، بسته به ترمینال خود یکی از دو دستور زیر را در پروژه اصلی (Startup Project) اجرا کنید :

*   **کنسول مدیریت پکیج (PMC):**
    ```powershell
    Scaffold-DbContext -Connection "name=DefaultConnection" -Provider Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
    ```
*   **خط فرمان دات‌نت (dotnet CLI):**
    ```bash
    dotnet ef dbcontext scaffold name=DefaultConnection Microsoft.EntityFrameworkCore.SqlServer -o Models
    ```

این دستور ارتباطات کلیدهای خارجی را اسکن کرده و به صورت خودکار روابط دوطرفه و پروپرتی‌های ناوبری را در هر دو سمت کلاس‌ها اعمال می‌سازد .

---

#### ۹.۷.۲ ارتقای فرآیند با ابزار گرافیکی EF Core Power Tools

اجرای دستورات متنی به دلیل طولانی بودن رشته‌های اتصال و پارامترها فرساینده است. افزونه محبوب **`EF Core Power Tools`** (توسعه‌یافته توسط Erik Ejlskov Jensen - @ErikEJ) یک رابط کاربری بصری (GUI) فوق‌العاده را به ویژوال استودیو اضافه می‌کند .

##### مزایای استفاده از Power Tools:
*   ذخیره تنظیمات و پارامترها در یک فایل کانفیگ داخلی برای استفاده در دفعات بعدی .
*   قابلیت شخصی‌سازی قالب تولید کدهای سی‌شارپ (T4 templates) .
*   امکان استفاده از فایل‌های **`.dacpac`** حاصل از پروژه دیتابیسی SQL Server (`.sqlproj`) برای به‌روزرسانی کدها بدون نیاز به اتصال به دیتابیس فعال .

---

#### ۹.۷.۳ چالش‌های تکامل کدهای مهندسی معکوس‌شده

استفاده مداوم از ابزار Scaffolding با یک چالش ساختاری عمیق در مهندسی نرم‌افزار همراه است: **با هر بار اجرای مجدد ابزار برای ثبت تغییرات جدید دیتابیس، تمام کلاس‌های دات‌نت قبلی دوباره ساخته شده و بازنویسی می‌شوند** . 

*   **چالش معماری:** اگر کدهای کلاس‌های دامنه خود را طبق الگوهای طراحی قلمرومحور (DDD) کپسوله‌سازی کرده باشید (مثلاً خصوصی کردن Setterها یا ایجاد متدهای بیزینسی)، اجرای مجدد Scaffolding تمام کدهای سفارشی شما را حذف خواهد کرد .
*   **راهکار معماری برتر (The Transition Strategy):** پیشنهاد می‌شود در ابتدای راه برای سرعت‌دهی، صرفاً **یک‌بار** دیتابیس قدیمی را مههدسی معکوس (Scaffold) کنید تا کلاس‌های اولیه دات‌نت ساخته شوند . سپس پیوند خود را با Scaffolding قطع کرده و کلاس سی‌شارپ را منبع حقیقت قرار دهید (Code-First)؛ پس از آن، تمام تغییرات طرحواره را با اسکریپت‌های دستی SQL یا مهاجرت‌های استاندارد EF Core به جلو ببرید .

---

### بخش ۹.۸: اعمال مهاجرت‌ها به پایگاه داده (Applying Your Migrations to a Database)

تا این مرحله، روش‌های مختلف ایجاد فایل‌های مهاجرت را بررسی کردیم. اکنون به یکی از حیاتی‌ترین مراحل یعنی **نحوه اعمال این مهاجرت‌ها بر روی پایگاه داده** (به ویژه دیتابیس محیط عملیاتی) می‌پردازیم. انتخاب روش اعمال مهاجرت، به شدت تحت تأثیر چگونگی ساخت آن و ویژگی‌های زیرساختی نرم‌افزار شما قرار دارد . 

به طور کلی، ۴ تکنیک اصلی برای اعمال مهاجرت‌ها وجود دارد که هر یک را با مزایا و محدودیت‌های مربوطه بررسی خواهیم کرد :

---

#### ۹.۸.۱ روش اول: فراخوانی متد `Database.Migrate` از درون برنامه اصلی (Startup Migration)

در این رویکرد، کدهایی به فایل استارت‌آپ برنامه (مانند متد `Main` در کلاس `Program` برنامه ASP.NET Core) اضافه می‌شود که قبل از بالا آمدن کامل برنامه و پاسخ‌دهی به درخواست‌ها، متد **`context.Database.Migrate()`** (یا نسخه ناهمگام آن `MigrateAsync`) را فراخوانی می‌کند.

##### مزایا و معایب (Table 9.6):
*   **مزایا:** پیاده‌سازی بسیار ساده و خودکار؛ پایداری بالا به این معنا که تضمین می‌کند دیتابیس همواره پیش از شروع به کار برنامه کاملاً به‌روز است.
*   **معایب و محدودیت‌ها:** 
    1.  **عدم پشتیبانی از قابلیت مقیاس‌پذیری افقی (Scaling Out):** اگر چندین نمونه (Instance) از وب‌سایت شما به طور همزمان بالا بیایند (مانند قرارگیری پشت Load Balancer یا مستقر در Kubernetes)، همه نمونه‌ها تلاش می‌کنند متد `Migrate` را به طور موازی اجرا کنند . از آنجا که این متد **نخ امن (Thread-safe) نیست**، این عملیات موازی قطعاً منجر به بروز تداخل و خرابی ساختار دیتابیس خواهد شد .
    2.  **قطع موقت دسترسی زمان خطا:** در صورت بروز هرگونه خطا در حین مهاجرت استارت‌آپ، کل فرآیند بالا آمدن برنامه متوقف شده و سایت از دسترس خارج می‌شود.

##### تشخیص مهاجرت‌های اعمال‌شده به صورت پویا در کد:
گاهی تمایل دارید بلافاصله پس از اعمال یک مهاجرت خاص، کدهای سی‌شارپ سفارشی را روی داده‌ها اجرا کنید (مانند پر کردن دستی یک فیلد محاسباتی). شما می‌توانید با استفاده از متد‌های **`GetPendingMigrations`** (مهاجرت‌های در صف اعمال) و **`GetAppliedMigrations`** (مهاجرت‌های اعمال‌شده قبلی) این کار را انجام دهید:

```csharp
// دریافت لیست مهاجرت‌هایی که قرار است اعمال شوند (باید قبل از Migrate صدا زده شود)
var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

await context.Database.MigrateAsync(); // اعمال مهاجرت‌ها

// بررسی اینکه آیا مهاجرت خاصی در این مرحله اعمال شده است یا خیر
if (pendingMigrations.Any(m => m.EndsWith("InitialMigration")))
{
    // اجرای کدهای جبرانی دات‌نت بر روی دیتابیس جدید
    await RunPostMigrationDataFixAsync(context); // 
}
```

---

#### ۹.۸.۲ روش دوم: اجرای متد `Database.Migrate` از طریق یک برنامه مستقل (Standalone Application)

در این روش، اعمال مهاجرت از برنامه اصلی وب شما جدا شده و به یک کلاینت یا برنامه کنسول مستقل (Console App) سپرده می‌شود که DbContext پروژه را در خود دارد. همچنین می‌توانید از دستور خط فرمان ابزار EF Core استفاده کنید:
```bash
dotnet ef database update --connection "رشته اتصال دیتابیس عملیاتی"
```

##### مزایا و معایب (Table 9.7):
*   **مزایا:** حل مشکل تداخل اجرای موازی (چون مهاجرت صرفاً یک‌بار از طریق برنامه مستقل اجرا می‌شود) و دریافت کدهای خطای بسیار دقیق‌تر در صورت بروز شکست.
*   **محدودیت‌ها:** برای اعمال این مهاجرت، باید دسترسی کاربران به سیستم به طور موقت قطع شده یا اصطلاحاً فرآیند "تعمیر و نگهداری" (Down for Maintenance) فعال شود . این روش در سیستم‌های توزیع‌شده با ابزارهای CI/CD (مانند متوقف کردن کانتینرها، اجرای دستور خط فرمان مهاجرت و سپس بالا آوردن کانتینرهای جدید) بسیار رایج است.

---

#### ۹.۸.۳ روش سوم: استخراج و اعمال مهاجرت از طریق اسکریپت‌های SQL (Idempotent SQL Scripts)

یکی از ایمن‌ترین و توصیه‌شده‌ترین روش‌ها برای محیط‌های عملیاتی، تبدیل مهاجرت‌های سی‌شارپ به اسکریپت‌های خالص SQL با استفاده از ابزار مهاجرت است:

*   **در کنسول PMC:** `Script-Migration -Idempotent`
*   **در خط فرمان CLI:** `dotnet ef migrations script --idempotent`

##### نقش حیاتی پارامتر Idempotent (تغییرناپذیر):
اگر اسکریپت بدون این پارامتر تولید شود، صرفاً شامل دستورات خام تبدیل است و فرض می‌کند دیتابیس در حالت صفر است. اما افزودن پارامتر **`idempotent`** باعث می‌شود EF Core کدهای SQL را با **بلاک‌های شرطی بررسی جدول تاریخچه مهاجرت** (`__EFMigrationsHistory`) احاطه کند. در این حالت، اسکریپت را می‌توان بدون هیچ خطایی بارها روی هر دیتابیسی اجرا کرد؛ زیرا دیتابیس به طور هوشمند ستون‌ها را بررسی کرده و صرفاً کدهای مربوط به بخش‌های اعمال‌نشده را اجرا می‌کند .

##### مزایا و معایب (Table 9.8):
*   **مزایا:** از نسخه EF Core 5 به بعد، این اسکریپت‌ها به طور بومی درون **تراکنش‌های SQL (Transactions)** اجرا می‌شوند؛ بنابراین در صورت شکست یکی از خطوط، کل تراکنش به طور کامل به عقب بازمی‌گردد (Rollback). همچنین اسکریپت نهایی قبل از اعمال، توسط مدیر دیتابیس (DBA) قابل بازبینی و ویرایش است.

---

#### ۹.۸.۴ روش چهارم: اعمال اسکریپت‌های دستی SQL با ابزارهای مدیریت مهاجرت (Migration Tools)

اگر منبع حقیقت شما کدهای SQL دستی هستند (بخش ۹.۶)، برای اعمال آن‌ها به محیط عملیاتی به یک ابزار مدیریت مهاجرت مانند **DbUp** (یک کتابخانه سبک و متن‌باز دات‌نت) نیاز دارید. این ابزارها جدول اختصاصی خود را در دیتابیس (مثلاً جدول `SchemaVersions` در DbUp) ایجاد کرده و تضمین می‌کنند که هر فایل اسکریپت دقیقاً یک‌بار و بر اساس ترتیب نام‌گذاری عددی آن اجرا می‌شود .

---

### بخش ۹.۹: مهاجرت دیتابیس در حین اجرای برنامه و بدون داون‌تایم (Migrating a Database While the Application Is Running)

در پروژه‌های بزرگ با کاربران فعال در سراسر جهان (مانند آمازون یا گیت‌هاب) که سرویس‌دهی مداوم (Continuous-Service Applications) یک الزام است، به هیچ وجه نمی‌توان سیستم را برای مهاجرت دیتابیس خاموش کرد . چالش بزرگ این است که تغییرات جدول دیتابیس نباید باعث از کار افتادن نسخه‌ای از برنامه شود که در همان لحظه در حال پاسخ‌گویی به کاربران است .

```
                ┌────────────────────────────────────────────────────────┐
                │          رویکردهای مهاجرت پایگاه داده عملیاتی          │
                └───────────────────────────┬────────────────────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
          تعمیر و نگهداری (Maintenance)                     سرویس‌دهی مداوم (Continuous)
          - متوقف کردن موقت برنامه                         - برنامه بدون داون‌تایم فعال می‌ماند.
          - ایجاد صفحه پوزش و انتظار                        - دیتابیس و کدها باید همزمان با نسخه
          - اعمال مستقیم تمام تغییرات                        قبلی و جدید سازگار باشند (Expand/Contract).
```

---

#### ۹.۹.۱ سناریوی اول: مهاجرت‌های غیرمخرب (Non-breaking changes)

اگر تغییر شما غیرمخرب باشد (مانند افزودن یک جدول جدید یا اضافه کردن یک ستون جدید به جدول موجود)، کار ساده‌تر است. با این حال، باید نکات زیر را رعایت کنید تا نسخه فعلی برنامه با خطا مواجه نشود:

*   **ستون‌های جدید باید حتماً نول‌پذیر (Nullable) باشند** یا دارای یک مقدار پیش‌فرض دیتابیس (`Default Value`) باشند . در غیر این صورت، وقتی نسخه قدیمی کدهای در حال اجرا سطری را درج می‌کند، چون از ستون جدید بی‌خبر است و مقداری برای آن نمی‌فرستد، دیتابیس خطای `NOT NULL Constraint` صادر کرده و تراکنش را خراب می‌کند.
*   **کلیدهای خارجی جدید نیز باید نول‌پذیر باشند** تا از بروز خطای یکپارچگی مراجع جلوگیری شود.

---

#### ۹.۹.۲ سناریوی دوم: مهاجرت‌های مخرب برنامه (Application-Breaking Changes)

پیاده‌سازی یک تغییر ساختاری بزرگ (مانند انتقال ستون‌های آدرس از جدول `Users` به جدول جدید `Addresses` بر اساس الگوی بخش ۹.۵.۲) در یک سایت بدون داون‌تایم، چالش‌برانگیزترین نوع مهاجرت است. اگر این کار را در یک مرحله انجام دهید، به محض اعمال مهاجرت، کدهای قبلی برنامه که تلاش می‌کنند فیلد آدرس را مستقیماً از جدول `Users` بخوانند یا بنویسند، بلافاصله کرش می‌کنند.

برای حل این مسئله، باید از الگوی **انبساط و انقباض (Expand and Contract)** استفاده کنیم. این الگو عملیات را به **۵ مرحله مجزا و ۳ فایل مهاجرت مستقل** تقسیم می‌کند تا دیتابیس در هیچ لحظه‌ای با کدهای در حال اجرا دچار تعارض نشود :

##### نمودار مراحل ۵ گانه الگو (`Figure 9.9`):

```
[مرحله ۱: شروع] ──► [مرحله ۲: مهاجرت اول (ADD)] ──► [مرحله ۳: مهاجرت دوم (COPY)] ──► [مرحله ۴: انتشار نسخه جدید] ──► [مرحله ۵: مهاجرت سوم (SUBTRACT)]
   App1 فعال             App2 (میانی) فعال             توقف App1 و کپی کامل داده‌ها             App3 (جدید) فعال              حذف ستون‌های اضافی و پاک‌سازی
```

##### شرح گام‌به‌گام مراحل:
1.  **مرحله ۱ (شروع):** نسخه قدیمی برنامه (`App1`) روی دیتابیس اصلی در حال اجراست.
2.  **مرحله ۲ (مهاجرت اول - ADD):** اولین فایل مهاجرت را اعمال می‌کنیم. این مهاجرت بدون حذف ستون‌های قدیمی، جدول جدید `Addresses` را ساخته و یک **SQL View** یا تریگر ایجاد می‌کند که داده‌های آدرس را همزمان در هر دو لایه نگه می‌دارد . اکنون نسخه میانی برنامه (`App2`) مستقر می‌شود؛ این نسخه برای خواندن از View استفاده می‌کند و برای نوشتن، هر دو لایه را مقداردهی می‌کند.
3.  **مرحله ۳ (مهاجرت دوم - COPY):** در این مرحله دسترسی نسخه قدیمی (`App1`) به طور کامل قطع شده و دومین مهاجرت که صرفاً یک اسکریپت بهینه کپی داده‌ها است اجرا می‌شود تا داده‌های آدرس‌های قدیمیِ کپی‌نشده را به جدول جدید منتقل کند .
4.  **مرحله ۴ (انتشار نسخه نهایی):** نسخه نهایی نرم‌افزار (`App3`) مستقر شده و شروع به کار می‌کند؛ این نسخه داده‌های آدرس را صرفاً از جدول فیزیکی جدید `Addresses` می‌خواند و می‌نویسد.
5.  **مرحله ۵ (مهاجرت سوم - SUBTRACT / پاک‌سازی):** پس از اطمینان از صحت کارکرد سیستم، آخرین مهاجرت اجرا می‌شود. این مهاجرت ستون‌های قدیمی آدرس را از جدول `Users` و همچنین SQL Viewهای موقت مرحله دوم را حذف کرده و دیتابیس را به ساختار بهینه نهایی می‌رساند.

---

### فصل ۱۰: پیکربندی ویژگی‌های پیشرفته و مدیریت همزمانی داده‌ها (Configuring Advanced Features and Handling Concurrency Conflicts)

در فازهای پیشرفته توسعه نرم‌افزار، صرفاً نگاشت‌های ساده کلاس به جدول پاسخگوی نیازهای پروژه نیستند. برای رسیدن به بالاترین سطح از کارایی و انعطاف‌پذیری، نیاز است محاسبات فیزیکی سنگین را به موتور بانک اطلاعاتی منتقل کنیم . همچنین در برنامه‌هایی با کاربران همزمان بالا، مدیریت برخورد داده‌ها (Concurrency Conflicts) برای حفظ پایداری سیستم یک الزام حیاتی به شمار می‌رود .

این فصل به کالبدشکافی قابلیت‌های فوق پیشرفته EF Core در تعامل مستقیم با بانک اطلاعاتی اختصاص دارد.

---

### بخش ۱۰.۱: استفاده از توابع تعریف‌شده توسط کاربر (UDFs) با ابزار `DbFunction`

بانک‌های اطلاعاتی رابطه‌ای نظیر SQL Server مجهز به قابلیتی به نام **User-Defined Functions (UDFs)** هستند که به توسعه‌دهنده اجازه می‌دهد کدهای SQL محاسباتی سفارشی را بنویسد که مستقیماً روی سرور دیتابیس اجرا می‌شوند . UDFها با دسترسی مستقیم به داده‌ها، سربار انتقال رکوردها به سمت کلاینت را حذف کرده و عملکرد پرس‌وجوها را به شدت ارتقا می‌دهند .

#### انواع توابع تعریف‌شده در بانک اطلاعاتی:
1.  **تابع اسکالر (Scalar-valued Function):** تابعی که پارامترهایی را دریافت کرده، محاسباتی را انجام می‌دهد و در نهایت **یک مقدار واحد** (مانند عدد یا رشته) بازمی‌گرداند .
2.  **تابع جدول‌محور (Table-valued Function):** تابعی پویاتر که خروجی آن به صورت **مجموعه‌ای از سطرها و ستون‌ها (Table)** است و مانند یک جدول فیزیکی قابلیت پرس‌وجو دارد .

> **تفاوت کلیدی با Stored Procedures:** توابع (UDFs) صرفاً مجاز به پرس‌وجو و خواندن داده‌ها (`SELECT`) هستند و هیچ قدرتی برای ویرایش، درج یا حذف داده‌ها (`INSERT/UPDATE/DELETE`) ندارند.

---

#### ۱۰.۱.۱ پیکربندی توابع اسکالر (Scalar-valued UDFs)

برای به‌کارگیری یک تابع اسکالر دیتابیس در کدهای LINQ، ابتدا باید یک **متد هم‌امضا (Signature)** در کدهای سی‌شارپ ایجاد کنید تا به عنوان نماینده آن تابع عمل کند . 

##### مرحله اول: تعریف متد هم‌امضا در کدهای سی‌شارپ
بهترین شیوه، ایجاد یک کلاس static اختصاصی برای متدهای کمکی UDF است تا کدهای کلاس `DbContext` شلوغ نشود. متد زیر نماینده تابعی به نام `AverageVotes` در دیتابیس است که میانگین امتیاز رکوردهای مربوط به یک کتاب را محاسبه می‌کند :

```csharp
public static class MyUdfMethods
{
    // ۱. متد بدنه ندارد، زیرا هرگز در سمت نرم‌افزار اجرا فیزیکی نخواهد شد
    public static double? AverageVotes(int bookId)
    {
        // ۲. مقدار بازگشتی فرضی صرفاً جهت رفع خطای کامپایلر است
        throw new NotImplementedException("این متد صرفاً توسط EF Core به دستور SQL ترجمه می‌شود."); 
    }
}
```

##### مرحله دوم: ثبت متد به عنوان تابع دیتابیس
شما به دو روش می‌توانید ارتباط بین متد سی‌شارپ و تابع دیتابیس را برای مدل مفهومی EF Core تبیین کنید:

*   **روش اول: استفاده از ویژگی `[DbFunction]` (توصیه‌شده):**
    کافی است اتریبیوت را مستقیماً بالای امضای متد قرار دهید:
    ```csharp
    [DbFunction("AverageVotes", Schema = "dbo")] //
    public static double? AverageVotes(int bookId) => throw new NotImplementedException();
    ```
*   **روش دوم: استفاده از Fluent API در متد `OnModelCreating`:**
    اگر متد را در کلاس خارجی تعریف کرده‌اید، با متد **`HasDbFunction`** آن را به صورت دستی ثبت کنید :
    ```csharp
    modelBuilder.HasDbFunction(typeof(MyUdfMethods).GetMethod(nameof(MyUdfMethods.AverageVotes), new[] { typeof(int) }))
                .HasName("AverageVotes") // نام فیزیکی تابع در دیتابیس
                .HasSchema("dbo"); // طرحواره دیتابیس
    ```

---

#### ۱۰.۱.۲ پیکربندی توابع جدول‌محور (Table-valued UDFs)

توابع جدول‌محور داده‌ها را به شکل یک ساختار جدولی برمی‌گردانند. برای مپ کردن خروجی این توابع، ابتدا به یک کلاس مدل متناظر (بدون کلید اصلی) جهت دریافت سطرها نیاز دارید :

```csharp
// کلاسی برای نگهداری فیلدهای دریافتی از تابع جدول‌محور
public class TableFunctionOutput
{
    public string Title { get; set; }
    public int ReviewsCount { get; set; }
    public double? AverageVotes { get; set; }
}
```

##### نحوه تعریف امضا درون کلاس DbContext:
برخلاف توابع اسکالر، توابع جدول‌محور **حتماً باید به صورت یک متد غیر استاتیک درون کلاس DbContext شما تعریف شوند**؛ زیرا برای ارائه‌ی خروجی کلکسیونی نیاز به فراخوانی متد داخلی **`FromExpression`** دارند:

```csharp
public class BookDbContext : DbContext
{
    // DbSet موقت برای کلاس خروجی بدون کلید
    public DbSet<TableFunctionOutput> TableFunctionOutputs { get; set; }

    // تعریف امضای تابع دیتابیس
    public IQueryable<TableFunctionOutput> GetBookTitleAndReviewsFiltered(int minStars)
    {
        // فراخوانی FromExpression جهت تبدیل متد به کدهای سیستمی دیتابیس
        return FromExpression(() => GetBookTitleAndReviewsFiltered(minStars)); 
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ۱. پیکربندی کلاس خروجی به عنوان موجودیت فاقد کلید اصلی
        modelBuilder.Entity<TableFunctionOutput>().HasNoKey(); //

        // ۲. ثبت متد کانتکست به عنوان DbFunction
        modelBuilder.HasDbFunction(() => GetBookTitleAndReviewsFiltered(default)); //
    }
}
```

---

#### ۱۰.۱.۳ اضافه کردن کدهای فیزیکی UDF به دیتابیس

از آنجا که EF Core کدهای نوشته شده درون متدهای سی‌شارپ UDF را ترجمه فیزیکی نمی‌کند، **باید اسکریپت فیزیکی ایجاد تابع را قبل از اولین فراخوانی به بانک اطلاعاتی ارسال کرده باشید**. برای این کار دو روش مرسوم وجود دارد:

1.  **روش اول: ویرایش فایل مهاجرت (Migrations) - پیشنهاد شده برای Production:**
    با ایجاد یک مهاجرت خالی، دستور فیزیکی ساخت تابع را با متد `migrationBuilder.Sql` به مهاجرت تزریق کنید.
2.  **روش دوم: اجرای مستقیم کدهای SQL در فاز راه‌اندازی (به ویژه در تست‌ها):**
    ```csharp
    context.Database.ExecuteSqlRaw(@"
        CREATE FUNCTION dbo.AverageVotes (@bookId INT)
        RETURNS FLOAT
        AS
        BEGIN
            DECLARE @Result FLOAT;
            SELECT @Result = AVG(CAST(NumStars AS FLOAT)) FROM Reviews WHERE BookId = @bookId;
            RETURN @Result;
        END"); 
    ```

---

#### ۱۰.۱.۴ فراخوانی و به‌کارگیری UDF در پرس‌وجوهای LINQ

به محض اتمام فرآیند ثبت و مهاجرت دیتابیس، فراخوانی این توابع در کدهای LINQ به سادگی استفاده از متدهای بومی سی‌شارپ خواهد بود:

```csharp
// کوئری بازیابی اطلاعات کلیدی کتاب همراه با اجرای تابع محاسباتی سمت سرور دیتابیس
var bookReport = context.Books
                        .Select(b => new BookListDto
                        {
                            BookId = b.BookId,
                            Title = b.Title,
                            // فراخوانی مستقیم متد UDF درون بدنه سلکت
                            AverageStars = MyUdfMethods.AverageVotes(b.BookId) 
                        })
                        .ToList();
```

##### کد SQL کامپایل شده و ارسالی به بانک اطلاعاتی توسط EF Core:
```sql
SELECT [b].[BookId], [b].[Title], [dbo].AverageVotes([b].[BookId]) AS [AverageStars]
FROM [Books] AS [b]; --
```

---

### بخش ۱۰.۲: ستون‌های محاسباتی (Computed Columns)

یکی دیگر از ویژگی‌های قدرتمند سمت دیتابیس، **ستون‌های محاسباتی (Computed Columns)** هستند. این ستون‌ها مقادیری را در خود نگهداری می‌کنند که فرمول محاسباتی آن‌ها بر اساس سایر ستون‌های موجود در همان سطر (Row) یا توابع داخلی سیستم مشخص شده است . 

#### رویکردهای دوگانه ستون‌های محاسباتی:
*   **ستون محاسباتی پویا (Dynamic/Virtual Computed Column):** محاسبات فیزیکی در بانک اطلاعاتی **به ازای هر بار خوانده شدن سطر** به صورت پویا تکرار و ارزیابی می‌شود .
*   **ستون محاسباتی پایدار (Persisted Computed Column):** محاسبات فیزیکی **صرفاً زمان ثبت اولیه یا به‌روزرسانی سایر ستون‌های وابسته** انجام شده و نتیجه به صورت فیزیکی روی دیسک دیتابیس ذخیره می‌شود . این رویکرد به شما اجازه می‌دهد تا برای افزایش سرعت جستجو، روی این ستون‌ها **ایندکس (Index)** بسازید .

---

#### ۱۰.۲.۱ نمونه پیاده‌سازی ستون محاسباتی و پیکربندی با Fluent API

سناریویی را در نظر بگیرید که در آن کلاس موجودیت شخص (`Person`)، دارای ویژگی‌های نام، نام خانوادگی و تاریخ تولد است . مایل هستیم ستون‌های زیر را به عنوان فیلد محاسباتی در دیتابیس مپ کنیم :
1.  **`YearOfBirth` (پویا):** استخراج صرفاً سال تولد از فیلد پشتیبان دیتابیس .
2.  **`FullName` (پایدار):** ترکیب نام و نام خانوادگی کاربر جهت استفاده دائمی در فیلترها و مرتب‌سازی‌ها بدون نیاز به محاسبات سمت کلاینت .

##### کلاس موجودیت شخص (`Listing 10.6`):

```csharp
public class Person
{
    public int PersonId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    // فیلد محاسباتی ترکیبی (از آنجا که مقدار توسط دیتابیس تولید می‌شود، Setter خصوصی است)
    public string FullName { get; private set; } 

    private DateTime _dateOfBirth; // فیلد پشتیبان تاریخ تولد دقیق

    // ستون محاسباتی سال تولد
    public int YearOfBirth { get; private set; } 

    public void SetDateOfBirth(DateTime dob) => _dateOfBirth = dob;
}
```

##### پیکربندی Fluent API در متد `OnModelCreating` (`Listing 10.7`):

برای مپ کردن این ستون‌ها، از متد‌های کلیدی **`HasComputedColumnSql`** استفاده می‌شود. برای ستون‌های پایدار، باید پارامتر دوم یعنی **`stored: true`** را صریحاً فعال کنید :

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Person>(entity =>
    {
        // ۱. تنظیم ستون محاسباتی پویا (سال تولد)
        entity.Property(p => p.YearOfBirth)
              .HasComputedColumnSql("DATEPART(year, [DateOfBirth])"); //

        // ۲. تنظیم ستون محاسباتی پایدار (نام کامل)
        entity.Property(p => p.FullName)
              .HasComputedColumnSql("[FirstName] + ' ' + [LastName]", stored: true); //

        // ۳. ساخت ایندکس فیزیکی روی ستون پایدار جهت افزایش پرفورمنس جستجوها
        entity.HasIndex(p => p.FullName); 
        
        // پیکربندی فیلد پشتیبان غیررابطه‌ای
        entity.Property<DateTime>("_dateOfBirth")
              .HasColumnName("DateOfBirth"); //
    });
}
```

---

#### ۱۰.۲.۲ فرآیند خواندن و به‌روزرسانی مقادیر توسط EF Core

از آنجا که مدیریت مقادیر این ستون‌ها به طور کامل در دست بانک اطلاعاتی است، کلاس‌های موجودیت هنگام تراکنش رفتار متفاوتی را نشان می‌دهند :

```
کد دات‌نت: تغییر FirstName یا LastName ──► ارسال دستور UPDATE فیزیکی به دیتابیس
                                                              │
                                                              ▼
کدهای مپ‌شده C# بروزرسانی می‌شوند ◄── خواندن همزمان مقادیر جدید FullName و YearOfBirth ◄── محاسبه فیزیکی ستون محاسباتی در دیتابیس
```

۱. **در زمان درج یا ویرایش (`SaveChanges`):**
موتور EF Core به صورت هوشمند این ویژگی‌ها را به عنوان فیلدهای فقط‌خواندنی شناسایی کرده و آن‌ها را از دستورات درج فیزیکی (`INSERT/UPDATE`) دیتابیس خارج می‌کند. 
۲. **بازخوانی آنی داده‌ها:**
بلافاصله پس از اتمام اجرای دستور فیزیکی درج یا به‌روزرسانی در دیتابیس، EF Core با مجهز کردن کوئری به بند `OUTPUT` (در SQL Server)، مقادیر تازه محاسباتی را از دیتابیس بازخوانی کرده و ویژگی‌های کلاس سی‌شارپ شما را به صورت خودکار به‌روزرسانی می‌کند تا کدهای شما همیشه به داده‌های واقعی دسترسی داشته باشند .

---

### بخش ۱۰.۳: تنظیم مقادیر پیش‌فرض برای ستون‌های دیتابیس (Setting a Default Value)

هنگامی که یک موجودیت در کدهای دات‌نت نمونه‌سازی می‌شود، خصوصیات آن دارای مقادیر پیش‌فرض CLR متناظر با نوع داده خود (مانند `0` برای `int` یا `null` برای `string`) هستند. فریم‌ورک EF Core سه روش مکمل و بسیار کارآمد را برای تخصیص مقادیر پیش‌فرض متفاوت در سطح فیزیکی بانک اطلاعاتی یا لایه نرم‌افزار ارائه می‌دهد:

#### ۱. متد `HasDefaultValue` (تزریق مقادیر ثابت در دیتابیس)
این متد به ابزار مهاجرت (Migration) دستور می‌دهد تا قید فیزیکی `DEFAULT` را به همراه یک مقدار ثابت و مشخص به ستون جدول در پایگاه داده اضافه کند.
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Person>()
                .Property(p => p.DateOfBirth)
                .HasDefaultValue(new DateTime(2000, 1, 1)); //
}
```
این کار در زمان ساخت یا ارتقای پایگاه داده، قید فیزیکی `DEFAULT '2000-01-01T00:00:00.0000000'` را روی ستون دیتابیس تعریف خواهد کرد.

#### ۲. متد `HasDefaultValueSql` (فراخوانی توابع داینامیک دیتابیس)
استفاده از مقادیر ثابت محدودیت‌های خاص خود را دارد. در سناریوهایی مانند ثبت زمان ایجاد رکورد (Auditing)، نیاز داریم از توابع پویا و بومی دیتابیس استفاده کنیم. متد **`HasDefaultValueSql`** به شما اجازه می‌دهد تا هر دستور بومی SQL (نظیر تابع `GETUTCDATE()` در SQL Server) را مستقیماً به عنوان قید پیش‌فرض ستون معرفی کنید:
```csharp
modelBuilder.Entity<DefaultTest>()
            .Property(x => x.CreatedOn)
            .HasDefaultValueSql("getutcdate()"); //
```

> **💡 نکته طلایی معماری:** برای فیلدهایی مانند `CreatedOn` که مقدار آن‌ها صرفاً باید توسط پایگاه داده ایجاد شود و لایه برنامه هرگز نباید مجاز به تغییر دستی آن‌ها باشد، پروپرتی را با **Setter خصوصی** (`{ get; private set; }`) تعریف کنید. در این حالت، کدهای سی‌شارپ شما امکان ویرایش فیلد را ندارند و ستون دیتابیس مقدار اولیه خود را به صورت ۱۰۰٪ امن از تابع SQL دریافت خواهد کرد.

#### ۳. متد `HasValueGenerator` (تولید مقدار پیش‌فرض در لایه کلاینت)
اگر مایل نیستید بار محاسباتی تولید مقادیر به دیتابیس منتقل شود، یا فرمول تولید مقدار پیش‌فرض به داده‌های دیگرِ داخل نرم‌افزار وابسته است (مانند ایجاد شناسه‌های رهگیری ترکیبی متشکل از نام کاربر، تاریخ جاری و یک شناسه یکتا)، می‌توانید از مولدهای مقدار در لایه کلاینت بهره ببرید. برای این منظور، کلاسی بسازید که از کلاس پایه **`ValueGenerator<T>`** ارث‌بری کند:

```csharp
public class OrderIdGenerator : ValueGenerator<string>
{
    public override string Next(EntityEntry entry)
    {
        // دسترسی به سایر پروپرتی‌های موجودیت جاری جهت استفاده در محاسبات
        var name = entry.Property("Name").CurrentValue; //
        var ticks = DateTime.UtcNow.ToString("s"); //
        var guidString = Guid.NewGuid().ToString(); //
        
        return $"{name}-{ticks}-{guidString}"; //
    }

    // اگر متد مقدار واقعی برای ذخیره تولید می‌کند، مقدار زیر را روی false تنظیم کنید
    public override bool GeneratesTemporaryValues => false; //
}
```
سپس این کلاس را با Fluent API به پروپرتی متناظر متصل کنید:
```csharp
modelBuilder.Entity<DefaultTest>()
            .Property(x => x.OrderId)
            .HasValueGenerator<OrderIdGenerator>(); //
```

#### 🚨 قوانین رفتاری بسیار حیاتی در به‌کارگیری مقادیر پیش‌فرض:
* **نقش حیاتی مقادیر پیش‌فرض CLR:** موتور EF Core تنها زمانی دستور اعمال مقدار پیش‌فرض را صادر می‌کند که پروپرتیِ مورد نظر در زمان لود یا تراکنش، **دقیقا حاوی مقدار پیش‌فرض نوع داده خود در دات‌نت (CLR Default) باشد**. برای مثال، اگر ستونی از نوع `int` تعریف شده باشد و شما رکوردی با مقدار `0` را ثبت کنید، چون `0` مقدار پیش‌فرض CLR است، EF Core ستون را از دستور درج حذف کرده و دیتابیس قید پیش‌فرض را اعمال می‌کند. اما اگر مقدار پروپرتی هر چیزی غیر از صفر (حتی منفی یک) باشد، همان مقدار مستقیماً ذخیره شده و قید پیش‌فرض دیتابیس نادیده گرفته می‌شود.
* **زمان اعمال:** مقداردهی پیش‌فرض دیتابیس (رویکرد اول و دوم) تا زمان فراخوانی متد `SaveChanges` و اجرای فیزیکی دستورات در پایگاه داده اتفاق نمی‌افتد. اما مولدهای مقدار نرم‌افزاری (رویکرد سوم)، بلافاصله در حافظه و به محض فراخوانی متد `Add` مقداردهی را روی موجودیت اعمال می‌کنند.

---

### بخش ۱۰.۴: دنباله‌ها (Sequences) - تولید اعداد سریال مرتب و بدون گپ فیزیکی

در بانک‌های اطلاعاتی رابطه‌ای، ستون‌های از نوع `IDENTITY` پایداری لازم برای تولید اعداد کاملاً متوالی را تضمین نمی‌کنند. اگر در اثنای یک تراکنش خطایی رخ دهد، اعدادی که توسط موتور هویتی مصرف شده‌اند از بین می‌روند و در دنباله شماره سریال رکوردهای بعدی گپ‌های بزرگی (مانند ۱، ۲، ۱۰، ۱۱) پدید می‌آید. 

یک **دنباله (Sequence)** یک شیء مستقل و مجزا در طرحواره دیتابیس است که اعدادی را با ترتیب فوق‌العاده سخت‌گیرانه، مرتب و بدون گپ تولید و مدیریت می‌کند که برای شماره‌گذاری فاکتورها، اسناد مالی و فیش‌های ثبت سفارش بسیار کاربرد دارد. از آنجا که دنباله به جدول فیزیکی خاصی وابسته نیست، کل سیستم دیتابیس می‌تواند به صورت سراسری به آن دسترسی داشته باشد.

#### نحوه تعریف و اتصال دنباله در Fluent API (`Listing 10.10`):

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // ۱. تعریف و ساخت فیزیکی شیء دنباله در دیتابیس
    modelBuilder.HasSequence<int>("OrderNumber", schema: "shared")
                .StartsAt(1) // نقطه شروع دنباله
                .IncrementsBy(1); // گام افزایش اعدا به ازای هر درخواست

    // ۲. اتصال فیلد شماره سفارش به دنباله با فراخوانی دستور NEXT VALUE FOR
    modelBuilder.Entity<Order>()
                .Property(o => o.OrderNo)
                .HasDefaultValueSql("NEXT VALUE FOR shared.OrderNumber"); //
}
```

---

### بخش ۱۰.۵: نشانه‌گذاری پروپرتی‌های تولیدشده توسط دیتابیس (Database-Generated Properties)

در سناریوهای اتصال به بانک‌های اطلاعاتی موجود (که مایل نیستید مهاجرت‌های EF Core تغییری در ساختار فیزیکی جداول آن‌ها ایجاد کند)، گاهی نیاز است به موتور ردیاب تغییرات (Change Tracker) بقبولانید که مقادیر برخی ستون‌ها به طور خودکار توسط تریگرها، کدهای محاسباتی داخلی یا توابع پیش‌فرض دیتابیس تولید می‌شوند. 

بدون این نشانه‌گذاری، EF Core در زمان اجرای متد `SaveChanges` تلاش می‌کند مقادیر پیش‌فرض محلی دات‌نت را به جدول بفرستد که موجب بازنویسی داده‌های تریگر یا بروز خطاهای قید دیتابیس می‌گردد. برای تفهیم نحوه تولید مقادیر به صورت دستی، سه متد زنجیره‌ای در Fluent API در دسترس است:

#### ۱. متد `ValueGeneratedOnAddOrUpdate` (معادل `DatabaseGeneratedOption.Computed`)
به ردیاب تغییرات تفهیم می‌کند که مقدار این ستون دیتابیس **در زمان هر بار عملیات درج (`INSERT`) یا به‌روزرسانی (`UPDATE`) مجدداً محاسبه و تغییر می‌یابد**. بنابراین، EF Core ستون مذکور را به طور کامل از دستورات ارسالی نوشتن حذف کرده و بلافاصله پس از انجام تراکنش، مقدار جدید تولیدشده توسط دیتابیس را بازخوانی کرده و موجودیت را به‌روز می‌کند.
```csharp
modelBuilder.Entity<Person>()
            .Property(p => p.YearOfBirth)
            .ValueGeneratedOnAddOrUpdate(); //
```

#### ۲. متد `ValueGeneratedOnAdd` (معادل `DatabaseGeneratedOption.Identity`)
به کانتکست اطلاع می‌دهد که مقدار این ویژگی **صرفاً در زمان درج اولیه رکورد (`INSERT`) توسط پایگاه داده ایجاد می‌شود** و در زمان آپدیت‌های بعدی ثابت باقی می‌ماند.
```csharp
modelBuilder.Entity<MyEntity>()
            .Property(p => p.CreatedOn)
            .ValueGeneratedOnAdd(); //
```

#### ۳. متد `ValueGeneratedNever` (معادل `DatabaseGeneratedOption.None`)
این تنظیم حالت عادی ستون‌ها را تداعی می‌کند؛ یعنی دیتابیس هیچ نقشی در مقداردهی اولیه یا ثانویه آن ندارد و مسئولیت تأمین مقدار به طور کامل بر دوش نرم‌افزار است. 
* **کاربرد حیاتی برای کلیدهای Guid:** به طور پیش‌فرض، اگر کلید اصلی جدول از نوع `Guid` تعریف شود، EF Core به صورت خودکار یک مقدارساز پویا به نام `SequentialGuidValueGenerator` را روی آن فعال می‌کند تا زمان درج، کلیدها را در کلاینت بسازد. اگر شما ملزم هستید که مقدار کلیدهای `Guid` را خودتان دستی مشخص کنید (مثلاً مقادیر از سرویس خارجی ارسال می‌شوند)، با اعمال این متد، تولید خودکار کلید را به طور کامل غیرفعال سازید:
```csharp
modelBuilder.Entity<MyEntity>()
            .Property(p => p.MyGuidKey)
            .ValueGeneratedNever(); //
```

---

### بخش ۱۰.۶: مدیریت تداخل همزمانی داده‌ها (Concurrency Conflicts)

یکی از چالش‌های اساسی در برنامه‌هایی با کاربران همزمان بالا، ویرایش همزمان یک رکورد مشترک در بانک اطلاعاتی است. به طور پیش‌فرض، Entity Framework Core از الگوی **همزمانی خوش‌بینانه (Optimistic Concurrency)** پیروی می‌کند. در این الگو، فرض بر این است که برخورد داده‌ها به ندرت رخ می‌دهد؛ بنابراین، هیچ قفلی (Lock) روی جدول یا ردیف‌ها قرار نمی‌گیرد، اما در صورت بروز ویرایش همزمان، آخرین تغییر ثبت‌شده بدون هیچ هشدار قبلی، ویرایش‌های قبلی را بازنویسی می‌کند (قانون Last Write Wins) .

#### ۱۰.۶.۱ چرا مدیریت تداخل همزمانی اهمیت دارد؟

هرچند الگوی بازنویسی نهایی (Last Write Wins) در بسیاری از سناریوهای ساده وب پذیرفته شده است، اما در سیستم‌های مالی و محاسباتی می‌تواند منجر به بروز فجایع اطلاعاتی شود :
*   **مثال اول (محاسبات مالی):** تغییر همزمان موجودی یا ثبت سند مالی موازی.
*   **مثال دوم (فیلدهای محاسباتی محلی):** همانطور که در بخش ۸.۷ دیدیم، اگر دو کاربر همزمان برای یک کتاب دیدگاه ثبت کنند، بازنویسی فیلد محاسباتی میانگین امتیازات (`ReviewsAverageVotes`) منجر به خطای جدی محاسباتی در دیتابیس خواهد شد.

> **💡 نکته طراحی معماری (Event Sourcing):** در برخی سیستم‌ها می‌توان با طراحی مجدد، تداخل همزمانی را کاملاً حذف کرد؛ برای مثال در یک سایت فروشگاهی با تبدیل تراکنش‌های وضعیت سفارش به حالت **تغییرناپذیر (Immutable)** و ثبت مرتب تمام تغییرات وضعیت به صورت سطر جدید به همراه تاریخ و زمان (Event Sourcing)، عملاً هیچ رکوردی ویرایش نمی‌شود و تداخلی رخ نخواهد داد . اما در سناریوهایی که ویرایش رکوردها گریزناپذیر است، باید از ابزارهای بومی EF Core برای کشف و اصلاح تداخل‌ها استفاده کنیم .

EF Core دو روش مجزا برای کشف تداخل‌های همزمانی ارائه می‌دهد که با اعمال آن‌ها، در صورت بروز تغییر همزمان، متد `SaveChanges` متوقف شده و یک استثنا از نوع **`DbUpdateConcurrencyException`** صادر می‌کند تا توسعه‌دهنده بتواند تراکنش را مدیریت کند .

---

#### ۱۰.۶.۲ روش اول: توکن همزمانی (Concurrency Tokens)

در این روش، شما **یک یا چند پروپرتی خاص** از موجودیت را به عنوان توکن همزمانی علامت‌گذاری می‌کنید. هنگام ویرایش رکورد، EF Core مقدار قدیمی این ستون را با مقدار فعلی آن در دیتابیس مقایسه می‌کند و تنها در صورت یکسان بودن، اجازه اعمال ویرایش را صادر می‌سازد.

##### نحوه تعریف توکن همزمانی (`Listing 10.11` & `Listing 10.12`):
فرض کنید می‌خواهیم ستون تاریخ انتشار کتاب (`PublishedOn`) را به عنوان توکن همزمانی قرار دهیم:

*   **روش ویژگی‌ها (Data Annotations):**
    ```csharp
    public class ConcurrencyBook
    {
        public int ConcurrencyBookId { get; set; }
        public string Title { get; set; }

        [ConcurrencyCheck] // علامت‌گذاری به عنوان توکن همزمانی
        public DateTime PublishedOn { get; set; }
    }
    ```
*   **روش Fluent API:**
    ```csharp
    modelBuilder.Entity<ConcurrencyBook>()
                .Property(b => b.PublishedOn)
                .IsConcurrencyToken(); // تعریف صریح به عنوان توکن
    ```

##### کالبدشکافی دستور SQL ارسالی به دیتابیس (`Listing 10.14`):
هنگام تغییر عنوان کتاب، دیتابیس پرووایدر دستور آپدیتی را صادر می‌کند که در بخش `WHERE` آن، علاوه بر کلید اصلی، ستون توکن همزمانی نیز با مقدار زمان لود اولیه بررسی می‌شود:

```sql
UPDATE [Books] 
SET [Title] = @p0 
WHERE [ConcurrencyBookId] = @p1 AND [PublishedOn] = @p2; -- بررسی همزمان مقدار قدیمی PublishedOn
SELECT @@ROWCOUNT; -- بازگرداندن تعداد رکوردهای به‌روزرسانی شده
```

اگر کاربر دیگری در این فاصله مقدار تاریخ انتشار را تغییر داده باشد، شرط `WHERE` رکوردی را پیدا نکرده و مقدار `@@ROWCOUNT` برابر با **`0`** می‌شود . در این حالت، EF Core متوجه تداخل شده و استثنای `DbUpdateConcurrencyException` را صادر می‌کند.

---

#### ۱۰.۶.۳ روش دوم: مهر زمانی (Timestamp / RowVersion)

استفاده از توکن همزمانی برای پروپرتی‌های منفرد مناسب است، اما اگر مایلید **کل یک ردیف/موجودیت** را در برابر هرگونه ویرایش همزمانی محافظت کنید، استفاده از **RowVersion (مهر زمانی دیتابیس)** راهکار استانداردی است. 

در این الگو، ستونی ویژه در جدول تعریف می‌شود که مقدار آن با هر بار ثبت (`INSERT`) یا ویرایش (`UPDATE`) سطر، توسط خود سرور دیتابیس به یک مقدار باینری کاملاً جدید و منحصربه‌فرد تغییر می‌یابد .

##### تفاوت فیزیکی مهر زمانی در دیتابیس‌های مختلف:
*   **SQL Server:** از نوع داده بومی `ROWVERSION` پشتیبانی می‌کند که در دات‌نت به آرایه‌ای از بایت‌ها (`byte[]`) نگاشت می‌شود .
*   **PostgreSQL:** از ویژگی ستون سیستمی `xmin` که یک عدد ۳۲ بیتی بدون علامت است استفاده می‌کند .
*   **Cosmos DB:** مجهز به ویژگی بومی `_etag` متنی است .

##### نمونه پیاده‌سازی کلاس و پیکربندی فیزیکی مهر زمانی (`Listing 10.15` & `Listing 10.16`):

```csharp
public class ConcurrencyAuthor
{
    public int ConcurrencyAuthorId { get; set; }
    public string Name { get; set; }

    [Timestamp] // تعریف ویژگی مهر زمانی سیستمی دیتابیس
    public byte[] ChangeCheck { get; set; }
}
```

در صورت استفاده از Fluent API:
```csharp
modelBuilder.Entity<ConcurrencyAuthor>()
            .Property(p => p.ChangeCheck)
            .IsRowVersion(); // نگاشت به ROWVERSION دیتابیس
```

##### نحوه کارکرد فیزیکی زمان تراکنش SaveChanges (`Listing 10.19`):
در زمان ویرایش، EF Core شرط تطابق مقدار قدیمی `ChangeCheck` را اعمال کرده و همزمان مقدار مهر زمان جدیدِ تولیدشده توسط دیتابیس را برای ردیاب خود بازخوانی می‌کند :

```sql
UPDATE [Authors] SET [Name] = @p0 
WHERE [ConcurrencyAuthorId] = @p1 AND [ChangeCheck] = @p2; -- تطبیق مقدار قدیمی RowVersion
SELECT [ChangeCheck] FROM [Authors] 
WHERE @@ROWCOUNT = 1 AND [ConcurrencyAuthorId] = @p1; -- بازخوانی مقدار RowVersion جدید تولیدشده توسط دیتابیس
```

---

#### ۱۰.۶.۴ مدیریت خطا و حل تداخل همزمانی (Handling the Exception)

هنگامی که خطای `DbUpdateConcurrencyException` صادر می‌شود، برنامه متوقف می‌شود. برای مدیریت صحیح، باید بلاک تراکنش را درون یک بدنه `try/catch` قرار داده و با استفاده از سه کپی از داده‌ها که ردیاب تغییرات (Change Tracker) در اختیار ما قرار می‌دهد، تصمیم‌گیری کنیم :

۱. **مقادیر اصلی (Original Values):** داده‌هایی که کلاینت شما در ابتدا و زمان لود اولیه از دیتابیس خوانده بود .
۲. **مقادیر کلاینت (Proposed/Client Values):** مقادیری که کدهای جاری برنامه شما تلاش کرده‌اند آن‌ها را در دیتابیس ذخیره کنند.
۳. **مقادیر دیتابیس/کاربر دیگر (Database/Other User Values):** مقادیری که در حال حاضر و به صورت واقعی در دیتابیس ذخیره شده‌اند (تغییراتی که کاربر موازی در این بین ثبت کرده است) .

##### Listing 10.21: نمونه متد حل تداخل همزمانی در حافظه (HandleBookConcurrency)

```csharp
public string HandleBookConcurrency(DbContext context, EntityEntry entry)
{
    // ۱. بررسی تطابق نوع سطر تداخل با کلاس هدف
    if (!(entry.Entity is ConcurrencyBook))
        throw new InvalidOperationException("این هندلر صرفاً برای کارهای ConcurrencyBook است."); //

    // ۲. استخراج مقادیر پیشنهادی کلاینت ما
    var clientValues = entry.CurrentValues; //

    // ۳. استخراج مقادیر اصلی لودشده در شروع کار
    var originalValues = entry.OriginalValues; //

    // ۴. واکشی مستقیم داده‌های فعلی دیتابیس بدون ردیابی جهت ردیابی آخرین تغییرات همزمان
    var databaseValues = entry.GetDatabaseValues(); //

    if (databaseValues == null)
    {
        // سطر همزمان توسط کاربر دیگر فیزیکی حذف شده است
        return "کتاب مورد نظر توسط کاربر دیگری حذف شده است."; //
    }

    // ۵. تعریف منطق تجاری ترکیب مقادیر (تطابق فیلد PublishedOn)
    var clientDate = (DateTime)clientValues[nameof(ConcurrencyBook.PublishedOn)];
    var databaseDate = (DateTime)databaseValues[nameof(ConcurrencyBook.PublishedOn)];

    if (clientDate != databaseDate)
    {
        // در صورت عدم انطباق تاریخ‌ها، مقدار جدید دیتابیس (برنده کاربر دیگر) را تایید می‌کنیم
        clientValues[nameof(ConcurrencyBook.PublishedOn)] = databaseDate; // 
    }

    // ۶. به‌روزرسانی مقادیر اصلی در ردیاب تغییرات جهت دور زدن مجدد تداخل زمان اجرای SaveChanges بعدی
    entry.OriginalValues.SetValues(databaseValues); //

    return null; // بازگرداندن مقدار null به نشانه حل موفقیت‌آمیز تداخل
}
```

---

#### ۱۰.۶.۵ تداخل همزمانی در سناریوهای متصل‌نشده (Disconnected Concurrency)

در برنامه‌های وب (مانند ASP.NET Core) یا معماری‌های میکروسرویس، به دلیل ساختار بدون حالت (Stateless) درخواست‌های HTTP، امکان نگه داشتن نمونه DbContext فعال بین فاز نمایش فرم و فاز ثبت نهایی وجود ندارد . در این شرایط، تداخل همزمانی در قالب **زمان انسانی (Human Time)** رخ می‌دهد؛ یعنی دقایقی بین لود اطلاعات روی صفحه کاربر و کلیک دکمه ثبت نهایی او فاصله می‌افتد .

به عنوان مثال، سناریوی بررسی همزمان حقوق پرسنل (`John Doe`) توسط مدیر و واحد منابع انسانی را در نظر بگیرید :

```
کلاینت منابع انسانی (Salary $1000) ──► آپدیت حقوق به $1025 ──► SaveChanges (موفقیت‌آمیز)
کلاینت مدیر پروژه (Salary $1000)  ──► آپدیت حقوق به $1100 ──► SaveChanges (اگر کنترل نشود، تغییر قبلی حذف می‌شود)
```

##### راه‌کار فریم‌ورک EF Core برای حل معضل متصل‌نشده:
برای اجرای بررسی همزمانی در برنامه‌های وب، **حتماً باید مقدار فیلد همزمانی اصلی (مانند `ChangeCheck` یا مقدار اصلی `Salary`) را همراه با سایر داده‌های فرم به سمت کلاینت فرستاده و در زمان ارسال مجدد فرم (Post) بازیابی کنید** .

سپس در زمان آپدیت، پیش از اجرای `SaveChanges`، مقدار اولیه بازیابی‌شده را به صورت دستی درون ردیاب تغییرات کانتکست در ویژگی **`OriginalValue`** ستون تزریق کنید .

##### Listing 10.22 & 10.24: پیاده‌سازی متد اعمال مستقیم مقادیر قدیمی کلاینت در وب‌سایت

```csharp
public class Employee
{
    public int EmployeeId { get; set; }
    public string Name { get; set; }

    [ConcurrencyCheck] // علامت‌گذاری حقوق به عنوان توکن همزمانی جهت پایش تغییرات انسانی
    public int Salary { get; set; }

    // متد اختصاصی دامنه جهت ویرایش فیلد همزمان در فاز قطع اتصال
    public void UpdateSalary(DbContext context, int orgSalary, int newSalary)
    {
        this.Salary = newSalary; // انتساب مقدار جدید ورودی از فرم

        // به ردیاب تغییرات دستور می‌دهیم که مقدار اصلی دیتابیس را برابر با مقدار اولیه صفحه نمایش فرم بداند
        context.Entry(this)
               .Property(p => p.Salary)
               .OriginalValue = orgSalary; //
    }
}
```

##### تشخیص تداخل و ارائه انتخاب‌های منطقی به کاربر نهایی (`Listing 10.23`):
در برنامه‌های وب، هدف متد هندلر برطرف کردن اتوماتیک تداخل نیست، بلکه باید گزارش ملموسی تهیه کند تا کاربر بتواند انتخاب کند که اطلاعات را بازنویسی کند یا تغییرات دیگران را بپذیرد :

```csharp
public string DiagnoseSalaryConflict(DbContext context, DbUpdateConcurrencyException ex)
{
    var entry = ex.Entries.Single(); // دریافت موجودیت شکست‌خورده
    
    if (!(entry.Entity is Employee))
        throw ex; // پرتاب مجدد استثنا در صورت عدم تطابق موجودیت کارمند

    // واکشی داده‌های فعلی دیتابیس به صورت خواندنی
    var dbValues = entry.GetDatabaseValues(); //

    if (dbValues == null)
    {
        return "این کارمند توسط کاربر دیگری در سیستم حذف شده است."; //
    }

    var databaseSalary = (int)dbValues[nameof(Employee.Salary)];

    // تهیه پیام شفاف خطا برای نمایش در فرم
    return $"خطای همزمانی داده: اطلاعات توسط شخص دیگری تغییر یافته است. حقوق جاری دیتابیس: {databaseSalary}. " +
           "آیا مایل به بازنویسی و اعمال حقوق خود هستید؟"; //
}
```

---

### فصل ۱۱: کالبدشکافی عمیق کلاس DbContext (Going Deeper into the DbContext)

در فصول قبلی با روش‌های مختلف پیکربندی مدل‌ها و مدیریت همزمانی داده‌ها آشنا شدیم. کلاس `DbContext` به عنوان قلب تپنده فریم‌ورک Entity Framework Core، نقطه ورود اصلی برای تعامل با پایگاه داده است . شناخت عمیق خصوصیات درونی، ساختار ردیاب تغییرات (Change Tracker) و متدهایی که وضعیت موجودیت‌ها را دستخوش تغییر قرار می‌دهند، ممیزه یک توسعه‌دهنده جونیور از یک معمار ارشد سیستم است. 

در این فصل، معماری داخلی `DbContext` را کالبدشکافی کرده و رفتارهای پنهان آن را در سناریوهای متصل (Connected) و متصل‌نشده (Disconnected) بررسی خواهیم کرد .

---

#### بخش ۱۱.۱: بررسی ویژگی‌های کلیدی کلاس DbContext

کلاس `DbContext` با ارث‌بری از پیاده‌سازی‌های پایه EF Core، چهار ویژگی (Property) عمومی و فوق‌العاده حیاتی را در اختیار ما قرار می‌دهد که هر کدام بخشی از مکانیزم‌های داخلی سیستم را مدیریت می‌کنند :

۱. **`ChangeTracker`:**
این ویژگی، دروازه دسترسی به موتور ردیابی تغییرات کانتکست است. با استفاده از آن می‌توانید به لیست موجودیت‌های در حال ردیابی دسترسی داشته باشید، وضعیت آن‌ها را بخوانید یا عملیات‌هایی مانند اعتبارسنجی داده‌ها (Data Validation) را پیش از ذخیره‌سازی نهایی اعمال کنید.

۲. **`ContextId`:**
یک شناسه منحصربه‌فرد (`Correlation ID`) برای نمونه جاری کانتکست تولید می‌کند. کاربرد اصلی این شناسه در فاز لاگین و عیب‌یابی (Debugging) است تا بتوانید به دقت ردیابی کنید که کدام کوئری‌ها یا تراکنش‌ها توسط یک نمونه خاص از `DbContext` اجرا شده‌اند.

۳. **`Database`:**
دسترسی به عملیات‌های سطح پایین دیتابیس را مهیا می‌سازد. این ویژگی شامل سه بخش کلیدی است:
*   **مدیریت تراکنش‌ها (Transactions):** کنترل صریح شروع و پایان تراکنش‌های دیتابیس.
*   **مدیریت طرحواره (Migrations):** ایجاد یا اعمال فیزیکی مهاجرت‌ها روی پایگاه داده.
*   **دستورات مستقیم SQL:** اجرای کوئری‌ها و دستورات SQL خام غیراستعلامی.

۴. **`Model`:**
تصویر ذهنی و داخلی مدل پایگاه داده را که EF Core در زمان اولین مقداردهی کانتکست مپ کرده است، به صورت متادیتا در اختیارتان می‌گذارد. این ویژگی ساختار جداول فیزیکی، ایندکس‌ها و ستون‌ها را مستند می‌کند.

---

#### بخش ۱۱.۲: ردیاب تغییرات چگونه وضعیت موجودیت‌ها را مدیریت می‌کند؟ (Change Tracking)

مکانیزم داخلی Change Tracker بر پایه انتساب یک وضعیت مشخص به نام **`EntityState`** به تک‌تک موجودیت‌های تحت ردیابی کار می‌کند . این وضعیت یک `enum` پنج‌حالته است که به EF Core دی کته می‌کند در زمان فراخوانی متد `SaveChanges` چه واکنشی نشان دهد :

```
[موجودیت جدید] ──────► Added ──────► (SaveChanges) ──────► Unchanged
                                                              │
[تغییر ویژگی‌ها] ◄───── Modified ◄───── (تغییر مقدار فیلد) ◄────┘
                                                              │
[درخواست حذف] ──────► Deleted ─────► (SaveChanges) ──────► Detached
```

*   **`Added` (افزوده شده):** موجودیت هنوز در دیتابیس وجود فیزیکی ندارد. متد `SaveChanges` یک دستور `INSERT` برای آن صادر خواهد کرد.
*   **`Unchanged` (بدون تغییر):** موجودیت در دیتابیس موجود است و هیچ تغییری در سمت کلاینت روی آن اعمال نشده است. متد `SaveChanges` آن را نادیده می‌گیرد.
*   **`Modified` (اصلاح شده):** موجودیت در دیتابیس موجود است و حداقل یکی از فیلدهای آن در کلاینت ویرایش شده است. متد `SaveChanges` دستور `UPDATE` صادر می‌کند.
*   **`Deleted` (حذف شده):** موجودیت در دیتابیس موجود است اما برای حذف علامت‌گذاری شده است. متد `SaveChanges` دستور `DELETE` صادر می‌کند.
*   **`Detached` (جدا شده):** موجودیت توسط کانتکست ردیابی نمی‌شود و موتور `SaveChanges` اساساً آن را نمی‌بیند.

> **ویژگی IsModified:** هنگامی که ردیف در وضعیت `Modified` قرار می‌گیرد، یک پرچم بوم اسکن ثانویه به نام **`IsModified`** برای تک‌تک پروپرتی‌های اسکالر فعال می‌شود تا EF Core بداند دقیقاً کدام ستون‌ها تغییر کرده‌اند و فقط کدهای به‌روزرسانی همان ستون‌های تغییریافته را به دیتابیس بفرستد.

---

#### بخش ۱۱.۳: دستوراتی که وضعیت موجودیت را تغییر می‌دهند (State Changing Commands)

در پروژه‌های واقعی، تغییر دادن دستی وضعیت موجودیت‌ها برای مدیریت سناریوهای پیچیده الزامی است. جدول زیر خلاصه‌ای از اثر فرخوانی هر متد بر روی وضعیت فیزیکی موجودیت ارائه می‌دهد :

| نام متد در DbContext | وضعیت نهایی موجودیت اصلی (Principal) | وضعیت موجودیت‌های رابطه (Reachable Graph) |
| :--- | :--- | :--- |
| **`Add / AddRange`** | **`Added`** | اگر Detached باشند به `Added` ارتقا می‌یابند . |
| **`Remove / RemoveRange`** | **`Deleted`** | بر اساس نوع رابطه و OnDelete به `Deleted` یا `Modified` (نول کردن کلید خارجی) تبدیل می‌شوند . |
| **`Attach / AttachRange`** | **`Unchanged`** | موجودیت‌های متصل بر اساس داشتن یا نداشتن مقدار کلید اصلی به `Unchanged` یا `Added` مپ می‌شوند . |
| **`Update / UpdateRange`** | **`Modified`** | تمام فیلدها بدون مقایسه به عنوان تغییریافته علامت می‌خورند. وابسته‌ها نیز به `Modified` یا `Added` مپ می‌شوند. |

---

##### ۱۱.۳.۱ متد `Add` (درج موجودیت‌های جدید)
این متد وضعیت موجودیت را به `Added` تغییر می‌دهد. موتور Change Tracker با پیمایش بازگشتی کل گراف اشیاء متصل به آن، تمامی کلاس‌های فرزندی که وضعیت `Detached` دارند را نیز به عنوان موجودیت جدید اسکن کرده و وضعیت آن‌ها را به `Added` تغییر می‌دهد .

##### ۱۱.۳.۲ متد `Remove` (حذف ردیف‌ها)
فراخوانی این متد وضعیت شیء را به `Deleted` تغییر می‌دهد. 
*   **اگر رابطه اجباری (Required) باشد:** موجودیت‌های فرزند متصل به آن نیز به وضعیت `Deleted` منتقل می‌شوند.
*   **اگر رابطه اختیاری (Optional) باشد:** کلیدهای خارجی فرزندان نول‌پذیر به `null` تغییر یافته و وضعیت فرزندان به `Modified` تغییر می‌کند تا دیتابیس صرفاً رابطه آن‌ها را قطع کند.

##### ۱۱.۳.۳ ویرایش خودکار داده‌ها در حافظه (Modifying by changing data)
اگر یک موجودیت را به صورت ردیابی‌شده (بدون `AsNoTracking`) از دیتابیس لود کنید و پروپرتی‌های آن را تغییر دهید، نیازی به صدا زدن هیچ متد اضافی ندارید. هنگام اجرای `SaveChanges`، فریم‌ورک به صورت خودکار متد **`ChangeTracker.DetectChanges()`** را اجرا کرده و با مقایسه وضعیت فعلی با تصویر لحظه‌ای شروع کار (Tracking Snapshot)، تغییرات را کشف و موجودیت را به وضعیت `Modified` هدایت می‌کند.

##### ۱۱.۳.۴ متد `Update` (به‌روزرسانی همگانی رکوردهای غیر ردیابی شده)
زمانی که داده‌ها را در قالب ساختارهای JSON از لایه وب (قطع اتصال) دریافت می‌کنید، چون کانتکست هیچ کپی قدیمی از شیء ندارد، متد `DetectChanges` کارایی ندارد. متد **`Update`** کل ستون‌های موجودیت را به عنوان تغییریافته علامت‌گذاری می‌کند. با این کار، در زمان ذخیره‌سازی، دستور `UPDATE` دیتابیس شامل تک‌تک ستون‌های جدول خواهد بود، حتی اگر مقادیر بعضی از آن‌ها تفاوتی با قبل نکرده باشد.

##### ۱۱.۳.۵ متد `Attach` (ردیابی مجدد بدون کوئری دیتابیس)
اگر رکوردی را در لایه وب بازسازی کرده‌اید و می‌دانید که داده‌های آن با دیتابیس کاملاً هماهنگ است، به جای اجرای یک کوئری سنگین برای لود کردن مجدد آن، متد **`Attach`** را فراخوانی کنید. این متد موجودیت را مستقیماً به وضعیت **`Unchanged`** منتقل کرده و شروع به ردیابی آن می‌کند، گویی که همین حالا از دیتابیس لود شده است .

##### ۱۱.۳.۶ تغییر مستقیم وضعیت (Setting State Directly)
شما می‌توانید به صورت دستی و کاملاً مستقل، وضعیت هر سطر را تغییر دهید. این تکنیک بیشتر در سناریوهای به‌روزرسانی ترکیبی کاربرد دارد:
```csharp
context.Entry(myEntity).State = EntityState.Modified; // تغییر صریح وضعیت به ویرایش شده 
```

##### ۱۱.۳.۷ متد قدرتمند `TrackGraph` (پیمایش هوشمند گراف اشیاء غیر ردیابی شده)
بزرگ‌ترین مشکل در سناریوهای متصل‌نشده (Disconnected Update)، مپ کردن صحیح وضعیت تک‌تک اشیاء درون یک گراف بزرگ از اشیاء متصل‌به‌هم (مانند یک کتاب، به همراه دیدگاه‌های جدید، نویسندگان قدیمی و آدرس‌های ویرایش‌شده) است. متدهای معمولی مانند `Update` یا `Attach` به صورت خشک و بازگشتی کل گراف را هم‌وضعیت می‌کنند که منجر به ثبت داده‌های تکراری یا خطای دیتابیس می‌شود .

متد **`TrackGraph`** کلید طلایی عبور از این چالش است. این متد از ریشه گراف شروع کرده و به صورت بازگشتی تمام نودهای متصل را پیمایش می‌کند و به ازای هر شیء متصل فاقد ردیابی، یک کدهای الحاقی (Lambda Action) اختصاصی را اجرا می‌کند تا وضعیت هر نود به صورت مجزا تعیین شود :

```csharp
// استفاده از TrackGraph برای تنظیم هوشمند وضعیت گراف کتاب بازسازی شده از کلاینت
context.ChangeTracker.TrackGraph(book, node =>
{
    // ۱. ابتدا وضعیت پیش‌فرض همه نودها را به عنوان رکوردهای موجود ثبت می‌کنیم
    node.Entry.State = EntityState.Unchanged; //

    // ۲. در صورتی که به نود نویسنده برخورد کردیم، صرفاً ویژگی نام را آپدیت می‌کنیم
    if (node.Entry.Entity is Author author) //
    {
        node.Entry.Property("Name").IsModified = true; //
    }
    
    // ۳. اگر نود دیدگاه جدید (فاقد کلید فیزیکی دیتابیس) بود، وضعیت آن را Added می‌کنیم
    else if (node.Entry.Entity is Review review && review.ReviewId == 0)
    {
        node.Entry.State = EntityState.Added;
    }
});

context.SaveChanges(); // صرفاً کدهای بهینه SQL برای درج کامنت جدید و آپدیت فیلد نام نویسنده ارسال می‌شود
```

---

### بخش ۱۱.۴: بررسی متد SaveChanges و ردیابی تغییرات با DetectChanges

تغییرات داده‌ها در سطح نرم‌افزار زمانی به پایگاه داده منتقل می‌شوند که متد **`SaveChanges`** (یا نسخه ناهمگام آن `SaveChangesAsync`) فراخوانی شود . برای اینکه فریم‌ورک EF Core بفهمد دقیقاً کدام ستون‌ها و ردیف‌ها دچار تغییر شده‌اند و باید برای آن‌ها کدهای SQL مقتضی صادر کند، از مکانیزم هوشمند ردیابی تغییرات کانتکست استفاده می‌نماید . در این بخش، معماری داخلی ردیاب تغییرات در زمان اجرای `SaveChanges` و روش‌های بهینه‌سازی و شخصی‌سازی آن را کالبدشکافی خواهیم کرد .

---

#### ۱۱.۴.۱ نحوه کشف تغییرات حالت توسط SaveChanges (How SaveChanges finds all State changes)

در حالی که وضعیت‌هایی مانند `Added` و `Deleted` با متدهای صریح کانتکست (مانند `Add` یا `Remove`) بلافاصله به موجودیت منتسب می‌شوند، تغییرات لایه داده (مانند تغییر مقدار یک پروپرتی در کلاس ردیابی‌شده) نیاز به کشف پویا دارند . 

زمانی که متد `SaveChanges` فراخوانی می‌شود، فرآیند زیر طی می‌گردد:

1. **فراخوانی DetectChanges:** متد `SaveChanges` در اولین گام، متد **`ChangeTracker.DetectChanges()`** را فراخوانی می‌کند .
2. **مقایسه با Tracking Snapshot:** این متد تک‌تک موجودیت‌های ردیابی‌شده را اسکن کرده و مقادیر فعلی تمامی خصوصیات (Properties)، فیلدهای پشتیبان (Backing Fields) و ستون‌های سایه (Shadow Properties) مپ‌شده به دیتابیس را با **تصویر لحظه‌ای شروع کار (Tracking Snapshot)** که در زمان لود اولیه از موجودیت ذخیره شده بود، مقایسه می‌کند .
3. **تغییر وضعیت به Modified:** در صورت کشف هرگونه تفاوت، وضعیت موجودیت به **`Modified`** تغییر کرده و پرچم **`IsModified`** برای پروپرتی‌های تغییریافته روی `true` تنظیم می‌شود تا در زمان تولید کدهای SQL، صرفاً ستون‌های اصلاح‌شده هدف قرار گیرند .

---

#### ۱۱.۴.۲ بهینه‌سازی ردیاب تغییرات در تراکنش‌های سنگین (What to do if ChangeTracker.DetectChanges is taking too long)

هرچند مکانیزم مقایسه‌ای `DetectChanges` کار توسعه‌دهنده را بسیار ساده می‌کند، اما در برنامه‌های بزرگ محاسباتی یا مدل‌سازی‌های AI که تعداد زیادی موجودیت ردیابی‌شده (مثلاً ۱۰,۰۰۰ موجودیت به بالا) به طور همزمان در حافظه لود هستند، این فرآیند مقایسه خطی به یک گلوگاه عملکردی جدی (Performance Bottleneck) تبدیل می‌شود. 

* **شواهد تست عملکردی:** بر اساس یک تست عملکردی، فرآیند اجرای متد `SaveChanges` برای ذخیره ۱۰۰,۰۰۰ موجودیت بسیار کوچک که بدون تغییر در حافظه لود شده بودند، با استفاده از مکانیزم پیش‌فرض `DetectChanges` حدود **۳۵۰ میلی‌ثانیه** زمان برد؛ در حالی که با جایگزین کردن مکانیزم‌های اطلاع‌رسانی مستقیم به کانتکست، این زمان به **۲ میلی‌ثانیه** کاهش یافت.

برای حل این چالش، EF Core چهار رویکرد متمایز را جهت دور زدن فرآیند مقایسه‌ای `DetectChanges` ارائه می‌دهد:

##### رویکرد اول: پیاده‌سازی اینترفیس `INotifyPropertyChanged`
در این روش، کلاس‌های موجودیت با پیاده‌سازی اینترفیس استاندارد دات‌نت به نام `INotifyPropertyChanged` مجهز می‌شوند. به محض تغییر هر ویژگی، یک رویداد صادر شده و کانتکست مستقیماً از ویرایش مطلع می‌شود؛ در نتیجه نیازی به ساخت Tracking Snapshot و اسکن مقایسه‌ای مقادیر نخواهد بود.

برای این کار، یک کلاس پایه کمکی ایجاد کرده و کلاس‌های دامین از آن ارث‌بری می‌کنند:

```csharp
using System.ComponentModel;
using System.Runtime.CompilerServices;

public class NotificationEntity : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;

    protected void SetWithNotify<T>(T value, ref T field, [CallerMemberName] string propertyName = "")
    {
        if (!EqualityComparer<T>.Default.Equals(field, value))
        {
            field = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName)); //
        }
    }
}

public class NotifyEntity : NotificationEntity
{
    private string _myString;
    
    // هر فیلد غیرکلکسیونی باید فیلد پشتیبان اختصاصی داشته باشد
    public string MyString
    {
        get => _myString;
        set => SetWithNotify(value, ref _myString); //
    }
}
```

سپس باید استراتژی ردیابی تغییرات کلاس را در متد `OnModelCreating` روی **`ChangedNotifications`** تنظیم کنید:

```csharp
modelBuilder.Entity<NotifyEntity>()
            .HasChangeTrackingStrategy(ChangeTrackingStrategy.ChangedNotifications); //
```

##### رویکرد دوم: استفاده از پروکسی‌های ردیاب تغییرات (Proxy Change Tracking)
این روش که در نسخه **EF Core 5** معرفی شد، ساده‌ترین راه پیاده‌سازی است. در این حالت نیازی به ارث‌بری از کلاس‌های کمکی و پیاده‌سازی رویدادها در تک‌تک پروپرتی‌ها نیست. فرآیند پیاده‌سازی آن شامل ۵ گام اساسی است:

1. تمام پروپرتی‌های اسکالر و ناوبری کلاس‌ها را به صورت **`virtual`** تعریف کنید.
2. برای پروپرتی‌های ناوبری مجموعه‌ای (Collection Navigations) حتماً از نوع‌های پویای کلکسیونی مانند **`ObservableHashSet<T>`** استفاده کنید .
3. پکیج NuGet تحت عنوان **`Microsoft.EntityFrameworkCore.Proxies`** را به پروژه اضافه کنید.
4. متد الحاقی **`.UseChangeTrackingProxies()`** را در زمان کانفیگ تنظیمات DbContext فعال کنید.
5. **محدودیت جدی کلاینت:** برای ساخت نمونه‌های جدید از موجودیت در کدهای سی‌شارپ، دیگر مجاز به استفاده از کلمه کلیدی `new` نیستید و حتماً باید از متد **`context.CreateProxy<TEntity>()`** استفاده کنید تا لایه پروکسی روی شیء فعال گردد .

---

#### ۱۱.۴.۳ ثبت هوشمند وقایع و تاریخچه تغییرات در SaveChanges (Auditing/Logging)

یکی از کاربردهای بسیار جذاب دسترسی به جزئیات Change Tracker، ثبت خودکار اطلاعات سیستمی (مانند زمان دقیق ایجاد یا ویرایش رکورد و نام کاربر ویرایش‌کننده) زمان ذخیره داده‌ها است .

بهترین روش برای پیاده‌سازی این قابلیت، تعریف یک اینترفیس مشخص (مانند `ICreatedUpdated`) روی کلاس‌های هدف و سپس **بازنویسی (Override) متد `SaveChanges`** در کلاس DbContext است :

```csharp
public interface ICreatedUpdated
{
    DateTime WhenCreatedUtc { get; }
    string CreatedBy { get; }
    DateTime LastUpdatedUtc { get; }
    string LastUpdatedBy { get; }

    void LogChange(DateTime now, string userId, EntityState state); 
}
```

##### پیاده‌سازی بدنه DbContext با بهینه‌سازی کامل کارکرد DetectChanges (`Listing 11.8`):

```csharp
public class Chapter11DbContext : DbContext
{
    private readonly string _currentUserId;

    public Chapter11DbContext(DbContextOptions<Chapter11DbContext> options, string currentUserId = "System") 
        : base(options)
    {
        _currentUserId = currentUserId;
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        // ۱. اجرای کدهای کمکی پیش از ثبت داده‌ها
        AddUpdateChecks(); //

        try
        {
            // ۳. غیرفعال کردن موقت ردیاب تغییرات جهت جلوگیری از اجرای مجدد و تکراری DetectChanges در لایه پایه
            ChangeTracker.AutoDetectChangesEnabled = false; //
            return base.SaveChanges(acceptAllChangesOnSuccess); //
        }
        finally
        {
            // ۴. تایید و بازگرداندن وضعیت ردیاب به حالت فعال در بلاک نهایی
            ChangeTracker.AutoDetectChangesEnabled = true; //
        }
    }

    private void AddUpdateChecks()
    {
        // الف) اجرای صریح و یک‌باره DetectChanges برای اطمینان از اسکن نهایی تمامی ویرایش‌ها
        ChangeTracker.DetectChanges(); //

        var now = DateTime.UtcNow;

        // ب) پیمایش تمام موجودیت‌های Added یا Modified مجهز به اینترفیس ICreatedUpdated
        foreach (var entry in ChangeTracker.Entries()) //
        {
            if (entry.State == EntityState.Added || entry.State == EntityState.Modified) //
            {
                if (entry.Entity is ICreatedUpdated auditedEntity) //
                {
                    // ج) ثبت خودکار تاریخ و شناسه کاربر ویرایش‌کننده
                    auditedEntity.LogChange(now, _currentUserId, entry.State); //
                    
                    // به دلیل خاموش بودن AutoDetectChanges، باید تغییر مقادیر پروپرتی‌های Auditing را صریحاً علامت بزنیم
                    entry.Property(nameof(ICreatedUpdated.LastUpdatedUtc)).IsModified = true; //
                    entry.Property(nameof(ICreatedUpdated.LastUpdatedBy)).IsModified = true; //
                    if (entry.State == EntityState.Added)
                    {
                        entry.Property(nameof(ICreatedUpdated.WhenCreatedUtc)).IsModified = true;
                        entry.Property(nameof(ICreatedUpdated.CreatedBy)).IsModified = true;
                    }
                }
            }
        }
    }
}
```

---

#### ۱۱.۴.۴ دریافت رویدادهای تغییر وضعیت موجودیت‌ها (Catching State changes via events)

فریم‌ورک EF Core مجهز به مکانیزم رویدادگرایی (Event-driven) بر روی ردیاب تغییرات است که امکان پایش چرخه حیات موجودیت‌ها را فراهم می‌سازد. دو رویداد اصلی در این بخش وجود دارد:

۱. **رویداد `ChangeTracker.Tracked`:** 
این رویداد دقیقاً زمانی فعال می‌شود که موجودیت برای اولین بار تحت مدیریت و ردیابی کانتکست قرار می‌گیرد . (خواه واکشی از طریق کوئری باشد، یا ثبت با متدهای `Add` و `Attach`). پروپرتی `FromQuery` در آرگومان‌های این رویداد نشان می‌دهد که آیا منبع لود موجودیت، کوئری دیتابیس بوده است یا خیر.

۲. **رویداد `ChangeTracker.StateChanged`:**
این رویداد زمانی رخ می‌دهد که وضعیت یک موجودیتِ ردیابی‌شده در حافظه تغییر کند. به عنوان نمونه، تبدیل وضعیت از `Added` به `Unchanged` (پس از اتمام تراکنش ثبت `SaveChanges`) یا تبدیل از `Unchanged` به `Modified`.

##### پیاده‌سازی کلاس شنونده رویدادها جهت لاگین سیستمی تغییرات (`Listing 11.11`):

```csharp
using Microsoft.Extensions.Logging;

public class ChangeTrackerEventHandler
{
    private readonly ILogger _logger;

    public ChangeTrackerEventHandler(ILogger logger)
    {
        _logger = logger;
    }

    // متد ثبت وقایع لود اولیه موجودیت
    public void OnEntityTracked(object sender, EntityTrackedEventArgs e)
    {
        if (e.FromQuery) return; // از لاگ کردن سطر‌های خام واکشی‌شده کوئری صرف‌نظر می‌کنیم

        _logger.LogInformation($"موجودیت {e.Entry.Entity.GetType().Name} تحت ردیابی رفت. وضعیت اولیه: {e.Entry.State}"); //
    }

    // متد ثبت وقایع تغییر وضعیت موجودیت‌ها
    public void OnEntityStateChanged(object sender, EntityStateChangedEventArgs e)
    {
        _logger.LogInformation($"تغییر وضعیت رخ داد! موجودیت {e.Entry.Entity.GetType().Name} از وضعیت {e.OldState} به وضعیت {e.NewState} منتقل شد."); //
    }
}
```

برای فعال‌سازی این سیستم، شنونده را در سازنده (Constructor) کلاس DbContext ثبت کنید:
```csharp
var handler = new ChangeTrackerEventHandler(loggerInstance);
context.ChangeTracker.Tracked += handler.OnEntityTracked; //
context.ChangeTracker.StateChanged += handler.OnEntityStateChanged; //
```

---

#### ۱۱.۴.۵ راه‌اندازی رویدادها در زمان فراخوانی SaveChanges/SaveChangesAsync

علاوه بر پایش وضعیت موجودیت‌ها، نسخه **EF Core 5** سه رویداد بومی را بر روی متد SaveChanges معرفی کرد که چرخه حیات ذخیره‌سازی تراکنش را ردیابی می‌کنند:

* **`SavingChanges`:** درست قبل از شروع فرآیند ذخیره‌سازی داده‌ها و صادر شدن دستورات دیتابیس فراخوانی می‌شود .
* **`SavedChanges`:** بلافاصله پس از اتمام موفقیت‌آمیز تراکنش و اعمال فیزیکی تغییرات در بانک اطلاعاتی رخ می‌دهد . این رویداد تعداد سطر‌های تاثیرپذیرفته دیتابیس (`EntitiesSavedCount`) را بازمی‌گرداند.
* **`SaveChangesFailed`:** در صورتی که اجرای دستورات به هر دلیلی با خطا مواجه شود، فعال شده و استثنای صادر شده را ارائه می‌دهد .

> **⚠️ تله عملکردی ردیابی لایف‌سایکل:** رویداد **`SavingChanges`** پیش از اجرای متد داخلی `DetectChanges` صدا زده می‌شود. اگر مایل هستید کدهای ویرایشی مجهز به اسکن وضعیت (بخش ۱۱.۴.۳) را به این رویداد متصل کنید، باید متد `DetectChanges` را دستی فراخوانی کنید. این کار باعث می‌شود ردیاب دیتابیس متد اسکن مقایسه‌ای را **دو بار** اجرا کند که پرفورمنس برنامه را به شدت تضعیف می‌کند؛ بنابراین، استفاده از متد بازنویسی فیزیکی `SaveChanges` برای کارهای Auditing ترجیح داده می‌شود .

---

#### ۱۱.۴.۶ اینترسپتورها در EF Core (EF Core Interceptors)

اینترسپتورها (که از نسخه **EF Core 3.0** معرفی شدند) ساختارهایی به مراتب قدرتمندتر و با سطح دسترسی پایین‌تر نسبت به رویدادها هستند. این قابلیت به شما اجازه می‌دهد عملیات‌های دیتابیس را رهگیری، اصلاح، یا حتی به طور کامل سرکوب (Suppress) کنید. 

* **کاربردهای پیشرفته:** شما می‌توانید کوئری‌های ارسالی SQL را قبل از اجرا در دیتابیس ویرایش کنید (مثلاً تغییر نام جداول در زمان اجرا)، رفتارهای بازگشایی اتصال کانکشن‌ها را مدیریت نمایید، یا رفتارهای متفاوتی را در حین بازخوانی کدهای خطا اتخاذ کنید. اینترسپتورها شامل انواع متمایزی مانند `DbCommandInterceptor` (برای فرمان‌های خام SQL) و `SaveChangesInterceptor` هستند.

---

### بخش ۱۱.۵: اجرای دستورات SQL خام در برنامه‌های EF Core (Using SQL Commands)

با وجود قدرت بالای موتور ترجمه LINQ در فریم‌ورک EF Core، سناریوهایی وجود دارند که در آن‌ها نوشتن دستورات SQL خام ترجیح داده می‌شود. این موارد عمدتاً شامل فراخوانی رویه‌های ذخیره‌شده (Stored Procedures)، سناریوهایی با پیچیدگی‌های فراتر از ساختار LINQ، یا بهینه‌سازی کدهای SQL غیراستاندارد صادر شده از سمت کامپایلر است. فریم‌ورک EF Core مجموعه‌ای از متدهای تخصصی را برای اجرای کدهای SQL خام در بستر کانتکست ارائه می‌دهد که امنیت برنامه را در برابر حملات **تزریق SQL (SQL Injection)** تضمین می‌نمایند.

---

#### ۱۱.۵.۱ پرس‌وجوی داده‌ها با متدهای `FromSqlRaw` و `FromSqlInterpolated`

این دو متد به شما اجازه می‌دهند تا کوئری‌های واکشی دیتابیس را مستقیماً با کدهای SQL خام بنویسید و خروجی را در قالب موجودیت‌های ردیابی‌شده (Tracked Entities) دریافت کنید .

##### ۱. تفاوت کلیدی و امنیت پارامترها:
*   **متد `FromSqlRaw`:** پارامترها را به صورت فیزیکی و جداگانه (به همراه آرایه یا کلاس‌های پارامتر) دریافت می‌کند.
*   **متد `FromSqlInterpolated`:** از ویژگی درون‌ریزی رشته‌ای سی‌شارپ (C# String Interpolation) استفاده می‌کند. هرچند دستور به صورت یک رشته پاس داده می‌شود، اما EF Core به صورت هوشمند متغیرهای درون‌ریزی‌شده را به پارامترهای امن دیتابیسی تبدیل کرده و جلوی حملات SQL Injection را می‌گیرد.

```csharp
// نمونه صحیح و ایمن با متد Interpolated برای فراخوانی رویه ذخیره‌شده
int filterBy = 5;
var books = context.Books
                   .FromSqlInterpolated($"EXECUTE dbo.FilterOnReviewRank @RankFilter = {filterBy}") //
                   .IgnoreQueryFilters() //
                   .ToList();
```

> **⚠️ هشدار بسیار مهم امنیتی (SQL Injection Trap):** اگر یک رشته مجهز به کاراکترهای درون‌ریزی را در بیرون از متد بسازید (مانند: `var sql = $"SELECT * FROM Books WHERE BookId = {key}"`) و سپس آن را به عنوان ورودی به متد `FromSqlRaw` پاس دهید، **موتور بررسی پارامترهای EF Core دور زده شده و برنامه شما کاملاً در برابر حملات تزریق SQL آسیب‌پذیر خواهد شد**. همواره پارامترها را درون خود بدنه متد ارسال کنید.

##### ۲. قوانین و محدودیت‌های سخت‌گیرانه در اجرای کوئری‌های SQL خام:
برای اینکه EF Core بتواند خروجی دستور فیزیکی SQL را به اشیاء دات‌نت نگاشت کند، رعایت ۳ قانون زیر الزامی است:
1.  **برگشت کامل ستون‌ها:** کوئری ارسالی باید حاوی تک‌تک ستون‌های مپ‌شده به ویژگی‌های آن موجودیت در دیتابیس باشد. واکشی ناقص ستون‌ها با خطا مواجه خواهد شد (برای این کار باید از Dapper یا نگاشت به مدل‌های دیگر استفاده کنید) .
2.  **تطابق نام ستون‌ها:** اسامی ستون‌های بازگشتی از کوئری SQL باید دقیقاً با نام فیزیکی ستون‌هایی که پروپرتی‌های کلاس به آن‌ها نگاشت شده‌اند تطابق داشته باشد.
3.  **محدودیت داده‌های وابسته:** کدهای SQL خام نمی‌توانند شامل دستورات پیوند جداول برای واکشی داده‌های ناوبری باشند. با این حال، شما می‌توانید متد الحاقی **`.Include(...)`** را به انتهای دستور زنجیره‌سازی کنید تا داده‌های وابسته به صورت خودکار توسط Change Tracker لود شوند (`Listing 11.16`) :

```csharp
// ترکیب SQL خام و متد Include برای واکشی داده‌های ناوبری
var books = context.Books
                   .FromSqlRaw("SELECT * FROM Books WHERE BookId IN (SELECT BookId FROM Reviews)")
                   .Include(b => b.Reviews) // لود همزمان داده‌های وابسته
                   .AsNoTracking()
                   .ToList();
```

> **تداخل با فیلترهای سراسری (Global Query Filters):** اگر روی موجودیت فیلترهای سراسری فعال باشد، برخی کدهای فیزیکی SQL (نظیر دستور `ORDER BY` داخلی) با خطا مواجه می‌شوند. راهکار برتر، استفاده از متد **`.IgnoreQueryFilters()`** بعد از DbSet و بازنویسی دستی فیلترها درون کدهای SQL است .

---

#### ۱۱.۵.۲ اجرای دستورات ویرایشی با `ExecuteSqlRaw` و `ExecuteSqlInterpolated`

برای اجرای دستوراتی که خروجی جدولی ندارند (Non-query Commands) نظیر دستورات به‌روزرسانی فیزیکی یا حذف مستقیم ردیف‌ها (`UPDATE / DELETE`)، از متدهای روی ویژگی `Database` کانتکست استفاده می‌شود . این متدها یک مقدار عددی بازمی‌گردانند که نشان‌دهنده تعداد سطر‌های تاثیرپذیرفته در دیتابیس است:

```csharp
string uniqueString = "توضیحات بهینه‌سازی‌شده";
int bookId = 4;

// اجرای مستقیم آپدیت در سطح دیتابیس بدون لود موجودیت در حافظه
var rowsAffected = context.Database
                          .ExecuteSqlRaw("UPDATE Books SET Description = {0} WHERE BookId = {1}", 
                                         uniqueString, bookId); //
```

---

#### ۱۱.۵.۳ متد `ToSqlQuery` (نگاشت مستقیم کلاس‌ها به کدهای SQL سفارشی)

از نسخه **EF Core 5**، قابلیتی معرفی شد که به شما اجازه می‌دهد موجودیت‌های بدون کلید (Keyless Entities) را به صورت مستقیم در لایه `OnModelCreating` به یک کوئری خام SQL مجهز کنید . با این کار، توسعه‌دهندگان می‌توانند از آن کلاس به عنوان یک DbSet فقط‌خواندنی استفاده کنند، بدون اینکه نگران کدهای SQL پیچیده پشت آن باشند :

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // نگاشت دائمی کلاس BookSqlQuery به یک کوئری SQL فیزیکی
    modelBuilder.Entity<BookSqlQuery>()
                .HasNoKey()
                .ToSqlQuery("SELECT BookId, Title, (SELECT AVG(NumStars) FROM Review WHERE BookId = b.BookId) AS AverageVotes FROM Books b"); //
}
```

---

#### ۱۱.۵.۴ ضرورت به‌کارگیری متد `Reload` پس از تغییرات فیزیکی SQL

زمانی که یک موجودیت را به صورت ردیابی‌شده در حافظه کانتکست دارید و همزمان با اجرای متد `ExecuteSql` داده‌های همان سطر را در دیتابیس آپدیت می‌کنید، **موتور ردیاب تغییرات (Change Tracker) متوجه این تغییرات فیزیکی بیرونی نخواهد شد** و موجودیت لود شده در حافظه شما قدیمی (Out of date) باقی می‌ماند. 

برای همگام‌سازی آنی، باید متد **`Reload`** یا نسخه ناهمگام آن را فراخوانی کنید تا EF Core داده‌ها را مجدداً از دیتابیس بازخوانی کرده و کپی حافظه را به‌روز کند:

```csharp
var book = context.Books.Single(b => b.BookId == 4); // لود اولیه در حافظه

// ویرایش فیزیکی ستون در دیتابیس بدون اطلاع Change Tracker
context.Database.ExecuteSqlRaw("UPDATE Books SET Description = 'New' WHERE BookId = 4"); //

// بازخوانی الزامی داده‌های جدید دیتابیس جهت تطابق کامل حالت شیء با بانک اطلاعاتی
context.Entry(book).Reload(); //
```

---

#### ۱۱.۵.۵ اجرای کدهای مستقیم با لایه کلاینت و تلفیق با کتابخانه Dapper

در سناریوهایی که نیاز به بهینه‌سازی حداکثری دارید (Performance-critical Hot Paths)، فریم‌ورک EF Core امکان دسترسی به شیء اتصال پایگاه داده را از طریق متد **`GetDbConnection()`** فراهم می‌سازد . این شیء می‌تواند به طور مستقیم در کتابخانه‌های مینی‌اوآرام محبوب و فوق‌العاده سریع مانند **Dapper** به کار گرفته شود .

##### 💡 نکته طلایی پرفورمنس (Dapper vs EF Core Raw SQL):
همانطور که ذکر شد، متدهای `FromSql` در EF Core ملزم به برگرداندن تمام ستون‌های جدول هستند که واکشی داده‌های سنگین بلااستفاده را به همراه دارد . اما با Dapper، شما می‌توانید با نوشتن یک کوئری ساده، صرفاً چند ستون محدود را مستقیماً درون یک DTO سبک (مانند `RawSqlDto`) لود کنید که سرعت واکشی را به شدت ارتقا می‌دهد :

```csharp
using Dapper;
using Microsoft.EntityFrameworkCore;

// واکشی ستون‌های محدود دیتابیس با استفاده از Dapper و اتصال مشترک کانتکست
using (var connection = context.Database.GetDbConnection()) //
{
    var sqlQuery = "SELECT BookId, Title, Price FROM Books WHERE BookId = @Id"; //
    
    // اجرای کوئری در بستر اتصال امن و سریع Dapper
    var bookDto = connection.QuerySingle<RawSqlDto>(sqlQuery, new { Id = 4 }); //
}
```

تلفیق هوشمندانه EF Core (برای کارهای تراکنشی و تغییرات داده‌ها) و Dapper (برای کوئری‌های واکشی سنگین لایه گزارش‌گیری) پایدارترین معماری را برای سیستم‌های تحت لود بالا تضمین می‌کند .

---

### بخش ۱۱.۶: دسترسی به متادیتای مدل و کالبدشکافی ساختارهای فیزیکی دیتابیس (Accessing Model Metadata)

در توسعه ابزارها، کتابخانه‌های اشتراکی یا زیرساخت‌های پیشرفته نرم‌افزار، گاهی نیاز است رفتارهایی بنویسید که به صورت کاملاً پویا (Dynamic) و مستقل از نوع کلاس کار کنند . برای مثال، مایل هستید بدون اینکه نام پروپرتی‌های کلید اصلی یک کلاس را بدانید، آن‌ها را بازنشانی (Reset) کنید یا نام فیزیکی ستون‌های دیتابیس را برای نوشتن کوئری‌های خام استخراج نمایید. 

فریم‌ورک EF Core تصویر کاملی از مدل مپ‌شده و ساختار فیزیکی پایگاه داده را در قالب **متادیتا (Metadata)** در اختیار توسعه‌دهنده قرار می‌دهد . این اطلاعات از دو منبع مجزا قابل استخراج هستند:
1. **`context.Entry(entity).Metadata`:** تمرکز این منبع روی کلاس‌های موجودیت سی‌شارپ، پروپرتی‌های اسکالر، روابط ناوبری و کلیدهای اصلی/خارجی آن‌ها است.
2. **`context.Model`:** این منبع تمرکز مستقیمی بر روی ساختار فیزیکی دیتابیس شامل نام جداول، طرحواره‌ها (Schemas)، ستون‌ها، ایندکس‌ها و قیود (Constraints) دارد .

---

#### ۱۱.۶.۱ بازنشانی پویای کلیدهای اصلی با استفاده از `Entry(entity).Metadata`

در بخش ۶.۲.۳ دیدیم که برای کپی کردن یک موجودیت به همراه داده‌های وابسته، باید کلید اصلی آن را صفر کنیم تا دیتابیس آن را به عنوان یک رکورد جدید درج کند. نوشتن دستی این کار برای تک‌تک کلاس‌ها فرساینده است. با استفاده از متادیتای کانتکست، می‌توانیم سرویسی بنویسیم که کل یک گراف اشیاء را پیمایش کرده و کلیدهای اصلی آن را به صورت پویا بازنشانی کند .

##### پیاده‌سازی کلاس پویای بازنشانی کلیدها (`Listing 11.23`):

```csharp
public class PkResetter
{
    private readonly DbContext _context;
    private readonly HashSet<object> _stopCircularLook = new HashSet<object>(); // جلوگیری از لوپ در روابط دوطرفه

    public PkResetter(DbContext context)
    {
        _context = context;
    }

    public void ResetKeys(object entity)
    {
        // ۱. جلوگیری از ورود به حلقه‌های تکراری پیمایش گراف
        if (_stopCircularLook.Contains(entity)) return; // 
        _stopCircularLook.Add(entity); // 

        // ۲. استخراج متادیتای مربوط به کلاس جاری
        var entry = _context.Entry(entity);
        var keyProperties = entry.Metadata.FindPrimaryKey()?.Properties; // یافتن پروپرتی‌های کلید اصلی

        if (keyProperties != null)
        {
            // ۳. بازنشانی مقادیر کلید اصلی به مقدار پیش‌فرض نوع داده خود (مثلا صفر برای int)
            foreach (var keyProperty in keyProperties)
            {
                var propertyInfo = keyProperty.PropertyInfo;
                if (propertyInfo != null)
                {
                    var defaultValue = propertyInfo.PropertyType.IsValueType 
                        ? Activator.CreateInstance(propertyInfo.PropertyType) 
                        : null;
                    propertyInfo.SetValue(entity, defaultValue); // 
                }
            }
        }

        // ۴. استخراج تمام روابط ناوبری (روابط یک‌به‌چند یا یک‌به‌یک متصل به این موجودیت)
        var navigations = entry.Metadata.GetNavigations(); // 
        foreach (var navigation in navigations)
        {
            var navProperty = navigation.PropertyInfo;
            if (navProperty == null) continue;

            var navValue = navProperty.GetValue(entity);
            if (navValue == null) continue;

            // ۵. پیمایش بازگشتی در صورت مجموعه‌ای بودن رابطه ناوبری
            if (navigation.IsCollection) // 
            {
                foreach (var childEntity in (IEnumerable)navValue)
                {
                    ResetKeys(childEntity); // 
                }
            }
            else
            {
                // پیمایش بازگشتی برای روابط تک‌عضوی
                ResetKeys(navValue); // 
            }
        }
    }
}
```

---

#### ۱۱.۶.۲ استخراج مشخصات فیزیکی دیتابیس با استفاده از `context.Model`

ویژگی `context.Model` تصویر کاملی از دیتابیس فیزیکی است که روی کانتکست کش شده است. یکی از کاربردهای جذاب این ویژگی، نوشتن پویای دستورات SQL بهینه‌سازی‌شده برای عملیات‌های خاص است. 

برای مثال، اگر بخواهید تمام دیدگاه‌های (`Review`) متصل به یک کتاب را با کدهای SQL خام حذف کنید، نیاز دارید نام فیزیکی جدول `Review` و نام فیزیکی ستون کلید خارجی `BookId` را در دیتابیس بدانید .

##### Listing 11.24: استخراج نام فیزیکی جدول و ستون‌ها برای حذف دسته‌جمعی بهینه

```csharp
public class BulkDeleteHelper
{
    private readonly DbContext _context;

    public BulkDeleteHelper(DbContext context)
    {
        _context = context;
    }

    public string BuildDeleteEntitySql<TEntity>(string foreignKeyName) where TEntity : class
    {
        // ۱. یافتن متادیتای مپینگ کلاس به جدول دیتابیس
        var entityType = _context.Model.FindEntityType(typeof(TEntity)); // 
        if (entityType == null)
            return null;

        // ۲. استخراج نام فیزیکی جدول و طرحواره (Schema) آن
        var tableName = entityType.GetTableName(); // 
        var schemaName = entityType.GetSchema() ?? "dbo"; // 

        // ۳. یافتن نام فیزیکی ستون کلید خارجی منطبق بر نام پروپرتی سی‌شارپ
        var foreignKeyProperty = entityType.GetForeignKeys()
            .SingleOrDefault(x => x.Properties.Count == 1 
                             && x.Properties.Single().Name == foreignKeyName)
            ?.Properties.Single(); // 

        if (foreignKeyProperty == null)
            throw new ArgumentException($"کلید خارجی با نام '{foreignKeyName}' یافت نشد.");

        var columnName = foreignKeyProperty.GetColumnName(); // استخراج نام ستون فیزیکی در بانک اطلاعاتی

        // ۴. تولید و بازگرداندن دستور بهینه SQL
        return $"DELETE FROM [{schemaName}].[{tableName}] WHERE [{columnName}] = {{0}}"; //
    }
}
```

سپس می‌توانید این دستور تولیدی را با بالاترین سرعت و به صورت مستقیم به دیتابیس ارسال کنید:
```csharp
var sql = bulkHelper.BuildDeleteEntitySql<Review>("BookId"); // خروجی: DELETE FROM [dbo].[Review] WHERE [BookId] = {0}
context.Database.ExecuteSqlRaw(sql, 4); // حذف آنی تمام ریویوهای کتاب با آی‌دی ۴ بدون لود در حافظه
```

---

### بخش ۱۱.۷: تغییر داینامیک کانکشن استرینگ در زمان اجرا (Database Sharding)

در پروژه‌های چندمستاجری (Multi-Tenant) یا معماری‌های توزیع‌شده با حجم داده عظیم، یکی از الگوهای رایج برای ارتقای پرفورمنس و امنیت داده‌ها، **Database Sharding (توزیع داده‌ها روی چند بانک اطلاعاتی فیزیکی)** است. در این الگو، به جای نگهداری اطلاعات تمام کاربران در یک دیتابیس، داده‌های هر گروه از کاربران (مثلاً بر اساس جغرافیا یا مستاجر فعال) در یک پایگاه داده مجزا ذخیره می‌شود.

فریم‌ورک EF Core مجهز به متد قدرتمند **`SetConnectionString`** است که به شما اجازه می‌دهد **در هر لحظه از طول عمر یک نمونه کانتکست فعال، کانکشن استرینگ دیتابیس مقصد را به صورت پویا تغییر دهید**.

##### نمودار فرآیند Sharding با متد `SetConnectionString` (`Figure 11.6`):

```
درخواست کاربر (همراه با TenantId) ──► تزریق سرویس ردیاب مستاجر (ITenantService)
                                                            │
                                                            ▼
DbContext متصل به دیتابیس هدف ◄── فراخوانی context.Database.SetConnectionString(dbUrl)
```

##### نمونه پیکربندی تغییر پویای آدرس دیتابیس در سازنده کانتکست:

```csharp
public class ShardedDbContext : DbContext
{
    private readonly ITenantService _tenantService;

    public ShardedDbContext(DbContextOptions<ShardedDbContext> options, ITenantService tenantService) 
        : base(options)
    {
        _tenantService = tenantService;

        // ۱. دریافت آدرس فیزیکی دیتابیس اختصاصی این مستاجر (Tenant) از سرویس خارجی
        var connectionString = _tenantService.GetConnectionStringForCurrentTenant(); // 

        if (!string.IsNullOrEmpty(connectionString))
        {
            // ۲. تغییر لحظه‌ای کانکشن استرینگ کانتکست جاری پیش از اجرای اولین کوئری
            Database.SetConnectionString(connectionString); // 
        }
    }
}
```

##### چند قانون فنی بسیار مهم در پیاده‌سازی Database Sharding:
1. **ثبات ساختاری جداول:** تغییر داینامیک کانکشن استرینگ صرفاً زمانی بدون خطا کار می‌کند که طرحواره (Schema) و ساختار جداول فیزیکی دیتابیس‌های مقصد کاملاً با مدل مفهومی کانتکست فعال در سی‌شارپ یکسان باشند.
2. **پشتیبانی از تراکنش‌ها:** فراخوانی متد `SetConnectionString` زمانی مجاز است که هیچ اتصال فیزیکی بازی باز نباشد و تراکنش فعالی روی کانتکست جریان نداشته باشد.

---

### بخش ۱۱.۸: تاب‌آوری اتصال و استراتژی‌های اجرای دیتابیس (Resilience and Execution Strategies)

در محیط‌های ابری (Cloud Hostings) یا سرورهای توزیع‌شده، اتصالات شبکه بین لایه اپلیکیشن و سرور دیتابیس همواره پایدار نیستند . در این شرایط، تراکنش‌ها ممکن است به دلیل **خطاهای گذرا (Transient Errors)** نظیر قطعی موقت شبکه، در صف انتظار ماندن بیش از حد دستورات (Timeouts) یا راه‌اندازی مجدد سرور دیتابیس با شکست مواجه شوند . 

برای مقابله با این معضل، فریم‌ورک EF Core مجهز به قابلیت قدرتمندی به نام **استراتژی‌های اجرا (Execution Strategies)** است . این مکانیزم به صورت کاملاً خودکار خطاهای گذرا را ردیابی کرده و در صورت شکست موقت، دستور را پس از یک وقفه کوتاه مجدداً تکرار (Retry) می‌کند تا مانع کرش کردن برنامه کلاینت شود .

---

#### ۱۱.۸.۱ فعال‌سازی مکانیزم بازخوانی خودکار (`EnableRetryOnFailure`)

پرووایدرهای رسمی دیتابیس در EF Core (مانند SQL Server) دارای استراتژی‌های اجرای بومی و ازپیش‌تنظیم‌شده‌ای هستند که کد خطاها (Error Numbers) و رفتارهای واکنشی متناسب با آن موتور دیتابیس را به خوبی می‌شناسند . 

##### نحوه فعال‌سازی در کلاس `Startup` یا بدنه پیکربندی دیتابیس (`Listing 11.25`):

```csharp
services.AddDbContext<Chapter11DbContext>(options =>
    options.UseSqlServer(
        Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
            maxRetryCount: 5,               // حداکثر دفعات تلاش مجدد
            maxRetryDelay: TimeSpan.FromSeconds(30), // حداکثر زمان وقفه بین تلاش‌ها
            errorNumbersToAdd: null         // کدهای خطای سفارشی فراتر از تنظیمات پیش‌فرض
        ))); 
```

با فعال‌سازی این متد، تمامی کوئری‌های واکشی معمولی (`LINQ Queries`) و همچنین متد `SaveChanges` به طور خودکار تحت پوشش استراتژی بازخوانی قرار می‌گیرند و در صورت بروز خطای شبکه یا تایم‌اوت، فرآیند ردیابی و تلاش مجدد بدون نیاز به نوشتن حتی یک خط کد اضافه در سمت کلاینت انجام می‌شود .

---

#### ۱۱.۸.۲ چالش مدیریت تراکنش‌ها با وجود استراتژی بازخوانی (Transactions with Execution Strategy)

هنگامی که استراتژی بازخوانی (`EnableRetryOnFailure`) را فعال می‌کنید، مدیریت تراکنش‌های چندمرحله‌ای (دستوراتی که حاوی چندین متد `SaveChanges` متوالی در یک تراکنش صریح هستند) چالش‌برانگیز می‌شود . 
* **علت چالش:** استراتژی اجرا، کوئری‌ها را به عنوان واحدهای مستقل عملیاتی می‌بیند . اگر در میانه یک تراکنش صریح (`Database.BeginTransaction()`) خطای گذرا رخ دهد، دیتابیس تراکنش را به عقب بازمی‌گرداند (`Rollback`)، اما EF Core نمی‌داند چگونه کدهای سی‌شارپ بالادستی و متدهای قبلی `SaveChanges` را مجدداً از نقطه صفر تراکنش بازخوانی و اجرا کند .
* **راهکار معماری:** کدهای تراکنش خود را باید با استفاده از متد **`CreateExecutionStrategy`** درون یک اکشن (`Action`) محصور کنید تا در صورت شکست تراکنش، کل بلاک کد سی‌شارپ از ابتدا مجدداً اجرا شود .

##### پیاده‌سازی صحیح تراکنش‌های مجهز به استراتژی تاب‌آوری (`Listing 11.26`):

```csharp
using (var context = new Chapter11DbContext(options))
{
    // ۱. ایجاد یک نمونه از استراتژی اجرایی تنظیم‌شده کانتکست
    var strategy = context.Database.CreateExecutionStrategy(); 

    // ۲. قرار دادن کل بلاک تراکنش در یک متد Action جهت تکرار کامل در صورت وقوع خطا
    strategy.Execute(() => 
    {
        using (var transaction = context.Database.BeginTransaction()) 
        {
            try
            {
                context.Add(new MyEntity { Name = "Data 1" });
                context.SaveChanges(); // اجرای تراکنش اول 

                context.Add(new MyEntity { Name = "Data 2" });
                context.SaveChanges(); // اجرای تراکنش دوم 

                transaction.Commit(); // ثبت نهایی و اتمیک تغییرات در صورت موفقیت 
            }
            catch (Exception)
            {
                // کدهای مدیریت خطای محلی و در نهایت پرتاب خطا جهت فعال‌سازی مکانیزم Retry استراتژی
                throw;
            }
        }
    });
}
```

##### ⚠️ هشدار امنیتی (Side Effects of Retries):
از آنجا که در زمان شکست، کل بدنه اکشن بالا از نو فراخوانی می‌شود، مطمئن شوید که متغیرهای وضعیت یا شمارنده‌های خارج از اکشن را در داخل بدنه دستکاری نکنید؛ زیرا با هر بار تکرار استراتژی، مقدار این متغیرها به صورت ناخواسته مجدداً تغییر خواهد کرد .

---

#### ۱۱.۸.۳ نوشتن استراتژی اجرایی سفارشی (Custom Execution Strategy)

اگر دیتابیس پرووایدر شما فاقد استراتژی پیش‌فرض است، یا قوانین خاصی برای ردیابی خطاها در سازمان خود دارید، می‌توانید یک استراتژی اختصاصی پیاده‌سازی کنید .

۱. **مرحله اول:** کلاسی بسازید که اینترفیس **`IExecutionStrategy`** را پیاده‌سازی کند یا از کلاس پایه پرووایدر خود (مانند `SqlServerExecutionStrategy`) ارث‌بری کند .
۲. **مرحله دوم:** با بازنویسی متدهای تصمیم‌گیرنده، مشخص کنید کدام خطاها گذرا هستند و زمان توقف یا وقفه مجدد چقدر باشد .
۳. **مرحله سوم:** این استراتژی را با استفاده از متد **`ExecuteStrategy`** در تنظیمات DbContext ثبت کنید (`Listing 11.27`) :

```csharp
optionsBuilder.UseSqlServer(
    connectionString,
    options => options.ExecutionStrategy(c => new MyCustomExecutionStrategy(c))); 
```

---

### بخش سوم: به‌کارگیری Entity Framework Core در پروژه‌های واقعی (Using EF Core in Real-World Applications)

پس از بررسی عمیق ساختار و پیکربندی‌های داخلی EF Core، در این بخش وارد سناریوهای واقعی دنیای توسعه نرم‌افزار می‌شویم. در پروژه‌های بزرگ، نوشتن کدهای ساده برای تعامل با دیتابیس کافی نیست؛ بلکه نحوه ادغام دیتابیس با الگوهای معماری، بهینه‌سازی کارایی و مدیریت رویدادها، تفاوت میان سیستم‌های پایدار و شکننده را رقم می‌زند .

---

### فصل ۱۲: حل مسائل تجاری با رویدادهای موجودیت (Using Entity Events to Solve Business Problems)

در مهندسی نرم‌افزار، اصطلاح **رویداد (Event)** به الگوهایی اطلاق می‌شود که در آن‌ها «رخداد الف، اجرای رخداد ب را تحریک می‌کند». در این فصل، نوع خاصی از رویدادها به نام **رویدادهای موجودیت (Entity Events)** را بررسی می‌کنیم که پیام‌هایی درون کلاس‌های موجودیت شما هستند و می‌توان آن‌ها را در لایه‌های دیگر نرم‌افزار بازخوانی و اجرا کرد. هدف نهایی رویدادها، فعال‌سازی کدهای تجاری (Business Logic) متناسب با تغییرات وضعیت موجودیت‌ها بدون آلوده کردن لایه‌های دیگر سیستم است.

---

#### بخش ۱۲.۱: مفاهیم پایه رویدادهای موجودیت (Domain Events vs. Integration Events)

ما رویدادهای موجودیت را به دو دسته‌ی کلی تقسیم می‌کنیم که هر کدام محدوده‌ی عملکردی و معماری کاملاً متفاوتی دارند:

```
                                  ┌───────────────────────────┐
                                  │   رویدادهای موجودیت (Events)  │
                                  └─────────────┬─────────────┘
                                                │
                        ┌───────────────────────┴───────────────────────┐
                        ▼                                               ▼
          رویدادهای دامنه (Domain Events)               رویدادهای یکپارچگی (Integration Events)
          - عملکرد درون یک Bounded Context.        - عملکرد در میان چندین Bounded Context.
          - کارهای درون‌برنامه‌ای (In-process)            - فراخوانی سرویس‌های خارجی یا سایر دیتابیس‌ها.
          - تراکنش اتمیک مشترک با SaveChanges.      - لزوم بازگشت (Rollback) در صورت شکست تراکنش.
```

##### ۱. رویدادهای دامنه (Domain Events):
این رویدادها صرفاً در محدوده‌ی یک کانتکست منطقی منحصربه‌فرد (**Bounded Context**) فعالیت می‌کنند. به عنوان مثال، اگر آدرس جغرافیایی یک پروژه تغییر کند، تمام فاکتورهای متصل به آن آدرس باید مالیات بر ارزش افزوده جدیدی دریافت کنند. در این سناریو، موجودیت آدرس، یک رویداد دامین صادر کرده و یک هندلر داخلی مقادیر مالیات فاکتورها را در همان تراکنش اصلاح می‌کند.

##### ۲. رویدادهای یکپارچگی (Integration Events):
این رویدادها از مرزهای کانتکست جاری فراتر رفته و وظیفه همگام‌سازی کارهای مختلف را با سیستم‌های دیگر به عهده دارند . به عنوان مثال، در یک مدل CQRS، به‌محض ثبت یک کتاب در پایگاه داده اصلی SQL، یک رویداد یکپارچگی باید اطلاعات کتاب را برای نمایش سریع در دیتابیس NoSQL (مانند Cosmos DB) نیز ثبت کند. اگر ارتباط با Cosmos DB شکست بخورد، تراکنش پایگاه داده SQL نیز باید به کل ملغی (Rollback) شود .

---

#### بخش ۱۲.۲: مزایا و معایب به‌کارگیری رویدادها در EF Core

##### مزایا (Pros):
*   **تفکیک اصول طراحی (Separation of Concerns):** قوانین پیچیده‌ی فرعی را از دکمه‌ها و فرم‌های فرانت‌اند پاک‌سازی می‌کند. تغییر آدرس صرفاً یک تغییر آدرس ساده باقی می‌ماند و رویداد مسئول تغییرات جانبی در فاکتورها می‌شود.
*   **تضمین یکپارچگی تراکنش‌ها (Robust DB Updates):** تغییرات اولیه صادرکننده رویداد و تغییرات ثانویه حاصل از هندلرها همگی **درون یک تراکنش واحد و مشترک** به پایگاه داده ارسال می‌شوند. در صورت شکست هر بخش، کل تراکنش لغو می‌شود.

##### معایب (Cons):
*   **افزایش پیچیدگی کدها:** برای هر کار باید کلاس‌های رویداد، اینترفیس‌ها و کلاس‌های هندلر متعددی بنویسید.
*   **دشواری در ردیابی جریان برنامه (Indirection):** خواندن جریان کدهای تو در تو و فهمیدن اینکه کدام هندلر به کدام دایرکشن متصل است، برای اعضای جدید تیم دشوارتر خواهد بود.

---

#### بخش ۱۲.۳: پیاده‌سازی سیستم رویداد دامنه (Domain Events) با EF Core

برای راه‌اندازی یک موتور داخلی پردازش رویدادها، ۷ بخش کلیدی را گام‌به‌گام پیاده‌سازی خواهیم کرد.

##### ۱. تعریف کلاس رویداد (`IDomainEvent`)
ابتدا اینترفیس پایه‌ای برای تمامی رویدادها می‌سازیم. این اینترفیس می‌تواند خالی باشد و صرفاً به عنوان یک امضا (Marker Interface) عمل کند:

```csharp
public interface IDomainEvent { } // مارکر اینترفیس برای پردازش همگانی رویدادها
```

سپس کلاس رویداد واقعی خود را به همراه داده‌های مورد نیاز هندلر می‌سازیم:

```csharp
public class LocationChangedEvent : IDomainEvent
{
    // ارسال داده‌های مورد نیاز هندلر (به عنوان مثال موجودیت لوکیشن تغییریافته)
    public Location ChangedLocation { get; }

    public LocationChangedEvent(Location location)
    {
        ChangedLocation = location;
    }
}
```

##### ۲. ایجاد اینترفیس و کلاس پایه برای موجودیت‌های بذرپاش (`IEntityEvents`)
موجودیت‌ها باید بتوانند رویدادها را در حافظه خود نگه دارند تا موتور رویدادخوان پس از واکشی کانتکست، آن‌ها را پردازش و بلافاصله پاک کند:

```csharp
public interface IEntityEvents
{
    // دریافت لیست رویدادها و پاک‌سازی همزمان آن برای جلوگیری از اجرای مضاعف
    IReadOnlyCollection<IDomainEvent> GetEventsThenClear();
}

public abstract class AddEventsToEntity : IEntityEvents
{
    private readonly List<IDomainEvent> _domainEvents = new List<IDomainEvent>(); //

    protected void AddEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent); //

    public IReadOnlyCollection<IDomainEvent> GetEventsThenClear()
    {
        var copy = _domainEvents.ToList();
        _domainEvents.Clear(); // پاک‌سازی الزامی پس از لود
        return copy;
    }
}
```

##### ۳. تغییر موجودیت جهت ثبت خودکار رویداد در زمان تغییر وضعیت
به کمک فیلد پشتیبان دیتابیس (Backing Fields)، ستون را مجهز به بررسی تغییر مقدار کرده و در صورت تغییر فیزیکی، رویداد را ثبت می‌کنیم:

```csharp
public class Location : AddEventsToEntity
{
    public int LocationId { get; set; }
    
    private string _state; // فیلد پشتیبان تاریخچه فیزیکی ستون
    public string State
    {
        get => _state;
        set
        {
            if (_state != value) // کشف پویای تغییر مقدار فیلد
            {
                _state = value;
                // ثبت خودکار پیام رویداد جهت خواندن توسط کانتکست
                AddEvent(new LocationChangedEvent(this)); //
            }
        }
    }
}
```

##### ۴. طراحی اینترفیس هندلر و کلاس هندلر تجاری (`IEventHandler<T>`)
تمام هندلرها باید امضای ثابتی داشته باشند تا موتور رویداد بتواند آن‌ها را به راحتی از طریق کانتکست تزریق سرویس‌ها (`ServiceProvider`) نمونه‌سازی کند:

```csharp
public interface IEventHandler<in T> where T : IDomainEvent
{
    void HandleEvent(T domainEvent); //
}

// هندلری که بر اساس تغییر آدرس لوکیشن، محاسبات مالیات بر ارزش افزوده Quotes را بروز می‌کند
public class LocationChangedEventHandler : IEventHandler<LocationChangedEvent>
{
    private readonly QuoteDbContext _context;
    private readonly ICalcSalesTaxService _taxService;

    // دسترسی کامل به تزریق وابستگی‌ها (DI) مانند دیتابیس و سایر سرویس‌های تجاری
    public LocationChangedEventHandler(QuoteDbContext context, ICalcSalesTaxService taxService)
    {
        _context = context;
        _taxService = taxService;
    }

    public void HandleEvent(LocationChangedEvent domainEvent)
    {
        var locId = domainEvent.ChangedLocation.LocationId;
        // واکشی کل فاکتورهای متصل به این آدرس جغرافیایی
        var quotes = _context.Quotes.Where(q => q.LocationId == locId).ToList();

        foreach (var quote in quotes)
        {
            // به‌روزرسانی مقدار فیزیکی مالیات در همان کانتکست و تراکنش
            quote.SalesTax = _taxService.CalculateTax(domainEvent.ChangedLocation); //
        }
    }
}
```

##### ۵. ساخت Event Runner (موتور تطبیق رویداد به هندلرها)
قلب تپنده سیستم رویداد، رانر زیر است که به طور مستقیم با `IServiceProvider` دات‌نت صحبت کرده و کدهای هندلر را بر اساس نوع رویداد به صورت جنریک اجرا می‌کند:

```csharp
public interface IEventRunner
{
    void RunEvents(DbContext context);
}

public class EventRunner : IEventRunner
{
    private readonly IServiceProvider _serviceProvider;

    public EventRunner(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void RunEvents(DbContext context)
    {
        // الف) واکشی تمام موجودیت‌های ردیابی‌شده در کانتکست که مجهز به اینترفیس IEntityEvents هستند
        var trackedEntities = context.ChangeTracker.Entries<IEntityEvents>()
                                    .Select(e => e.Entity)
                                    .ToList(); //

        // ب) استخراج و جمع‌آوری تمام رویدادهای ثبت‌شده در موجودیت‌ها
        var allEvents = trackedEntities.SelectMany(x => x.GetEventsThenClear()).ToList(); //

        foreach (var domainEvent in allEvents)
        {
            // ج) ساخت پویا و داینامیک تایپ هندلر مربوط به این رویداد خاص
            var handlerType = typeof(IEventHandler<>).MakeGenericType(domainEvent.GetType());

            // د) نمونه‌سازی هندلر از طریق مکانیزم DI سیستم
            var handler = _serviceProvider.GetService(handlerType);

            if (handler != null)
            {
                // هـ) اجرای متد HandleEvent روی هندلر مربوطه با استفاده از روش‌های کمکی جنریک
                var runnerType = typeof(EventHandlerRunner<>).MakeGenericType(domainEvent.GetType());
                var runner = (EventHandlerRunner)Activator.CreateInstance(runnerType, handler);
                runner.Run(domainEvent); //
            }
        }
    }
}

// کلاس‌های کمکی برای پل زدن بین نوع‌های جنریک در زمان اجرا
public abstract class EventHandlerRunner
{
    public abstract void Run(IDomainEvent domainEvent);
}

public class EventHandlerRunner<T> : EventHandlerRunner where T : IDomainEvent
{
    private readonly IEventHandler<T> _handler;

    public EventHandlerRunner(IEventHandler<T> handler) => _handler = handler;

    public override void Run(IDomainEvent domainEvent) => _handler.HandleEvent((T)domainEvent); //
}
```

##### ۶. بازنویسی (Override) متد `SaveChanges` کانتکست جهت ادغام رانر
موتور رانر باید **دقیقاً قبل از شروع تراکنش فیزیکی دیتابیس** اجرا شود تا تمام رکوردهای اصلاح‌شده هندلرها به صورت یکپارچه درون متد Up پایگاه داده ثبت شوند:

```csharp
public class QuoteDbContext : DbContext
{
    private readonly IEventRunner _eventRunner;

    public QuoteDbContext(DbContextOptions<QuoteDbContext> options, IEventRunner eventRunner) 
        : base(options)
    {
        _eventRunner = eventRunner;
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        // اجرای پویای رانر و بروزرسانی حافظه کانتکست توسط هندلرها قبل از ثبت نهایی
        _eventRunner?.RunEvents(this); //
        
        return base.SaveChanges(acceptAllChangesOnSuccess); // اجرای یکپارچه و اتمیک کل تغییرات
    }
}
```

---

#### بخش ۱۲.۴: پیاده‌سازی سیستم رویدادهای یکپارچگی (Integration Events) و تراکنش‌های مرزی

برخلاف رویدادهای دامنه، رویدادهای یکپارچگی با دنیای بیرون از اپلیکیشن کار دارند (مانند ارسال فرمان کسر کالا به وب‌سرویس انبار فیزیکی پس از ثبت فاکتور Legos). استراتژی ما در این بخش تضمین بقای دوطرفه است: **تا سفارش در انبار تایید نشود فاکتور نباید ذخیره شود، و تا فاکتور ذخیره نشود سفارش انبار نباید نهایی گردد**.

برای تضمین این بقای دوطرفه، باید به سراغ **تراکنش‌های صریح و بومی دیتابیس (Explicit Transactions)** برویم تا کارهای برون‌سیستمی و درون‌دیتابیسی را در یک نقطه مشترک به هم متصل کنیم:

```csharp
public class OrderDbContext : DbContext
{
    private readonly IWarehouseService _warehouseService; // وب‌سرویس انبار خارجی

    public OrderDbContext(DbContextOptions<OrderDbContext> options, IWarehouseService warehouseService) 
        : base(options)
    {
        _warehouseService = warehouseService;
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        // ۱. پایش و کشف سفارشات در شرف درج از طریق ChangeTracker
        var newOrders = ChangeTracker.Entries<Order>()
                                    .Where(x => x.State == EntityState.Added)
                                    .Select(x => x.Entity)
                                    .ToList(); //

        if (!newOrders.Any())
            return base.SaveChanges(acceptAllChangesOnSuccess); // در صورت نبود سفارش، به صورت عادی ذخیره کن

        // ۲. شروع یک تراکنش صریح فیزیکی بر روی کانتکست دیتابیس
        using (var transaction = Database.BeginTransaction()) //
        {
            try
            {
                // الف) ثبت اولیه و موقت سفارش در دیتابیس SQL (به دست آوردن شناسه فیزیکیOrderId)
                var result = base.SaveChanges(acceptAllChangesOnSuccess); //

                // ب) فراخوانی سرویس خارجی انبار با ارسال اطلاعات کامل سفارش ثبت شده
                foreach (var order in newOrders)
                {
                    var isSuccess = _warehouseService.ValidateAndReserveStock(order); //
                    
                    if (!isSuccess)
                    {
                        // ج) در صورت عدم وجود کالا در انبار، خطا پرتاب کرده تا کل تراکنش SQL به عقب بازگردد
                        throw new OutOfStockException("موجودی کالا در انبار کافی نیست یا توزیع‌کننده در دسترس نیست."); //
                    }
                }

                // د) در صورت تایید کامل انبار، تراکنش SQL را متعهد و نهایی می‌سازیم
                transaction.Commit(); //
                return result;
            }
            catch (Exception)
            {
                // رهاسازی و بازگشت (Rollback) خودکار دیتابیس به وضعیت قبل به دلیل خروج از بلاک using بدون اجرای Commit
                throw;
            }
        }
    }
}
```

---

### فصل ۱۳: طراحی قلمرومحور (Domain-Driven Design - DDD) و سایر رویکردهای معماری

با بزرگ‌تر شدن و تکامل برنامه‌ها، توسعه و نگهداری آن‌ها دشوارتر می‌شود؛ زیرا اضافه کردن هر ویژگی جدید ممکن است کدهای موجود را تحت تأثیر قرار داده یا به شکست بکشاند. انتخاب یک معماری مناسب به همراه رعایت اصول مهندسی نرم‌افزار مانند **تفکیک مسئولیت‌ها (Separation of Concerns - SoC)** و **طراحی قلمرومحور (DDD)**، راهنمای برنامه‌نویس برای نوشتن کدهای منظم، امن و با قابلیت نگهداری بالا خواهد بود. در این فصل، فرآیند تبدیل کلاس‌های ساده و فاقد رفتار (Anemic Model) به موجودیت‌های غنی و تحت کنترل لایه دامین (DDD-styled Entities) را کالبدشکافی خواهیم کرد .

---

#### بخش ۱۳.۱: اهمیت معماری تکاملی (Evolutionary Architecture)

در دنیای مدرن نرم‌افزار، برنامه‌ها برای ارائه بهترین تجربه کاربری باید توانایی رشد و تغییر مداوم را داشته باشند (معماری تکاملی). در حالی که برای پروژه‌های ساده و ابتدایی، یک معماری لایه‌ای ساده به خوبی پاسخگو است، ارتقای پرفورمنس و اضافه کردن دیتابیس‌های چندگانه در فازهای پیشرفته، نیازمند اتخاذ رویکردی ساختاریافته‌تر است.

---

#### بخش ۱۳.۲: اصول سه‌گانه معماری جدید پروژه Book App

برای مدیریت بهینه لایه‌های دسترسی، سه اصل معماری به طور همزمان به کار گرفته می‌شوند :

```
                     ┌──────────────────────────────────────────────┐
                     │          اصول سه‌گانه معماری پروژه            │
                     └──────────────────────┬───────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
   یکپارچگی مدولار (Modular Monolith)     اصول DDD در لایه دامین       معماری پیاز / تمیز (Clean)
  - تقسیم کدها به پروژه‌های مجزا.      - کپسوله‌سازی کامل موجودیت‌ها.    - جداسازی مطلق دایرکشن‌ها.
  - قطع دسترسی مستقیم پروژه‌ها به هم.    - رفتارهای غنی و متدهای دامنه.   - لایه دامین بدون هیچ پکیج فیزیکی.
```

##### ۱. رویکرد یکپارچگی مدولار (Modular Monolith):
جلوگیری از ایجاد کدهای درهم‌تنیده (بحران **Big Ball of Mud**) با تقسیم ویژگی‌های بیزینسی به پروژه‌های دات‌نت مجزا و مستقل . هر ویژگی صرفاً به کانتکست مشترک و لایه پایین‌تر خود متصل است .

##### ۲. اصول طراحی قلمرومحور (DDD) در سطح کلاس‌های موجودیت:
موجودیت دامین باید کنترل ۱۰۰ درصدی روی داده‌های خود داشته باشد. تمامی پروپرتی‌ها صرفاً فقط‌خواندنی (`read-only`) شده و هرگونه ساخت یا ویرایش داده صرفاً از طریق سازنده‌ها یا متدهای غنی بیزینسی درون خود موجودیت کنترل می‌شود.

##### ۳. معماری تمیز (Clean Architecture) اثر عمو باب:
سازماندهی پروژه‌ها در قالب حلقه‌های پیاز؛ به گونه‌ای که لایه دامین (Domain) در درونی‌ترین لایه فاقد هرگونه ارجاع به لایه‌های بیرونی و به خصوص پکیج‌های فیزیکی دیتابیس (نظیر EF Core) باشد تا منطق بیزینس کاملاً عاری از مسائل زیرساختی پیاده‌سازی شود .

---

#### بخش ۱۳.۳: کلاژ کلاس‌های Anemic در برابر موجودیت‌های غنی DDD

در رویکردهای سنتی (که به مدل کم‌خون یا **Anemic Domain Model** معروف است)، کلاس‌های موجودیت سی‌شارپ صرفاً ظرف‌های نگهداری داده فاقد منطق هستند و تمام کدهای ویرایشی و بیزینسی بیرون از کلاس (در لایه سرویس یا کنترلر) نوشته می‌شوند . 

در DDD، موجودیت مانند یک جعبه سیاه (Black Box) عمل می‌کند. این کلاس از کدهای بیزینسی محافظت کرده و تضمین می‌کند که شیء دامین در هیچ لحظه‌ای در وضعیت نامعتبر قرار نگیرد .

---

#### بخش ۱۳.۴: تبدیل گام‌به‌گام کدهای موجودیت به الگوی طراحی DDD

برای تبیین فرآیند، کلاس کتاب (`Book`) را از حالت ساده به الگوی کپسوله‌سازی کامل ارتقا می‌دهیم .

##### ۱۳.۴.۱ غیرقابل تغییر کردن پروپرتی‌ها (Read-Only Properties)
در اولین گام، Setter تمامی پروپرتی‌های اسکالر موجودیت به صورت **`private`** تعریف می‌شوند تا هیچ کلاس بیرونی مجاز به تغییر مستقیم مقادیر نباشد . همچنین، کلکسیون‌های ناوبری نیز به صورت فقط‌خواندنی (`IReadOnlyCollection<T>`) خارج می‌شوند تا کنترل درج فیزیکی کلکسیون‌ها صرفاً در دست ریشه باشد:

```csharp
public class Book : AddEventsToEntity
{
    public int BookId { get; private set; } // غیرقابل تغییر از بیرون
    public string Title { get; private set; }
    public decimal OrgPrice { get; private set; }
    public decimal ActualPrice { get; private set; }
    public string PromotionalText { get; private set; }

    // استفاده از فیلد پشتیبان دیتابیس (Backing Field) برای کلکسیون ناوبری
    private readonly List<Review> _reviews; 
    public IReadOnlyCollection<Review> Reviews => _reviews?.ToList(); // خروجی فقط‌خواندنی
}
```

> **⚠️ هشدار در استفاده از AutoMapper:** ابزار AutoMapper به طور پیش‌فرض به دلیل دسترسی بازتابی (Reflection)، سدهای Setterهای خصوصی را نادیده گرفته و مقادیر را بازنویسی می‌کند. در معماری DDD حتماً باید متد **`IgnoreAllPropertiesWithAnInaccessibleSetter()`** را در کانفیگ‌های مپر خود فراخوانی کنید تا ساختار کپسوله‌سازی مخدوش نگردد.

---

##### ۱۳.۴.۲ افزودن متدهای دسترسی بیزینسی (Access Methods)
برای هرگونه ویرایش، متدهای مشخص دامین (مانند اعمال تخفیف یا حذف تخفیف) تعریف می‌شوند که قوانین بیزینس را در همان لحظه اعتبارسنجی می‌کنند :

*   **قانون اول:** متن تبلیغاتی نباید خالی باشد.
*   **قانون دوم:** اعمال تخفیف باید قیمت فروش (`ActualPrice`) را پایین‌تر از قیمت پایه (`OrgPrice`) تنظیم کند .

```csharp
public IStatusGeneric AddPromotion(decimal newPrice, string promotionalText)
{
    // ایجاد ساختار اعتبارسنجی خروجی از کتابخانه GenericServices.StatusGeneric
    var status = new StatusGenericHandler(); // 

    if (string.IsNullOrEmpty(promotionalText))
    {
        status.AddError("متن تبلیغاتی برای اعمال تخفیف اجباری است.", nameof(PromotionalText)); 
        return status;
    }

    if (newPrice >= OrgPrice)
    {
        status.AddError("قیمت تخفیف‌خورده باید از قیمت اصلی کتاب کمتر باشد.", nameof(ActualPrice));
        return status;
    }

    // انتساب فیلدها پس از موفقیت‌آمیز بودن تمام بررسی‌های دامنه
    ActualPrice = newPrice;
    PromotionalText = promotionalText;

    return status; // بازگرداندن وضعیت موفقیت‌آمیز
}

public void RemovePromotion()
{
    // حذف سریع تخفیف و بازگرداندن قیمت به حالت اولیه بدون ریسک خطا
    ActualPrice = OrgPrice;
    PromotionalText = null; //
}
```

---

##### ۱۳.۴.۳ کنترل فرآیند ساخت موجودیت (Constructors vs. Static Factories)
در طراحی DDD، برای ساخت یک موجودیت جدید هرگز نباید از سازنده‌های بدون پارامتر عمومی استفاده کرد . برای تضمین صحت ساختار ورودی از دو رویکرد استفاده می‌شود :

1.  **سازنده‌های پارامتردار عمومی:** برای اشیایی که قوانین پیچیده و پرتاب خطای اعتبارسنجی ندارند.
2.  **متدهای کارخانه‌ای استاتیک (Static Factory Methods):** بهترین راهکار برای مدیریت فرآیند ساخت کلاس‌های بیزینسی؛ این متدها پارامترها را دریافت کرده، بررسی‌های کامل را انجام می‌دهند و در صورت موفقیت، شیء جدید را به همراه وضعیت ثبت موفقیت‌آمیز بازمی‌گردانند :

```csharp
public class Book : AddEventsToEntity
{
    // سازنده خالی برای استفاده داخلی خود فریم‌ورک EF Core
    private Book() { } // 

    // متد استاتیک کارخانه برای ساخت امن یک کتاب در سیستم
    public static IStatusGeneric<Book> CreateBook(string title, decimal price, ICollection<Author> authors)
    {
        var status = new StatusGenericHandler<Book>(); // 

        if (string.IsNullOrEmpty(title))
        {
            status.AddError("عنوان کتاب نمی‌تواند خالی باشد.", nameof(Title));
        }

        if (price <= 0)
        {
            status.AddError("قیمت فیزیکی کتاب باید بزرگتر از صفر باشد.", nameof(OrgPrice));
        }

        if (authors == null || !authors.Any())
        {
            status.AddError("هر کتاب باید حداقل دارای یک نویسنده باشد.", nameof(BookAuthor)); 
        }

        if (status.HasErrors)
        {
            return status; // در صورت وجود خطا، نمونه کتاب ساخته نشده و نول تحویل داده می‌شود
        }

        // ساخت نمونه فیزیکی شیء دامین در صورت صحت داده‌ها
        var book = new Book
        {
            Title = title,
            OrgPrice = price,
            ActualPrice = price
        };

        status.SetResult(book); // قرار دادن نمونه کتاب در خروجی
        return status;
    }
}
```

---

#### بخش ۱۳.۴.۴: تفاوت شیء‌مقدار (Value Object) و موجودیت (Entity) در DDD و EF Core

یکی از تمایزهای کلیدی در طراحی قلمرومحور، تفکیک بین موجودیت‌ها (Entities) و شیء‌مقدارها (Value Objects) است:

*   **موجودیت (Entity):** موجودیتی است که با **هویت منحصربه‌فرد و مستقلش (Identity)** شناخته می‌شود . این هویت در طول چرخه حیات شیء تغییر نمی‌کند، حتی اگر تمام ویژگی‌های داخلی آن تغییر یابند. در EF Core، موجودیت‌ها کلاس‌هایی هستند که دارای کلید اصلی (`Primary Key`) مشخص بوده و ردیاب تغییرات سیستم آن‌ها را بر اساس این کلید اسکن می‌کند.
*   **شیء‌مقدار (Value Object):** شیئی است که فاقد هویت مستقل بوده و صرفاً با **مجموعه ویژگی‌ها و مقادیر درونی‌اش** تعریف می‌شود . دو شیء‌مقدار در صورتی برابر در نظر گرفته می‌شوند که تمام پروپرتی‌های آن‌ها کاملاً هم‌مقدار باشند . به عنوان مثال، یک آدرس پستی (شامل خیابان، شهر و کد پستی) نمونه بارز یک شیء‌مقدار است؛ زیرا هویت مستقلی از مقادیر درونی خود ندارد .

##### پیاده‌سازی شیء‌مقدار در EF Core با الگوهای Owned Types:
در فریم‌ورک EF Core، شیء‌مقدارها با استفاده از قابلیت **موجودیت‌های تحت مالکیت (Owned Types)** پیاده‌سازی می‌شوند . این کلاس‌ها فاقد کلید اصلی مستقل در دیتابیس هستند و داده‌های آن‌ها به صورت پیش‌فرض درون ستون‌های همان جدول فیزیکی موجودیتِ مالک ذخیره می‌شوند . ویژگی فوق‌العاده الگوهای Owned Types در این است که در زمان کوئری گرفتن از جدول اصلی، این فیلدها بدون نیاز به نوشتن دستورات `Include` به صورت خودکار لود می‌شوند.

---

#### بخش ۱۳.۴.۵: کمینه‌سازی روابط میان کلاس‌های موجودیت (Minimizing Relationships)

در معماری‌های سنتی، تعریف مکرر روابط دوطرفه (مانند دسترسی دوطرفه بین والد و فرزند) بسیار رایج است. با این حال، قواعد تفکر DDD اصرار بر **کمینه‌سازی حداکثری مراجع و روابط متقابل** دارد؛ چرا که ارتباطات دوطرفه، فهم کدهای موجودیت را پیچیده ساخته و تغییر ساختار آن‌ها را بسیار فرساینده و پرهزینه می‌کند.

*   **مثال عملی:** در پروژه فروشگاه کتاب، موجودیت کتاب (`Book`) نیاز جدی به دسترسی مجموعه‌ای از دیدگاه‌ها (`Reviews`) دارد تا بتواند در زمان محاسبات میانگین، قوانین دامین را ارزیابی کند . اما موجودیت دیدگاه (`Review`) هیچ وظیفه یا منطق تجاری ندارد که به خاطر آن نیاز باشد رابطه‌ای بازگشتی به کلاس کتاب در خود داشته باشد . بنابراین، با حذف پروپرتی ناوبری بازگشتی درون کلاس `Review`، این کلاس به صورت مستقل، ساده و بدون وابستگی‌های آزاردهنده نگهداری می‌شود.

---

#### بخش ۱۳.۴.۶: گروه‌بندی موجودیت‌ها در قالب مجموعه‌های همبسته (Aggregates)

**مجموعه همبسته (Aggregate)، الگویی برای گروه‌بندی مجموعه‌ای از موجودیت‌های فیزیکی مرتبط است که از دیدگاه تغییرات داده‌ها در سیستم به عنوان یک واحد اتمیک (Single Unit) عمل می‌کنند**.

```
┌─────────────────────────────────────────────────────────────┐
│                       مجموعه همبسته کتاب                     │
│                                                             │
│                      ┌─────────────────┐                    │
│                      │    Book (Root)  │                    │
│                      └──────┬─────┬────┘                    │
│                             │     │                         │
│             ┌───────────────┘     └────────────────┐        │
│             ▼                                      ▼        │
│    ┌────────────────┐                     ┌────────────────┐│
│    │     Review     │                     │   BookAuthor   ││
│    └────────────────┘                     └────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                    (رابطه ضعیف خارجی)
                              │
                              ▼
                     ┌─────────────────┐
                     │   Author Root   │
                     └─────────────────┘
```

##### قواعد حاکم بر مجموعه‌های همبسته:
1.  **ریشه مجموعه همبسته (Aggregate Root):** هر مجموعه همبسته دارای یک موجودیت اصلی به عنوان ریشه است. دنیای بیرون از این مجموعه (مانند سرویس‌ها و کدهای اپلیکیشن)، برای هرگونه تغییر، ویرایش یا درج اطلاعات در اشیای وابسته، **صرفاً و صرفاً مجاز به برقراری ارتباط با ریشه هستند** .
2.  **عدم دسترسی مستقیم خارجی:** کدهای خارجی به هیچ وجه حق ندارند تغییراتی را به طور مستقیم روی موجودیت‌های Dependent (مانند `Review` یا `BookAuthor`) اعمال کنند . ریشه موظف است صحت روابط و قواعد دامین را در زمان تغییرات تضمین نماید.
3.  **تفکیک مراجع مستقل:** موجودیت‌هایی مانند `Author` خارج از مرز مجموعه همبسته کتاب قرار دارند؛ زیرا یک نویسنده مستقل است و می‌تواند همزمان متعلق به کتاب‌های مختلف باشد .

---

#### بخش ۱۳.۴.۷: تصمیم‌گیری برای خروج منطق تجاری از موجودیت‌ها

با وجود اینکه کپسوله‌سازی منطق درون موجودیت‌ها از اصول تغییرناپذیر DDD است، اما اگر یک منطق یا فرآیند تجاری **نیازمند تعامل و همکاری چندین مجموعه همبسته (Aggregate Groups) مجزا باشد**، نوشتن آن درون یک موجودیت ریشه اشتباه است؛ زیرا موجب آلودگی و نقض مرزهای مستقل آن موجودیت می‌گردد. در این سناریوها، باید منطق را به کلاسی خارجی به نام **سرویس دامنه (Domain Service)** یا کلاس منطق تجاری مستقل منتقل کرد.

##### سناریوی ثبت سفارش خرید کتاب (`PlaceOrderBizLogic`):
فرآیند ثبت سفارش همزمان به اطلاعات کتاب‌ها (مجموعه همبسته کتاب) و اطلاعات سفارشات جدید (مجموعه همبسته سفارش و LineItems) نیاز دارد . 

##### Listing 13.5: کلاس پردازش سفارش به عنوان سرویس خارجی دامین
```csharp
public class PlaceOrderBizLogic
{
    private readonly IPlaceOrderDbAccess _dbAccess;

    public PlaceOrderBizLogic(IPlaceOrderDbAccess dbAccess)
    {
        _dbAccess = dbAccess;
    }

    public IStatusGeneric<Order> PlaceOrder(PlaceOrderInDto dto)
    {
        var status = new StatusGenericHandler<Order>(); //

        // ۱. واکشی اطلاعات قیمت کتاب‌ها از دیتابیس (خارج از کانتکست تراکنش سفارش)
        var bookIds = dto.LineItems.Select(x => x.BookId).ToList();
        var booksDict = _dbAccess.FindBooksByIdsWithPriceOffers(bookIds);

        // ۲. واگذاری مرحله نهایی ساخت سفارش به متد کارخانه‌ای استاتیک در ریشه سفارش (Order)
        var orderStatus = Order.CreateOrder(dto.UserId, dto.LineItems, booksDict); //
        
        if (orderStatus.HasErrors)
        {
            status.CombineStatuses(orderStatus);
            return status;
        }

        // ۳. ثبت سفارش تکمیل‌شده در کانتکست جهت ذخیره‌سازی نهایی
        _dbAccess.Add(orderStatus.Result); //
        status.SetResult(orderStatus.Result);

        return status;
    }
}
```

---

#### بخش ۱۳.۷: غلبه بر چالش‌های کارایی کدهای به‌روزرسانی در ساختارهای DDD

پیاده‌سازی صددرصدی DDD در وب‌سایت‌های تحت لود بالا می‌تواند به چالش‌های جدی کارایی (Performance Issues) منجر شود. 

##### 🚨 کالبدشکافی چالش کارایی:
طبق معماری مجموعه‌های همبسته، برای اضافه کردن یک دیدگاه به کتاب، حتماً باید متد دسترسی `AddReview` را روی ریشه کتاب فراخوانی کنیم. این یعنی کدهای برنامه ابتدا باید کتاب را به همراه **تمام دیدگاه‌های موجود آن** لود کنند (`Include(b => b.Reviews)`) تا ردیاب تغییرات بتواند مجموعه را بررسی کرده و رکورد جدید را ثبت نماید . اما اگر کتابی در دیتابیس (مانند محصولات پرفروش آمازون) دارای **هزاران دیدگاه** باشد، لود کردن همزمان تمامی آن‌ها برای افزودن صرفاً یک کامنت جدید، به شدت پرفورمنس کل سیستم را نابود خواهد کرد.

برای برطرف کردن این چالش بدون دور ریختن کامل اصول معماری DDD، سه رویکرد هوشمندانه وجود دارد:

##### رویکرد اول: تزریق مستقیم کلاس DbContext به متد دسترسی موجودیت (`Listing 13.13`)
در این حالت، به جای لود کل کلکسیون در حافظه، نمونه DbContext را به عنوان پارامتر به متد دامین پاس می‌دهیم تا متد بتواند رکورد فرزند را بدون لود رکوردهای قبلی، مستقیماً به دیتابیس معرفی کند:
```csharp
public void AddReview(int numStars, string comment, string voterName, DbContext context)
{
    if (BookId == default) 
        throw new Exception("کتاب ابتدا باید در دیتابیس ثبت شده باشد."); //

    // ساخت فیزیکی دیدگاه و اتصال مستقیم کلید خارجی کتاب بدون لود کل رکوردهایReviews
    var review = new Review(numStars, comment, voterName, BookId); //
    context.Add(review); //
}
```
*   **مزیت:** سرعت اجرای بی‌نظیر (بدون لود بیهوده داده‌ها).
*   **اشکال:** نقض شدید اصول معماری تمیز و DDD؛ زیرا لایه دامنه با کدهای فیزیکی زیرساخت دیتابیس (`DbContext`) آلوده می‌شود .

##### رویکرد دوم: استفاده از کلاس‌های کمکی خارجی (BizLogic) و عمومی کردن سازنده فرزند
با عمومی کردن سازنده کلاس `Review`، کدهای متد `AddReview` را به کلی از ریشه کتاب حذف کرده و به یک کلاس منطق خارجی انتقال می‌دهیم تا آن کلاس به صورت مستقیم کار ثبت را انجام دهد.
*   **اشکال:** این رویکرد قانون کپسوله‌سازی ریشه را کاملاً دور می‌زند و هر توسعه‌دهنده‌ای می‌تواند خارج از کنترل ریشه کتاب، دیدگاه‌های نامعتبر ایجاد کند.

##### رویکرد سوم (بهترین راهکار): پردازش از طریق رویدادهای دامنه (Domain Events)
در این الگوی کاملاً استاندارد و وفادار به اصول معماری، متد دسترسی موجودیت کتاب به جای دریافت کلاس DbContext، با ساخت یک شیء دیدگاه موقت، یک **رویداد دامنه** صادر می‌کند . 

هنگامی که متد `SaveChanges` کانتکست فراخوانی می‌شود، موتور رانرِ رویداد فعال شده و کلاس هندلر مربوطه (`AddReviewHandler`) را پیدا می‌کند. این هندلر که در لایه زیرساخت قرار دارد و دسترسی کامل به دیتابیس دارد، بدون آلوده کردن لایه دامین، سطر جدید را مستقیماً به کانتکست اضافه کرده و دیتابیس را بدون لود کردن دیدگاه‌های قبلی با بالاترین پرفورمنس به‌روزرسانی می‌کند.

---

### فصل ۱۴: بهینه‌سازی عملکرد در EF Core (EF Core Performance Tuning)

توسعه سریع نرم‌افزار به کمک فریم‌ورک‌های O/RM مانند EF Core نباید به قیمت کاهش کارایی و کندی سیستم تمام شود . رویکرد استاندارد معماری این است: «ابتدا کدهای خود را به درستی بنویسید و اجرا کنید، اما آمادگی لازم را برای سریع‌تر کردن آن‌ها در صورت نیاز داشته باشید» . طبق بررسی‌های تجربی، معمولاً تنها ۵ الی ۱۰ درصد از کوئری‌های یک نرم‌افزار به بهینه‌سازی دستی و دقیق نیاز دارند. 

در این فصل، استراتژی‌ها، ابزارها و الگوهای طلایی کشف و رفع گلوگاه‌های کارایی در EF Core را بررسی خواهیم کرد .

---

#### بخش ۱۴.۱: تصمیم‌گیری برای بهینه‌سازی (Deciding Which to Fix)

بهینه‌سازی زودهنگام (Premature Optimization) و بدون برنامه، هدر دادن منابع توسعه است . فرآیند بهینه‌سازی نیازمند اتخاذ تصمیمات مهندسی بر اساس متریک‌های دقیق است:

*   **بررسی انتظارات کاربر (User Expectations):** لزومی ندارد برای بهینه‌سازی یک دستور مدیریتی نادر و کم‌کاربرد (مانند پاک‌سازی کل اطلاعات دیتابیس) وقت بگذارید . تمرکز اصلی باید روی بخش‌های پرکاربردی باشد که کاربر مستقیماً با آن‌ها در تعامل است و انتظار سرعت بالایی دارد (مانند جستجو یا ثبت سفارش) .
*   **هزینه توسعه در برابر سود کارایی:** فرآیند بهینه‌سازی یک رابطه خطی بین زمان صرف شده و بهبود سرعت ندارد؛ بلکه بهینه‌سازی‌های افراطی و عمیق، افزایش نمایی (Exponential) در تلاش توسعه را به همراه دارند در حالی که کارایی به صورت خطی بهبود می‌یابد . گاهی اوقات افزایش توان سرور (Scaling Up/Out) یا استفاده از HTTP Caching راه‌حل‌های بسیار ارزان‌تر و سریع‌تری هستند .

---

#### بخش ۱۴.۲: تکنیک‌های تشخیص گلوگاه‌های کارایی (Diagnosing Performance Issues)

برای عیب‌یابی و یافتن علت کندی سیستم، یک فرآیند سه‌مرحله‌ای پیشنهاد می‌شود :

```
سطح ۱: بررسی تجربه کاربر (اندازه‌گیری زمان پاسخ‌دهی کل درخواست در مرورگر)
   │
   ▼
سطح ۲: یافتن تمام کدهای دسترسی به دیتابیس در کدهای دات‌نت (بررسی آنتی‌پترن‌ها)
   │
   ▼
سطح ۳: بررسی مستقیم کدهای فیزیکی SQL صادر شده (از طریق لاگ‌های سیستم)
```

##### واکشی کدهای فیزیکی SQL از طریق لاگ‌ها (EF Core Logging):
با تنظیم سطح لاگ سیستم روی **`Information`** و فعال‌سازی متد **`EnableSensitiveDataLogging`** (صرفاً در محیط توسعه)، می‌توانید کدهای SQL تولیدشده به همراه مقادیر پارامترها و زمان دقیق اجرای هر دستور را استخراج و بررسی کنید .

---

#### بخش ۱۴.۳: الگوهای خوب برای دسترسی سریع (Good Patterns for High Performance)

بکارگیری الگوهای بهینه از ابتدای پروژه، کارایی سیستم را تضمین می‌کند :

1.  **بارگذاری انتخابی با DTOها (Select Loading):** از واکشی کل کلاس‌های موجودیت خودداری کنید . به کمک متد `Select` در LINQ، صرفاً ستون‌های مورد نیاز را لود کرده و در قالب یک شیء مپ‌شده DTO دریافت کنید . با این کار نیازی به الحاق بیهوده جداول نخواهید داشت.
2.  **استفاده از فیلتر و صفحه‌بندی (Paging & Filtering):** کوئری که روی سیستم توسعه محلی سریع کار می‌کند، روی دیتابیس عملیاتی با میلیون‌ها رکورد فاجعه‌بار خواهد بود. همواره از متدهای `Skip` و `Take` برای کنترل حجم داده‌های بازگشتی استفاده کنید.
3.  **غیرفعال‌سازی ردیابی برای کوئری‌های فقط‌خواندنی (`AsNoTracking`):** برای گزارش‌ها و بخش‌های فقط‌خواندنی، ردیاب کانتکست را خاموش کنید . استفاده از `AsNoTracking` با حذف فرآیند ساخت تصویر لحظه‌ای (Tracking Snapshot)، تا **۵۰ درصد** سرعت اجرای کوئری را افزایش می‌دهد .
4.  **استفاده کامل از متدهای ناهمگام (Async/Await):** در وب‌سایت‌های تحت لود بالا، برای بهبود مقیاس‌پذیری (Scalability) و آزاد کردن تردها در زمان انتظار دیتابیس، همواره از نسخه‌های ناهمگام (مانند `ToListAsync` یا `SaveChangesAsync`) استفاده کنید .

---

#### بخش ۱۴.۴: آنتی‌پترن‌های کوئری دیتابیس (Query Antipatterns)

اشتباهات رایج در نوشتن کوئری‌های LINQ که پرفورمنس را تضعیف می‌کنند :

##### ۱. عدم کاهش تعداد درخواست‌های ارسالی به دیتابیس (Round Trips)
بررسی کارایی انواع روش‌های بارگذاری داده‌های رابطه، تفاوت فاحش آن‌ها را نشان می‌دهد :
*   **بارگذاری انتخابی (Select/Eager Loading):** با **۱ درخواست** به دیتابیس و کارایی ۱۰۰٪.
*   **بارگذاری جداگانه بهینه (Eager with `AsSplitQuery`):** با **۴ درخواست** به دیتابیس و کارایی ۱۰۸٪ (جهت حل مشکل چندبرابر شدن فیزیکی سطرها در پیوندهای سنگین مجموعه‌ها) .
*   **بارگذاری تنبل و صریح (Explicit / Lazy Loading):** با **۶ درخواست** به دیتابیس و کارایی ۲۲۵٪ (بسیار کند و پرهزینه به دلیل تعداد بالای رفت‌وآمدهای شبکه) .

##### ۲. عدم استفاده از سریع‌ترین متد برای لود تک‌موجودیت
زمان لازم برای واکشی یک کتاب به روش‌های مختلف در دیتابیسی با ۱,۰۰۰ رکورد بررسی شد :
*   `context.Books.Single(...)`: **مبنای کارایی (۱۰۰٪)**.
*   `context.Books.First(...)`: حدود **۱۰۹٪** زمان می‌برد.
*   `context.Find<Book>(id)` (موجودیت ردیابی‌نشده): حدود **۳۵۰٪** زمان می‌برد (به دلیل اسکن اولیه کل حافظه کانتکست).
*   `context.Find<Book>(id)` (موجودیت قبلاً ردیابی شده): کسر بسیار ناچیزی از زمان (**۰.۳٪**) را می‌گیرد زیرا بدون مراجعه به دیتابیس، داده را از حافظه پس می‌دهد.

##### ۳. محاسبات در لایه نرم‌افزار به جای انتقال به دیتابیس
اجرای توابع سنگین ریاضی، جمع‌زدن فیلدها و گرفتن میانگین‌ها باید به موتور دیتابیس سپرده شود . فرمول‌هایی مانند `Count` یا `Sum` را درون بدنه LINQ بنویسید تا کدهای SQL متناظر بهینه تولید و در سمت سرور اجرا شوند .

---

#### بخش ۱۴.۵: آنتی‌پترن‌های نوشتن داده‌ها (Write Antipatterns)

نوشتن غیراصولی داده‌ها سربار محاسباتی شدیدی را به کلاینت و سرور دیتابیس تحمیل می‌کند :

##### ۱. فراخوانی مکرر و مجزای متد SaveChanges
ثبت ۱۰۰ موجودیت جدید در دو حالت آزمایش شد :
*   **روش مجزا (اضافه کردن تک‌به‌تک و اجرای SaveChanges در هر بار):** حدود **۱۶۰ میلی‌ثانیه** زمان برد.
*   **روش جمعی (اضافه کردن ۱۰۰ موجودیت با AddRange و یک‌بار اجرای SaveChanges در انتها):** به دلیل فعال‌سازی مکانیزم بچینگ (Batching) بهینه دیتابیس، صرفاً **۹ میلی‌ثانیه (بیش از ۱۵ برابر سریع‌تر)** زمان برد .

##### ۲. خسته کردن بیش از حد ردیاب تغییرات (DetectChanges)
هر چه تعداد موجودیت‌های ردیابی‌شده در حافظه کانتکست بیشتر باشد، زمان اجرای متد `SaveChanges` طولانی‌تر می‌شود :

| تعداد ردیف‌های تحت ردیابی فعال | زمان اجرای متد DetectChanges | میزان کاهش سرعت |
| :--- | :--- | :--- |
| **بدون ردیابی (AsNoTracking)** | **۰.۲ میلی‌ثانیه** | **مبنا** |
| **۱۰۰ رکورد** | **۰.۶ میلی‌ثانیه** | **۲ برابر کندتر** |
| **۱,۰۰۰ رکورد** | **۲.۲ میلی‌ثانیه** | **۱۱ برابر کندتر** |
| **۱۰,۰۰۰ رکورد** | **۲۰.۰ میلی‌ثانیه** | **۱۰۰ برابر کندتر** |

**راهکارهای پیشنهادی:** استفاده مستمر از AsNoTracking در زمان کوئری‌های فقط‌خواندنی، ثبت داده‌ها در دسته‌های کوچک‌تر (Batching) و تغییر استراتژی ردیابی کانتکست به تغییرات اعلانی .

##### ۳. عدم استفاده از HashSet در روابط مجموعه‌ای
در زمان استفاده از مجموعه‌ها، اختصاص نوع **`HashSet<T>`** به ویژگی‌های ناوبری، سرعت انجام تراکنش‌های افزودن رابطه (Relational Fixup) را بهبود می‌بخشد . به عنوان مثال، ثبت یک موجودیت جدید با ۱,۰۰۰ رکورد فرزند متصل، در صورت استفاده از کلکسیون‌های سنتی (`ICollection` یا `IList`) حدود **۳۰ درصد بیشتر زمان می‌برد**.

---

#### بخش ۱۴.۶: الگوهای ارتقای مقیاس‌پذیری دیتابیس (Database Scalability)

برای اینکه دیتابیس بتواند هزاران درخواست همزمان کاربران را بدون کندی و قفل شدن پاسخ دهد، رعایت اصول زیر الزامی است :

*   **استفاده از استخر کانتکست (DbContext Pooling):** به جای ساخت و حذف مداوم نمونه‌های DbContext در هر درخواست وب، با ثبت سرویس از طریق متد **`AddDbContextPool`**، کانتکست‌های غیرفعال را در حافظه استخر کش کنید تا سربار اتصال اولیه به دیتابیس حذف شود .
*   **طراحی دیتابیس‌های چندگانه و CQRS:** برای نرم‌افزارهای بسیار بزرگ، با تفکیک کامل لایه خواندن و نوشتن و استفاده از ابزارهایی مانند Cosmos DB یا مدل‌های حافظه‌ای (Caching)، دیتابیس اصلی را سبک نگه دارید .

---

### فصل ۱۵: کارگاه عملی بهینه‌سازی پیشرفته پرس‌وجوها (Master Class on Performance-Tuning Database Queries)

در فصل گذشته با الگوهای نظری و آنتی‌پترن‌های بهینه‌سازی عملکرد در EF Core آشنا شدیم . در این فصل، آن تئوری‌ها را در قالب یک **کارگاه عملی و شبیه‌سازی واقعی** بر روی پروژه فروشگاه کتاب (Book App) پیاده‌سازی می‌کنیم . هدف این کارگاه، بررسی گام‌به‌گام روش‌های افزایش سرعت نمایش لیست کتاب‌ها است . 

---

#### ۱۵.۱ سناریوی تست و بررسی کلی روش‌های چهارگانه

برای شبیه‌سازی دقیق چالش‌های عملکردی یک سیستم بزرگ عملیاتی، داده‌های واقعی دریافتی از انتشارات Manning Publications (شامل ۷۰۰ عنوان کتاب واقعی) را با استفاده از ابزار تولید خودکار داده (`BookGenerator`) شبیه‌سازی و تکثیر کرده‌ایم تا به یک بانک اطلاعاتی بزرگ با ساختار زیر برسیم :

*   **تعداد کتاب‌ها فیزیکی (`Books`):** ۱۰۰,۰۰۰ ردیف 
*   **تعداد دیدگاه‌ها (`Review`):** ۵۴۶,۰۲۳ ردیف 
*   **رابطه نویسندگان کتاب (`BookAuthor`):** ۱۵۶,۹۵۸ ردیف 
*   **تعداد تگ‌ها و دسته‌بندی‌ها (`BookTags`):** ۱۷۴,۴۰۵ ردیف 

در این کارگاه، کارایی سیستم را تحت **۴ استراتژی متمایز بهینه‌سازی** و بر روی **۳ نوع کوئری مختلف** (از کوئری ساده مرتب‌سازی بر اساس تاریخ تا کوئری سنگین و محاسباتی مرتب‌سازی بر اساس امتیاز کاربران) به چالش می‌کشیم .

##### استراتژی‌های چهارگانه بهینه‌سازی در یک نگاه:
1.  **روش اول: Good LINQ:** استفاده اصولی از کدهای LINQ مپ‌شده به DTO.
2.  **روش دوم: LINQ + UDFs:** ترکیب کدهای LINQ با توابع اسکالر دیتابیس برای الحاق رشته‌ها.
3.  **روش سوم: SQL + Dapper:** کنار گذاشتن موتور EF Core و اجرای کدهای بهینه SQL از طریق Dapper.
4.  **روش چهارم: LINQ + Caching:** پیش‌محاسبه (Denormalization) بخش‌های سنگین کوئری و ذخیره در ستون‌های کتاب .

##### 📊 نتایج آزمایش عملی سرعت واکشی و رندر ۱۰۰ کتاب اول (میلی‌ثانیه) :

| نوع کوئری ارزیابی‌شده | روش اول: Good LINQ | روش دوم: LINQ + UDFs | روش سوم: SQL + Dapper | روش چهارم: LINQ + Caching |
| :--- | :---: | :---: | :---: | :---: |
| **مرتب‌سازی بر اساس تاریخ (ساده)** | ۶۳ ms | ۶۳ ms | ۶۸ ms | **۶۰ ms** |
| **فیلتر امتیاز + مرتب‌سازی قیمت** | ۳۴۵ ms | ۳۵۰ ms | ۳۷۵ ms | **۸۵ ms** |
| **مرتب‌سازی بر اساس میانگین امتیاز (بسیار سنگین)** | ۸۴۰ ms | ۶۲۰ ms | ۴۸۰ ms | **۶۰ ms** |

---

#### ۱۵.۲ روش اول: استفاده اصولی از کوئری LINQ Select (پایه عملکرد)

این روش معادل کدهای بهینه‌سازی‌شده فصول ابتدایی کتاب است که کدهای LINQ را به یک شیء انتقال داده (DTO) مپ می‌کند تا محاسبات در سمت دیتابیس انجام شوند . 

##### Listing 15.1: متد بهینه نگاشت اطلاعات کدهای LINQ به DTO

```csharp
public static IQueryable<BookListDto> MapBookToDto(this IQueryable<Book> books)
{
    return books.Select(p => new BookListDto
    {
        BookId = p.BookId,
        Title = p.Title,
        PublishedOn = p.PublishedOn,
        ActualPrice = p.ActualPrice, // قیمت نهاییِ مپ‌شده به فیلد فیزیکی ایندکس‌دار 
        PromotionText = p.PromotionalText,
        
        // ۱. واکشی صرفاً نام نویسندگان به صورت رشته‌ای به جای لود فیزیکی کل کلاس‌های رابطه 
        AuthorsOrdered = string.Join(", ", p.AuthorsLink
                                            .OrderBy(q => q.Order)
                                            .Select(q => q.Author.Name)),
                                            
        TagStrings = p.Tags.Select(x => x.TagId).ToArray(), // واکشی صرفاً کلید تگ‌ها 
        ReviewsCount = p.Reviews.Count(), // انتقال دستور COUNT فیزیکی به دیتابیس 
        
        // ۲. تبدیل کدهای میانگین به تابع AVG بومی با کست به نوع نول‌پذیر جهت پایداری زمان نبود دیدگاه 
        ReviewsAverageVotes = p.Reviews.Select(y => (double?)y.NumStars).Average() // 
    });
}
```

##### 💡 چرا این کوئری همچنان در دیتابیس‌های بزرگ دچار افت فریم می‌شود؟
با اینکه محاسبات میانگین امتیازها و شمارش کامنت‌ها به درستی درون بانک اطلاعاتی انجام می‌شوند، اما زمانی که کاربر درخواست مرتب‌سازی بر اساس میانگین امتیازات را صادر می‌کند، سرور دیتابیس ملزم است محاسبات میانگین (`AVG`) را برای تمامی ۱۰۰,۰۰۰ رکورد دیتابیس به صورت پویا انجام داده و سپس نتایج را مرتب کند که این عملیات سربار محاسباتی (CPU Load) شدیدی را به دیتابیس تحمیل می‌کند . به همین علت، زمان اجرای این پرس‌وجو به **۸۴۰ میلی‌ثانیه** می‌رسد .

---

#### ۱۵.۳ روش دوم: ادغام LINQ با توابع بومی SQL UDFs

در کدهای روش اول، به دلیل اینکه هر کتاب می‌تواند چندین نویسنده و چندین تگ داشته باشد، موتور EF Core کدهای SQL بسیار شلوغی به همراه تعداد زیادی پارامتر درون بخش `ORDER BY` صادر می‌کند تا بتواند ساختارهای کلکسیونی را به صورت سطر‌های مسطح واکشی کند . 

برای ساده‌سازی فرآیند ساخت یافته‌های کلکسیونی، دو تابع بومی اسکالر (Scalar UDF) در SQL Server تعریف می‌کنیم که وظیفه دارند شناسه کتاب را دریافت کرده و رشته‌ی الحاقی نویسندگان و تگ‌ها را مستقیماً در دیتابیس بسازند .

##### Listing 15.2: ویرایش نگاشت با استفاده از توابع DbFunction سفارشی

```csharp
public static IQueryable<BookListDto> MapBookUdfsToDto(this IQueryable<Book> books)
{
    return books.Select(p => new BookListDto
    {
        BookId = p.BookId,
        Title = p.Title,
        PublishedOn = p.PublishedOn,
        ActualPrice = p.ActualPrice,
        PromotionText = p.PromotionalText,
        
        // ۱. فراخوانی توابع بومی UDF جهت تولید رشته‌های مسطح در سمت سرور
        AuthorsOrdered = UdfDefinitions.AuthorsStringUdf(p.BookId), //
        TagStrings = UdfDefinitions.TagsStringUdf(p.BookId), //
        
        ReviewsCount = p.Reviews.Count(),
        ReviewsAverageVotes = p.Reviews.Select(y => (double?)y.NumStars).Average()
    });
}
```

با جایگزینی این توابع، هر کتاب دقیقاً یک ردیف خروجی از دیتابیس برمی‌گرداند و نیازی به کوئری‌های تودرتو و بخش‌های سنگین `ORDER BY` سیستمی نخواهد بود. این تغییر، سرعت مرتب‌سازی بر اساس امتیاز را به **۶۲۰ میلی‌ثانیه** ارتقا می‌دهد (بهبود ۲۵ درصدی) .

---

#### ۱۵.۴ روش سوم: بازنویسی فیزیکی SQL و استفاده از کتابخانه Dapper

یکی از محدودیت‌های موتور LINQ در EF Core این است که امکان استفاده مستقیم از نام‌های مستعار ستون‌ها (Column Aliases) را در فیلترها و مرتب‌سازی‌ها ندارد . در نتیجه، EF Core مجبور است فرمول‌های میانگین امتیاز را یک‌بار در بخش `SELECT` (برای نمایش) و مجدداً در بخش `ORDER BY` (برای مرتب‌سازی) محاسبه کند.

زبان T-SQL به ما اجازه می‌دهد ستون محاسباتی را صرفاً **یک‌بار** پردازش کرده و مستقیماً روی آن مرتب‌سازی انجام دهیم . با نوشتن دستی این کوئری و اجرای آن توسط کتابخانه فوق‌سریع **Dapper**، می‌توان کارایی را باز هم ارتقا داد .

##### نمونه کوئری بهینه ارسالی توسط Dapper:
```sql
SELECT b.BookId, b.Title, b.ActualPrice,
       dbo.AuthorsStringUdf(b.BookId) AS AuthorsOrdered, -- استفاده از UDF تعریف شده در مرحله قبل
       (SELECT AVG(CAST(r.NumStars AS FLOAT)) FROM Review r WHERE r.BookId = b.BookId) AS ReviewsAverageVotes
FROM Books b
WHERE b.SoftDeleted = 0
ORDER BY ReviewsAverageVotes DESC -- مرتب‌سازی مستقیم روی ستون محاسباتی یکپارچه
OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY; -- اعمال بهینه صفحه‌بندی
```

با اجرای این کدهای سفارشی و سبک توسط Dapper، زمان مرتب‌سازی امتیازات به **۴۸۰ میلی‌ثانیه** کاهش می‌یابد که تقریباً دو برابر سریع‌تر از روش معمولی LINQ است .

---

#### ۱۵.۵ روش چهارم: الگوهای ذخیره‌سازی مقادیر محاسباتی و کشینگ (Cached SQL)

سرعت ۴۸۰ میلی‌ثانیه‌ای Dapper برای سیستم‌های تحت لود بالا هنوز مطلوب نیست. راهکار نهایی و طلایی برای حل دائمی این مشکل، **پیش‌محاسبه مقادیر سنگین (Denormalization / Caching)** و ذخیره فیزیکی آن‌ها در قالب ۳ فیلد اختصاصی در خود جدول `Books` است :
1. `ReviewsCount`: تعداد دیدگاه‌های کتاب 
2. `ReviewsAverageVotes`: میانگین امتیاز کتاب 
3. `AuthorsOrdered`: رشته متنی مرتب‌شده از اسامی نویسندگان 

با داشتن این ستون‌ها و ایندکس‌گذاری آن‌ها، سرعت پرس‌وجو به **۶۰ میلی‌ثانیه** (۱۴ برابر سریع‌تر از روش اول) ارتقا می‌یابد؛ چرا که دیتابیس صرفاً مقادیر ایندکس‌گذاری‌شده فیزیکی را می‌خواند .

چالش اصلی این الگو، روش به‌روز نگه‌داشتن داده‌های کش و جلوگیری از آلودگی داده‌ها (Dirty Cache) است . برای پیاده‌سازی این سیستم، یک معماری رویدادمحور بر پایه **رویدادهای دامنه (Domain Events)** بنا می‌کنیم:

##### گام اول: ثبت رویداد در زمان تغییر وضعیت دیدگاه‌ها (موجودیت ریشه کتاب)
با استفاده از کدهای کپسوله‌شده DDD، به محض تغییر دیدگاه‌ها، رویداد متناظر را تولید می‌کنیم:

```csharp
public class Book : EntityEventsBase // کلاس پایه ثبت رویدادهای GenericEventRunner 
{
    public int BookId { get; private set; }
    public int ReviewsCount { get; private set; }
    public double? ReviewsAverageVotes { get; private set; }

    // ۱. متد افزودن دیدگاه جدید
    public void AddReview(int numStars, string comment, string voterName)
    {
        var review = new Review(numStars, comment, voterName);
        _reviews.Add(review);
        
        // ثبت رویداد دامنه به همراه مقدار امتیاز جدید
        AddEvent(new BookReviewAddedEvent(numStars, this)); 
    }

    // متد مورد استفاده هندلر برای آپدیت فیلدهای کش
    public void UpdateReviewCachedValues(int newCount, double? newAvg)
    {
        ReviewsCount = newCount;
        ReviewsAverageVotes = newAvg; //
    }
}
```

##### گام دوم: پیاده‌سازی هندلر به روزرسانی کش با رویکرد دلتا (Delta Update)
برای بالا بردن حداکثری سرعت تراکنش‌های درج، هندلر نباید کوئری `SELECT AVG` به دیتابیس بفرستد، بلکه باید مقدار میانگین جدید را با استفاده از **تکنیک محاسبات دلتای ریاضی** در حافظه کش کند :

```csharp
public class ReviewAddedHandler : IDuringEventHandler<BookReviewAddedEvent> 
{
    public void Handle(BookReviewAddedEvent domainEvent)
    {
        var book = domainEvent.Book;
        var newStars = domainEvent.NumStars;

        // فرمول دلتا جهت محاسبه میانگین جدید بدون لود رکوردهای قبلی دیتابیس
        int currentCount = book.ReviewsCount;
        double currentAvg = book.ReviewsAverageVotes ?? 0;

        int newCount = currentCount + 1; //
        double newAvg = currentAvg + ((newStars - currentAvg) / newCount);

        book.UpdateReviewCachedValues(newCount, newAvg); // اعمال فیزیکی به کانتکست
    }
}
```

##### گام سوم: پیکربندی کنترل همزمانی فیلدهای کش (Concurrency Handling)
اگر دو کاربر به صورت همزمان برای یک کتاب دیدگاه ثبت کنند، محاسبات دلتای آن‌ها در ردیاب تغییرات دچار تداخل شده و مقادیر فیلد کش خراب می‌شود . برای تضمین امنیت، ستون‌های کش را به عنوان **توکن همزمانی (Concurrency Tokens)** پیکربندی کرده و در لایه SaveChanges استثنای همزمانی را مدیریت می‌کنیم :

```csharp
public override int SaveChanges(bool acceptAllChangesOnSuccess)
{
    try
    {
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }
    catch (DbUpdateConcurrencyException ex) // کشف تداخل ویرایش همزمان فیلدهای کش 
    {
        var bookEntry = ex.Entries.Single();
        var databaseValues = bookEntry.GetDatabaseValues(); // واکشی مقادیر ثبت‌شده توسط کاربر موازی
        
        var clientBook = (Book)bookEntry.Entity;
        var dbBook = (Book)databaseValues.ToObject();

        // بازسازی و اصلاح ریاضی مقادیر کش بر اساس آخرین وضعیت واقعی دیتابیس
        int correctCount = dbBook.ReviewsCount + 1; 
        // ... (اعمال فرمول‌های ترکیبی دلتا بر اساس داده‌های کاربر موازی)

        bookEntry.OriginalValues.SetValues(databaseValues); // دور زدن خطای همزمانی برای تلاش مجدد
        return SaveChanges(acceptAllChangesOnSuccess); // اجرای مجدد تراکنش موفق
    }
}
```

---

#### ۱۵.۶ مقایسه رویکردهای چهارگانه بر اساس پرفورمنس و هزینه توسعه

پیاده‌سازی هر یک از این استراتژی‌ها هزینه‌های توسعه و نگهداری خاصی را به تیم تحمیل می‌کند :

*   **روش Good LINQ:** هزینه توسعه فوق‌العاده پایین (حدود یک ساعت) و بدون نیاز به کدهای پیچیده، اما سرعت در دیتابیس‌های بزرگ معمولی است .
*   **روش LINQ + UDFs:** نیازمند دانش پایه‌ای اسکریپت‌نویسی SQL (حدود نصف روز کاری)، کارایی در بخش‌های کلکسیونی مطلوب است .
*   **روش SQL + Dapper:** نوشتن دستی کدهای SQL بسیار فرساینده و خطاساز است و امکان زنجیره‌سازی کدهای صفحه‌بندی LINQ را سلب می‌کند (نیازمند ۱ الی ۲ روز توسعه و دیباگ)، اما پرفورمنس بالایی دارد .
*   **روش Cached SQL:** پیچیده‌ترین روش توسعه (نیازمند حداقل یک هفته زمان جهت پیاده‌سازی کامل رویدادها، هندلرها و کدهای همزمانی سخت)، اما سرعت و کارایی پرس‌وجوها را تضمین می‌کند.

---

#### ۱۵.۷ ارتقای مقیاس‌پذیری پایگاه داده (Scalability)

علاوه بر سرعت، توانایی پاسخ‌گویی به تعداد کاربران همزمان بالا (مقیاس‌پذیری) از شاخصه‌های بقای نرم‌افزار است . اگر دیتابیس رابطه‌ای شما تحت شدیدترین لودهای واکشی قرار دارد، دو الگوی زیر پیشنهاد می‌شود :

۱. **استفاده از پایگاه داده NoSQL به عنوان کش جلو (CQRS):**
پیش‌نمایش (Projection) اطلاعات کتاب‌ها را بر اساس رویدادهای یکپارچگی به یک پایگاه داده بدون رابطه بسیار مقیاس‌پذیر نظیر **Cosmos DB** منتقل کرده و تمام لود گزارش‌گیری و سرچ سایت را به سمت Cosmos DB هدایت کنید تا دیتابیس اصلی SQL Server صرفاً بر روی تراکنش‌های نوشتن تمرکز کند.

---

### فصل ۱۶: ادغام Cosmos DB، معماری CQRS و سایر پایگاه‌های داده (Cosmos DB, CQRS, and other database types)

در ادامه‌ی تلاش برای بهینه‌سازی عملکرد فروشگاه کتاب (Book App) در مقیاس‌های بسیار بزرگ، استفاده از یک دیتابیس رابطه‌ای سنتی مانند SQL Server حتی با وجود به‌کارگیری پیشرفته‌ترین فیلدهای محاسباتی کش‌شده در لایه‌ی کدهای سی‌شارپ (بخش ۱۵.۵)، به دلیل ساختار درونی خود با چالش مواجه می‌شود . اگر حجم داده‌ها را به **۵۰۰,۰۰۰ کتاب و حدود ۳ میلیون دیدگاه** ارتقا دهیم، کوئری‌های واکشیِ فیلترشده همراه با مرتب‌سازی بر اساس تعداد یا میانگین آرا به دلیل نیاز به اسکن فیزیکی ایندکس‌های سنگین و پیوندهای تو در تو، دچار افت شدید فریم یا حتی اتمام زمان اتصال دیتابیس (Timeout 30s) می‌شوند .

یکی از راه‌کارهای معمارانه فوق‌العاده برای غلبه بر این چالش، **تفکیک مسئولیت دستور و پرس‌وجو (Command and Query Responsibility Segregation - CQRS)** و بهره‌گیری از یک دیتابیس غیررابطه‌ای (NoSQL) فوق‌العاده سریع به عنوان کش نمایش وب‌سایت (Read-side Cache) است . در این بخش، روش طراحی، پیاده‌سازی و یکپارچه‌سازی پروژه‌های مبتنی بر دیتابیس رابطه‌ای SQL Server با دیتابیس NoSQL ابری مایکروسافت یعنی **Azure Cosmos DB** را در بستر فریم‌ورک EF Core به طور کامل کالبدشکافی خواهیم کرد .

---

#### ۱۶.۱ تفاوت‌های بنیادین پایگاه‌های داده رابطه‌ای (SQL) و سندمحور (NoSQL)

پیش از شروع پیاده‌سازی فیزیکی، درک تفاوت میان این دو جهان ضروری است :

*   **دیتابیس‌های رابطه‌ای (Relational/SQL Server):** بر پایه‌ی برقراری قیود سخت‌گیرانه‌ی مرجع فیزیکی (Constraints)، کلیدهای خارجی و یکپارچگی آنی داده‌ها کار می‌کنند. این دیتابیس‌ها در تراکنش‌های مالی و اداری پیچیده که نباید به هیچ وجه عدم‌تطابقی در سطح سطرها و ستون‌ها رخ دهد، بی‌رقیب هستند .
*   **دیتابیس‌های NoSQL (مانند Cosmos DB):** برای مقیاس‌پذیری افقی (Horizontal Scalability) و در دسترس بودن همیشگی (Availability) طراحی شده‌اند . این موتورها قیود رابطه‌ای سخت‌گیرانه را قربانی پرفورمنس می‌کنند . NoSQLها به جای ثبات آنی، از الگوی **ثبات نهایی (Eventual Consistency)** پیروی می‌کنند؛ به این معنی که ثبت یک رکورد جدید ممکن است چند ثانیه طول بکشد تا در کل سرورهای کپی سراسر جهان همگام شود.

---

#### ۱۶.۲ آشنایی با دیتابیس Cosmos DB و پرووایدر بومی آن در EF Core

دیتابیس ابری **Cosmos DB** یک موتور ذخیره‌سازی توزیع‌شده سندمحور (Document Store) است که داده‌ها را در قالب اسناد پویای **JSON** ذخیره می‌کند . پرووایدر رسمی Cosmos DB در فریم‌ورک EF Core این امکان را به توسعه‌دهندگان می‌دهد تا بدون نیاز به یادگیری کدهای SDK جدید، با همان دستورات آشنای LINQ و کلاس‌های DbContext معمولی، اسناد JSON را در Cosmos DB خوانده و بنویسند.

---

#### ۱۶.۳ طراحی معماری سیستم دو دیتابیسی (Polyglot CQRS Architecture)

در این الگو، ما از **ساختار چنددیتابیسی (Polyglot Persistence)** استفاده می‌کنیم تا از مزایای هر دو دنیا بهره‌مند شویم:

```
                     ┌──────────────────────────────────────────────┐
                     │          معماری دو دیتابیسی CQRS             │
                     └──────────────────────┬───────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
   Write-Side (سمت نوشتن)                                      Read-Side (سمت خواندن)
   - دیتابیس فیزیکی: SQL Server                         - دیتابیس فیزیکی: Cosmos DB (NoSQL)
   - وظیفه: ثبت فاکتور، ویرایش‌ها، سفارشات              - وظیفه: نمایش لیست کتاب‌ها، جستجو، فیلتر
   - ویژگی: ثبات آنی و اتمیک (ACID)                     - ویژگی: پروژکشن‌های JSON آماده نمایش 
```

هنگامی که یک ادمین کتاب جدیدی اضافه می‌کند یا کاربری دیدگاهی می‌نویسد، عملیات نوشتن روی دیتابیس SQL Server انجام می‌شود. سپس برنامه از طریق **رویدادهای یکپارچگی (Integration Events)** تغییرات را به دیتابیس Cosmos DB کپی و ارسال می‌کند تا به شکل سندی مسطح و آماده، بازنویسی شود . تمامی لودِ ترافیک بازدیدکنندگان سایت برای لود صفحه اول روی دیتابیس Cosmos DB هدایت می‌شود تا دیتابیس اصلی SQL Server کاملاً سبک بماند.

---

#### ۱۶.۴ پیاده‌سازی سیستم CQRS دو دیتابیسی با رویدادهای یکپارچگی

برای همگام نگه‌داشتن دیتابیس SQL Server و Cosmos DB، از الگوی رویدادهای یکپارچگی و کتابخانه `GenericEventRunner` استفاده می‌کنیم .

##### ۱۶.۴.۱ ساخت رویدادهای تغییر وضعیت موجودیت (`Listing 16.1`):
ابتدا رویداد یکپارچگی تغییر وضعیت کتاب را به همراه یک ویژگی برای مشخص کردن نوع رخداد (افزودن، ویرایش، حذف) تعریف می‌کنیم :

```csharp
public enum BookChangeType { Added, Updated, Deleted } //

[RemoveDuplicateEvents] // حذف خودکار رویدادهای تکراری روی یک کتاب خاص زمان تراکنش 
public class BookChangedEvent : IDomainEvent
{
    public int BookId { get; }
    public BookChangeType ChangeType { get; } //

    public BookChangedEvent(int bookId, BookChangeType changeType)
    {
        BookId = bookId;
        ChangeType = changeType; //
    }
}
```

##### ۱۶.۴.۲ ارسال رویداد از موجودیت کتاب (`Listing 16.2` & `Listing 16.3`):
در بدنه متدهای بیزینسی موجودیت DDD کتاب، رویداد تغییر را بذرپاشی می‌کنیم :

```csharp
public class Book : AddEventsToEntity
{
    public int BookId { get; private set; }
    public string Title { get; private set; }
    public bool SoftDeleted { get; private set; } //

    public void AddPromotion(decimal newPrice, string promoText)
    {
        // اعمال کدهای بیزینسی ...
        AddEvent(new BookChangedEvent(BookId, BookChangeType.Updated)); // ثبت رویداد ویرایش 
    }

    public void SetSoftDeleted(bool value)
    {
        if (SoftDeleted != value) //
        {
            SoftDeleted = value;
            var type = value ? BookChangeType.Deleted : BookChangeType.Added; 
            AddEvent(new BookChangedEvent(BookId, type)); // ثبت رویداد حذف یا بازیابی
        }
    }
}
```

---

##### ۱۶.۴.۳ مدل‌سازی موجودیت‌های فقط‌خواندنی Cosmos DB (`Listing 16.4` & `Listing 16.5`):
در سمت Cosmos DB، کل ساختارهای ناوبری چندلایه به صورت یک موجودیت مسطح همراه با **مجموعه‌های تو در تو (Nested Owned Types)** ذخیره می‌شوند تا ساختار سند کاملاً یکپارچه باشد :

```sharp
public class CosmosBook
{
    [Key] // کلید اصلی فیزیکی سند در Cosmos
    public int BookId { get; set; } //
    public string Title { get; set; }
    public decimal ActualPrice { get; set; }
    public double? ReviewsAverageVotes { get; set; } // مقدار پیش‌محاسبه شده
    public int ReviewsCount { get; set; }

    // نگهداری تگ‌ها به صورت کلکسیون تحت مالکیت درون خود سند JSON (Nesting)
    public ICollection<CosmosTag> Tags { get; set; } 
}

public class CosmosTag // کلاس بدون کلید به صورت Owned Type 
{
    public string TagId { get; set; } //
}
```

پیکربندی کلاس DbContext برای ارتباط با Cosmos DB به صورت زیر خواهد بود :

```csharp
public class CosmosDbContext : DbContext
{
    public DbSet<CosmosBook> CosmosBooks { get; set; } //

    public CosmosDbContext(DbContextOptions<CosmosDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CosmosBook>(entity =>
        {
            entity.ToContainer("Books"); // نگاشت به کانتینر اختصاصی در Cosmos 
            entity.HasKey(x => x.BookId); //
            entity.OwnsMany(x => x.Tags); // پیکربندی مپینگ تودرتوی تگ‌ها
        });
    }
}
```

---

##### ۱۶.۴.۴ پیاده‌سازی هندلر رویداد و همگام‌سازی تراکنشی (`Listing 16.8`):
هنگام ذخیره داده‌ها، یک **تراکنش فیزیکی اتمیک مشترک** باز می‌شود . ابتدا تغییرات در SQL ثبت شده و آی‌دی فیزیکی ساخته می‌شود . سپس رویداد اجرا شده و سندی جدید در Cosmos DB درج می‌کند . در صورتی که ذخیره در Cosmos با شکست مواجه شود، تراکنش SQL Server نیز **رول‌بک (Rollback)** می‌شود تا دیتابیس‌ها تحت هیچ شرایطی از یکدیگر عقب نیفتند .

```csharp
public class BookChangedEventHandler : IEventHandler<BookChangedEvent> //
{
    private readonly CosmosDbContext _cosmosContext;
    private readonly EfCoreContext _sqlContext; // کانتکست دیتابیس رابطه‌ای

    public BookChangedEventHandler(CosmosDbContext cosmosContext, EfCoreContext sqlContext)
    {
        _cosmosContext = cosmosContext;
        _sqlContext = sqlContext;
    }

    public async Task HandleAsync(BookChangedEvent domainEvent)
    {
        if (domainEvent.ChangeType == BookChangeType.Added)
        {
            // ۱. واکشی اطلاعات کتاب مپ‌شده به همراه تمام الحاقات از دیتابیس SQL
            var sqlBook = await _sqlContext.Books
                                           .Select(b => new CosmosBook
                                           {
                                               BookId = b.BookId,
                                               Title = b.Title,
                                               ActualPrice = b.Promotion == null ? b.Price : b.Promotion.NewPrice,
                                               Tags = b.Tags.Select(t => new CosmosTag { TagId = t.TagId }).ToList()
                                           })
                                           .SingleOrDefaultAsync(x => x.BookId == domainEvent.BookId); //

            if (sqlBook != null)
            {
                // ۲. درج مستقیم پروژکشن JSON آماده در کانتینر Cosmos DB
                _cosmosContext.CosmosBooks.Add(sqlBook); //
                await _cosmosContext.SaveChangesAsync(); //
            }
        }
        // کدهای مربوط به کارهای Update و Delete ...
    }
}
```

---

#### ۱۶.۵ ساختار فیزیکی ذخیره‌سازی اطلاعات در اسناد Cosmos DB

هنگامی که رکوردی توسط پرووایدر در Cosmos DB ذخیره می‌شود، داده‌ها به یک فرمت سند استاندارد JSON کامپایل می‌گردند . دیتابیس ویژگی‌های مخفی سیستمی متمایزی را در انتهای سند برای کارهای سیستمی اضافه می‌کند :

```json
{
  "BookId": 123,
  "Title": "Entity Framework Core in Action",
  "ActualPrice": 59.99,
  "Tags": [
    { "TagId": "Databases" },
    { "TagId": "Development" }
  ],
  "id": "CosmosBook|123",  // شناسه منحصربه‌فرد سند که توسط ادغام نام کلاس و کلید اصلی ساخته می‌شود 
  "_etag": "\"00004a11-0000-0800-0000-5f2174500000\"", // مهر زمانی برای مدیریت تداخل همزمانی خوش‌بینانه
  "_ts": 1595982864, // زمان آخرین به‌روزرسانی فیزیکی به فرمت یونیکس
  "_rid": "MyDatabaseRowId==",
  "_self": "dbs/MyDatabase/colls/Books/docs/MyRowId=="
}
```

---

#### ۱۶.۶ چالش‌های بزرگ پرووایدر Cosmos DB در نسخه EF Core 5

با وجود سادگی استفاده، پرووایدر Cosmos DB در فریم‌ورک EF Core 5 دارای محدودیت‌های زیرساختی بسیار جدی است که نوشتن پرس‌وجوهای LINQ معمولی روی آن را با خطا مواجه می‌کند :

##### ۱. گلوگاه فاجعه‌بار شمارش تعداد ردیف‌ها (`Count`):
در زمان استفاده از ابزار صفحه‌بندی وب‌سایت، برای محاسبه تعداد کل صفحات نیاز به فراخوانی متد `context.CosmosBooks.Count()` داریم. اما پرووایدر EF Core 5 به دلیل عدم ترجمه این دستور به کدهای اسکالر سیستم، **تمام ۵۰۰,۰۰۰ سند را ابتدا به حافظه سرور لود کرده و سپس شمارش می‌کند!** این کار عملکرد کل وب‌سایت را فلج کرده و حجم عظیمی از پردازش سرور (Request Units) را نابود می‌سازد .
*   **راهکار معماری ۱ (Next/Previous Paging):** برای حل این معضل، دکمه‌های صفحه‌بندی ترتیبی معمول را از روی سایت حذف کرده و همانند سایت‌های بزرگی چون آمازون، از دکمه‌های «صفحه بعدی / قبلی» (بدون نیاز به کوئری تعداد کل صفحات) استفاده می‌کنیم .
*   **راهکار معماری ۲ (Cosmos Direct SQL):** در کدهای لایه گزارش‌گیری با واگذاری مستقیم کوئری به کدهای مستقیم SDK، این دستور به سرعت نور در سمت کلاینت بازخوانی می‌شود :
    ```csharp
    var container = context.Database.GetCosmosClient().GetContainer("MyDatabase", "Books"); 
    var countQuery = new QueryDefinition("SELECT VALUE COUNT(c) FROM c"); //
    // شمارش بسیار سریع در ۲۵ میلی‌ثانیه نسبت به ۹۰ میلی‌ثانیه SQL Server
    ```

##### ۲. عدم امکان اجرای کوئری‌های تودرتو (Subqueries):
فیلتر کردن کتاب‌ها بر اساس تگ‌ها، نیازمند کوئری‌های شرطی روی کلکسیون‌هایowned است. اما پرووایدر EF Core 5 توانایی ترجمه دستور LINQ شامل `.Any(y => y == ...)` را به فرمان‌های NoSQL ندارد. 
*   **راهکار کمکی دات‌نت:** برای حل این چالش، می‌توان در زمان پروژکشن کتاب، تمام نام‌های تگ را به صورت یک رشته متنی الحاق‌شده با کاراکتر جداکننده (به عنوان مثال: `| Databases | Development |`) درون یک پروپرتی تک اسکالر به نام `TagsString` در سند JSON ذخیره نمود؛ سپس فیلترها را با دستور ساده `Contains` شبیه‌سازی کرد.

##### ۳. کند بودن فرآیند رد کردن سطرها (`Skip`):
در دیتابیس‌های رابطه‌ای، پرش از روی رکوردها بسیار ارزان است. اما در Cosmos DB، برای انجام دستور `Skip(1000)`، موتور دیتابیس ملزم است تک‌تک ۱۰۰۰ سند اول را لود و اسکن کند تا به سطر ۱۰۰۱ برسد؛ لذا پرش‌های بزرگ با افت شدید سرعت و افزایش نجومی فاکتور شارژ ابری (RUs) همراه است . همواره نمایش لیست‌ها را به ۱۰۰ کتاب اول محدود کنید.

---

#### ۱۶.۷ تحلیل و ارزیابی نهایی کارگاه عملی (SQL Server vs. Cosmos DB)

پس از بارگذاری **۵۰۰,۰۰۰ کتاب و حدود ۳ میلیون دیدگاه** در هر دو دیتابیس (با قیمت اجاره ابری کاملاً همتراز)، نتایج آزمایش کوئری‌های سنگین به شرح زیر است :

*   **کوبیده شدن دیتابیس SQL Server:** با افزایش حجم داده‌ها، اجرای پرس‌وجوهای فیلتر و مرتب‌سازی بر اساس آرا روی دیتابیس SQL Server به قدری سنگین شد که دیتابیس قبل از جواب‌دهی، با خطای اتمام ۳۰ ثانیه‌ای ارتباط مواجه و متوقف شد.
*   **تاب‌آوری بی‌نظیر Cosmos DB:** اما دیتابیس Cosmos DB به دلیل معماری مسطح و عدم نیاز به پیوند دادن جداول فیزیکی (No Joins)، تمامی کوئری‌های واکشی، مرتب‌سازی و فیلتر را مستقل از حجم داده‌ها، **در زمان‌های خیره‌کننده‌ی زیر ۱۰۰ میلی‌ثانیه** پاسخ داد .

---

### فصل ۱۷: تست‌های واحد در پروژه‌های EF Core (Unit Testing EF Core Applications)

تست واحد (Unit Testing) یکی از ستون‌های اصلی توسعه نرم‌افزارهای پایدار و قابل نگهداری است . هدف از تست واحد، بررسی صحت کارکرد بخش‌های مجزا و کوچک از کدهای برنامه در یک محیط کاملاً کنترل‌شده و ایزوله است. از آنجا که بخش عمده‌ای از منطق برنامه‌های مبتنی بر EF Core با پایگاه داده گره خورده است، طراحی تست‌های واحدِ سریع، دقیق و بدون ریسک برای دسترسی به دیتابیس اهمیت دوچندانی دارد .

در این فصل، استراتژی‌ها، ابزارها و کارگاه‌های عملی پیاده‌سازی تست‌های واحد در محیط EF Core را کالبدشکافی خواهیم کرد.

---

#### ۱۷.۱ مقدمه‌ای بر ساختار تست واحد در EF Core

برای نوشتن تست‌های واحد، انتخاب ابزارها و الگوهای صحیح، تجربه توسعه را به شدت بهبود می‌دهد :

##### ۱. فریم‌ورک xUnit (محیط پیش‌فرض تست):
فریم‌ورک **xUnit** به دلیل پشتیبانی عالی مایکروسافت و تیم توسعه EF Core (که خود بیش از ۷۰,۰۰۰ تست واحد را با آن مدیریت می‌کنند)، به عنوان بستر استاندارد تست واحد استفاده می‌شود . ویژگی برجسته xUnit، **اجرای موازی (Parallel) کلاس‌های تست** است که سرعت کلی اجرای تست‌ها را به شدت افزایش می‌دهد.
*   *محدودیت متغیرهای ایستا (Static):* به دلیل اجرای موازی تست‌ها، استفاده از متغیرهای ایستای اشتراکی (به جز ثابت‌ها) می‌تواند منجر به تداخل شدید داده‌ها شود؛ بنابراین در صورت استفاده از متغیرهای ایستا، باید اجرای موازی xUnit را غیرفعال کنید.

##### ۲. الگوی سه‌مرحله‌ای تست (Setup, Attempt, Verify):
کدهای تست بر اساس الگوی استاندارد چیدمان می‌شوند:
*   **Setup (Arrange):** آماده‌سازی بستر، دیتابیس و بذرپاشی داده‌های اولیه (Seed Data) .
*   **Attempt (Act):** اجرای بخش کدهایی که قصد تست کردن آن‌ها را داریم .
*   **Verify (Assert):** اعتبارسنجی خروجی‌ها و بررسی تطابق نتایج با مقادیر مورد انتظار .

##### ۳. نوشتن تست‌های خواناتر با Fluent Validation:
به جای استفاده از متدهای سنتی `Assert.Equal(2, books.Count())` در xUnit، استفاده از شیوه زنجیره‌ای (Fluent) مانند **`books.Count().ShouldEqual(2)`** به دلیل پشتیبانی بهتر از قابلیت IntelliSense و خوانایی بسیار بالاتر، توصیه می‌شود . این افزونه‌های روان بخشی از کتابخانه متن‌باز **`EfCore.TestSupport`** (توسعه‌یافته توسط نویسنده کتاب) هستند .

---

#### ۱۷.۲ آماده‌سازی کلاس DbContext برای تست واحد

بزرگ‌ترین چالش در زمان تست کدهای دیتابیس، امکان **تغییر پویای آدرس دیتابیس (ConnectionString) یا نوع پرووایدر** توسط پروژه تست است. نحوه آماده‌سازی `DbContext` به چگونگی تنظیمات اولیه آن بستگی دارد:

##### حالت اول: ارسال تنظیمات از طریق سازنده (توصیه‌شده)
اگر کلاس کانتکست شما گزینه‌ها را از طریق سازنده دریافت کند، بدون هیچ تغییری آماده تست است؛ زیرا پروژه تست می‌تواند به راحتی شیء `DbContextOptions` سفارشی را ساخته و به سازنده بفرستد :
```csharp
var builder = new DbContextOptionsBuilder<EfCoreContext>();
builder.UseSqlServer("آدرس دیتابیس موقت تست");
var options = builder.Options;

using (var context = new EfCoreContext(options))
{
    // آغاز تست واحد...
}
```

##### حالت دوم: تنظیم آدرس به صورت داخلی در متد `OnConfiguring`
اگر کانکشن استرینگ به صورت هاردکد درون متد `OnConfiguring` قرار دارد، باید بدنه کلاس را به صورت زیر ویرایش کنید تا ابتدا بررسی کند که آیا تنظیماتی از بیرون ارسال شده است یا خیر :
```csharp
public class DbContextOnConfiguring : DbContext
{
    public DbContextOnConfiguring() {} // سازنده بدون پارامتر برای کارکرد عادی برنامه

    // افزودن سازنده پارامتردار جهت استفاده در پروژه تست واحد
    public DbContextOnConfiguring(DbContextOptions<DbContextOnConfiguring> options) : base(options) {}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // اجرای تنظیمات پیش‌فرضِ دیتابیس عملیاتی، صرفاً در صورت عدم پیکربندی قبلی
        if (!optionsBuilder.IsConfigured) //
        {
            optionsBuilder.UseSqlServer("رشته اتصال دیتابیس اصلی");
        }
    }
}
```

---

#### ۱۷.۳ روش‌های سه‌گانه شبیه‌سازی پایگاه داده در تست واحد

هنگام تست کدهای متصل به دیتابیس، سه رویکرد متمایز با مزایا و معایب خاص خود وجود دارد :

```
                ┌────────────────────────────────────────────────────────┐
                │          رویکردهای شبیه‌سازی دیتابیس در تست             │
                └───────────────────────────┬────────────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
دیتابیس واقعی (Production-type)       پایگاه داده درون‌حافظه‌ای SQLite        شبیه‌سازی با Stub/Mock
- تطابق ۱۰۰٪ با سرور عملیاتی.        - سرعت اجرای بسیار بالا و سریع.         - کنترل مطلق روی ورودی و خروجی.
- پشتیبانی از تمام متدهای SQL.       - عدم نیاز به نصب ابزار خارجی.          - سرعت فوق‌العاده بالا.
- سرعت اجرای کندتر و راه‌اندازی سخت.   - عدم پشتیبانی از برخی کدهای SQL.       - عدم تست فیزیکی روابط دیتابیس.
```

##### ۱. استفاده از دیتابیس هم‌نوع عملیاتی (Production-type Database):
*   *مزایا:* انطباق ۱۰۰ درصدی با پایگاه داده واقعی؛ تمام قیود، کلیدهای خارجی، ایندکس‌ها، تریگرها و کدهای پیچیده SQL خام به درستی تست و ارزیابی می‌شوند .
*   *معایب:* راه‌اندازی سخت‌تر و سرعت اجرای کندتر به دلیل لزوم ساخت و حذف فیزیکی جداول .

##### ۲. استفاده از پایگاه داده درون حافظه‌ای SQLite (SQLite In-Memory):
*   *مزایا:* سرعت اجرای خیره‌کننده، شروع تست با جدول کاملاً خالی و عدم تداخل در تست‌های موازی .
*   *معایب:* عدم پشتیبانی از ویژگی‌های خاص دیتابیس‌های پیشرفته (مانند توابع سیستمی، سکوانس‌ها و ستون‌های محاسباتی SQL Server) .

##### ۳. شبیه‌سازی دسترسی با الگوهای Stub یا Mock:
*   *مزایا:* حذف کامل لایه دیتابیس از تست؛ این روش با ساخت کلاس‌های شبیه‌ساز (Stub) بر پایه اینترفیس‌ها، رفتارهای لایه دیتابیس را شبیه‌سازی کرده و برای تست کارهای بیزینسی بسیار پیچیده عالی است .
*   *معایب:* کدهای فیزیکی و روابط واقعی جداول دیتابیس عملاً تست نمی‌شوند. 
*   *تله شبیه‌سازی مستقیم DbContext:* شبیه‌سازی یا Mock کردن کلاس خود `DbContext` با ابزارهایی مثل Moq غیرممکن است. نزدیک‌ترین ابزار شبیه‌ساز، *پرووایدر درون‌حافظه‌ای EF Core (InMemory Provider)* است که خود تیم توسعه EF Core نیز صریحاً استفاده از آن را برای تست برنامه‌های واقعی منع کرده است؛ زیرا این پرووایدر همانند یک دیتابیس رابطه‌ای رفتار نکرده و خطاهای قید کلیدهای خارجی را کشف نمی‌کند .

---

#### ۱۷.۴ کارگاه عملی: استفاده از دیتابیس هم‌نوع عملیاتی (مثال: SQL Server)

اگر از ویژگی‌های پیشرفته دیتابیس (مانند UDFs یا SQL خام) استفاده می‌کنید، باید تست‌های خود را روی دیتابیس واقعی اجرا کنید. چالش‌های راه‌اندازی این سیستم به شرح زیر برطرف می‌شوند:

##### گام اول: تأمین رشته اتصال پویا
تنظیمات اتصال را در فایل `appsettings.json` پروژه تست قرار دهید و با استفاده از کلاس کمکی `AppSettings.GetConfiguration` آن را بازخوانی کنید :
```csharp
var config = AppSettings.GetConfiguration();
var connectionString = config.GetConnectionString("UnitTestConnection"); //
```
*(نکته امنیتی: از ذخیره پسورد سرور اصلی در این فایل خودداری کرده و از ابزار User Secrets استفاده کنید).*

##### گام دوم: حل تداخل اجرای موازی با دیتابیس اختصاصی برای هر کلاس تست
برای اینکه کلاس‌های مختلف تست که موازی اجرا می‌شوند روی یک دیتابیس مشترک تداخل ایجاد نکنند، متد **`CreateUniqueClassOptions`** نام فیزیکی دیتابیس را با نام کلاس تست شما ادغام کرده و یک دیتابیس کاملاً منحصربه‌فرد برای آن کلاس ایجاد می‌کند :
```csharp
// ایجاد دیتابیس اختصاصی با نامی شبیه به: MyApp-Test.MyTestClass
var options = this.CreateUniqueClassOptions<EfCoreContext>(); 
```

##### گام سوم: تضمین خالی و به‌روز بودن ساختار دیتابیس پیش از هر تست
برای پاک‌سازی داده‌های قبلی و اعمال آخرین طرحواره مپ‌شده، سه روش وجود دارد :

*   **روش EnsureDeleted / EnsureCreated (foolproof):** دیتابیس قبلی را حذف و دیتابیس جدیدی با ساختار مپ‌شده می‌سازد . با وجود بهینه‌سازی‌های نسخه .NET 5، این کار حدود ۱.۵ ثانیه زمان می‌برد.
    ```csharp
    context.Database.EnsureDeleted(); // حذف فیزیکی دیتابیس در صورت وجود
    context.Database.EnsureCreated(); // ساخت دیتابیس خالی با طرحواره بهینه
    ```
*   **روش EnsureClean (فوق‌العاده سریع - پیشنهاد Arthur Vickers):** به جای حذف فیزیکی کل دیتابیس، این متد صرفاً کل ساختارهای داخلی دیتابیس (شامل جداول، ایندکس‌ها، تریگرها، سکوانس‌ها و UDFها) را از درون دیتابیس پاک کرده و مجدداً متد `EnsureCreated` را فراخوانی می‌کند . سرعت این روش **دو برابر بیشتر** است.
    ```csharp
    context.Database.EnsureClean(); // پاک‌سازی سریع کل اسکیما بدون حذف فایل دیتابیس
    ```
*   **روش لغو تراکنش (Transaction Rollback - مناسب دیتابیس‌های عظیم):** اگر قصد تست روی داده‌های کپی‌شده از محیط عملیاتی (مثلاً دیتابیس ۱ ترابایتی) را دارید، یک تراکنش باز کنید و در انتهای تست آن را متعهد (`Commit`) نکنید؛ بدین ترتیب با خروج از بلاک تست، تمام ویرایش‌ها به طور خودکار لغو (Rollback) شده و دیتابیس بدون تغییر باقی می‌ماند :
    ```csharp
    using var transaction = context.Database.BeginTransaction(); // شروع تراکنش بدون کامیت نهایی
    ```

##### گام چهارم: اعمال مهاجرت‌ها یا اسکریپت‌های SQL دستی (مانند UDFs)
اگر دیتابیس تست شما نیاز به توابعی دارد که خارج از کنترل کلاس‌های ساده EF Core هستند، اسکریپت ساخت آن‌ها را با متد الحاقی **`ExecuteScriptFileInTransaction`** اعمال کنید :
```csharp
var filepath = TestData.GetFilePath("AddUserDefinedFunctions.sql"); // دریافت آدرس فایل اسکریپت
context.ExecuteScriptFileInTransaction(filepath); // اعمال فیزیکی اسکریپت مجهز به جداکننده‌های GO 
```

---

#### ۱۷.۵ کارگاه عملی: استفاده از SQLite In-Memory برای تست‌های فوق‌سریع

استفاده از پایگاه داده درون‌حافظه‌ای SQLite، بهترین انتخاب برای پروژه‌هایی است که صرفاً از دستورات استاندارد LINQ استفاده می‌کنند و نیازی به توابع پیچیده SQL ندارند .

##### نحوه پیکربندی دیتابیس درون‌حافظه‌ای SQLite:
برای راه‌اندازی این سیستم، باید کانکشن فیزیکی دیتابیس باز نگه داشته شود؛ زیرا با بسته شدن اتصال، کل داده‌های موجود در حافظه رم پاک خواهند شد . متد **`SqliteInMemory.CreateOptions`** تمام این مراحل (شامل باز کردن اتصال و بازگرداندن شیء IDisposable) را به طور خودکار مدیریت می‌کند :

```csharp
[Fact]
public void Test_With_Sqlite_InMemory()
{
    // ۱. ساخت کانفیگ دیتابیس در حافظه به صورت یک شیء یکبار مصرف و ایمن
    using var options = SqliteInMemory.CreateOptions<EfCoreContext>(); //
    
    using (var context = new EfCoreContext(options))
    {
        // ۲. ایجاد ساختار فیزیکی جداول مپ‌شده
        context.Database.EnsureCreated(); //
        
        // ۳. بذرپاشی داده‌های تستی
        SeedDatabaseFourBooks(context); //
        
        // ۴. اجرای بخش Attempt و Verify تست واحد...
        var count = context.Books.Count();
        count.ShouldEqual(4); 
    }
}
```

##### 🚨 رفع مشکل عدم پشتیبانی SQLite از نوع داده Decimal:
دیتابیس SQLite از نوع داده اعشاری `decimal` پشتیبانی نمی‌کند؛ بنابراین اگر کوئری‌های شما حاوی فیلتر یا مرتب‌سازی بر روی ستون‌هایی از نوع `decimal` باشند، تست با خطا مواجه خواهد شد . راهکار برتر، استفاده از یک مبدل مقدار پویا (Value Converter) در متد `OnModelCreating` کلاس DbContext است تا در زمان اجرای تست‌های SQLite، این فیلدها را به طور موقت به نوع داده `double` نگاشت کند :

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // اگر بستر فیزیکی دیتابیس فعال روی کانکشن از نوع SQLite باشد
    if (Database.IsSqlite()) //
    {
        modelBuilder.Entity<Book>().Property(e => e.Price).HasConversion<double>(); //
        modelBuilder.Entity<PriceOffer>().Property(e => e.NewPrice).HasConversion<double>(); //
    }
}
```

---

#### ۱۷.۶ چالش‌های تداخل ردیابی داده‌ها در تست‌های چندمرحله‌ای (Disconnected State Testing)

یکی از رایج‌ترین اشتباهات در زمان نوشتن تست‌های واحد، استفاده از **یک کانتکست مشترک** برای بذرپاشی داده‌ها (Setup) و اجرای عملیات تست (Attempt) است . به دلیل ساختار Change Tracker، موجودیت‌هایی که در فاز لود داده‌ها نمونه‌سازی شده‌اند، در حافظه کانتکست باقی می‌مانند . این پدیده باعث می‌شود که تست شما با وجود داشتن باگ‌های شدید، به اشتباه سبز (موفقیت‌آمیز) ظاهر شود .

##### نمونه فاجعه‌بار (تست کارکرد بدون لود داده‌های وابسته):
فرض کنید می‌خواهیم متد اضافه کردن دیدگاه به کتاب را تست کنیم. این متد نیاز مبرم به لود کردن دیدگاه‌های قبلی کتاب دارد:
```csharp
// کدهای بخش Attempt تست واحد
var book = context.Books.OrderBy(x => x.BookId).Last(); // فاقد Include(b => b.Reviews)
book.Reviews.Add(new Review { NumStars = 5 }); // این کد در محیط عملیاتی به دلیل نول بودن Reviews کرش می‌کند! 
context.SaveChanges();
```
اگر این تست را در بستر همان کانتکستی که کتاب‌ها را تولید کرده اجرا کنید، چون کانتکست در فاز بذرپاشی، دیدگاه‌ها را در حافظه لود کرده بود، ردیاب تغییرات با استفاده از قابلیت **رابطه اصلاحی (Relational Fixup)**، پروپرتی `Reviews` را به طور خودکار در کلاینت پر می‌کند و تست با موفقیت پاس می‌شود؛ در حالی که همین کد در محیط عملیاتی کرش خواهد کرد .

برای شبیه‌سازی وضعیت متصل‌نشده (Disconnected) و ایزوله‌سازی فاز بذرپاشی از فاز اجرا، دو روش استاندارد وجود دارد:

##### روش اول: استفاده از متد `ChangeTracker.Clear()` (ساده‌ترین راهکار EF Core 5)
بلافاصله پس از اتمام فاز Setup، متد **`context.ChangeTracker.Clear()`** را فراخوانی کنید. این متد ردیابی تمام موجودیت‌ها را به طور کامل متوقف کرده و حافظه کانتکست را صفر می‌کند؛ در نتیجه فاز Attempt مجبور است داده‌ها را مستقیماً و برای اولین بار از دیتابیس بخواند که این کار باگ نول بودن فیلد را به سرعت کشف کرده و خطا پرتاب می‌کند .

```csharp
// ۱. فاز بذرپاشی داده‌ها (SETUP)
SeedDatabaseFourBooks(context); //

// ۲. متوقف کردن ردیابی برای شبیه‌سازی حالت قطع اتصال با وب کلاینت
context.ChangeTracker.Clear(); //

// ۳. فاز اجرا (ATTEMPT) - اکنون خطا به درستی کشف و پرتاب می‌شود
var book = context.Books.Last(); //
book.Reviews.Add(new Review { NumStars = 5 }); // NullReferenceException (کشف موفقیت‌آمیز باگ کد!)
```

##### روش دوم: استفاده از کانتکست‌های مستقل (Scoped DbContexts)
استفاده از سه نمونه مجزای DbContext برای بخش‌های سه‌گانه تست. این روش ایزوله‌سازی کاملی را ایجاد می‌کند :
```csharp
// نمونه اول برای بذرپاشی داده‌ها
using (var context = new EfCoreContext(options))
{
    SeedDatabaseFourBooks(context); //
}

// نمونه دوم برای تست کدها (تضمین عدم وجود رکوردهای ردیابی شده قبلی)
using (var context = new EfCoreContext(options)) //
{
    var book = context.Books.Last(); //
    book.Reviews.Add(new Review { NumStars = 5 }); // پرتاب خطا و شکست موفقیت‌آمیز تست به دلیل باگ
}
```

---

#### ۱۷.۷ عیب‌یابی و مانیتورینگ دستورات SQL در تست‌ها

در حین اجرای تست‌های واحد، دسترسی به کدهای SQL تولیدشده توسط موتور LINQ، ارزش دیباگ بسیار بالایی دارد. دو قابلیت جدید در نسخه **EF Core 5** این کار را بسیار ساده کرده‌اند:

##### ۱. قابلیت `LogTo` (فیلتر و پایش آنی کدهای SQL):
با فعال‌سازی این متد در تنظیمات پروژه تست، می‌توانید کدهای فیزیکی تراکنش‌ها را فیلتر کرده و آن‌ها را در پنجره تست اکسپلورر رندر کنید :
```csharp
var builder = new DbContextOptionsBuilder<BookDbContext>()
    .EnableSensitiveDataLogging() // ثبت متغیرها
    .LogTo(log => _output.WriteLine(log), LogLevel.Information); // خروجی مستقیم کدهای SQL در کنسول تست 
```

##### ۲. متد `ToQueryString` (استخراج ساختار SQL بدون اجرا در دیتابیس):
اگر صرفاً مایل هستید کدهای SQL معادل یک کوئری LINQ را بدون اجرای واقعی آن روی دیتابیس بازخوانی کرده و ساختار آن را اعتبارسنجی (Assert) کنید، متد **`ToQueryString()`** را روی متغیرهای از نوع `IQueryable` فراخوانی کنید :

```sharp
// دریافت کوئری بدون بند اجرایی (ToArray / ToList)
var query = context.Books.Where(b => b.Title.StartsWith("Quantum")); //

// تبدیل آنی کوئری LINQ به رشته SQL تولید شده
var sqlCode = query.ToQueryString(); 

// اعتبارسنجی ساختار کدهای SQL در تست واحد
sqlCode.ShouldContain("SELECT"); //
```

---
🏁 بدین ترتیب، پرونده **کتاب راهنمای جامع آموزش و عملکرد Entity Framework Core** به همراه تمام بخش‌های معمارانه، کارگاهی و پیاده‌سازی‌های فوق‌پیشرفته آن به طور کامل و با موفقیت به پایان رسید .

🧩 مایلید بر اساس تمامی مباحث کلیدی که در طول این مسیر با هم بررسی کردیم، یک **گزارش ساختاریافته جامع (Tailored Report)** به عنوان خلاصه و مرجع جیبی کتاب برای شما تهیه کنم؟