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

export const createSlider = async (sliderData) => {
  return apiRequest("post", "/slider", sliderData);
};
export const fetchSlider = async () => {
  return apiRequest("get", "/slider");
};
export const fetchSliderForID = async (sliderId) => {
  return apiRequest("get", `/slider/${sliderId}`);
};
export const deleteSlider = async (sliderId) => {
  await apiRequest("delete", `/slider/${sliderId}`);
};
export const updateSlider = async (sliderId, sliderData) => {
  await apiRequest("put", `/slider/${sliderId}`, sliderData);
};

export const createFeature = async (featureData) => {
  return apiRequest("post", "/feature", featureData);
};
export const fetchFeature = async () => {
  return apiRequest("get", "/feature");
};
export const fetchFeatureForID = async (featureId) => {
  return apiRequest("get", `/feature/${featureId}`);
};
export const deleteFeature = async (featureId) => {
  await apiRequest("delete", `/feature/${featureId}`);
};
export const updateFeature = async (featureId, featureData) => {
  await apiRequest("put", `/feature/${featureId}`, featureData);
};

export const createProduct = async (productData) => {
  return apiRequest("post", "/product", productData);
};
export const fetchProduct = async () => {
  return apiRequest("get", "/product");
};
export const fetchProductForID = async (productId) => {
  return apiRequest("get", `/product/${productId}`);
};
export const deleteProduct = async (productId) => {
  await apiRequest("delete", `/product/${productId}`);
};
export const updateProduct = async (productId, productData) => {
  await apiRequest("put", `/product/${productId}`, productData);
};

export const createCategory = async (categoriesData) => {
  return apiRequest("post", `/category`, categoriesData);
};
export const fetchCategory = async () => {
  return apiRequest("get", `/category`);
};
export const updateCategory = async (categoryId, categoriesData) => {
  return apiRequest("put", `/category/${categoryId}`, categoriesData);
};
export const deleteCategory = async (categoryId) => {
  return apiRequest("delete", `/category/${categoryId}`);
};
export const fetchCategoryForID = async (categoryId) => {
  return apiRequest("get", `/category/${categoryId}`);
};
export const createSubCategory = async (categoryId, subCategoriesData) => {
  return apiRequest(
    "post",
    `/category/${categoryId}/subcategory`,
    subCategoriesData
  );
};
export const fetchSubCategory = async (categoryId) => {
  return apiRequest("get", `/category/${categoryId}/subcategory`);
};
export const fetchSubCategoryForID = async (categoryId, subCategoryId) => {
  return apiRequest(
    "get",
    `/category/${categoryId}/subcategory/${subCategoryId}`
  );
};
export const updateSubCategory = async (
  categoryId,
  subCategoryId,
  subCategoriesData
) => {
  return apiRequest(
    "put",
    `/category/${categoryId}/subcategory/${subCategoryId}`,
    subCategoriesData
  );
};
export const deleteSubCategory = async (categoryId, subCategoryId) => {
  return apiRequest(
    "delete",
    `/category/${categoryId}/subcategory/${subCategoryId}`
  );
};

export const createFooterHeader = async (FooterHeaderData) => {
  return apiRequest("post", `/footerHeader`, FooterHeaderData);
};
export const fetchFooterHeader = async () => {
  return apiRequest("get", `/footerHeader`);
};
export const updateFooterHeader = async (footerHeaderId, FooterHeaderData) => {
  return apiRequest("put", `/footerHeader/${footerHeaderId}`, FooterHeaderData);
};
export const deleteFooterHeader = async (footerHeaderId) => {
  return apiRequest("delete", `/footerHeader/${footerHeaderId}`);
};
export const fetchFooterHeaderForID = async (footerHeaderId) => {
  return apiRequest("get", `/footerHeader/${footerHeaderId}`);
};
export const createFooterItem = async (footerHeaderId, footerItemData) => {
  return apiRequest(
    "post",
    `/footerHeader/${footerHeaderId}/FooterItem`,
    footerItemData
  );
};
export const fetchFooterItem = async (footerHeaderId) => {
  return apiRequest("get", `/footerHeader/${footerHeaderId}/FooterItem`);
};
export const fetchFooterItemForID = async (footerHeaderId, footerItemId) => {
  return apiRequest(
    "get",
    `/footerHeader/${footerHeaderId}/FooterItem/${footerItemId}`
  );
};
export const updateFooterItem = async (
  footerHeaderId,
  footerItemId,
  footerItemData
) => {
  return apiRequest(
    "put",
    `/footerHeader/${footerHeaderId}/FooterItem/${footerItemId}`,
    footerItemData
  );
};
export const deleteFooterItem = async (footerHeaderId, footerItemId) => {
  return apiRequest(
    "delete",
    `/footerHeader/${footerHeaderId}/FooterItem/${footerItemId}`
  );
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
export const fetchFooterForID = async (footerItemId) => {
  return apiRequest("get", `/FooterItem/${footerItemId}`);
};
export const deleteFooter = async (footerItemId) => {
  await apiRequest("delete", `/FooterItem/${footerItemId}`);
};
export const updateFooter = async (footerItemId, footerData) => {
  await apiRequest("put", `/FooterItem/${footerItemId}`, footerData);
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
