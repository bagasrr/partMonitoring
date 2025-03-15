import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef } from "react";
import AmountLimitChart from "./AmountLimitChart";
import DayUsedChart from "./DayUsedChart";

const ChartSwiper = ({ statusData }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    // Ensure navigation is updated after the Swiper instance is initialized
    const swiperInstance = document.querySelector(".swiper").swiper;
    swiperInstance.params.navigation.prevEl = prevRef.current;
    swiperInstance.params.navigation.nextEl = nextRef.current;
    swiperInstance.navigation.init();
    swiperInstance.navigation.update();
  }, []);

  return (
    <div className="relative w-full">
      {/* Custom Navigation untuk PC */}
      <div className="hidden md:flex absolute top-0 right-4 z-10 space-x-2">
        <button ref={prevRef} className="p-2 bg-gray-300 rounded-lg shadow">
          ⬅️
        </button>
        <button ref={nextRef} className="p-2 bg-gray-300 rounded-lg shadow">
          ➡️
        </button>
      </div>

      <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1} navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }} pagination={{ clickable: true, el: ".custom-pagination" }} className="w-full">
        <SwiperSlide>
          <div className="p-4  min-h-[250px] md:min-h-[400px] bg-white shadow rounded-lg">
            <DayUsedChart data={statusData.swapPart} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="p-4  min-h-[250px] md:min-h-[400px] bg-white shadow rounded-lg">
            <AmountLimitChart data={statusData.replacePart} />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Custom Pagination dengan jarak lebih jauh */}
      <div className="custom-pagination mt-6 flex justify-center"></div>
    </div>
  );
};

export default ChartSwiper;
