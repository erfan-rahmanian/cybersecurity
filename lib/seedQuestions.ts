import { securityPlusConcepts } from "./securityPlusConcepts";
import { cehConcepts } from "./cehConcepts";
import { socConcepts } from "./socConcepts";

export interface Question {
  id: number;
  category: "security+" | "ceh" | "soc";
  difficulty: "easy" | "medium" | "hard";
  type: "multiple" | "essay";
  questionText: string;
  options?: string[];
  correctOption?: number;
  explanation: string;
  hint: string;
  syllabusTopic: string;
  keywords?: string[]; // keywords for deterministic grading
}

// Keeping this array empty as we have fully migrated to 100% robust dynamic concept-driven generation
export const seedQuestions: Question[] = [];

export const topicsSecurityPlusList = [
  "تهدیدها و حملات امنیتی",
  "پروتکل‌ها و معماری شبکه",
  "احراز هویت و مدیریت دسترسی",
  "امنیت داده و رمزنگاری",
  "مدیریت ریسک و انطباق قوانین",
  "امنیت در بستر ابری و مجازی‌سازی",
  "تست نفوذ پذیری و ممیزی سیستم"
];

export const topicsCEHList = [
  "جمع‌آوری اطلاعات و شناسایی شبکه",
  "اسکن شبکه‌ها و آسیب‌پذیری‌ها",
  "متدولوژی هک سیستم و دور زدن دفاع",
  "بدافزارها، تروجان‌ها و بات‌نت‌ها",
  "شنود شبکه و مسموم‌سازی کش",
  "مهندسی اجتماعی و فیشینگ",
  "حملات وب، تزریق کد و هک بیسیم"
];

export const topicsSOCList = [
  "مفاهیم پایه مانیتورینگ و لاگ",
  "سیستم‌های SIEM و تحلیل هشدارهای امنیتی",
  "فرآیند تریاژ و واکنش به حوادث",
  "جرم‌یابی دیجیتال رم و دیسک",
  "تحلیل لاگ‌های ویندوز، لینوکس و شبکه",
  "شکار تهدیدها و پایش هوش تهدید (CTI)",
  "امنیت لبه شبکه و دیوارهای آتش"
];

