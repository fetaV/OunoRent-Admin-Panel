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
  CFormSwitch,
  CFormTextarea,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../../../config";

const Faq = () => {
  const [faq, setFaq] = useState([]);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaq, setFilteredFaq] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newFaq, setNewFaq] = useState({
    label: "",
    text: "",
    orderNumber: 0,
    isActive: false,
  });
  const [visible, setVisible] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaq.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaq.length / itemsPerPage);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = faq
      .filter(
        (item) =>
          item.label.toLowerCase().includes(lowercasedQuery) ||
          item.orderNumber.toString().includes(lowercasedQuery)
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));

    setFilteredFaq(filteredData);
  }, [searchQuery, faq]);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faq`);
      console.log(response);
      setFaq(response.data);
      setFilteredFaq(response.data);
    } catch (error) {
      console.error("getFaq error:", error);
      toast.error("Failed to fetch FAQ items");
    }
  };

  const handleCreateFaq = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/faq`, newFaq);
      toast.success("FAQ item created successfully");
      fetchFaq();
      setVisible(false);
    } catch (error) {
      console.error("createFaq error:", error);
      toast.error("Failed to create FAQ item");
    }
  };

  const handleUpdateFaq = async (faqId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/faq/${faqId}`,
        currentFaq
      );
      toast.success("FAQ item updated successfully");
      fetchFaq();
      setVisible(false);
    } catch (error) {
      console.error("updateFaq error:", error);
      toast.error("Failed to update FAQ item");
    }
  };

  const handleDeleteFaq = async (faqId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/faq/${faqId}`);
      toast.success("FAQ item deleted successfully");
      fetchFaq();
    } catch (error) {
      console.error("deleteFaq error:", error);
      toast.error("Failed to delete FAQ item");
    }
  };

  const handleEditButtonClick = async (faqId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faq/${faqId}`);
      setCurrentFaq(response.data);
      setVisible(true);
    } catch (error) {
      console.error("Error fetching the FAQ item:", error);
      toast.error("Failed to fetch FAQ item");
    }
  };

  return (
    <div>
      <ToastContainer />

      <CButton
        color="primary"
        className="mb-3"
        onClick={() => setVisible(true)}
      >
        Yeni FAQ Ekle
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
              Soru Başlığı
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Sıra Numarası
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Durum
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems
            .sort((a, b) =>
              a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1
            )
            .map((item) => (
              <CTableRow key={item.faqId}>
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {item.label}
                </CTableDataCell>
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {item.orderNumber}
                </CTableDataCell>
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "8px",
                      backgroundColor: item.isActive ? "#d4edda" : "#f8d7da",
                      color: item.isActive ? "#155724" : "#721c24",
                      border: `1px solid ${item.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    }}
                  >
                    {item.isActive ? "Aktif" : "Pasif"}
                  </div>
                </CTableDataCell>
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <CButton
                    color="primary text-white"
                    className="me-2"
                    onClick={() => handleEditButtonClick(item.faqId)}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger text-white"
                    onClick={() => handleDeleteFaq(item.faqId)}
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
        className="mt-3"
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
            {currentFaq ? "Edit FAQ Item" : "Create FAQ Item"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Soru Başlığı"
              value={currentFaq ? currentFaq.label : newFaq.label}
              onChange={(e) =>
                currentFaq
                  ? setCurrentFaq({ ...currentFaq, label: e.target.value })
                  : setNewFaq({ ...newFaq, label: e.target.value })
              }
            />
            <CFormTextarea
              type="text"
              className="mb-3"
              label="Metin"
              rows={5}
              value={currentFaq ? currentFaq.text : newFaq.text}
              onChange={(e) =>
                currentFaq
                  ? setCurrentFaq({ ...currentFaq, text: e.target.value })
                  : setNewFaq({ ...newFaq, text: e.target.value })
              }
            />
            <CFormInput
              type="number"
              className="mb-3"
              placeholder="Order Number"
              label="Sıra Numarası"
              value={currentFaq ? currentFaq.orderNumber : newFaq.orderNumber}
              onChange={(e) =>
                currentFaq
                  ? setCurrentFaq({
                      ...currentFaq,
                      orderNumber: +e.target.value,
                    })
                  : setNewFaq({ ...newFaq, orderNumber: +e.target.value })
              }
            />
            <CFormSwitch
              label="Durum"
              checked={currentFaq ? currentFaq.isActive : newFaq.isActive}
              onChange={(e) =>
                currentFaq
                  ? setCurrentFaq({ ...currentFaq, isActive: e.target.checked })
                  : setNewFaq({ ...newFaq, isActive: e.target.checked })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentFaq ? handleUpdateFaq(currentFaq.faqId) : handleCreateFaq()
            }
          >
            {currentFaq ? "Save Changes" : "Create"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Faq;
