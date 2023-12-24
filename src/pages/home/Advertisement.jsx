/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import _ from "lodash";
import { getSpecificBanner } from "../../helper/api/apiHelper";
import { useHref } from "react-router-dom";
import { Skeleton } from "antd";
import CustomSwiper from "../../components/CustomSwiper";

function Advertisement() {
    const [adds, setAdds] = useState([]);
    const path = useHref();
    const [currentLoading, setCurrentLoading] = useState(false);

    const fetchData = async () => {
        try {
            setCurrentLoading(true);
            const allBanners = await getSpecificBanner("Advertisement_Banner");
            setAdds(_.get(allBanners, "data.data", []));
            // eslint-disable-next-line no-empty
        } catch (err) {
        } finally {
            setCurrentLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Skeleton
            active
            className="w-screen lg:min-h-[50vh] lg:px-10 px-2 py-10 center_div"
            loading={currentLoading}
        >
            <div
                className="w-screen lg:min-h-screen lg:px-10 px-2 py-10 relative center_div gap-y-2"
                id="advertisement"
            >
                <div className="lg:text-6xl md:text-5xl font-bold text-lg text-left w-screen  text-light_gray  lg:pt-20">
                    BROMAG Advertisement
                </div>
                <div className="center_div w-screen  lg:h-[calc(100vh-100px)]  px-2 pt-4">
                    <img
                        src="/assets/images/arc.png"
                        alt=""
                        className="absolute top-[120px] right-0 hidden lg:block"
                    />
                    <img
                        src="/assets/images/arcleft.png"
                        alt=""
                        className="absolute bottom-[120px] left-0 hidden lg:block"
                    />
                    <CustomSwiper
                        data={adds}
                        scroll={true}
                        setLoading={setCurrentLoading}
                        width={98}
                        path={path}
                    />
                </div>
            </div>
        </Skeleton>
    );
}

export default Advertisement;
