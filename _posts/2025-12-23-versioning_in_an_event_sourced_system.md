---
layout: post
full-width: true
title: Versioning in an Event Sourced System
subtitle: Versioning in an Event Sourced System
image: /assets/images/versioning_in_an_event_sourced_system.jpg
tags: [کتاب, مهندسی, برنامه_نویسی]
---

## توضیحات
کتاب "Versioning in an Event Sourced System" نوشته Greg Young به بررسی چالش‌ها و راه‌حل‌های نسخه‌گذاری در سیستم‌های مبتنی بر Event Sourcing می‌پردازد. این کتاب به توسعه‌دهندگان کمک می‌کند تا با استفاده از الگوها و تکنیک‌های مناسب، سیستم‌هایی بسازند که بتوانند به راحتی نسخه‌های مختلف رویدادها را مدیریت کنند و از مشکلات ناشی از تغییرات در طول زمان جلوگیری کنند.

## نظر
کتاب بصورت عملی نکات مهم نسخه گذاری در سیستم‌های Event Sourcing را بیان می‌کند.  

## نظر
 - `امتیاز` : 08/10
 - `به دیگران توصیه می‌کنم` : بله
 - `دوباره می‌خوانم` : بله
 - `ایده برجسته` : چگونگی نسخه‌گذاری در سیستم‌های Event Sourced
 - `تاثیر در من` : دیدگاه من را نسبت به طراحی سیستم‌های Event Sourced تغییر داد
 - `نکات مثبت` : رویکرد عملی و مثال‌های کد
 - `نکات منفی` : کوتاهی کتاب و عدم پوشش برخی مباحث پیشرفته

