import  { useEffect } from "react";

function WhoAreWe() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-screen lg:py-20 lg:px-20 px-4 py-4 flex flex-col gap-y-4 min-h-screen">
      <h1 className="font-bold text-center lg:pb-4 text-xl lg:text-4xl">Who are we</h1>
      <p className="text-justify indent-10 leading-loose ">
        Officially launched in the Month of March 10 2023, the Bromag technology
        platform seamlessly connects customers, restaurant partners, and
        delivery riders to fulfill their diverse needs. Customers rely on our
        platform to easily search for and order food from individual
        restaurants, read and contribute reviews, arrange for food delivery,
        reserve tables, and make secure payments while dining out. On the other
        hand, we empower restaurant partners with industry-specific solutions
        tailored to their requirements. These include customized packaging
        solutions for their dishes, professional food photography services,
        content video production for their establishments, and an e-commerce
        platform hosted on their own domain name. Additionally, we provide them
        with individual Android and iOS apps, as well as POS billing software,
        to enhance customer engagement and acquisition, while ensuring a
        reliable and efficient last-mile delivery service. Furthermore, we offer
        a comprehensive procurement solution, delivering high-quality tender
        chicken products to our restaurant partners. Lastly, our dedicated
        delivery riders operate with our own vehicles as full-time employees.
      </p>
    </div>
  );
}

export default WhoAreWe;
