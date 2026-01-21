import { Button } from "../ui/button";

export const CallToActionSection = () => {
  return (
    <section className="relative container bg-primary rounded-2xl overflow-hidden py-20 my-10 px-4">

      <div className="relative flex flex-col items-center gap-4 max-w-[939px] mx-auto z-10">
        <h2 className="w-full font-medium text-white text-5xl text-center tracking-[0] leading-[70px]">
          انضم إلى آلاف المستخدمين السعداء
        </h2>

        <p className="w-full font-normal text-white text-[28px] text-center tracking-[0] leading-[39px]">
          سجل الآن واحصل على وصول فوري لأفضل الأطباء والمستشفيات. حجز مواعيدك
          أصبح أسهل من أي وقت مضى! 
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Button
            variant="outline"
            className="w-[169px] h-[46px] bg-transparent border-white text-white hover:bg-white/10 rounded-[14px] font-medium text-lg"
          >
            تواصل معنا
          </Button>

          <Button className="w-[169px] h-[46px] bg-white text-primary hover:bg-white/90 rounded-[14px] font-medium text-lg">
            سجل الان مجانا
          </Button>
        </div>
      </div>
    </section>
  );
};
