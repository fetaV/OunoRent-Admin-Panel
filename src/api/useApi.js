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

const apiRequest = async (method, url, data = null, headers = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      headers: {
        ...headers,
        "Content-Type": headers["Content-Type"] || "application/json",
      },
    });
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

export const createWarehouseConnection = async () => {
  return apiRequest("post", "/warehouse/WarehouseConnection");
};
export const fetchWarehouseConnection = async () => {
  return apiRequest("get", "/warehouse/WarehouseConnection");
};
export const fetchWarehouseConnectionForID = async (warehouseConnectionId) => {
  return apiRequest(
    "get",
    `/warehouse/WarehouseConnection/${warehouseConnectionId}`
  );
};
export const deleteWarehouseConnection = async (warehouseConnectionId) => {
  await apiRequest(
    "delete",
    `/warehouse/WarehouseConnection/${warehouseConnectionId}`
  );
};
export const updateWarehouseConnection = async (warehouseConnectionId) => {
  await apiRequest(
    "put",
    `/Warehouse/warehouseConnection/${warehouseConnectionId}`
  );
};

export const createChannel = async () => {
  return apiRequest("post", "/Channel");
};
export const fetchChannel = async () => {
  return apiRequest("get", "/Channel");
};
export const fetchChannelForID = async (ChannelId) => {
  return apiRequest("get", `/Channel/${ChannelId}`);
};
export const deleteChannel = async (ChannelId) => {
  await apiRequest("delete", `/Channel/${ChannelId}`);
};
export const updateChannel = async (ChannelId) => {
  await apiRequest("put", `/Channel/${ChannelId}`);
};

export const createWarehouse = async () => {
  return apiRequest("post", "/warehouse");
};
export const fetchWarehouse = async () => {
  return apiRequest("get", "/warehouse");
};
export const fetchWarehouseForID = async (warehouseId) => {
  return apiRequest("get", `/warehouse/${warehouseId}`);
};
export const deleteWarehouse = async (warehouseId) => {
  await apiRequest("delete", `/warehouse/${warehouseId}`);
};
export const updateWarehouse = async (warehouseId) => {
  await apiRequest("put", `/Warehouse/${warehouseId}`);
};

export const createFaq = async () => {
  return apiRequest("post", "/Faq");
};
export const fetchFaq = async () => {
  return apiRequest("get", "/Faq");
};
export const fetchFaqForID = async (FaqId) => {
  return apiRequest("get", `/Faq/${FaqId}`);
};
export const deleteFaq = async (FaqId) => {
  await apiRequest("delete", `/Faq/${FaqId}`);
};
export const updateFaq = async (FaqId) => {
  await apiRequest("put", `/Faq/${FaqId}`);
};

export const createFooter = async () => {
  return apiRequest("post", "/FooterItem");
};
export const fetchFooter = async () => {
  return apiRequest("get", "/FooterItem");
};
export const fetchFooterForID = async (FooterItemId) => {
  return apiRequest("get", `/FooterItem/${FooterItemId}`);
};
export const deleteFooter = async (FooterItemId) => {
  await apiRequest("delete", `/FooterItem/${FooterItemId}`);
};
export const updateFooter = async (FooterItemId) => {
  await apiRequest("put", `/FooterItem/${FooterItemId}`);
};
