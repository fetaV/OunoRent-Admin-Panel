import React, { useState, useEffect } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../../../config";

const Price = () => {
  const [prices, setPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [newPrice, setNewPrice] = useState({
    barcode: "",
    logoPrice: 0,
  });
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrice, setFilteredPrice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = prices
      .filter(
        (price) =>
          (price.barcode &&
            price.barcode.toLowerCase().includes(lowercasedQuery)) ||
          (price.logoPrice &&
            price.logoPrice.toString().toLowerCase().includes(lowercasedQuery))
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
    setFilteredPrice(filteredData);
  }, [searchQuery, prices]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/price`);
      setPrices(response.data);
      setFilteredPrice(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Fetch prices error:", error);
      toast.error("Failed to fetch prices");
    }
  };

  const handleCreatePrice = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/price`, newPrice);
      toast.success("Price item created successfully");
      fetchPrices();
      setVisible(false);
    } catch (error) {
      console.error("Create price error:", error);
      toast.error("Failed to create price item");
    }
  };

  const handleUpdatePrice = async (priceId) => {
    try {
      await axios.put(`${API_BASE_URL}/price/${priceId}`, currentPrice);
      toast.success("Price item updated successfully");
      fetchPrices();
      setVisible(false);
    } catch (error) {
      console.error("Update price error:", error);
      toast.error("Failed to update price item");
    }
  };

  const handleDeletePrice = async (priceId) => {
    try {
      await axios.delete(`${API_BASE_URL}/price/${priceId}`);
      toast.success("Price item deleted successfully");
      fetchPrices();
    } catch (error) {
      console.error("Delete price error:", error);
      toast.error("Failed to delete price item");
    }
  };

  const handleEditButtonClick = async (priceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/price/${priceId}`);
      setCurrentPrice(response.data);
      setVisible(true);
    } catch (error) {
      console.error("Fetch price error:", error);
      toast.error("Failed to fetch price item");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrice.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrice.length / itemsPerPage);

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => setVisible(true)}
      >
        Yeni Price Ekle
      </CButton>

      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Barkod
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Logo Fiyatı
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((price) => (
            <CTableRow key={price.priceId}>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {price.barcode}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {price.logoPrice}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditButtonClick(price.priceId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeletePrice(price.priceId)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination
        aria-label="Page navigation"
        className="mt-3 btn border-0"
        align="center"
        items={totalPages}
        active={currentPage}
        onChange={(page) => setCurrentPage(page)}
      >
        {[...Array(totalPages).keys()].map((page) => (
          <CPaginationItem
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </CPaginationItem>
        ))}
      </CPagination>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            {currentPrice ? "Edit Price Item" : "Create Price Item"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Barkod"
              value={currentPrice ? currentPrice.barcode : newPrice.barcode}
              onChange={(e) =>
                currentPrice
                  ? setCurrentPrice({
                      ...currentPrice,
                      barcode: e.target.value,
                    })
                  : setNewPrice({ ...newPrice, barcode: e.target.value })
              }
            />
            <CFormInput
              type="number"
              className="mb-3"
              label="Logo Fiyatı"
              value={currentPrice ? currentPrice.logoPrice : newPrice.logoPrice}
              onChange={(e) =>
                currentPrice
                  ? setCurrentPrice({
                      ...currentPrice,
                      logoPrice: parseFloat(e.target.value),
                    })
                  : setNewPrice({
                      ...newPrice,
                      logoPrice: parseFloat(e.target.value),
                    })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentPrice
                ? handleUpdatePrice(currentPrice.priceId)
                : handleCreatePrice()
            }
          >
            {currentPrice ? "Kaydet" : "Oluştur"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Price;
