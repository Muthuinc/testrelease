/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Avatar, Rate, Card, Modal } from "antd";
import { useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";

const CustomerReview = ({ customerReview }) => {
    const [view, setView] = useState("");
    return (
        <div className="w-screen lg:min-h-[50vh] lg:center_div justify-start  items-start lg:pt-10  pt-4">
            <div className="lg:text-6xl font-bold  text-left w-screen text-light_gray px-4 pb-5">
                Customer's Review
            </div>
            <Swiper
                slidesPerView={1}
                centeredSlides={false}
                slidesPerGroupSkip={1}
                grabCursor={true}
                modules={[Autoplay, Pagination]}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    1024: {
                        slidesPerView: 3,
                    },
                }}
                loop={true}
                spaceBetween={30}
                className="mySwiper w-screen center_div"
            >
                {customerReview.map((res, index) => {
                    return (
                        <SwiperSlide
                            key={index}
                            className=" lg:py-10 w-screen pl-[20px] px-4"
                        >
                            <Card
                                hoverable
                                className="lg:w-[30vw] lg:p-4 p-2 w-[90vw] h-[300px] shadow-lg rounded-[10%]  justify-start  text-light_gray gap-y-0"
                            >
                                <Card.Meta
                                    avatar={
                                        _.get(res, "userRef.user_image", "") ? (
                                            <Avatar
                                                className="lg:w-[50px]  lg:h-[50px] w-[30px] h-[30px] rounded-full uppercase center_div"
                                                src={_.get(
                                                    res,
                                                    "userRef.user_image",
                                                    ""
                                                )}
                                            ></Avatar>
                                        ) : (
                                            <Avatar className="lg:w-[50px]  lg:h-[50px] w-[30px] h-[30px] rounded-full uppercase center_div">
                                                {
                                                    _.get(
                                                        res,
                                                        "userRef.user",
                                                        ""
                                                    ).split("")[0]
                                                }
                                            </Avatar>
                                        )
                                    }
                                    title={
                                        <p className="font-bold lg:text-xl capitalize">
                                            {_.get(res, "userRef.user", "")}
                                        </p>
                                    }
                                    description={
                                        <Rate
                                            value={Number(res.ratings)}
                                            disabled
                                            className="lg:text-md text-sm"
                                        />
                                    }
                                />
                                <div>
                                    <p className="lg:text-md text-sm text-justify leading-loose pt-4 indent-8">
                                        {_.get(res, "message", "").slice(
                                            0,
                                            160
                                        )}
                                        &nbsp;
                                        <span
                                            onClick={() => {
                                                setView(res.message);
                                            }}
                                            className="text-primary_color text-sm"
                                        >
                                            {_.get(res, "message", "").length >
                                            150
                                                ? "  view more"
                                                : ""}
                                        </span>
                                    </p>
                                </div>
                            </Card>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <Modal
                open={view}
                onCancel={() => {
                    setView("");
                }}
                footer={false}
                closable={false}
                className="!bg-white !rounded-lg"
            >
                <p className="lg:text-md text-sm text-justify leading-loose pt-4 indent-8">
                    {view}
                </p>
            </Modal>
        </div>
    );
};

export default CustomerReview;
