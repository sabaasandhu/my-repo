Library
/
Home.jsx


import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../redux/actions/productActions";
import Loader from "../../components/Loader";
import ProductCard from "../../components/ProductCard";
import MetaData from "../../components/MetaData";
import Carasol from "../../components/Carasol";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.prodSlice);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isAdmin = user && user.is_staff === true;

  return (
    <div className="bg-gray-50">
      <MetaData title="Main Page" />

      <Carasol />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-semibold">
              New Collection
            </span>
            <h1 className="text-5xl font-bold mt-6">
              Discover Your Perfect Style
            </h1>
            <p className="text-gray-600 mt-5 text-lg">
              Explore premium dresses with elegant designs and beautiful
              collections for every occasion.
            </p>

            <a
              href="#arrivals"
              className="inline-block mt-8 bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700"
            >
              Shop Now
            </a>
          </div>

          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900"
            alt="Fashion"
            className="rounded-3xl shadow-2xl h-[520px] w-full object-cover"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        {[
          ["Casual Wear","https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"],
          ["Luxury Collection","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800"],
          ["New Arrivals","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"],
        ].map(([title,img])=>(
          <div key={title} className="relative overflow-hidden rounded-3xl group">
            <img src={img} alt={title} className="h-96 w-full object-cover group-hover:scale-110 duration-500"/>
            <div className="absolute inset-0 bg-black/40 flex items-end p-6">
              <div>
                <h2 className="text-white text-3xl font-bold">{title}</h2>
              </div>
            </div>
          </div>
        ))}
      </section>

      <h2 id="arrivals" className="text-center text-4xl font-extrabold py-10">
        ✨ NEW ARRIVALS
      </h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <div className="bg-red-200 text-red-700 p-4 rounded-lg text-center col-span-full">
              No Products Found
              {isAdmin && (
                <div className="mt-3">
                  <Link
                    className="underline font-bold"
                    to="https://web-production-10987.up.railway.app/admin/"
                  >
                    Add New Product
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;