export function getSeedQuestion(
  category: "security+" | "ceh" | "soc",
  id: number,
  typeParam?: "multiple" | "essay"
): Question {
  // Ensure we constrain ID between 1 and 100
  const normalizedId = Math.max(1, Math.min(100, id));
  const conceptIndex = normalizedId - 1;

  // 1. Determine type
  const type: "multiple" | "essay" = typeParam || (normalizedId % 2 === 1 ? "multiple" : "essay");

  // 2. Select Concept list
  let conceptsList: [string, string, string, string][] = [];
  let topicList: string[] = [];
  
  if (category === "security+") {
    conceptsList = securityPlusConcepts;
    topicList = topicsSecurityPlusList;
  } else if (category === "ceh") {
    conceptsList = cehConcepts;
    topicList = topicsCEHList;
  } else {
    conceptsList = socConcepts;
    topicList = topicsSOCList;
  }

  const concept = conceptsList[conceptIndex];
  const syllabusTopic = topicList[conceptIndex % topicList.length];

  // 3. Determine Progressive Difficulty
  let difficulty: "easy" | "medium" | "hard" = "easy";
  if (normalizedId >= 36 && normalizedId <= 70) {
    difficulty = "medium";
  } else if (normalizedId >= 71) {
    difficulty = "hard";
  }

  // 4. Generate Highly Detailed Parameterized Environmental Context
  const host = ["SRV-WEB-PRD-", "DC-CORP-", "DB-FIN-", "FW-EDGE-", "WORKSTATION-", "CLOUD-NODE-", "GW-INTERNAL-", "APP-PROD-", "BACKUP-SYS-", "DMZ-PROXY-"][normalizedId % 10] + (100 + normalizedId);
  const ip = "192.168." + (normalizedId % 254) + "." + ((normalizedId * 13) % 254);
  const port = [22, 80, 443, 445, 3389, 8080, 1433, 5432, 21, 23][normalizedId % 10];
  const cve = "CVE-2026-" + (1000 + normalizedId);
  const user = ["admin", "sys_backup", "j_doe", "a_smith", "root", "operator", "sec_engineer", "developer", "guest", "service_acct"][normalizedId % 10] + "_" + normalizedId;
  const file = ["update_svc", "task_helper", "win_patch", "sys_driver", "chrome_addon", "config_loader", "cert_mgr", "temp_agent", "win_log", "vba_macro"][normalizedId % 10] + "_" + normalizedId + [".exe", ".dll", ".ps1", ".vbs", ".bin"][normalizedId % 5];
  const dept = ["مالی", "توسعه نرم‌افزار", "منابع انسانی", "عملیات شبکه", "مدیریت ارشد", "پشتیبانی مشتریان", "تحقیق و توسعه", "بازاریابی", "حقوقی", "امنیت اطلاعات"][normalizedId % 10];

  // 5. Build Core Question Text & Explanations based on Category and Difficulty
  let questionText = "";
  let explanation = "";
  let hint = "";

  if (category === "security+") {
    if (type === "multiple") {
      if (difficulty === "easy") {
        questionText = `کدام یک از گزینه‌های زیر بهترین تعریف علمی برای مفهوم امنیتی «${concept[0]}» یا همان ${concept[1]} در گواهینامه بین‌المللی Security+ است؟`;
        explanation = `مفهوم امنیتی ${concept[0]} (${concept[1]}) بدین صورت تعریف می‌شود: ${concept[2]}. ${concept[3]}`;
        hint = `این مفهوم مستقیماً به ${concept[2]} اشاره دارد.`;
      } else if (difficulty === "medium") {
        questionText = `در سناریوی کاری دپارتمان ${dept}، مدیر سیستم تصمیم دارد برای کاربر ${user} روی کلاینت ${host} با آی‌پی ${ip} الزامات مربوط به «${concept[0]}» (${concept[1]}) را اعمال کند. کدام گزینه بهترین روش اجرای این استاندارد را بیان می‌کند؟`;
        explanation = `برای پیاده‌سازی موفقیت‌آمیز ${concept[0]} (${concept[1]}) روی هاست ${host} برای کاربر ${user}، باید اصول اساسی آن را رعایت کنیم. بر اساس استاندارد: ${concept[2]}. اهمیت کاربرد عملیاتی آن: ${concept[3]}`;
        hint = `به اعمال مستقیم این مفهوم بر روی هاست دپارتمان اشاره دارد.`;
      } else {
        questionText = `تیم پایش و واکنش به حوادث دپارتمان ${dept} متوجه رفتارهای مشکوکی روی سرور اصلی ${host} با آی‌پی ${ip} روی پورت ${port} می‌شود. شواهد جرم‌یابی نشان می‌دهد که هکرها تلاش دارند با اکسپلویت آسیب‌پذیری ${cve}، قوانین پایه مربوط به «${concept[0]}» (${concept[1]}) را دور بزنند. بهترین تصمیم استراتژیک برای خنثی‌سازی این سناریو چیست؟`;
        explanation = `در سناریوهای پیشرفته نقض ${concept[1]} در سرور حیاتی ${host} با آسیب‌پذیری ${cve}، تیم امنیت باید کنترل‌های حفاظتی پیشرفته را فعال کند. مفهوم ${concept[0]} بیان می‌کند که: ${concept[2]}. برای مقابله با این موضوع: ${concept[3]}`;
        hint = `به کنترل‌های دفاع عمیق و مهار آسیب‌پذیری بر اساس این مفهوم دقت کنید.`;
      }
    } else {
      // Essay
      if (difficulty === "easy") {
        questionText = `مفهوم امنیتی «${concept[0]}» (${concept[1]}) را به طور کامل تعریف کرده و نقش آن را در کاهش ریسک‌های کلی دپارتمان ${dept} توضیح دهید.`;
        explanation = `مفهوم امنیتی ${concept[0]} (${concept[1]}) به شرح زیر است:\n\nتعریف رسمی: ${concept[2]}\nنقش و اهمیت حفاظتی: ${concept[3]}\nبا پیاده‌سازی مناسب این مفهوم، دپارتمان ${dept} قادر خواهد بود بخش مهمی از تهدیدات حوزه نفوذ را مهار سازد.`;
        hint = `تعریف مستقیم مفهوم و چگونگی محافظت از دپارتمان را بنویسید.`;
      } else if (difficulty === "medium") {
        questionText = `سناریویی را فرض کنید که در آن کلاینت ${host} متعلق به کاربر ${user} از دپارتمان ${dept} نیاز مبرم به پیاده‌سازی مکانیزم‌های «${concept[0]}» (${concept[1]}) دارد. مراحل گام به گام پیاده‌سازی و چالش‌های مدیریتی یا فنی آن را مورد تحلیل قرار دهید.`;
        explanation = `برای پیاده‌سازی گام به گام ${concept[0]} (${concept[1]}) روی سیستم ${host} متعلق به کاربر ${user}، مراحل زیر الزامی است:\n\n۱. ممیزی وضعیت دسترسی‌های کلاینت.\n۲. اعمال الزامات فنی هماهنگ با تعریف: ${concept[2]}\n۳. پایش و بررسی رفتاری کلاینت.\nچالش اصلی در این سناریو برقراری تعادل میان امنیت و راحتی کارمند است. اهمیت عملیاتی: ${concept[3]}`;
        hint = `به مراحل ممیزی، تغییر دسترسی کلاینت و پایش مستمر رفتار کاربر توجه کنید.`;
      } else {
        questionText = `یک معماری دفاع عمیق (Defense in Depth) قوی برای سرور پایگاه داده دپارتمان ${dept} به آدرس ${ip} طراحی کنید که هسته اصلی دفاعی آن بر اساس مفهوم «${concept[0]}» (${concept[1]}) بنا شده باشد. تشریح کنید که این معماری چگونه جلوی تلاش‌های مهاجم برای اکسپلویت آسیب‌پذیری ${cve} روی پورت ${port} را خواهد گرفت؟`;
        explanation = `طراحی معماری دفاع عمیق بر اساس ${concept[0]} (${concept[1]}) برای سرور حیاتی ${host} شامل موارد زیر است:\n\n۱. لایه شبکه: بستن پورت‌های غیرضروری و محدود کردن پورت ${port}.\n۲. لایه سیستم‌عامل و برنامه: اعمال مفهوم ${concept[0]} که یعنی: ${concept[2]}\n۳. لایه پایش لاگ‌ها: رصد فعال برای جلوگیری از اکسپلویت ${cve}.\nبر اساس توصیه دفاعی: ${concept[3]}`;
        hint = `لایه‌های شبکه، سیستم‌عامل و پایش لاگ را با محوریت این مفهوم توصیف کنید.`;
      }
    }
  } else if (category === "ceh") {
    if (type === "multiple") {
      if (difficulty === "easy") {
        questionText = `در حوزه هک قانونمند و تست نفوذ (Certified Ethical Hacker)، کدام یک از گزینه‌های زیر دقیق‌ترین توضیح فنی را برای ابزار یا مفهوم «${concept[0]}» (${concept[1]}) ارائه می‌کند؟`;
        explanation = `در متدولوژی CEH، مفهوم ${concept[0]} (${concept[1]}) به صورت زیر است: ${concept[2]}. کاربرد تست نفوذ: ${concept[3]}`;
        hint = `این تکنیک مستقیماً برای ${concept[2]} استفاده می‌شود.`;
      } else if (difficulty === "medium") {
        questionText = `فرض کنید به عنوان یک هکر کلاه سفید، قصد ارزیابی امنیت سرور ${host} با آی‌پی ${ip} روی پورت ${port} را دارید. برای بهره‌برداری بهینه از تکنیک «${concept[0]}» (${concept[1]})، کدام اقدام فنی یا دستور العمل بهترین کارایی را برای دپارتمان ${dept} خواهد داشت؟`;
        explanation = `در فازهای میانی ارزیابی امنیتی، استفاده از تکنیک ${concept[1]} روی سیستم ${host} امکان کشف عمیق آسیب‌پذیری‌ها را می‌دهد. طبق تعریف: ${concept[2]}. پیاده‌سازی کاربردی: ${concept[3]}`;
        hint = `به چگونگی استفاده از این ابزار یا روش روی پورت مشخص سرور دقت کنید.`;
      } else {
        questionText = `در جریان تست نفوذ به زیرساخت دپارتمان ${dept}، متوجه وجود آسیب‌پذیری ${cve} روی سرور حیاتی ${host} با سیستم‌عامل ویندوز/لینوکس می‌شوید. اگر بخواهید با تلفیق این باگ با متد پیشرفته «${concept[0]}» (${concept[1]}) دسترسی خود را ارتقا دهید یا فایلی مانند ${file} را اجرا کنید، کدام اقدام استراتژیک درست است؟`;
        explanation = `در تست‌های پیشرفته نفوذ، بهره‌گیری از ${concept[1]} برای اکسپلویت آسیب‌پذیری ${cve} روی ${host}، یکی از اهداف اصلی تیم قرمز است. بر اساس متدولوژی ${concept[0]}: ${concept[2]}. گام نهایی: ${concept[3]}`;
        hint = `به تعامل میان آسیب‌پذیری و تکنیک پیشرفته هک برای ارتقای دسترسی فکر کنید.`;
      }
    } else {
      // Essay
      if (difficulty === "easy") {
        questionText = `مفهوم یا ابزار هک «${concept[0]}» (${concept[1]}) را به طور کامل تعریف کرده و نقش آن را در فازهای مختلف چرخه تست نفوذ (Ethical Hacking Lifecycle) شرح دهید.`;
        explanation = `مفهوم هک ${concept[0]} (${concept[1]}) به شرح زیر است:\n\nتعریف پایه: ${concept[2]}\nنقش در هک سیستم: ${concept[3]}\nدرک دقیق این تکنیک به هکرهای قانونمند امکان می‌دهد پیش از مهاجمان کلاه سیاه، نقاط ضعف کلاینت‌ها را مسدود سازند.`;
        hint = `فازهای جمع‌آوری اطلاعات، اسکن یا اکسپلویت مربوط به این مفهوم را توضیح دهید.`;
      } else if (difficulty === "medium") {
        questionText = `به عنوان تست‌کننده نفوذ دپارتمان ${dept}، سناریویی را بنویسید که در آن از روش «${concept[0]}» (${concept[1]}) برای نفوذ یا ارزیابی هاست ${host} متعلق به کاربر ${user} استفاده می‌کنید. دستورات و ابزارهای مرتبط را ذکر کنید.`;
        explanation = `فرآیند اجرای تست نفوذ بر اساس ${concept[0]} روی کلاینت ${host} شامل مراحل زیر است:\n\n۱. شناسایی اولیه هاست و بررسی پورت‌های باز.\n۲. راه‌اندازی فرآیند بر اساس اصول: ${concept[2]}\n۳. فرار از سیستم‌های نظارتی و کشف شواهد نفوذ.\nاهمیت کاربردی این تکنیک: ${concept[3]}`;
        hint = `مراحل کار را از فاز شناسایی تا اجرای ابزار بر اساس این مفهوم لیست کنید.`;
      } else {
        questionText = `سناریوی یک حمله پیشرفته زنجیره‌ای (Cyber Kill Chain) را ترسیم کنید که در آن مهاجم ابتدا از طریق اکسپلویت آسیب‌پذیری ${cve} روی پورت ${port} وارد سرور ${host} شده و سپس با ابزار/تکنیک «${concept[0]}» (${concept[1]}) اقدام به سرقت اطلاعات یا پایداری در دپارتمان ${dept} می‌کند. روش مقابله با این حمله را تحلیل کنید.`;
        explanation = `تحلیل حمله زنجیره‌ای ترکیبی آسیب‌پذیری ${cve} و تکنیک ${concept[1]}:\n\n۱. نفوذ و بهره‌برداری اولیه: اکسپلویت باگ ${cve} روی سرور ${host}.\n۲. اجرای تکنیک ثانویه: پیاده‌سازی متد ${concept[0]} که طبق تعریف عبارت است از: ${concept[2]}\n۳. دفاع و مقابله دپارتمان ${dept}: مسدودسازی پورت ${port}، ارتقای پچ امنیتی و مانیتورینگ رفتاری.\nبر اساس راهکار طلایی مقابله: ${concept[3]}`;
        hint = `هر دو فاز حمله (اکسپلویت) و دفاع (مسدودسازی و پچ کردن) را به همراه تعریف مفهوم بنویسید.`;
      }
    }
  } else {
    // category === "soc"
    if (type === "multiple") {
      if (difficulty === "easy") {
        questionText = `در یک مرکز عملیات امنیت (SOC)، تحلیل‌گر لایه ۱ به محض مواجهه با هشدار مربوط به «${concept[0]}» (${concept[1]})، کدام تعریف استاندارد زیر را باید مبنای تریاژ و اولویت‌بندی خود قرار دهد؟`;
        explanation = `مفهوم مانیتورینگ ${concept[0]} (${concept[1]}) در مرکز امنیت به این صورت است: ${concept[2]}. نحوه مدیریت هشدار: ${concept[3]}`;
        hint = `این هشدار زمانی صادر می‌شود که ${concept[2]} رخ دهد.`;
      } else if (difficulty === "medium") {
        questionText = `سیستم SIEM دپارتمان ${dept} هشداری مشکوک حاوی شناسه کاربری ${user} روی سرور ${host} در پورت ${port} صادر کرده است. بررسی‌ها نشان می‌دهد رخداد مربوط به «${concept[0]}» (${concept[1]}) است. کدام اقدام سریع تحلیل‌گر لایه ۲ توصیه می‌شود؟`;
        explanation = `در مواجهه با رخداد ${concept[1]} مربوط به حساب ${user} روی سیستم ${host}، تحلیلگر باید لاگ‌ها را عمیقاً بررسی کند. طبق ساختار این مفهوم: ${concept[2]}. اقدام اصلاحی و پاسخ به رخداد: ${concept[3]}`;
        hint = `به اقدامات مهار اولیه و بررسی فرآیندهای مشکوک روی هاست اشاره دارد.`;
      } else {
        questionText = `در پی وقوع یک نفوذ گسترده به شبکه دپارتمان ${dept}، سرور حیاتی ${host} با آی‌پی ${ip} آلوده شده است. لاگ‌های دیواره آتش و سیسمون نشان می‌دهند مهاجم پس از اکسپلویت آسیب‌پذیری ${cve}، تلاش کرده تا فرآیند مربوط به «${concept[0]}» (${concept[1]}) را فریب داده یا دور بزند. به عنوان تحلیل‌گر ارشد SOC و کارشناس جرم‌یابی دیجیتال، اقدام فنی درست چیست؟`;
        explanation = `تحلیل جرم‌یابی نفوذ عمیق به سرور ${host} شامل استخراج شواهد رم و دیسک برای یافتن منشأ ${concept[1]} است. مفهوم ${concept[0]} به این صورت تعریف می‌شود: ${concept[2]}. پایش و مهار تخصصی: ${concept[3]}`;
        hint = `به تکنیک‌های شکار تهدید و جرم‌یابی شواهد برای این مفهوم دقت کنید.`;
      }
    } else {
      // Essay
      if (difficulty === "easy") {
        questionText = `مفهوم نظارت و پاسخ «${concept[0]}» (${concept[1]}) را به طور کامل تعریف کرده و نقش حیاتی آن را در کار روزانه تحلیل‌گران مرکز عملیات امنیت (SOC) دپارتمان ${dept} تشریح کنید.`;
        explanation = `مفهوم مانیتورینگ ${concept[0]} (${concept[1]}) در فرآیندهای دفاعی به شرح زیر است:\n\nتعریف رسمی: ${concept[2]}\nنقش در امنیت سازمان: ${concept[3]}\nرصد مستمر این شاخص به تحلیلگران SOC دپارتمان ${dept} کمک می‌کند پیش از وقوع فاجعه، تهدید را در لایه‌های مرزی متوقف کنند.`;
        hint = `تعریف رسمی این مفهوم و چگونگی کمک آن به تحلیلگران SOC دپارتمان را بنویسید.`;
      } else if (difficulty === "medium") {
        questionText = `پلی‌بوک (Playbook) گام به گام واکنش به حادثه را برای مهار هشدار مربوط به «${concept[0]}» (${concept[1]}) روی هاست ${host} متعلق به کاربر ${user} در دپارتمان ${dept} طراحی و تدوین کنید.`;
        explanation = `پلی‌بوک واکنش به حادثه ${concept[0]} (${concept[1]}) روی هاست ${host} برای کاربر ${user} بدین شرح است:\n\n۱. شناسایی و تایید هشدار بر اساس تعریف علمی: ${concept[2]}\n۲. مهار: قطع ارتباط منطقی هاست از شبکه سازمان.\n۳. پاکسازی: متوقف کردن پروسس‌ها و حذف فایل‌های آلوده.\n۴. بازیابی و مستندسازی: درس‌های آموخته شده بر اساس راهکار مهار: ${concept[3]}`;
        hint = `چهار فاز اصلی پلی‌بوک واکنش شامل تایید، مهار شبکه، پاکسازی هاست و درس‌های آموخته شده را بنویسید.`;
      } else {
        questionText = `یک طرح جامع شکار تهدید (Threat Hunting) و جرم‌یابی دیجیتال (Forensics) بر روی سرور اصلی دپارتمان ${dept} به آدرس ${ip} بنویسید که تمرکز اصلی آن کشف ردپای پنهان ناقضِ «${concept[0]}» (${concept[1]}) متعاقب تلاش برای اکسپلویت آسیب‌پذیری ${cve} روی پورت ${port} باشد.`;
        explanation = `طرح جامع شکار تهدید و جرم‌یابی بر اساس ${concept[0]} (${concept[1]}) روی سرور ${host} به شرح زیر است:\n\n۱. تبیین فرضیه شکار: مهاجم از باگ ${cve} استفاده کرده تا مفهوم ${concept[1]} را دور بزند. تعریف مفهوم: ${concept[2]}\n۲. بررسی شواهد فیزیکی و سیستمی: تحلیل لاگ‌های ویندوز، لینوکس و ابزار سیسمون.\n۳. بررسی اتصالات شبکه: مانیتور ترافیک پورت ${port} و بسته‌های خروجی مشکوک.\n۴. فرآیند جرم‌یابی: بازیابی فایل‌های مرتبط و تحلیل بدافزار بر اساس اصل: ${concept[3]}`;
        hint = `طرح را در قالب تدوین فرضیه شکار تهدید، ممیزی لاگ‌های هاست، و جرم‌یابی شواهد سیستمی بنویسید.`;
      }
    }
  }

  // 6. Generate deterministic distractors for multiple-choice questions
  let options: string[] | undefined = undefined;
  let correctOption: number | undefined = undefined;

  if (type === "multiple") {
    // Generate deterministic correct option index (0 to 3) based on ID to vary answers beautifully
    correctOption = (normalizedId * 3) % 4;

    // Select 3 deterministic unique distractors from the concept list using prime step offsets
    const distractor1Idx = (conceptIndex + 17) % 100;
    const distractor2Idx = (conceptIndex + 43) % 100;
    const distractor3Idx = (conceptIndex + 79) % 100;

    const distractor1 = conceptsList[distractor1Idx];
    const distractor2 = conceptsList[distractor2Idx];
    const distractor3 = conceptsList[distractor3Idx];

    const distractorOptions = [
      `${distractor1[0]} (${distractor1[1]})`,
      `${distractor2[0]} (${distractor2[1]})`,
      `${distractor3[0]} (${distractor3[1]})`
    ];

    options = [];
    let distractorPtr = 0;
    for (let j = 0; j < 4; j++) {
      if (j === correctOption) {
        options.push(`${concept[0]} (${concept[1]})`);
      } else {
        options.push(distractorOptions[distractorPtr]);
        distractorPtr++;
      }
    }
  }

  // 7. Extract clean keywords for grading (used for Farsi & English matching)
  const keywordsSet = new Set<string>();

  const cleanAndAdd = (term: string) => {
    const cleaned = term.replace(/[.()«»""'':;]/g, "").trim();
    if (cleaned.length > 2) {
      keywordsSet.add(cleaned);
      cleaned.split(/\s+/).forEach((w) => {
        if (w.length > 2) keywordsSet.add(w);
      });
    }
  };

  cleanAndAdd(concept[0]); // Persian Concept Name
  cleanAndAdd(concept[1]); // English Concept Name

  // Extract other key words from definition
  concept[2].split(/\s+/).forEach((w) => {
    const word = w.replace(/[.()«»""'']/g, "").trim();
    if (
      word.length > 3 &&
      !["است", "است؟", "شود", "کنند", "برای", "کردن", "بودن", "شدن", "یک", "یا", "که", "به", "تا"].includes(word)
    ) {
      keywordsSet.add(word);
    }
  });

  // Extract specific terms based on parameters
  keywordsSet.add(dept);
  keywordsSet.add(host);
  keywordsSet.add(user);

  const keywords = Array.from(keywordsSet).slice(0, 8); // Keep up to 8 highly robust keywords

  return {
    id: normalizedId,
    category,
    difficulty,
    type,
    questionText,
    options,
    correctOption,
    explanation,
    hint,
    syllabusTopic,
    keywords
  };
}
