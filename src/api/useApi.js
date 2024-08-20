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
        "Content-Type": "application/json",
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

export const createBlog = async (blogData) => {
  return apiRequest("post", "/blog", blogData);
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
export const updateBlog = async (blogId, blogData) => {
  await apiRequest("put", `/blog/${blogId}`, blogData);
};

export const fetchCategory = async () => {
  return apiRequest("get", `/category`);
};
export const fetchCategoryForID = async (categoryId) => {
  return apiRequest("get", `/category/${categoryId}`);
};
export const fetchSubCategoryForID = async (categoryId) => {
  return apiRequest("get", `/category/${categoryId}/subcategory`);
};

export const createWarehouseConnection = async (warehouseConnectionData) => {
  return apiRequest(
    "post",
    "/warehouse/WarehouseConnection",
    warehouseConnectionData
  );
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
export const updateWarehouseConnection = async (
  warehouseConnectionId,
  warehouseConnectionData
) => {
  await apiRequest(
    "put",
    `/Warehouse/warehouseConnection/${warehouseConnectionId}`,
    warehouseConnectionData
  );
};

export const createChannel = async (channelData) => {
  return apiRequest("post", "/Channel", channelData);
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
export const updateChannel = async (ChannelId, channelData) => {
  await apiRequest("put", `/Channel/${ChannelId}`, channelData);
};

export const createWarehouse = async (warehouseData) => {
  return apiRequest("post", "/warehouse", warehouseData);
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
export const updateWarehouse = async (warehouseId, warehouseData) => {
  await apiRequest("put", `/Warehouse/${warehouseId}`, warehouseData);
};

export const createFaq = async (faqData) => {
  return apiRequest("post", "/Faq", faqData);
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
export const updateFaq = async (FaqId, faqData) => {
  await apiRequest("put", `/Faq/${FaqId}`, faqData);
};

export const createUser = async (userData) => {
  return apiRequest("post", "/Auth/Register", userData);
};
export const fetchUser = async () => {
  return apiRequest("get", "/User");
};
export const fetchUserForID = async (UserId) => {
  return apiRequest("get", `/User/${UserId}`);
};
export const deleteUser = async (UserId) => {
  await apiRequest("delete", `/User/${UserId}`);
};
export const updateUser = async (UserId, userData) => {
  await apiRequest("put", `/User/${UserId}`, userData);
};

export const createFooter = async (footerData) => {
  return apiRequest("post", "/FooterItem", footerData);
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
export const updateFooter = async (FooterItemId, footerData) => {
  await apiRequest("put", `/FooterItem/${FooterItemId}`, footerData);
};

export const fetchUserContract = async () => {
  return apiRequest("get", "/UserContract");
};
export const fetchUserContractForID = async (UserContractId) => {
  return apiRequest("get", `/UserContract/${UserContractId}`);
};

export const createContract = async (ContractData) => {
  return apiRequest("post", "/Contract", ContractData);
};
export const updateContract = async (ContractId, ContractData) => {
  await apiRequest("put", `/Contract/${ContractId}`, ContractData);
};
export const fetchContract = async () => {
  return apiRequest("get", "/Contract");
};
export const fetchContractForID = async (ContractId) => {
  return apiRequest("get", `/Contract/${ContractId}`);
};

export const createBrand = async (brandData) => {
  return apiRequest("post", "/Brand", brandData);
};
export const fetchBrand = async () => {
  return apiRequest("get", "/Brand");
};
export const fetchBrandForID = async (BrandId) => {
  return apiRequest("get", `/Brand/${BrandId}`);
};
export const deleteBrand = async (BrandId) => {
  await apiRequest("delete", `/Brand/${BrandId}`);
};
export const updateBrand = async (BrandId, brandData) => {
  await apiRequest("put", `/Brand/${BrandId}`, brandData);
};

export const createMenuItem = async (MenuItemData) => {
  return apiRequest("post", "/MenuItem", MenuItemData);
};
export const fetchMenuItem = async () => {
  return apiRequest("get", "/MenuItem");
};
export const fetchMenuItemForID = async (MenuItemId) => {
  return apiRequest("get", `/MenuItem/${MenuItemId}`);
};
export const deleteMenuItem = async (MenuItemId) => {
  await apiRequest("delete", `/MenuItem/${MenuItemId}`);
};
export const updateMenuItem = async (MenuItemId, MenuItemData) => {
  await apiRequest("put", `/MenuItem/${MenuItemId}`, MenuItemData);
};

export const createFeaturedCategory = async (FeaturedCategoryData) => {
  return apiRequest("post", "/FeaturedCategory", FeaturedCategoryData);
};
export const fetchFeaturedCategory = async () => {
  return apiRequest("get", "/FeaturedCategory");
};
export const fetchFeaturedCategoryForID = async (FeaturedCategoryId) => {
  return apiRequest("get", `/FeaturedCategory/${FeaturedCategoryId}`);
};
export const deleteFeaturedCategory = async (FeaturedCategoryId) => {
  await apiRequest("delete", `/FeaturedCategory/${FeaturedCategoryId}`);
};
export const updateFeaturedCategory = async (
  FeaturedCategoryId,
  FeaturedCategoryData
) => {
  await apiRequest(
    "put",
    `/FeaturedCategory/${FeaturedCategoryId}`,
    FeaturedCategoryData
  );
};
