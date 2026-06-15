import apis from "../../config/apis";
import {
  setLoading,
  setProducts,
  setProduct,
  setError,
  setsliders,
  setProductsByCategory,
  setUnstitchs
} from "../slices/productSlice";

import axios from "axios";

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem("access");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await axios.get(apis[0], config);
    dispatch(setProducts(data));

  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const fetchSliders = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(apis[3]);
    dispatch(setsliders(data));

  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const singleProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading())
    const { data } = await axios.get(`${apis[1]}/${id}`)
    dispatch(setProduct(data));

  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const fetchCategory = (category ) => async (dispatch) => {
  try {
    dispatch(setLoading())
   const token = localStorage.getItem("access");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    const { data } = await axios.get(`${apis[4]}/${category}`, config)
    dispatch(setProductsByCategory(data));


  } catch (err) {
    dispatch(setError(err.message))
  }
}
export const fetchUnstitchs = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(apis[5]);
    dispatch(setUnstitchs(data));

  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const singleUnstitch = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(`${apis[6]}/${id}`);  // [6] is new unstitch endpoint
    dispatch(setProduct(data));
  } catch (err) {
    dispatch(setError(err.message));
  }
};