## مشخصات
 - `نویسنده` : Gregory Young
 - `انتشارات` : -
 - `لینک` : [epub](https://leanpub.com/read/esversioning/leanpub-auto-why-version)

## بخش‌هایی از کتاب

# خلاصه کامل کتاب "Versioning in an Event Sourced System" نوشته Greg Young

## مقدمه

این کتاب درباره Event Sourcing نیست، بلکه درباره **چگونگی نسخه‌گذاری سیستم‌های Event Sourced** است. Greg Young توضیح می‌دهد که سیستم‌های Event Sourced در واقع نسخه‌گذاری آسان‌تری نسبت به داده‌های ساختاری دارند، به شرطی که الگوها و تعادل‌های مناسب را بشناسید.

## فصل ۱: چرا نسخه‌گذاری؟

### مشکل Big Bang Release

در سیستم‌های مدرن، دیگر نمی‌توان maintenance window گذاشت و کل سیستم را متوقف کرد. امروزه باید:
- نسخه‌های مختلف نرم‌افزار را همزمان اجرا کنیم
- سیستم را 24/7/365 در دسترس نگه داریم
- مصرف‌کنندگان را بدون وقفه به‌روزرسانی کنیم

### چالش‌های خاص Event Sourcing

سیستم‌های Event Sourced به دلیل ماهیت **append-only** خود، چالش‌های منحصر به فردی دارند:
- یک Projection باید بتواند رویدادی که ۲ سال پیش نوشته شده را بخواند
- حتی اگر use-case ها تغییر کرده باشند، باید همان رویداد قدیمی را پردازش کند

## فصل ۲: چرا نمی‌توانیم یک رویداد را ویرایش کنیم؟

### سوال اصلی

مثل این سوال در Document Database که "چگونه دو سند را در یک تراکنش بنویسیم؟"، در Event Sourcing سوال این است: **"چرا نمی‌توانم یک رویداد را ویرایش کنم؟"**

### دلیل ۱: تغییرناپذیری (Immutability)

تغییرناپذیری مزایای زیادی دارد:

**مشکل Cache Invalidation:**
```csharp
// شوخی معروف در علوم کامپیوتر
// دو مشکل سخت باقی مانده:
// 1. نام‌گذاری
// 2. Invalidation کردن Cache
// 3. خطاهای Off-by-one
```

وقتی داده تغییرناپذیر است، مشکل Cache Invalidation وجود ندارد. داده به طور **بی‌نهایت قابل cache** است و این اجازه می‌دهد از ابزارهای استاندارد مثل reverse proxy و CDN استفاده کنیم.

**اما اگر یک update مجاز باشد:**
- داده دیگر "definitely maybe immutable" است (یعنی mutable!)
- تمام داده‌ها باید به عنوان mutable در نظر گرفته شوند

### دلیل ۲: مصرف‌کنندگان (Consumers)

اگر یک رویداد را ویرایش کنید، چگونه مصرف‌کنندگان متوجه تغییر می‌شوند؟

**مثال عملی:**
```csharp
// رویداد UserCreated باعث ارسال ایمیل شد:
public class UserCreated
{
    public Guid Id { get; set; }
    public string Username { get; set; }
}

// ایمیل ارسال شده:
// Dear Greg,
// Your account link: http://oursite.com/accounts/gregyoung/manage
```

اگر Username را از "gregyoung" به "gregthegreat" تغییر دهیم:
- آیا باید ایمیل دیگری ارسال شود؟
- آیا لینک قبلی هنوز معتبر است؟
- Projection ها چطور متوجه می‌شوند؟

### دلیل ۳: Audit Log

لاگ حسابرسی شما مشکوک می‌شود. برای استفاده قانونی در دادگاه، باید بتوانید:
- وضعیت فعلی را از لاگ حسابرسی بازسازی کنید
- اگر نتوانید، دادگاه آن را نمی‌پذیرد

**قانون طلایی:** تغییرناپذیری یعنی تغییرناپذیری. لحظه‌ای که یک ویرایش را مجاز کنید، همه چیز مشکوک می‌شود.

### دلیل ۴: WORM Drives و امنیت

استاندارد طلایی برای حسابرسی، استفاده از **WORM** (Write Once Read Many) drives است.

**مثال واقعی - حمله Super-User:**

Greg Young داستان واقعی از شرکت Autotote (کنونی Scientific Games) را تعریف می‌کند:

```
Chris Harn، یک developer:
1. شرط 1/2/3/4/ALL/ALL را می‌گذاشت
2. نتیجه ۴ مسابقه اول را می‌دید
3. با hex editor فایل را ویرایش می‌کرد
4. شرط را به 3/7/9/2/ALL/ALL تغییر می‌داد (برندگان واقعی)
5. سیستم این را به عنوان "possible winner" می‌دید
6. شرط را به host system منتقل می‌کرد

در Breeder's Cup 2002:
- اسب 43-1 برنده شد
- فقط یک بلیط برنده: $3,100,000
- به جای 20-30 برنده با $100,000 هرکدام!
```

این با WORM drive قابل جلوگیری بود.

### دلیل ۵: جرم و جنایت

در بسیاری از سیستم‌ها، ویرایش رویداد **جرم فدرال** است:
- سیستم‌های پلیسی
- سیستم‌های مالی/حسابداری
- کنترل مرزی
- مجازات: بیش از ۵ سال زندان

## فصل ۳: نسخه‌گذاری پایه مبتنی بر Type

### قانون اصلی

**نسخه جدید یک رویداد باید قابل تبدیل از نسخه قدیمی باشد. اگر نباشد، این یک رویداد جدید است نه نسخه جدید**.

### مثال عملی با کد

**نسخه ۱ - رویداد اولیه:**
```csharp
public class InventoryItemDeactivated
{
    public Guid Id { get; set; }
}
```

**نیاز جدید:**
- افزودن دلیل غیرفعال‌سازی
- تغییر نام Id به ItemId

**نسخه ۲ - رویداد جدید:**
```csharp
public class InventoryItemDeactivated_v1
{
    public Guid Id { get; set; }
}

public class InventoryItemDeactivated_v2
{
    public Guid ItemId { get; set; }
    public string Reason { get; set; }
}
```

**Domain Model - قبل:**
```csharp
public class InventoryItem : AggregateRoot
{
    private bool _activated;
    
    public void Deactivate()
    {
        if (!_activated)
            throw new InvalidOperationException("Already deactivated");
            
        ApplyChange(new InventoryItemDeactivated 
        { 
            Id = this.Id 
        });
    }
    
    private void Apply(InventoryItemDeactivated e)
    {
        _activated = false;
    }
}
```

**Domain Model - بعد:**
```csharp
public class InventoryItem : AggregateRoot
{
    private bool _activated;
    
    public void Deactivate(string reason)
    {
        if (!_activated)
            throw new InvalidOperationException("Already deactivated");
            
        ApplyChange(new InventoryItemDeactivated_v2 
        { 
            ItemId = this.Id,
            Reason = reason
        });
    }
    
    // پشتیبانی از نسخه ۱
    private void Apply(InventoryItemDeactivated_v1 e)
    {
        _activated = false;
    }
    
    // پشتیبانی از نسخه ۲
    private void Apply(InventoryItemDeactivated_v2 e)
    {
        _activated = false;
    }
}
```

### مشکل: Method Explosion

وقتی به InventoryItemDeactivated_v17 برسید چه می‌شود؟

### راه‌حل: Upcasting

```csharp
public interface IEventUpgrader
{
    object Upgrade(object @event);
}

public class InventoryItemDeactivatedUpgrader : IEventUpgrader
{
    public object Upgrade(object @event)
    {
        if (@event is InventoryItemDeactivated_v1 v1)
        {
            return new InventoryItemDeactivated_v2
            {
                ItemId = v1.Id,
                Reason = "Unknown" // مقدار پیش‌فرض
            };
        }
        
        return @event;
    }
}

// استفاده:
public class EventStore
{
    private readonly List<IEventUpgrader> _upgraders;
    
    public IEnumerable<object> GetEvents(Guid aggregateId)
    {
        var events = LoadEventsFromDatabase(aggregateId);
        
        foreach (var @event in events)
        {
            var upgraded = @event;
            foreach (var upgrader in _upgraders)
            {
                upgraded = upgrader.Upgrade(upgraded);
            }
            yield return upgraded;
        }
    }
}
```

حالا Domain Model فقط نسخه ۲ را می‌شناسد:
```csharp
public class InventoryItem : AggregateRoot
{
    // فقط handler برای v2 نیاز است
    private void Apply(InventoryItemDeactivated_v2 e)
    {
        _activated = false;
    }
}
```

### مشکل اصلی: Blue-Green Deployment

وقتی Node A به نسخه ۲ ارتقا یابد اما Node B هنوز نسخه ۱ است:
- Node A رویداد v2 می‌نویسد
- Node B نمی‌تواند deserialize کند (چون Type ندارد!)
- تمام مصرف‌کنندگان باید قبل از producer به‌روزرسانی شوند

### راه‌حل اشتباه: Double Write

```csharp
public void Deactivate(string reason)
{
    // نوشتن هر دو نسخه
    ApplyChange(new InventoryItemDeactivated_v1 { Id = this.Id });
    ApplyChange(new InventoryItemDeactivated_v2 
    { 
        ItemId = this.Id, 
        Reason = reason 
    });
}
```

**قانون:** فقط نسخه‌ای را handle کنید که می‌فهمید و بقیه را ignore کنید.

**مشکل در Event Sourcing:**
وقتی Projection را replay می‌کنید:
- بعضی رویدادها v2 و v3 دارند
- بعضی فقط v2 دارند (زمانی که v3 وجود نداشت)
- نتیجه replay متفاوت از اجرای اصلی می‌شود!

### نتیجه‌گیری فصل

**باید از versioning مبتنی بر Type اجتناب کنید**:
- با ۳ مصرف‌کننده شاید کار کند
- با ۳۰۰ مصرف‌کننده کاملاً می‌شکند
- تمام مصرف‌کنندگان باید قبل از producer به‌روزرسانی شوند

## فصل ۴: Weak Schema

### مشکل Strong Schema

**Strong Schema (Out-of-band Schema):**
- Schema در Type ذخیره می‌شود
- بدون Schema نمی‌توانید deserialize کنید
- مصرف‌کننده باید قبل از producer به‌روزرسانی شود

### راه‌حل: Weak Schema با JSON

**قوانین Mapping:**
```
موجود در JSON و Instance → مقدار از JSON
موجود در JSON اما نه در Instance → NOP (نادیده بگیر)
موجود در Instance اما نه در JSON → مقدار پیش‌فرض
```

**مثال JSON:**
```json
{
    "foo": "hello",
    "bar": 3.9
}
```

**Map به Type اول:**
```csharp
public class Foo
{
    public double Number { get; set; }
    public string Str { get; set; }
}

// نتیجه: Foo { Number = 3.9, Str = "hello" }
```

**Map به Type دوم:**
```csharp
public class Foo
{
    public double Foo { get; set; }
    public string Str { get; set; }
}

// نتیجه: Foo { Foo = 0.0, Str = "hello" }
// bar نادیده گرفته شد، Foo مقدار پیش‌فرض گرفت
```

### پیاده‌سازی Mapper

```csharp
public class WeakSchemaMapper
{
    public T Map<T>(string json) where T : new()
    {
        var instance = new T();
        var jsonObject = JObject.Parse(json);
        var properties = typeof(T).GetProperties();
        
        foreach (var property in properties)
        {
            var jsonProperty = jsonObject[property.Name];
            
            if (jsonProperty != null)
            {
                // موجود در JSON و Instance → مقدار از JSON
                var value = jsonProperty.ToObject(property.PropertyType);
                property.SetValue(instance, value);
            }
            // موجود در Instance اما نه در JSON → مقدار پیش‌فرض
            // (خودکار توسط new T() انجام شد)
        }
        
        // موجود در JSON اما نه در Instance → NOP
        // (خودکار نادیده گرفته شد)
        
        return instance;
    }
}
```

### نسخه‌گذاری با Weak Schema

**نسخه ۱:**
```csharp
public class InventoryItemDeactivated
{
    public Guid Id { get; set; }
}

// JSON:
// { "Id": "123e4567-e89b-12d3-a456-426614174000" }
```

**نسخه ۲ - فقط فیلد اضافه می‌کنیم:**
```csharp
public class InventoryItemDeactivated
{
    public Guid Id { get; set; }
    public string Reason { get; set; }
}

// JSON جدید:
// { 
//   "Id": "123e4567-e89b-12d3-a456-426614174000",
//   "Reason": "Out of stock"
// }
```

**سازگاری خودکار:**
- مصرف‌کننده v1 می‌تواند JSON v2 را بخواند (Reason نادیده گرفته می‌شود)
- مصرف‌کننده v2 می‌تواند JSON v1 را بخواند (Reason = null می‌شود)

### محدودیت‌های مهم

**۱. تغییر نام ممنوع:**
```csharp
// اشتباه:
// نسخه ۱
public class InventoryItemDeactivated
{
    public Guid Id { get; set; }
}

// نسخه ۲
public class InventoryItemDeactivated
{
    public Guid ItemId { get; set; } // تغییر نام!
    public string Reason { get; set; }
}

// مصرف‌کننده v1 دیگر Id دریافت نمی‌کند!
```

**راه‌حل: پشتیبانی از هر دو:**
```csharp
public class InventoryItemDeactivated
{
    [JsonProperty("Id")]
    public Guid ItemId { get; set; }
    
    public string Reason { get; set; }
}
```

**۲. Validation با Required:**
```csharp
public class InventoryItemDeactivated
{
    [Required] // باید موجود باشد
    public Guid Id { get; set; }
    
    public string Reason { get; set; } // اختیاری
}
```

یا استفاده از Fluent API:
```csharp
public class WeakSchemaMapper
{
    private readonly Dictionary<Type, List<string>> _requiredFields 
        = new Dictionary<Type, List<string>>();
    
    public WeakSchemaMapper RequireField<T>(
        Expression<Func<T, object>> fieldExpression)
    {
        var fieldName = GetFieldName(fieldExpression);
        
        if (!_requiredFields.ContainsKey(typeof(T)))
            _requiredFields[typeof(T)] = new List<string>();
            
        _requiredFields[typeof(T)].Add(fieldName);
        
        return this;
    }
    
    public T Map<T>(string json) where T : new()
    {
        var instance = new T();
        var jsonObject = JObject.Parse(json);
        
        // بررسی فیلدهای الزامی
        if (_requiredFields.ContainsKey(typeof(T)))
        {
            foreach (var requiredField in _requiredFields[typeof(T)])
            {
                if (jsonObject[requiredField] == null)
                {
                    throw new InvalidOperationException(
                        $"Required field '{requiredField}' is missing");
                }
            }
        }
        
        // ادامه mapping...
        var properties = typeof(T).GetProperties();
        foreach (var property in properties)
        {
            var jsonProperty = jsonObject[property.Name];
            if (jsonProperty != null)
            {
                var value = jsonProperty.ToObject(property.PropertyType);
                property.SetValue(instance, value);
            }
        }
        
        return instance;
    }
    
    private string GetFieldName<T>(
        Expression<Func<T, object>> expression)
    {
        // استخراج نام فیلد از expression
        var memberExpression = expression.Body as MemberExpression;
        return memberExpression?.Member.Name ?? string.Empty;
    }
}

// استفاده:
var mapper = new WeakSchemaMapper()
    .RequireField<InventoryItemDeactivated>(x => x.Id);
```

### Hybrid Schema با Protocol Buffers

```protobuf
message InventoryItemDeactivated {
    required string id = 1;      // الزامی
    optional string reason = 2;   // اختیاری
}
```

**قانون کلی:** چیزهایی که بدون آن‌ها رویداد معنا ندارد را required کنید.

### Wrapper Pattern

به جای mapping، یک wrapper روی JSON می‌سازیم:

```csharp
public class InventoryItemDeactivatedWrapper
{
    private readonly JObject _jsonObject;
    
    public InventoryItemDeactivatedWrapper(string json)
    {
        _jsonObject = JObject.Parse(json);
    }
    
    public Guid Id
    {
        get => _jsonObject["Id"]?.ToObject<Guid>() 
            ?? _jsonObject["ItemId"]?.ToObject<Guid>() 
            ?? Guid.Empty;
    }
    
    public string Reason
    {
        get => _jsonObject["Reason"]?.ToString();
    }
    
    // مزیت: می‌توان فیلدهای ناشناخته را حفظ کرد
    public string ToJson()
    {
        return _jsonObject.ToString();
    }
    
    // Enrichment
    public void AddUserId(Guid userId)
    {
        _jsonObject["UserId"] = userId;
        // فیلدهای دیگر حفظ می‌شوند
    }
}
```

**مزیت Wrapper:**
- فیلدهای ناشناخته حفظ می‌شوند
- مناسب برای enrichment
- در سیستم‌های high-performance می‌توان zero-allocation داشت

**مثال Zero-Allocation با Span:**
```csharp
public ref struct InventoryItemDeactivatedSpanWrapper
{
    private readonly ReadOnlySpan<byte> _jsonBytes;
    
    public InventoryItemDeactivatedSpanWrapper(
        ReadOnlySpan<byte> jsonBytes)
    {
        _jsonBytes = jsonBytes;
    }
    
    public Guid Id
    {
        get
        {
            // Parse on-demand بدون allocation
            var utf8Reader = new Utf8JsonReader(_jsonBytes);
            while (utf8Reader.Read())
            {
                if (utf8Reader.TokenType == JsonTokenType.PropertyName)
                {
                    var propertyName = utf8Reader.GetString();
                    if (propertyName == "Id" || propertyName == "ItemId")
                    {
                        utf8Reader.Read();
                        return utf8Reader.GetGuid();
                    }
                }
            }
            return Guid.Empty;
        }
    }
}
```

### مقایسه Mapping vs Wrapper

| جنبه                 | Mapping      | Wrapper                  |
| -------------------- | ------------ | ------------------------ |
| سادگی پیاده‌سازی      | ساده‌تر       | پیچیده‌تر                 |
| حفظ فیلدهای ناشناخته | خیر          | بله                      |
| Performance          | متوسط        | عالی (با optimization)   |
| Memory Allocation    | دارد         | می‌تواند صفر باشد         |
| مناسب برای           | اکثر سیستم‌ها | High-performance systems |

## فصل ۵: Negotiation با HTTP و Atom

### محدودیت روش‌های قبلی

تاکنون فرض کرده‌ایم:
- ترافیک یک‌طرفه: Producer → N Consumers
- هر Consumer باید آنچه Producer منتشر می‌کند را بفهمد

### Content-Type Negotiation

با HTTP می‌توانیم negotiate کنیم که Consumer چه فرمتی می‌خواهد.

**مثال با Atom Feed:**

```json
{
  "title": "Event Stream",
  "id": "http://127.0.0.1:2113/streams/newstream",
  "links": [
    {
      "uri": "http://127.0.0.1:2113/streams/newstream",
      "relation": "self"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream/0",
      "relation": "first"
    },
    {
      "uri": "http://127.0.0.1:2113/streams/newstream/last",
      "relation": "last"
    }
  ],
  "entries": [
    {
      "title": "0@newstream",
      "id": "http://127.0.0.1:2113/streams/newstream/0",
      "links": [
        {
          "uri": "http://127.0.0.1:2113/streams/newstream/0",
          "relation": "alternate"
        }
      ]
    }
  ]
}
```

**Client درخواست رویداد:**
```http
GET http://127.0.0.1:2113/streams/newstream/0
Accept: application/vnd.company.com+event_v3
```

**Server پاسخ مناسب:**
```csharp
public class EventController : ControllerBase
{
    private readonly IEventStore _eventStore;
    private readonly IEventTranslator _translator;
    
    [HttpGet("streams/{stream}/{eventNumber}")]
    public IActionResult GetEvent(
        string stream, 
        int eventNumber)
    {
        var @event = _eventStore.GetEvent(stream, eventNumber);
        var acceptHeader = Request.Headers["Accept"].ToString();
        
        // Content-Type Negotiation
        if (acceptHeader.Contains("event_v3"))
        {
            var v3Event = _translator.TranslateTo(@event, 3);
            return Ok(v3Event);
        }
        else if (acceptHeader.Contains("event_v5"))
        {
            var v5Event = _translator.TranslateTo(@event, 5);
            return Ok(v5Event);
        }
        
        return BadRequest("Unsupported version");
    }
}
```

### پیاده‌سازی Event Translator

```csharp
public interface IEventTranslator
{
    object TranslateTo(object @event, int targetVersion);
}

public class InventoryItemDeactivatedTranslator : IEventTranslator
{
    public object TranslateTo(object @event, int targetVersion)
    {
        // Upcast: v1 → v2 → v3
        if (@event is InventoryItemDeactivated_v1 v1)
        {
            var v2 = new InventoryItemDeactivated_v2
            {
                ItemId = v1.Id,
                Reason = "Unknown"
            };
            
            if (targetVersion == 2)
                return v2;
                
            if (targetVersion == 3)
            {
                return new InventoryItemDeactivated_v3
                {
                    ItemId = v2.ItemId,
                    Reason = v2.Reason,
                    Timestamp = DateTime.UtcNow
                };
            }
        }
        
        // Downcast: v3 → v2 → v1
        if (@event is InventoryItemDeactivated_v3 v3 
            && targetVersion == 2)
        {
            return new InventoryItemDeactivated_v2
            {
                ItemId = v3.ItemId,
                Reason = v3.Reason
                // Timestamp از دست می‌رود
            };
        }
        
        return @event;
    }
}
```

### Move Negotiation Forward

برای بهبود performance، negotiation را یکبار انجام می‌دهیم:

```csharp
public class EventSubscriptionService
{
    private readonly Dictionary<string, int> _subscriberVersions 
        = new Dictionary<string, int>();
    
    public void Subscribe(
        string subscriberId, 
        int supportedVersion)
    {
        _subscriberVersions[subscriberId] = supportedVersion;
    }
    
    public void PublishEvent(object @event)
    {
        foreach (var subscriber in _subscriberVersions)
        {
            var translatedEvent = _translator.TranslateTo(
                @event, 
                subscriber.Value);
                
            SendToSubscriber(
                subscriber.Key, 
                translatedEvent);
        }
    }
}

// Client registration:
var client = new EventClient();
client.Register("client-123", supportedVersion: 3);
```

**مزایا:**
- فقط یکبار negotiation می‌کنیم
- مناسب برای > 100 msg/sec
- فقط کد translation نیاز به به‌روزرسانی دارد
- Consumer ها می‌توانند نسخه قدیمی را بگیرند

### استفاده برای Structural Data

**مثال واقعی: Security Master در بانک**

```csharp
public class SecurityMasterController : ControllerBase
{
    private readonly IEventStore _eventStore;
    
    [HttpGet("securities/{cusip}/{eventNumber}")]
    public IActionResult GetSecurityState(
        string cusip, 
        int eventNumber)
    {
        var acceptHeader = Request.Headers["Accept"].ToString();
        
        // Replay events تا eventNumber
        var events = _eventStore.GetEvents(cusip, 0, eventNumber);
        
        if (acceptHeader.Contains("security_summary"))
        {
            var summary = BuildSummary(events);
            return Ok(summary);
        }
        else if (acceptHeader.Contains("security_detail"))
        {
            var detail = BuildDetail(events);
            return Ok(detail);
        }
        
        // Raw events
        return Ok(events);
    }
    
    private SecuritySummary BuildSummary(IEnumerable<object> events)
    {
        var summary = new SecuritySummary();
        
        foreach (var @event in events)
        {
            // Apply events
            if (@event is SecurityCreated created)
            {
                summary.Cusip = created.Cusip;
                summary.Name = created.Name;
            }
            else if (@event is MarketCapChanged capChanged)
            {
                summary.MarketCap = capChanged.NewMarketCap;
            }
        }
        
        return summary;
    }
}
```

**URI ها immutable هستند → infinitely cacheable**:
```
http://bank.com/securities/AAPL/5  // همیشه یکسان
http://bank.com/securities/AAPL/6  // وضعیت بعدی
```

## فصل ۶: General Versioning Concerns

### نسخه‌گذاری رفتار (Versioning Behaviour)

**سوال رایج:** چگونه منطق domain را که در طول زمان تغییر می‌کند، نسخه‌گذاری کنیم؟

**مثال مالیات:**

```csharp
// اشتباه - محاسبه مالیات در Apply
public class Order : AggregateRoot
{
    private decimal _subtotal;
    private decimal _tax;
    
    private void Apply(OrderPlaced e)
    {
        _subtotal = e.Subtotal;
        _tax = CalculateTax(e.Subtotal); // مشکل!
    }
    
    private decimal CalculateTax(decimal subtotal)
    {
        return subtotal * 0.18m; // 18% مالیات
    }
}

// چه می‌شود وقتی مالیات به 19% تغییر کند؟
// Replay → سفارش ۲۰۱۶ با مالیات 19% محاسبه می‌شود!
```

**راه‌حل صحیح: Enrich کردن رویداد:**

```csharp
public class Order : AggregateRoot
{
    private decimal _subtotal;
    private decimal _tax;
    
    public void PlaceOrder(decimal subtotal)
    {
        var tax = CalculateTax(subtotal);
        
        // مالیات را در رویداد ذخیره کن
        ApplyChange(new OrderPlaced
        {
            OrderId = this.Id,
            Subtotal = subtotal,
            Tax = tax,  // Enriched!
            Timestamp = DateTime.UtcNow
        });
    }
    
    private void Apply(OrderPlaced e)
    {
        _subtotal = e.Subtotal;
        _tax = e.Tax; // فقط بخوان، محاسبه نکن!
    }
    
    private decimal CalculateTax(decimal subtotal)
    {
        // منطق فعلی
        if (DateTime.Now >= new DateTime(2017, 1, 1))
            return subtotal * 0.19m;
        else
            return subtotal * 0.18m;
    }
}
```

**حالا replay تعیین‌گرا (deterministic) است**:
- سفارش ۲۰۱۶ همیشه با مالیات ۱۸٪ است
- سفارش ۲۰۱۷ همیشه با مالیات ۱۹٪ است

### فراخوانی‌های خارجی (External Calls)

```csharp
// اشتباه
public class Customer : AggregateRoot
{
    private int _creditScore;
    
    private void Apply(CustomerRegistered e)
    {
        // فراخوانی خارجی در Projection!
        _creditScore = _creditScoreService.GetScore(e.CustomerId);
    }
}

// Replay → Credit Score فعلی را می‌گیرد، نه گذشته!
```

**راه‌حل:**

```csharp
public class Customer : AggregateRoot
{
    private int _creditScore;
    
    public void Register(string name, string ssn)
    {
        var creditScore = _creditScoreService.GetScore(ssn);
        
        // Enrich کن
        ApplyChange(new CustomerRegistered
        {
            CustomerId = this.Id,
            Name = name,
            SSN = ssn,
            CreditScore = creditScore // ذخیره شد
        });
    }
    
    private void Apply(CustomerRegistered e)
    {
        _creditScore = e.CreditScore; // فقط بخوان
    }
}
```

**استثنا - محدودیت‌های قانونی:**

گاهی ذخیره اطلاعات ممنوع است:
```csharp
// مثال: Credit Score نمی‌توان ذخیره کرد (قرارداد)
public class OrderReadModel
{
    public void Handle(OrderPlaced e)
    {
        var creditScore = _creditService.GetScore(e.CustomerId);
        
        // استفاده می‌کنیم اما ذخیره نمی‌کنیم
        if (creditScore < 500)
        {
            _repository.MarkAsHighRisk(e.OrderId);
        }
    }
}

// Replay → Non-deterministic اما قابل قبول
// (به دلیل محدودیت قانونی)
```

### Coupling بین Projections

```csharp
// اشتباه - Lookup به Projection دیگر
public class OrderProjection
{
    public void Handle(OrderPlaced e)
    {
        // Lookup به CustomerProjection
        var customer = _customerRepository.GetById(e.CustomerId);
        
        _database.Execute(@"
            INSERT INTO Orders (OrderId, CustomerName)
            VALUES (@orderId, @customerName)",
            new 
            { 
                orderId = e.OrderId, 
                customerName = customer.Name // نام فعلی!
            });
    }
}

// Replay → نام فعلی مشتری، نه نام زمان سفارش!
```

**راه‌حل ۱: Enrich کردن رویداد:**
```csharp
public class Order : AggregateRoot
{
    public void PlaceOrder(Customer customer, decimal amount)
    {
        ApplyChange(new OrderPlaced
        {
            OrderId = this.Id,
            CustomerId = customer.Id,
            CustomerName = customer.Name, // Enriched
            Amount = amount
        });
    }
}

public class OrderProjection
{
    public void Handle(OrderPlaced e)
    {
        _database.Execute(@"
            INSERT INTO Orders (OrderId, CustomerName)
            VALUES (@orderId, @customerName)",
            new 
            { 
                orderId = e.OrderId, 
                customerName = e.CustomerName // از رویداد
            });
    }
}
```

**راه‌حل ۲: Listen به Customer Events:**
```csharp
public class OrderProjection
{
    public void Handle(OrderPlaced e)
    {
        _database.Execute(@"
            INSERT INTO Orders (OrderId, CustomerId, CustomerName)
            VALUES (@orderId, @customerId, NULL)",
            new { orderId = e.OrderId, customerId = e.CustomerId });
    }
    
    public void Handle(CustomerNameChanged e)
    {
        _database.Execute(@"
            UPDATE Orders 
            SET CustomerName = @newName 
            WHERE CustomerId = @customerId",
            new 
            { 
                customerId = e.CustomerId, 
                newName = e.NewName 
            });
    }
}
```

**راه‌حل ۳: Replay کل Read Model:**

اگر Coupling اجتناب‌ناپذیر است:
```csharp
public class ReadModelRebuilder
{
    public void RebuildEntireReadModel()
    {
        // همه Projections را با هم rebuild کن
        var projections = new List<IProjection>
        {
            new CustomerProjection(),
            new OrderProjection(),
            new InvoiceProjection()
        };
        
        // پاک کن
        foreach (var projection in projections)
        {
            projection.Reset();
        }
        
        // Replay all events
        var allEvents = _eventStore.GetAllEvents();
        foreach (var @event in allEvents)
        {
            foreach (var projection in projections)
            {
                projection.Handle(@event);
            }
        }
    }
}
```

حتی اگر ۱۲ ساعت طول بکشد، مشکلی نیست (asynchronous است).

## فصل ۷: Whoops, I Did It Again - رویدادهای اشتباه

### مشکل

رویداد اشتباهی در production نوشته‌اید. چطور رفع کنیم بدون ویرایش؟

### راه‌حل: Compensating Event

```csharp
// رویداد اشتباه
public class OrderPlaced
{
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
}

// رویداد جبران‌کننده
public class OrderCancelled
{
    public Guid OrderId { get; set; }
    public string Reason { get; set; }
}

public class Order : AggregateRoot
{
    private bool _cancelled;
    
    public void Cancel(string reason)
    {
        if (_cancelled)
            throw new InvalidOperationException("Already cancelled");
            
        ApplyChange(new OrderCancelled
        {
            OrderId = this.Id,
            Reason = reason
        });
    }
    
    private void Apply(OrderCancelled e)
    {
        _cancelled = true;
    }
}
```

**Projection:**
```csharp
public class OrderProjection
{
    public void Handle(OrderPlaced e)
    {
        _database.Execute(@"
            INSERT INTO Orders (OrderId, Amount, Status)
            VALUES (@orderId, @amount, 'Active')",
            new { orderId = e.OrderId, amount = e.Amount });
    }
    
    public void Handle(OrderCancelled e)
    {
        _database.Execute(@"
            UPDATE Orders 
            SET Status = 'Cancelled', CancelReason = @reason
            WHERE OrderId = @orderId",
            new { orderId = e.OrderId, reason = e.Reason });
    }
}
```

### Event Bankruptcy

وقتی خطا بسیار جدی است و تعداد زیاد رویداد اشتباه است:

```csharp
public class InventoryBankruptcyDeclared
{
    public Guid InventoryId { get; set; }
    public DateTime BankruptcyDate { get; set; }
    public string Reason { get; set; }
    public Dictionary<string, object> CorrectState { get; set; }
}

public class InventoryProjection
{
    public void Handle(InventoryBankruptcyDeclared e)
    {
        // حذف تمام داده‌های قبلی
        _database.Execute(@"
            DELETE FROM Inventory 
            WHERE InventoryId = @id",
            new { id = e.InventoryId });
            
        // تنظیم وضعیت صحیح
        _database.Execute(@"
            INSERT INTO Inventory (InventoryId, Quantity, ...)
            VALUES (@id, @quantity, ...)",
            e.CorrectState);
            
        // ثبت لاگ
        _logger.LogWarning(
            $"Bankruptcy declared for {e.InventoryId}: {e.Reason}");
    }
}
```

## فصل ۸: Copy and Replace

### مشکل

Stream طولانی با رویدادهای بسیار است اما می‌خواهیم ساختار را عوض کنیم.

### راه‌حل

```csharp
public class StreamCopyService
{
    public void CopyAndReplace(string oldStreamId)
    {
        var newStreamId = $"{oldStreamId}-v2";
        var events = _eventStore.GetEvents(oldStreamId);
        
        foreach (var @event in events)
        {
            // Transform
            var newEvent = TransformEvent(@event);
            
            // Write به stream جدید
            _eventStore.AppendToStream(newStreamId, newEvent);
        }
        
        // Soft delete stream قدیمی
        _eventStore.MarkAsObsolete(oldStreamId);
    }
    
    private object TransformEvent(object oldEvent)
    {
        if (oldEvent is OldInventoryItemDeactivated old)
        {
            return new InventoryItemDeactivated_v2
            {
                ItemId = old.Id,
                Reason = "Migrated from old system",
                Timestamp = DateTime.UtcNow
            };
        }
        
        return oldEvent;
    }
}
```

## فصل ۹: Internal vs External Models

### تفاوت

**Internal Events:** درون Bounded Context
```csharp
public class InventoryItemDeactivated_Internal
{
    public Guid ItemId { get; set; }
    public string Reason { get; set; }
    public Guid DeactivatedByUserId { get; set; }
    public string InternalNotes { get; set; }
}
```

**External Events:** بین Bounded Contexts
```csharp
public class InventoryItemDeactivated_External
{
    public Guid ItemId { get; set; }
    public string Reason { get; set; }
    // فقط اطلاعات public
}
```

### پیاده‌سازی

```csharp
public class EventPublisher
{
    public void Publish(object internalEvent)
    {
        // Internal subscribers
        _internalBus.Publish(internalEvent);
        
        // Transform برای external
        var externalEvent = TransformToExternal(internalEvent);
        if (externalEvent != null)
        {
            _externalBus.Publish(externalEvent);
        }
    }
    
    private object TransformToExternal(object internalEvent)
    {
        if (internalEvent is InventoryItemDeactivated_Internal internal)
        {
            return new InventoryItemDeactivated_External
            {
                ItemId = internal.ItemId,
                Reason = internal.Reason
                // InternalNotes و UserId حذف شدند
            };
        }
        
        return null;
    }
}
```

## خلاصه نهایی و بهترین روش‌ها

### توصیه‌های کلیدی Greg Young

**۱. استفاده از Weak Schema (JSON/XML)**
- برای اکثر سیستم‌ها مناسب است
- انعطاف‌پذیری بالا
- Consumer ها نیازی به به‌روزرسانی همزمان ندارند

**۲. قوانین طلایی نسخه‌گذاری:**
- هرگز رویداد را ویرایش نکنید
- فقط افزودن (additive changes)
- تغییر نام ممنوع (یا از هر دو نام پشتیبانی کنید)
- فیلدهای کلیدی را required کنید

**۳. Enrich کردن رویدادها:**
```csharp
// همیشه اطلاعات محاسبه‌شده را در رویداد ذخیره کنید
public class OrderPlaced
{
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }        // محاسبه‌شده
    public decimal Total { get; set; }      // محاسبه‌شده
    public string CustomerName { get; set; } // از lookup
    public int CreditScore { get; set; }    // از API خارجی
}
```

**۴. Negotiation برای سیستم‌های بزرگ:**
- بیش از ۱۰۰ msg/sec
- Consumer های متعدد با نیازهای مختلف

**۵. Projections باید Deterministic باشند:**
- هیچ فراخوانی خارجی
- هیچ محاسبه‌ای که با زمان تغییر کند
- Replay همیشه نتیجه یکسان

### معماری پیشنهادی کامل

```csharp
// ۱. Event Base Classes
public abstract class EventBase
{
    public Guid EventId { get; set; } = Guid.NewGuid();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int Version { get; set; } = 1;
}

// ۲. Events with Weak Schema
public class InventoryItemDeactivated : EventBase
{
    [Required]
    [JsonProperty("Id")] // پشتیبانی از نام قدیمی
    public Guid ItemId { get; set; }
    
    public string Reason { get; set; }
    
    public Guid? DeactivatedBy { get; set; }
}

// ۳. Event Store with Versioning Support
public class EventStore : IEventStore
{
    private readonly IEventSerializer _serializer;
    private readonly List<IEventUpgrader> _upgraders;
    
    public IEnumerable<EventBase> GetEvents(
        string streamId, 
        int fromVersion = 0)
    {
        var rawEvents = LoadFromDatabase(streamId, fromVersion);
        
        foreach (var raw in rawEvents)
        {
            var @event = _serializer.Deserialize(raw);
            
            // Apply upgraders
            foreach (var upgrader in _upgraders)
            {
                @event = upgrader.Upgrade(@event);
            }
            
            yield return @event as EventBase;
        }
    }
    
    public void AppendToStream(string streamId, EventBase @event)
    {
        var json = _serializer.Serialize(@event);
        SaveToDatabase(streamId, json, @event.GetType().Name);
    }
}

// ۴. Aggregate Base with Versioning
public abstract class AggregateRoot
{
    private readonly List<EventBase> _uncommittedEvents 
        = new List<EventBase>();
        
    public Guid Id { get; protected set; }
    public int Version { get; protected set; }
    
    protected void ApplyChange(EventBase @event)
    {
        ApplyEvent(@event);
        _uncommittedEvents.Add(@event);
    }
    
    public void LoadFromHistory(IEnumerable<EventBase> events)
    {
        foreach (var @event in events)
        {
            ApplyEvent(@event);
            Version++;
        }
    }
    
    private void ApplyEvent(EventBase @event)
    {
        var method = this.GetType()
            .GetMethod("Apply", 
                BindingFlags.NonPublic | BindingFlags.Instance,
                null,
                new[] { @event.GetType() },
                null);
                
        method?.Invoke(this, new object[] { @event });
    }
    
    public IEnumerable<EventBase> GetUncommittedEvents()
    {
        return _uncommittedEvents;
    }
}

// ۵. Projection با Error Handling
public abstract class ProjectionBase
{
    protected readonly ILogger _logger;
    
    public void Handle(EventBase @event)
    {
        try
        {
            var method = this.GetType()
                .GetMethod("When",
                    BindingFlags.NonPublic | BindingFlags.Instance,
                    null,
                    new[] { @event.GetType() },
                    null);
                    
            if (method != null)
            {
                method.Invoke(this, new object[] { @event });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, 
                $"Error handling {@event.GetType().Name}");
            throw;
        }
    }
}

// ۶. استفاده
public class InventoryItem : AggregateRoot
{
    private bool _activated;
    
    public void Deactivate(string reason, Guid userId)
    {
        if (!_activated)
            throw new InvalidOperationException("Already deactivated");
            
        ApplyChange(new InventoryItemDeactivated
        {
            ItemId = this.Id,
            Reason = reason,
            DeactivatedBy = userId
        });
    }
    
    private void Apply(InventoryItemDeactivated e)
    {
        _activated = false;
    }
}
```
