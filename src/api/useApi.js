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
