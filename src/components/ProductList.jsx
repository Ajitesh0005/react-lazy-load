import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';


export function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get('https://api.jsonbin.io/v3/qs/67824cd5e41b4d34e475b24f');

      const productsData = response.data?.record || [];

      const newProducts = productsData.map((product) => ({
        name: product.product_name,
        image: product.image_url,
        price: product.product_price
      }));

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [loading]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const productsToRender = products.slice(0, page * 8);

  return (
    <div className="container">
      <div className="row">
        {productsToRender.map((product, index) => (
          <div className="col-md-3" key={index}>
            <div className="card">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">₹{product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="loading"><h3>Please wait, Items are loading.....</h3></div>}
      <div ref={loader} className="loading"><h5>Scroll down to load more products.....</h5></div>
    </div>
  );
};


