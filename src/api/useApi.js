import api from "./client";
import { toast } from "react-toastify";

const handleApiError = (error) => {
  if (error.response && error.response.status === 409) {
    toast.error(
      "Çakışma! Aynı ID ile kayıt zaten mevcut veya veri çakışması yaşandı."
    );
  } else {
    toast.error(
      error?.response?.data?.message ||
        "Bir hata oluştu! Lütfen daha sonra tekrar deneyin..."
    );
  }
};

const apiRequest = async (method, url, data = null) => {
  try {
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchAddress = async () => {
  return apiRequest("get", "/address");
};
export const deleteAddress = async (addressId) => {
  await apiRequest("delete", `/address/${addressId}`);
};
export const fetchAddressForID = async (addressId) => {
  return apiRequest("get", `/address/${addressId}`);
};
export const updateAddressForID = async (addressId, addressData) => {
  await apiRequest("put", `/address/${addressId}`, addressData);
};

export const fetchContactForm = async () => {
  return apiRequest("get", "/contactForm");
};
export const deleteContactForm = async (contactFormId) => {
  await apiRequest("delete", `/contactForm/${contactFormId}`);
};
export const fetchContactFormForID = async (contactFormId) => {
  return apiRequest("get", `/contactForm/${contactFormId}`);
};

export const createBlog = async () => {
  return apiRequest("post", "/blog");
};
export const fetchBlog = async () => {
  return apiRequest("get", "/blog");
};
export const fetchBlogForID = async (blogId) => {
  return apiRequest("get", `/blog/${blogId}`);
};
export const deleteBlog = async (blogId) => {
  await apiRequest("delete", `/blog/${blogId}`);
};
export const updateBlog = async (blogId) => {
  await apiRequest("put", `/blog/${blogId}`);
};
export const fetchCategory = async () => {
  return apiRequest("get", `/category`);
};
export const fetchCategoryForID = async (categoryId) => {
  return apiRequest("get", `/category/${categoryId}`);
};
export const fetchSubCategoryForID = async (categoryId, subCategoryId) => {
  return apiRequest(
    "get",
    `/category/${categoryId}/subcategory/${subCategoryId}`
  );
};
