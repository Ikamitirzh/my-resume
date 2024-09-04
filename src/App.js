// App.js
import React, { useEffect } from "react";
import Phaser from "phaser";

function App() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // بارگذاری تصاویر و اسپریت‌شیت‌ها و آیکون‌ها
      this.load.image("background-intro", "assets/city-5.png");
      this.load.image("background-js", "assets/city-6.png");
      this.load.image("background-react", "assets/city-7.png");
      this.load.image("background-nextjs", "assets/city-8.png");
      this.load.image("background-tailwind", "assets/city-9.png");
      this.load.image("background-outro", "assets/city-10.png");

      // بارگذاری اسپریت‌شیت‌های شخصیت اصلی
      this.load.spritesheet("amir-idle", "assets/Idle.png", {
        frameWidth: 128,
        frameHeight: 128,
      });
      this.load.spritesheet("amir-walk", "assets/Walk.png", {
        frameWidth: 128,
        frameHeight: 128,
      });

      // بارگذاری آیکون‌ها
      this.load.image("javascript", "assets/javascript2.png");
      this.load.image("react", "assets/react4.png");
      this.load.image("nextjs", "assets/nextjs2.png");
      this.load.image("tailwind", "assets/tailwind3.png");
    }

    let player, cursors, dialogueBox, dialogueText, dialogues, dialogueIndex, camera, typingEvent;
    let icons = {};
    let currentStage = 0;

    function create() {
      // ایجاد پس‌زمینه مرحله اول
      this.bg = this.add.image(400, 300, "background-intro").setOrigin(0.5, 0.5);
      this.bg.setDisplaySize(1600, 600); // تنظیم اندازه کامل بک‌گراند و جلوگیری از فلیکر

      // ایجاد شخصیت اصلی
      player = this.physics.add.sprite(100, 450, "amir-idle").setScale(1.5);
      player.setCollideWorldBounds(true);

      // ایجاد انیمیشن‌های شخصیت اصلی
      this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("amir-idle", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("amir-walk", { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });

      // تنظیم کنترل‌ها
      cursors = this.input.keyboard.createCursorKeys();

      // دیالوگ‌های هر مرحله
      dialogues = [
        [".سلام! من امیرحسین بهرامی هستم.دکمه سمت راست رو بزن تا متن بعدی رو ببینی",
           "امروز آمدم تا رزومه خودم رو براتون بازگو کنم",
            "خیلی خوشحال میشم تا تهش همراهیم کنی فقط لازمه برای خوندن حرفام به راست حرکت کنی"],
        [
          "جاوا اسکریپت",
          "جاوا اسکریپت زبان اصلی منه.",
          "تجربه کار با این زبان رو در پروژه‌های مختلف دارم.",
          "پروژه هایی مثل بازی دو بعدی و حتی ماشین خودران با شبکه عصبی رو با جاوا اسکریپت زدم",
          "میتونی بری داخل گیت هابم و ببینیشون 😊🚀",
          "خب برو جلوتر تا ببینی دیگه چی بلد هستم فقط برای خواندن متن ها کافیه یه بار به راست حرکت کنی"
        ],
        [
          "ری‌اکت",
          "در ری‌اکت هم پروژه‌های مختلفی کار کردم.",
          "این مهارت یکی از اصلی‌ترین تخصص‌های منه.",
          "باهاش پروژه های سایت فروشگاهی و ... رو زدم",
          "خب برو جلو تر چون مهارت هام به همینجا ختم نمیشه 😎",
        ],
        [
          "نکست جی‌اس",
          "تجربه کار با نکست جی‌اس و ساخت سایت‌های بهینه دارم.",
          "این مهارت یکی از ابزارهای اصلی در پروژه‌های من است.",
          "دو تا سایت فروشگاهی خیلی خفن با نکست دارم که خوشحال میشم ببینیشون",
          "هنوز تموم نشده برو جلو تر...",
        ],
        [
          "تیلویند",
          "استفاده از تیلویند در پروژه‌ها باعث افزایش سرعت توسعه شده.",
          "این ابزار را برای استایل‌دهی سریع و مدرن استفاده می‌کنم.",
          "میتونم سایت های رسپانسیو رو باهاش ایجاد کنم",
          "همچنان برو جلو تر البته اگه خسته شدی یکم استراحت کن بعد برو 🤷‍♂️",
        ],
        ["خب اینا فقط بخشی از چیزایی بود ک بلدم",
          "مثلا همین چیزی که داری میبینی رو با کتابخانه های بازیسازی جاواسکریپت زدم. ",
          
        "خیلی خوشحال شدم که با رزومه من آشنا شدی.",
        "اینم ادرس گیت هابم هست که میتونی پروژه هام رو داخلش نگاه کنی",
        "https://github.com/Ikamitirzh",
         "امیدوارم بتونیم همکاری کنیم!",
        "و اگه منو برای شرکتت استخدام نکنی مجبور میشم با همین تفنگ که تو دستمه کارت رو تموم کنم",
      "پس بهتره مسالمت آمیز رفتار کنیم 🌹😊",
    " 👉👈خداحافظ دوست عزیز تو شرکت میبنمت "],
      ];
      dialogueIndex = 0;

      // افزودن جعبه دیالوگ
      dialogueBox = this.add.graphics();
      dialogueBox.fillStyle(0x000000, 0.7);
      dialogueBox.fillRoundedRect(0, 0, 700, 100, 16);
      dialogueBox.setScrollFactor(0);

      // افزودن متن دیالوگ
      dialogueText = this.add.text(20, 10, "", {
        fontSize: "18px",
        color: "#ffffff",
        wordWrap: { width: 660 },
      });
      dialogueText.setScrollFactor(0);

      // گروه دیالوگ باکس و متن
      const dialogueContainer = this.add.container(50, 50, [dialogueBox, dialogueText]);

      // ایجاد دوربین برای دنبال کردن شخصیت اصلی
      camera = this.cameras.main;
      camera.startFollow(player);
      camera.setBounds(0, 0, 1600, 600);

      // نمایش اولین دیالوگ با افکت تایپ
      showDialogue(currentStage, dialogueIndex);

      // نمایش آیکون‌ها
      setupIcons(this);

      // تنظیم موقعیت باکس دیالوگ همراه با دوربین و شخصیت
      this.events.on("postupdate", () => {
        dialogueContainer.setPosition(
          Math.min(camera.scrollX + 50, player.x - 50),
          camera.scrollY + 50
        );
      });
    }

    function update() {
      // کنترل حرکت شخصیت اصلی
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.play("walk", true);
        player.flipX = true;
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.play("walk", true);
        player.flipX = false;
      } else {
        player.setVelocityX(0);
        player.play("idle", true);
      }

      // حرکت به مرحله بعد در انتهای صفحه
      if (player.x > 700 && currentStage < dialogues.length - 1) {
        moveToNextStage(this);
      }

      // بازگشت به مرحله قبلی در ابتدای صفحه
      if (player.x < 100 && currentStage > 0) {
        moveToPreviousStage(this);
      }

      // تغییر دیالوگ با فشردن کلید راست
      if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        if (!typingEvent) {
          dialogueIndex++;
          if (dialogueIndex < dialogues[currentStage].length) {
            showDialogue(currentStage, dialogueIndex);
          }
        }
      }
    }

    function showDialogue(stage, index) {
      // نمایش دیالوگ به صورت تایپی با راست‌چین کردن
      let dialogue = dialogues[stage][index];
      dialogueText.setText("");
      dialogueText.setStyle({
        align: "right",
        rtl: true, // راست‌چین کردن متن‌ها
      });
    
      let charIndex = 0;
    
      // ایجاد افکت تایپ برای نمایش کاراکتر به کاراکتر دیالوگ
      typingEvent = setInterval(() => {
        if (charIndex < dialogue.length) {
          dialogueText.setText(dialogueText.text + dialogue[charIndex]);
          charIndex++;
        } else {
          clearInterval(typingEvent);
          typingEvent = null;
          showIconsBasedOnStage(stage); // نمایش آیکون‌ها بر اساس مرحله
        }
      }, 50); // تنظیم سرعت تایپ
    }
    function setupIcons(scene) {
      // ایجاد آیکون‌ها با افکت جذاب و جدید
      const iconScale = 0.2;
      icons.javascript = scene.add.image(150, 300, "javascript").setScale(iconScale).setAlpha(0);
      icons.react = scene.add.image(250, 300, "react").setScale(iconScale).setAlpha(0);
      icons.nextjs = scene.add.image(350, 300, "nextjs").setScale(iconScale).setAlpha(0);
      icons.tailwind = scene.add.image(450, 300, "tailwind").setScale(iconScale).setAlpha(0);
    }

    function showIconsBasedOnStage(stage) {
      // حذف یا تغییر جذاب آیکون‌ها بر اساس نیاز
      Object.values(icons).forEach((icon) => {
        icon.setAlpha(0);
        icon.setVisible(false);
      });

      // اضافه کردن انیمیشن محو شدن برای جذابیت بیشتر
      switch (stage) {
        case 1:
          icons.javascript.setVisible(true).setAlpha(1);
          break;
        case 2:
          icons.react.setVisible(true).setAlpha(1);
          break;
        case 3:
          icons.nextjs.setVisible(true).setAlpha(1);
          break;
        case 4:
          icons.tailwind.setVisible(true).setAlpha(1);
          break;
        default:
          break;
      }
    }

    function moveToNextStage(scene) {
      currentStage++;
      player.setPosition(100, 450); // برگرداندن شخصیت به ابتدای صفحه
      dialogueIndex = 0;
      const backgrounds = [
        "background-intro",
        "background-js",
        "background-react",
        "background-nextjs",
        "background-tailwind",
        "background-outro",
      ];
      scene.bg.setTexture(backgrounds[currentStage]).setDisplaySize(1600, 600); // تنظیم اندازه بک‌گراند
      showDialogue(currentStage, dialogueIndex);
    }

    function moveToPreviousStage(scene) {
      // کاهش شماره مرحله
      currentStage--;
    
      // بازنشانی موقعیت کاراکتر در انتهای صفحه
      player.setPosition(1400, 450);
    
      // بازنشانی شماره دیالوگ به 0 برای شروع از دیالوگ اول مرحله جدید
      dialogueIndex = 0;
    
      // تنظیم بک‌گراند متناسب با مرحله فعلی
      const backgrounds = [
        "background-intro",
        "background-js",
        "background-react",
        "background-nextjs",
        "background-tailwind",
        "background-outro",
      ];
    
      // تعویض بک‌گراند به مرحله فعلی و تنظیم دقیق اندازه برای جلوگیری از مشکلات گرافیکی
      scene.bg.setTexture(backgrounds[currentStage]).setDisplaySize(1600, 600);
    
      // نمایش دیالوگ مرتبط با مرحله فعلی
      showDialogue(currentStage, dialogueIndex);
    
      // تنظیم دوربین و بازنشانی اسکرول موقعیت برای جلوگیری از فلش یا مشکلات بصری
      camera.scrollX = 0;
      camera.scrollY = 0;
      camera.setBounds(0, 0, 1600, 600); // تنظیم محدوده جدید دوربین برای مرحله جدید
    }
    

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
}

export default App;
