/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CustomSwiper from "../../components/CustomSwiper";

const TopFoods = ({ topfoods }) => {
    const [topFoodsData, setTopFoodsData] = useState([]);

    useEffect(() => {
        setTopFoodsData(
            topfoods.filter((res) => {
                return res.name === "Top Notch Banner";
            })
        );
    }, []);

    return (
        <div className="w-screen lg:min-h-[80vh] flex lg:flex-row justify-center items-center flex-nowrap flex-col-reverse lg:pt-0 pt-2 gap-y-6 lg:px-10">
            <div className="lg:w-[60vw] w-screen relative lg:h-[80vh] center_div">
                <CustomSwiper data={topFoodsData} pagination={true} />
            </div>
            <div className="lg:w-[50vw]  lg:center_div_col flex-nowrap flex-col gap-y-4">
                <div className="lg:text-5xl font-bold gap-y-20 text-light_gray lg:center_div justify-center gap-x-2 lg:px-0 px-4 ">
                    <div className="min-w-[10px] lg:h-[40px]  h-[20px] lg:bg-[#DF9300] rounded-2xl  -left-0 top-0"></div>
                    Top Notch Food
                </div>
                <p className="lg:text-lg  tracking-wider indent-4 !leading-loose text-light_gray font-bold text-justify pt-4 text-sm px-4 ">
                    Immerse yourself in the rich tapestry of tastes, where every
                    bite tells a story of quality, creativity, and
                    sustainability. Our chefs, the architects of this culinary
                    haven, invite you to experience a world where gastronomy
                    transcends expectations.
                </p>
            </div>
        </div>
    );
};

export default TopFoods;
