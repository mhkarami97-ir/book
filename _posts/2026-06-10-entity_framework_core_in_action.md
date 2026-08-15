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

